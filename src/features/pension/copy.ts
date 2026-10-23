import { pensionPlan } from '@/constants/mock-api-pension';

// Copy from the design mockup. Every layout reads its labels from here so
// the wording stays identical no matter how the content is arranged.
export const copy = {
  home: 'Home',
  logOut: 'Log out',
  asOf: `Your retirement account as of ${pensionPlan.asOfDate}`,
  planName: pensionPlan.planName,
  contract: `Contract ${pensionPlan.contractNumber}`,
  sections: {
    account: 'Account details',
    personal: 'Personal details',
    documents: 'E-documents'
  },
  grossMonthly: {
    title: 'Gross monthly payments',
    paidTo: (count: number) => `Paid to ${count} account(s)`,
    action: 'Edit payment settings'
  },
  taxWithholding: {
    title: 'Tax withholding forms',
    body: 'View your federal and state tax withholding forms.',
    federal: 'View federal taxes',
    state: 'View state taxes'
  },
  incomeLetter: {
    title: 'Income verification letter',
    for: (name: string) => `For ${name}`,
    body: `Your income verification letter documents your income as a participant of ${pensionPlan.planName}.`,
    action: 'Download letter'
  },
  paymentHistory: {
    title: 'Payment history',
    asOf: `As of ${pensionPlan.asOfDate}`,
    statusHelp: 'What does status mean?',
    columns: {
      netAmount: 'Net amount',
      method: 'Method',
      accountNumber: 'Account number',
      paymentDate: 'Payment date',
      status: 'Status'
    },
    view: 'View',
    viewAll: 'View all'
  },
  personalDetails: {
    title: 'Personal details',
    action: 'Edit personal details'
  },
  otherDetails: {
    title: 'Need to update other details?',
    body: 'You can update your email address, password, and other preferences on your profile.',
    action: 'Go to profile'
  }
};
