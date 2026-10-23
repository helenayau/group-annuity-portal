'use client';

import { createContext, useContext, useState } from 'react';
import {
  depositAccounts as initialAccounts,
  participant as initialParticipant,
  type DepositAccount,
  type Participant
} from '@/constants/mock-api-pension';

interface PensionState {
  participant: Participant;
  setParticipant: (participant: Participant) => void;
  accounts: DepositAccount[];
  setAccounts: (accounts: DepositAccount[]) => void;
}

const PensionContext = createContext<PensionState | null>(null);

// Lives in the /pension layout so edits made on one tab are still there
// after switching to another.
export function PensionProvider({ children }: { children: React.ReactNode }) {
  const [participant, setParticipant] = useState(initialParticipant);
  const [accounts, setAccounts] = useState(initialAccounts);

  return (
    <PensionContext.Provider value={{ participant, setParticipant, accounts, setAccounts }}>
      {children}
    </PensionContext.Provider>
  );
}

export function usePension() {
  const context = useContext(PensionContext);
  if (!context) throw new Error('usePension must be used inside PensionProvider');
  return context;
}
