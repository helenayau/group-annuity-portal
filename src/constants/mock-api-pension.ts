export interface PensionPlan {
  planName: string;
  contractNumber: string;
  asOfDate: string;
}

export const pensionPlan: PensionPlan = {
  planName: 'Western Conference of Teamsters Pension Trust',
  contractNumber: '123456',
  asOfDate: '8/22/2024'
};

export interface Participant {
  firstName: string;
  lastName: string;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  phone: string;
}

export const participant: Participant = {
  firstName: 'Carter',
  lastName: 'Haldwell',
  addressLine1: '1234 Shutthedoor Avenue',
  city: 'Newark',
  state: 'NJ',
  zip: '33122',
  email: 'carter.haldwell@example.com',
  phone: '(555) 201-4411'
};

export interface PensionAlert {
  id: string;
  title: string;
  body: string;
}

export const pensionAlerts: PensionAlert[] = [
  {
    id: 'cola',
    title: 'Your 2025 payment amount is confirmed',
    body: 'Your monthly payment will stay at $320.00 next year. No action is needed.'
  },
  {
    id: '1099r',
    title: 'Tax forms go paperless this year',
    body: 'Your 1099-R will be posted to E-documents by January 31 instead of mailed.'
  },
  {
    id: 'address',
    title: 'Moved recently?',
    body: 'Keep your mailing address current so tax forms and notices reach you.'
  }
];

export interface DepositAccount {
  id: string;
  bankName: string;
  accountType: 'Checking' | 'Savings';
  accountLast4: string;
  amount: number;
}

export const grossMonthlyPayment = 320;

export const depositAccounts: DepositAccount[] = [
  {
    id: 'acct-1',
    bankName: 'First Harbor Bank',
    accountType: 'Checking',
    accountLast4: '4411',
    amount: 160
  },
  {
    id: 'acct-2',
    bankName: 'First Harbor Bank',
    accountType: 'Savings',
    accountLast4: '0927',
    amount: 100
  },
  {
    id: 'acct-3',
    bankName: 'Union Credit Union',
    accountType: 'Checking',
    accountLast4: '5583',
    amount: 60
  }
];

export type PensionPaymentStatus = 'processing' | 'transmitted' | 'returned';

export interface PensionPayment {
  id: string;
  date: string;
  method: 'Direct deposit';
  accountLast4: string;
  netAmount: number;
  status: PensionPaymentStatus;
}

// Mirrors the mockup's rows: the full $320 payment by direct deposit to *****4411.
const paymentHistory: Array<[string, PensionPaymentStatus]> = [
  ['08/15/2024', 'processing'],
  ['07/15/2024', 'transmitted'],
  ['06/14/2024', 'transmitted'],
  ['05/15/2024', 'transmitted'],
  ['04/15/2024', 'transmitted'],
  ['03/15/2024', 'transmitted'],
  ['02/15/2024', 'transmitted'],
  ['01/12/2024', 'transmitted']
];

export const pensionPayments: PensionPayment[] = paymentHistory.map(([date, status]) => ({
  id: date,
  date,
  method: 'Direct deposit',
  accountLast4: '4411',
  netAmount: 320,
  status
}));

export interface PensionDocument {
  id: string;
  title: string;
  date: string;
  description: string;
}

export type PensionDocumentCategory =
  | 'tax-forms'
  | 'welcome-kits'
  | 'annuity-certificates'
  | 'smr-output';

export const pensionDocumentCategories: Record<
  PensionDocumentCategory,
  { label: string; description: string; actionLabel: string; documents: PensionDocument[] }
> = {
  'tax-forms': {
    label: 'Tax forms',
    description: 'View your current or past tax forms.',
    actionLabel: 'View tax forms',
    documents: [
      {
        id: '1099r-2023',
        title: 'Form 1099-R (2023)',
        date: '01/26/2024',
        description: 'Distributions from pensions and annuities for tax year 2023'
      },
      {
        id: '1099r-2022',
        title: 'Form 1099-R (2022)',
        date: '01/27/2023',
        description: 'Distributions from pensions and annuities for tax year 2022'
      },
      {
        id: 'w4p',
        title: 'Form W-4P on file',
        date: '03/02/2022',
        description: 'Your current federal withholding election'
      }
    ]
  },
  'welcome-kits': {
    label: 'Welcome kits',
    description: 'Your enrollment packet and what to expect from your monthly benefit.',
    actionLabel: 'View welcome kits',
    documents: [
      {
        id: 'welcome-kit',
        title: 'Retiree welcome kit',
        date: '03/02/2022',
        description: 'How your pension is paid, who to contact, and key dates'
      },
      {
        id: 'payment-guide',
        title: 'Payment and deposit guide',
        date: '03/02/2022',
        description: 'Setting up and changing direct deposit accounts'
      }
    ]
  },
  'annuity-certificates': {
    label: 'Annuity certificates',
    description: 'Proof of your guaranteed lifetime benefit issued by the plan.',
    actionLabel: 'View annuity',
    documents: [
      {
        id: 'certificate',
        title: 'Annuity certificate',
        date: '04/01/2022',
        description: 'Your benefit amount, form of payment, and start date'
      },
      {
        id: 'certificate-rider',
        title: 'Certificate amendment',
        date: '01/05/2023',
        description: 'Update to beneficiary terms on your certificate'
      }
    ]
  },
  'smr-output': {
    label: 'SMR output',
    description: 'Statements of monthly remittance for each payment run.',
    actionLabel: 'View SMR output',
    documents: [
      {
        id: 'smr-2024-08',
        title: 'SMR output - August 2024',
        date: '08/15/2024',
        description: 'Remittance detail for the 08/15/2024 payment'
      },
      {
        id: 'smr-2024-07',
        title: 'SMR output - July 2024',
        date: '07/15/2024',
        description: 'Remittance detail for the 07/15/2024 payment'
      },
      {
        id: 'smr-2024-06',
        title: 'SMR output - June 2024',
        date: '06/14/2024',
        description: 'Remittance detail for the 06/14/2024 payment'
      }
    ]
  }
};
