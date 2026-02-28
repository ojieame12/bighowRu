import { useState, useEffect, useRef, useCallback } from 'react';

type UseCountdownOptions = {
  initialSeconds: number;
  autoStart?: boolean;
  onComplete?: () => void;
};

export function useCountdown({
  initialSeconds,
  autoStart = true,
  onComplete,
}: UseCountdownOptions) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!running || seconds <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setRunning(false);
          onCompleteRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, seconds <= 0]);

  const reset = useCallback(
    (newSeconds?: number) => {
      setSeconds(newSeconds ?? initialSeconds);
      setRunning(true);
    },
    [initialSeconds]
  );

  const pause = useCallback(() => setRunning(false), []);
  const resume = useCallback(() => {
    if (seconds > 0) setRunning(true);
  }, [seconds]);

  return {
    seconds,
    running,
    urgent: seconds > 0 && seconds <= 60,
    finished: seconds === 0,
    reset,
    pause,
    resume,
  };
}
