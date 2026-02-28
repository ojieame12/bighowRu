import React, { createContext, useContext, useState, useMemo } from 'react';
import { type Mood } from './tokens';
import {
  interpolateToken,
  positivityToMood,
  MOOD_TO_POSITIVITY,
} from './mood-engine';

type MoodContextType = {
  positivity: number;
  setPositivity: (score: number) => void;
  mood: Mood;
  setMood: (mood: Mood) => void;
  themed: (token: Record<Mood, string>) => string;
};

const MoodContext = createContext<MoodContextType>({
  positivity: 0.25,
  setPositivity: () => {},
  mood: 'moody',
  setMood: () => {},
  themed: () => '',
});

export function MoodProvider({
  children,
  initialMood = 'moody' as Mood,
  initialPositivity,
}: {
  children: React.ReactNode;
  initialMood?: Mood;
  initialPositivity?: number;
}) {
  const [positivity, setPositivity] = useState<number>(
    initialPositivity ?? MOOD_TO_POSITIVITY[initialMood]
  );

  const mood = useMemo(() => positivityToMood(positivity), [positivity]);

  const setMood = (m: Mood) => {
    setPositivity(MOOD_TO_POSITIVITY[m]);
  };

  const themed = (token: Record<Mood, string>) =>
    interpolateToken(token, positivity);

  return (
    <MoodContext.Provider
      value={{ positivity, setPositivity, mood, setMood, themed }}
    >
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  return useContext(MoodContext);
}
