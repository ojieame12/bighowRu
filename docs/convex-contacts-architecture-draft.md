# HowRU Convex Architecture Draft

## 1) Product Scope (Current vs Target)

### Current implementation in app
- Contacts and check-in data are hardcoded in frontend state.
- Timers are local interval timers with no server truth.
- Mood check-in updates local UI only.
- Expanded contact cards already contain the right UX blocks:
  - Mood pills
  - Check-in metadata (date, time, location)
  - Selfie strip (view or nudge)
  - Optional Checkup CTA
- Mood engine supports continuous positivity and token interpolation.

### Target implementation
- Circle-based, authenticated, real-time app backed by Convex.
- Home and Contacts pages both read from a single backend view model.
- Contacts page adds an in-card trend graph for "how they are doing" over time.
- Reliable nudges, reminders, and notifications via durable outbox + schedulers.
- Temporal selfie storage for pending uploads, with strict cleanup and access control.

## 2) Functional Requirements

### Core
- Authentication and user identity.
- Circle management: create circle, invite, join/leave, member roles.
- Contact list by circle with latest status, positivity, and freshness.
- Check-in submission with mood phase selections and optional selfie.
- Per-member timers based on server-calculated due times.

### Contacts page feature
- Route launched from footer nav.
- Same contact list and card visual language as Home.
- Expanded cards include TrendStrip module.
- Trend modes:
  - Mood trend (positivity over time).
  - Pain trend (simple derived score for now, extensible later).
- Trend status chip: Improving / Stable / Needs attention.

### Engagement and reliability
- Checkup nudge.
- Selfie nudge.
- Reminder notifications for overdue check-ins.
- Push delivery retries and dedupe.

## 3) Convex Data Model

Use denormalized read models for fast list rendering and append-only event/check-in records for auditability.

### users
- _id
- authId (provider subject)
- displayName
- email
- avatarUrl
- timezone
- locale
- createdAt
- updatedAt

Indexes
- by_authId

### devices
- _id
- userId
- platform (ios/android/web)
- pushToken
- lastSeenAt
- enabled

Indexes
- by_userId
- by_pushToken

### circles
- _id
- name
- ownerUserId
- colorTheme
- defaultCheckinCadenceHours
- archived
- createdAt

Indexes
- by_ownerUserId

### circle_members
- _id
- circleId
- userId
- role (owner/admin/member)
- status (active/pending/removed)
- reminderCadenceHours
- reminderHourLocal
- reminderMinuteLocal
- quietHoursStartLocal
- quietHoursEndLocal
- joinedAt

Indexes
- by_circleId
- by_userId
- by_circleId_userId

### checkins
- _id
- circleId
- userId
- positivity (-1..1)
- discreteMood (bad|neutral|moody|great)
- phaseSelections (json object; feeling/health/energy/social and optional stress)
- painScore (optional 0..1)
- note (optional)
- selfieStorageId (optional)
- createdAt
- source (dial/manual/import)
- idempotencyKey

Indexes
- by_circleId_userId_createdAt
- by_userId_createdAt
- by_circleId_createdAt
- by_idempotencyKey

### member_state (denormalized latest card state)
- _id
- circleId
- userId
- latestCheckinId
- latestPositivity
- latestDiscreteMood
- latestPainScore
- latestPhaseSelections
- lastCheckinAt
- nextDueAt
- status (checked_in|due_soon|overdue|stale)
- needsCheckup (boolean)
- hasRecentSelfie (boolean)
- lastSelfieAt (optional)
- trendDirectionMood (improving|stable|declining)
- trendDirectionPain (improving|stable|declining)
- updatedAt

Indexes
- by_circleId
- by_circleId_status
- by_circleId_nextDueAt
- by_userId

### member_trend_daily
- _id
- circleId
- userId
- dayKey (YYYY-MM-DD in member timezone)
- moodAvg
- moodMin
- moodMax
- painAvg (optional)
- sampleCount
- updatedAt

Indexes
- by_circleId_userId_dayKey

### member_trend_snapshot
- _id
- circleId
- userId
- windowDays (14|30)
- moodPoints (array of { dayKey, value|null })
- painPoints (array of { dayKey, value|null })
- moodDirection
- painDirection
- lastComputedAt

Indexes
- by_circleId_userId_windowDays

### nudges
- _id
- circleId
- fromUserId
- toUserId
- type (checkup|selfie)
- status (queued|sent|acked|failed|expired)
- cooldownKey
- payload
- createdAt
- sentAt (optional)

Indexes
- by_circleId_toUserId_createdAt
- by_toUserId_status
- by_cooldownKey

### notification_outbox
- _id
- recipientUserId
- channel (push|email|inapp)
- template
- payload
- dedupeKey
- status (pending|sending|sent|failed|dead)
- attempts
- nextAttemptAt
- lastError
- createdAt
- sentAt

Indexes
- by_recipientUserId_status
- by_status_nextAttemptAt
- by_dedupeKey

### selfie_staging (temporal selfie storage)
- _id
- userId
- circleId
- storageId
- status (staged|committed|expired|deleted)
- createdAt
- expiresAt
- committedCheckinId (optional)

Indexes
- by_userId_status
- by_expiresAt
- by_storageId

### activity_events (optional but recommended)
- _id
- circleId
- actorUserId
- type
- targetUserId
- refId
- payload
- createdAt

Indexes
- by_circleId_createdAt

## 4) Auth and Authorization

### Auth
- Use Convex Auth or Clerk + Convex auth bridge.
- Every query/mutation resolves identity from auth context.

### Authorization rules
- User must be active member of circle for all circle reads/writes.
- Users can submit check-in only for themselves.
- Owner/admin policies for membership and circle settings.
- Nudge sender and target must share same active circle.
- Selfie access only to active circle members and owner of media.

## 5) Query and Mutation Contracts

## queries
- circles.listMyCircles()
- contacts.listForCircle({ circleId, cursor, limit })
  - returns compact card DTO with member_state + trend_snapshot(14d)
- contacts.getMemberDetail({ circleId, memberId })
  - returns history metadata and expanded card details
- trends.getMemberTrend({ circleId, memberId, windowDays, metric })

## mutations
- circles.create({ name, colorTheme })
- circles.inviteMember({ circleId, emailOrUserId })
- circles.updateMemberSettings({ circleId, memberId, cadenceHours, reminderHourLocal, reminderMinuteLocal })
- checkins.beginSelfieUpload({ circleId })
  - returns upload URL + staging record
- checkins.submit({ circleId, phaseSelections, painScore?, note?, selfieStagingId?, idempotencyKey })
  - computes positivity server-side
  - writes checkin
  - updates member_state
  - upserts trend buckets/snapshot
  - schedules next reminder
  - enqueues notifications
- nudges.sendCheckup({ circleId, targetUserId })
- nudges.sendSelfieRequest({ circleId, targetUserId })
- notifications.ack({ notificationId })

## actions/internal
- notifications.dispatchPendingBatch()
- trends.recomputeSnapshot({ circleId, userId, windowDays })
- state.reconcileMemberState({ circleId, userId })
- media.cleanupExpiredSelfieStaging({ now })

## 6) Contacts Page Trend Module

### TrendStrip component contract
- props
  - moodPoints: number[] or nullable points
  - painPoints: number[] or nullable points
  - selectedMetric: "mood" | "pain"
  - direction: "improving" | "stable" | "declining"
  - windowLabel: "14d" | "30d"
- UI behavior
  - smooth sparkline, no axes
  - small top-right chip for direction
  - optional switch/chips for Mood vs Pain
  - consistent card styling and tokenized colors

### Trend direction rules (simple v1)
- Use last 7 non-null daily points.
- Compute slope via linear regression or simple delta.
- mood direction
  - slope > +threshold => improving
  - slope < -threshold => declining
  - else stable
- pain direction uses inverse semantics
  - lower is improving

### Pain score in v1
- If no explicit pain input yet, derive from health-related phase/emojis.
- Keep nullable and fallback to mood-only rendering when absent.

## 7) Reminder and Cron Plan

### Use both scheduled jobs and cron
- runAt jobs for user/member-specific reminders at local times.
- cron for retries, reconciliation, and cleanup.

### Cron jobs
- Every 5 minutes
  - mark members due/overdue based on nextDueAt
  - enqueue reminder notifications where needed
- Every 5 minutes
  - dispatch pending notification_outbox records with retry backoff
- Every 15 minutes
  - recompute trend snapshots for recently changed users
- Every 10 minutes
  - cleanup expired selfie_staging blobs and records
- Daily
  - finalize previous day trend buckets per timezone
  - retention cleanup for old events/outbox/dead records

### Notification reliability
- Outbox with status machine.
- Exponential backoff retries.
- dedupeKey to avoid duplicate pushes.
- dead-letter status after max attempts.

## 8) Temporal Selfie Storage Design

### Lifecycle
1. Client calls checkins.beginSelfieUpload.
2. Server creates selfie_staging row with expiresAt (e.g., now + 24h).
3. Client uploads blob using returned URL.
4. On checkins.submit, server validates staging ownership and expiry.
5. On success, staging row set to committed and linked to checkin.
6. Expired staged selfies are deleted by cleanup job.

### Security
- No public URLs persisted.
- Access via authorized read endpoint that returns short-lived signed URL.
- Circle membership required to view selfie.

## 9) Read Models for Performance

### Why denormalize
- Contacts page needs fast list hydration with minimal joins.
- member_state and member_trend_snapshot avoid heavy per-card aggregation.

### Contacts list DTO
- member id, name, avatar, status
- latest mood label + emoji id
- latest positivity + discrete mood
- timer (secondsUntilDue)
- check-in meta (date/time/location preview)
- selfie preview available flag
- trend mini points + direction

## 10) Migration and Rollout Plan

### Phase 1: backend skeleton
- Add schema tables and auth guards.
- Implement circles + members + contacts.listForCircle.

### Phase 2: check-in write path
- Implement checkins.submit and member_state updates.
- Wire Home mood dial completion to mutation.

### Phase 3: notifications + nudges
- Implement outbox dispatch and nudge mutations.
- Add cooldowns and dedupe.

### Phase 4: contacts trend page
- Add app/contacts route and footer navigation action.
- Add TrendStrip in expanded card and wire trend snapshot query.

### Phase 5: temporal selfie pipeline
- Implement beginSelfieUpload + commit/cleanup.
- Hook selfie toggle and selfie strip flows.

## 11) Known Gaps in Current Frontend to Align During Build

- Phase mismatch:
  - mood-phases currently has 4 phases (Feeling, Health, Energy, Social).
  - some copy and preview imply 5 phases with Stress.
- Timer behavior is local-only and not server-synchronized.
- Check-in completion currently updates local mood only, not durable records.

## 12) Recommended Defaults

- Reminder cadence: every 24 hours.
- due_soon window: 2 hours before due.
- stale threshold: 48 hours overdue.
- trend window: 14 days default.
- selfie staging TTL: 24 hours.
- notification max retries: 8.

## 13) Minimal DTO Interfaces (for app-client use)

```ts
export type ContactListItem = {
  memberId: string;
  name: string;
  avatarUrl?: string;
  status: "checked_in" | "due_soon" | "overdue" | "stale";
  latestPositivity?: number;
  latestMoodLabel?: string;
  latestEmojiId?: string;
  secondsUntilDue?: number;
  checkinDate?: string;
  checkinTime?: string;
  checkinLocation?: string;
  hasSelfie?: boolean;
  trendMood14d: Array<number | null>;
  trendPain14d?: Array<number | null>;
  trendDirectionMood: "improving" | "stable" | "declining";
  trendDirectionPain?: "improving" | "stable" | "declining";
};

export type SubmitCheckinInput = {
  circleId: string;
  phaseSelections: Record<string, { emojiId: string; label: string }>;
  painScore?: number;
  note?: string;
  selfieStagingId?: string;
  idempotencyKey: string;
};
```

## 14) Invite Flows (Resend + Twilio)

Invite flows must support:
- Email invite via Resend.
- Phone invite via Twilio SMS.
- Existing-user fast-path and new-user onboarding path.
- Durable delivery status, retries, and auditability.

### Additional tables for invites

### invitations
- _id
- circleId
- inviterUserId
- inviteeUserId (optional, if already matched)
- inviteeEmail (optional)
- inviteePhoneE164 (optional)
- channel (email|sms|both)
- role (admin|member)
- status (pending|accepted|revoked|expired)
- tokenHash
- tokenExpiresAt
- acceptedAt
- createdAt
- lastSentAt
- sendCount

Indexes
- by_circleId_status
- by_inviteeEmail_status
- by_inviteePhoneE164_status
- by_tokenHash

### user_contacts (optional but recommended)
- _id
- userId
- type (email|phone)
- valueCanonical
- verified
- verifiedAt
- primary

Indexes
- by_userId_type
- by_type_valueCanonical

Note: `notification_outbox` already covers delivery durability and retry logic for invite messages.

### Send invite mutation contract
- invitations.send({
  circleId,
  role,
  inviteeEmail?,
  inviteePhone?,
  channel
})

Server behavior:
1. Authorize inviter as owner/admin in circle.
2. Normalize destination:
   - email: lowercase + trim.
   - phone: strict E.164 format.
3. Check for existing active member in circle and short-circuit if already joined.
4. Create or upsert pending invitation with:
   - random opaque token (store hash only).
   - expiry (default 7 days).
5. Enqueue invite delivery records in `notification_outbox`:
   - email channel for Resend.
   - sms channel for Twilio.
6. Emit activity event: `invite_sent`.

### Existing-user fast-path
If invite destination matches verified contact for an existing user:
- Set `inviteeUserId`.
- Send in-app notification immediately.
- Still send email/SMS deep link unless inviter opted in-app only.

### Accept invite flow
- invitations.accept({ token })

Server behavior:
1. Require authenticated user.
2. Hash token, fetch pending invite, verify not expired/revoked.
3. Enforce destination binding:
   - If invite had email, user must have matching verified email.
   - If invite had phone, user must have matching verified phone.
4. Insert/update `circle_members`.
5. Mark invitation accepted.
6. Emit activity event: `invite_accepted`.

### Resend integration (email)
- Use Convex action adapter: `providers.sendEmail`.
- Payload includes:
  - to
  - templateId/templateName
  - merge vars (circle name, inviter name, accept URL, expiry date).
- Record provider message id on outbox row for webhook reconciliation.

### Twilio integration (SMS)
- Use Messaging Service SID for sender management.
- Use Convex action adapter: `providers.sendSms`.
- SMS body includes short accept URL and expiry.
- Record Twilio MessageSid for status callback reconciliation.

### Phone verification and OTP
- Use Twilio Verify during signup/account linking for phone ownership.
- Only verified phone can accept phone-bound invite.
- Keep Verify attempt count and cooldown to block abuse.

## 15) Delivery Webhooks, Compliance, and Reliability

### Webhook HTTP actions in Convex
- providers.webhooks.resend(event)
- providers.webhooks.twilioStatus(event)
- providers.webhooks.twilioInbound(event)

### Webhook behaviors
- Resend:
  - update outbox status on delivered/bounced/complained.
  - suppress future sends to hard-bounce recipients.
- Twilio status callbacks:
  - update outbox row to sent/failed with terminal code.
- Twilio inbound:
  - handle STOP/START/HELP semantics.
  - persist opt-out flags to recipient communication preferences.

### Retry and fallback policy
- Outbox retries with exponential backoff.
- Terminal failures:
  - mark as dead after max attempts.
- Optional fallback:
  - if email hard-fails and phone exists + consented, enqueue sms fallback.
  - if sms fails and email exists, enqueue email fallback.

### Rate limits and anti-abuse
- Per inviter:
  - max invites per hour/day.
- Per destination:
  - cooldown between repeated invites.
- Per circle:
  - cap pending invitations.
- Idempotency key on `invitations.send` and outbox dedupe keys.

### Compliance requirements
- Phone numbers stored canonicalized (E.164).
- Respect SMS opt-out (STOP) and do-not-contact flags.
- Respect quiet hours when sending reminder/nudge SMS.
- Keep audit events for invite and notification actions.

### Link security
- Accept links carry opaque token only.
- Store token hash (not raw token).
- Single-use token; invalidate on accept/revoke/expiry.
- Short token expiry + explicit resend flow.

## 16) Summary

This design keeps your current style-heavy frontend intact while introducing a reliable backend core:
- circle-based access
- durable check-ins
- trend-friendly read models
- dependable notifications/nudges
- secure temporal selfie storage
- production-grade invite and delivery workflows (Resend + Twilio)

It is intentionally simple in v1 and scales by adding workers and denormalized projections, not by complicating client logic.
