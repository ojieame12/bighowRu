/**
 * Central SVG import map — static imports required by react-native-svg-transformer.
 */

import type React from 'react';
import type { SvgProps } from 'react-native-svg';

// ─── Emotion ───
import EnragedSvg from './svg/enraged.svg';
import AngryRedSvg from './svg/angry-red.svg';
import LoudlyCryingSvg from './svg/loudly-crying.svg';
import AngryFaceSvg from './svg/angry-face.svg';
import CryingSvg from './svg/crying.svg';
import UnamusedSvg from './svg/unamused.svg';
import ExpressionlessSvg from './svg/expressionless.svg';
import SmileSvg from './svg/smile.svg';
import SmilingSvg from './svg/smiling.svg';
import GrinningSvg from './svg/grinning.svg';
import TearsOfJoySvg from './svg/tears-of-joy.svg';
import HeartEyesSvg from './svg/heart-eyes.svg';

// ─── Health ───
import FaceVomitingSvg from './svg/face-vomiting.svg';
import NauseatedSvg from './svg/nauseated.svg';
import ThermometerSvg from './svg/thermometer.svg';
import SneezingSvg from './svg/sneezing.svg';
import MedicalMaskSvg from './svg/medical-mask.svg';
import RelievedSvg from './svg/relieved.svg';
import SmilingAltSvg from './svg/smiling-alt.svg';
import CareSvg from './svg/care.svg';

// ─── Energy ───
import CrossedOutEyesSvg from './svg/crossed-out-eyes.svg';
import WoozySvg from './svg/woozy.svg';
import SleepingSvg from './svg/sleeping.svg';
import YawningSvg from './svg/yawning.svg';
import SweatGrinSvg from './svg/sweat-grin.svg';
import GrinningSquintSvg from './svg/grinning-squint.svg';
import StarEyesSvg from './svg/star-eyes.svg';

// ─── Social ───
import FrowningSvg from './svg/frowning.svg';
import FlushedSvg from './svg/flushed.svg';
import HaloSvg from './svg/halo.svg';
import CareAltSvg from './svg/care-alt.svg';
import SmilingHeartsSvg from './svg/smiling-hearts.svg';

// ─── Stress ───
import SpiralEyesSvg from './svg/spiral-eyes.svg';
import ScreamingSvg from './svg/screaming.svg';
import SunglassesSvg from './svg/sunglasses.svg';

export type SvgEmojiComponent = React.FC<SvgProps>;

const SVG_EMOJI_MAP: Record<string, SvgEmojiComponent> = {
  // Emotion
  'enraged': EnragedSvg,
  'angry-red': AngryRedSvg,
  'loudly-crying': LoudlyCryingSvg,
  'angry-face': AngryFaceSvg,
  'crying': CryingSvg,
  'unamused': UnamusedSvg,
  'expressionless': ExpressionlessSvg,
  'smile': SmileSvg,
  'smiling': SmilingSvg,
  'grinning': GrinningSvg,
  'tears-of-joy': TearsOfJoySvg,
  'heart-eyes': HeartEyesSvg,

  // Health
  'face-vomiting': FaceVomitingSvg,
  'nauseated': NauseatedSvg,
  'thermometer': ThermometerSvg,
  'sneezing': SneezingSvg,
  'medical-mask': MedicalMaskSvg,
  'relieved': RelievedSvg,
  'smiling-alt': SmilingAltSvg,
  'care': CareSvg,

  // Energy
  'crossed-out-eyes': CrossedOutEyesSvg,
  'woozy': WoozySvg,
  'sleeping': SleepingSvg,
  'yawning': YawningSvg,
  'sweat-grin': SweatGrinSvg,
  'grinning-squint': GrinningSquintSvg,
  'star-eyes': StarEyesSvg,

  // Social
  'frowning': FrowningSvg,
  'flushed': FlushedSvg,
  'halo': HaloSvg,
  'care-alt': CareAltSvg,
  'smiling-hearts': SmilingHeartsSvg,

  // Stress
  'spiral-eyes': SpiralEyesSvg,
  'screaming': ScreamingSvg,
  'sunglasses': SunglassesSvg,
};

export default SVG_EMOJI_MAP;
