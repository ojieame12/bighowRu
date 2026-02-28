import React, { createContext, useContext } from 'react';
import { Id } from '@/convex/_generated/dataModel';

type CircleContextType = {
  activeCircleId: Id<"circles"> | null;
  userId: string | null;
};

const CircleContext = createContext<CircleContextType>({
  activeCircleId: null,
  userId: null,
});

export function CircleProvider({
  children,
  activeCircleId,
  userId,
}: {
  children: React.ReactNode;
  activeCircleId: Id<"circles"> | null;
  userId: string | null;
}) {
  return (
    <CircleContext.Provider value={{ activeCircleId, userId }}>
      {children}
    </CircleContext.Provider>
  );
}

export function useCircle() {
  return useContext(CircleContext);
}
