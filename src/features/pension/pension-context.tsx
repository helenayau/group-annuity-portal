'use client';

import { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import {
  depositAccounts as initialAccounts,
  grossMonthlyPayment,
  participant as initialParticipant,
  type DepositAccount,
  type Participant,
  type PensionDocumentCategory,
  type PensionPayment
} from '@/constants/mock-api-pension';
import { downloadPensionIncomeLetter, downloadWithholdingForm } from './documents';

export type PensionDialog =
  | { kind: 'payment-settings' }
  | { kind: 'personal-details' }
  | { kind: 'profile' }
  | { kind: 'status-help' }
  | { kind: 'payment'; payment: PensionPayment }
  | { kind: 'documents'; category: PensionDocumentCategory };

interface PensionState {
  participant: Participant;
  setParticipant: (participant: Participant) => void;
  accounts: DepositAccount[];
  setAccounts: (accounts: DepositAccount[]) => void;
  dialog: PensionDialog | null;
  setDialog: (dialog: PensionDialog | null) => void;
}

const PensionContext = createContext<PensionState | null>(null);

// Lives in the /pension layout so edits survive switching between layouts,
// and so every layout opens the same dialogs from one shared host.
export function PensionProvider({ children }: { children: React.ReactNode }) {
  const [participant, setParticipant] = useState(initialParticipant);
  const [accounts, setAccounts] = useState(initialAccounts);
  const [dialog, setDialog] = useState<PensionDialog | null>(null);

  return (
    <PensionContext.Provider
      value={{ participant, setParticipant, accounts, setAccounts, dialog, setDialog }}
    >
      {children}
    </PensionContext.Provider>
  );
}

export function usePension() {
  const context = useContext(PensionContext);
  if (!context) throw new Error('usePension must be used inside PensionProvider');
  return context;
}

export function usePensionActions() {
  const { participant, accounts, setDialog } = usePension();

  return {
    editPaymentSettings: () => setDialog({ kind: 'payment-settings' }),
    editPersonalDetails: () => setDialog({ kind: 'personal-details' }),
    goToProfile: () => setDialog({ kind: 'profile' }),
    showStatusHelp: () => setDialog({ kind: 'status-help' }),
    viewPayment: (payment: PensionPayment) => setDialog({ kind: 'payment', payment }),
    viewDocuments: (category: PensionDocumentCategory) =>
      setDialog({ kind: 'documents', category }),
    viewFederalTaxes: () => {
      downloadWithholdingForm('federal', participant);
      toast.success('Federal withholding form downloaded');
    },
    viewStateTaxes: () => {
      downloadWithholdingForm('state', participant);
      toast.success('State withholding form downloaded');
    },
    downloadLetter: () => {
      downloadPensionIncomeLetter(participant, accounts, grossMonthlyPayment);
      toast.success('Income verification letter downloaded');
    }
  };
}
