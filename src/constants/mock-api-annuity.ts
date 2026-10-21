export interface AccountHolder {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
}

export const accountHolder: AccountHolder = {
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex.morgan@example.com',
  phone: '(555) 123-4567',
  dateOfBirth: '1958-04-12',
  addressLine1: '482 Willow Creek Dr',
  city: 'Ann Arbor',
  state: 'MI',
  zip: '48103'
};

export interface Contract {
  productName: string;
  contractType: string;
  contractNumber: string;
  status: 'Active';
  issueDate: string;
  asOfDate: string;
  owner: string;
  annuitant: string;
  jointAnnuitant: string;
  issueState: string;
  initialPremium: number;
  contractYear: number;
  nextAnniversary: string;
}

export const contract: Contract = {
  productName: 'Horizon Secure Index 10',
  contractType: 'Fixed Indexed Annuity',
  contractNumber: 'FIA-4021-88317',
  status: 'Active',
  issueDate: 'Mar 15, 2019',
  asOfDate: 'Oct 20, 2026',
  owner: 'Alex Morgan',
  annuitant: 'Alex Morgan',
  jointAnnuitant: 'Pat Morgan',
  issueState: 'Michigan',
  initialPremium: 300_000,
  contractYear: 8,
  nextAnniversary: 'Mar 15, 2027'
};

export interface AnnuitySummary {
  accountValue: number;
  surrenderValue: number;
  deathBenefit: number;
  guaranteedMonthlyIncome: number;
  nextPayoutDate: string;
  payoutsRemaining: string;
  contractType: string;
}

export const annuitySummary: AnnuitySummary = {
  accountValue: 381_520,
  surrenderValue: 370_768,
  deathBenefit: 381_520,
  guaranteedMonthlyIncome: 2150,
  nextPayoutDate: 'Nov 1, 2026',
  payoutsRemaining: 'Lifetime',
  contractType: contract.contractType
};

export interface IncomeRider {
  name: string;
  incomeBase: number;
  payoutRate: number;
  annualIncome: number;
  incomeStartDate: string;
  coverage: string;
  riderFee: number;
}

export const incomeRider: IncomeRider = {
  name: 'Lifetime Income Benefit Rider',
  incomeBase: 430_000,
  payoutRate: 6.0,
  annualIncome: 25_800,
  incomeStartDate: 'Apr 1, 2025',
  coverage: 'Joint life (Alex and Pat Morgan)',
  riderFee: 1.0
};

export interface FreeWithdrawal {
  annualAllowance: number;
  usedThisYear: number;
  contractYearEnds: string;
}

export const freeWithdrawal: FreeWithdrawal = {
  annualAllowance: 39_667,
  usedThisYear: 16_550,
  contractYearEnds: contract.nextAnniversary
};

export interface SurrenderChargeYear {
  contractYear: number;
  chargePercent: number;
  period: string;
}

export const surrenderSchedule: SurrenderChargeYear[] = [
  { contractYear: 1, chargePercent: 10, period: 'Mar 2019 - Mar 2020' },
  { contractYear: 2, chargePercent: 9, period: 'Mar 2020 - Mar 2021' },
  { contractYear: 3, chargePercent: 8, period: 'Mar 2021 - Mar 2022' },
  { contractYear: 4, chargePercent: 7, period: 'Mar 2022 - Mar 2023' },
  { contractYear: 5, chargePercent: 6, period: 'Mar 2023 - Mar 2024' },
  { contractYear: 6, chargePercent: 5, period: 'Mar 2024 - Mar 2025' },
  { contractYear: 7, chargePercent: 4, period: 'Mar 2025 - Mar 2026' },
  { contractYear: 8, chargePercent: 3, period: 'Mar 2026 - Mar 2027' },
  { contractYear: 9, chargePercent: 2, period: 'Mar 2027 - Mar 2028' },
  { contractYear: 10, chargePercent: 1, period: 'Mar 2028 - Mar 2029' },
  { contractYear: 11, chargePercent: 0, period: 'Mar 2029 onward' }
];

export interface IndexStrategy {
  id: string;
  name: string;
  index: string;
  method: string;
  rateLabel: 'Cap' | 'Participation' | 'Declared rate';
  rate: number;
  floor: number;
  allocationPercent: number;
  value: number;
  termStart: string;
  termEnd: string;
}

export const indexStrategies: IndexStrategy[] = [
  {
    id: 'sp500-ptp-cap',
    name: 'S&P 500 Annual Point-to-Point',
    index: 'S&P 500',
    method: '1-year point-to-point with cap',
    rateLabel: 'Cap',
    rate: 9.25,
    floor: 0,
    allocationPercent: 40,
    value: 152_608,
    termStart: 'Mar 15, 2026',
    termEnd: 'Mar 15, 2027'
  },
  {
    id: 'nasdaq-2yr-par',
    name: 'Nasdaq-100 2-Year Point-to-Point',
    index: 'Nasdaq-100',
    method: '2-year point-to-point with participation rate',
    rateLabel: 'Participation',
    rate: 45,
    floor: 0,
    allocationPercent: 25,
    value: 95_380,
    termStart: 'Mar 15, 2025',
    termEnd: 'Mar 15, 2027'
  },
  {
    id: 'balanced-vc-par',
    name: 'Balanced Risk Control 5% Index',
    index: 'Balanced Risk Control 5%',
    method: '1-year point-to-point with participation rate',
    rateLabel: 'Participation',
    rate: 140,
    floor: 0,
    allocationPercent: 20,
    value: 76_304,
    termStart: 'Mar 15, 2026',
    termEnd: 'Mar 15, 2027'
  },
  {
    id: 'fixed-account',
    name: 'Fixed Account',
    index: 'None',
    method: 'Declared annual interest rate',
    rateLabel: 'Declared rate',
    rate: 4.1,
    floor: 0,
    allocationPercent: 15,
    value: 57_228,
    termStart: 'Mar 15, 2026',
    termEnd: 'Mar 15, 2027'
  }
];

export interface ReallocationWindow {
  opens: string;
  closes: string;
}

export const reallocationWindow: ReallocationWindow = {
  opens: 'Feb 13, 2027',
  closes: 'Mar 15, 2027'
};

export interface CreditingHistoryYear {
  anniversary: string;
  year: string;
  creditedPercent: number;
  creditedAmount: number;
  accountValue: number;
  note?: string;
}

export const creditingHistory: CreditingHistoryYear[] = [
  {
    anniversary: 'Mar 15, 2020',
    year: '2020',
    creditedPercent: 3.1,
    creditedAmount: 9300,
    accountValue: 309_300
  },
  {
    anniversary: 'Mar 15, 2021',
    year: '2021',
    creditedPercent: 8.4,
    creditedAmount: 25_981,
    accountValue: 335_281
  },
  {
    anniversary: 'Mar 15, 2022',
    year: '2022',
    creditedPercent: 0,
    creditedAmount: 0,
    accountValue: 335_281,
    note: '0% floor applied, no loss from the index decline'
  },
  {
    anniversary: 'Mar 15, 2023',
    year: '2023',
    creditedPercent: 4.6,
    creditedAmount: 15_423,
    accountValue: 350_704
  },
  {
    anniversary: 'Mar 15, 2024',
    year: '2024',
    creditedPercent: 7.9,
    creditedAmount: 27_706,
    accountValue: 378_410
  },
  {
    anniversary: 'Mar 15, 2025',
    year: '2025',
    creditedPercent: 6.2,
    creditedAmount: 23_461,
    accountValue: 401_871
  },
  {
    anniversary: 'Mar 15, 2026',
    year: '2026',
    creditedPercent: 5.3,
    creditedAmount: 20_600,
    accountValue: 396_671,
    note: 'Value reflects $25,800 of income payments taken this contract year'
  }
];

export type PaymentStatus = 'scheduled' | 'processing' | 'deposited';

export interface Payment {
  id: string;
  date: string;
  type: 'Guaranteed income' | 'Additional withdrawal';
  grossAmount: number;
  federalWithholding: number;
  stateWithholding: number;
  netAmount: number;
  method: 'Direct deposit';
  accountLast4: string;
  status: PaymentStatus;
}

function incomePayment(id: string, date: string, status: PaymentStatus): Payment {
  return {
    id,
    date,
    type: 'Guaranteed income',
    grossAmount: 2150,
    federalWithholding: 215,
    stateWithholding: 91.38,
    netAmount: 1843.62,
    method: 'Direct deposit',
    accountLast4: '4411',
    status
  };
}

export const payments: Payment[] = [
  incomePayment('pmt-2611', 'Nov 1, 2026', 'scheduled'),
  incomePayment('pmt-2610', 'Oct 1, 2026', 'deposited'),
  incomePayment('pmt-2609', 'Sep 1, 2026', 'deposited'),
  incomePayment('pmt-2608', 'Aug 1, 2026', 'deposited'),
  {
    id: 'wd-2607',
    date: 'Jul 15, 2026',
    type: 'Additional withdrawal',
    grossAmount: 1500,
    federalWithholding: 150,
    stateWithholding: 63.75,
    netAmount: 1286.25,
    method: 'Direct deposit',
    accountLast4: '4411',
    status: 'deposited'
  },
  incomePayment('pmt-2607', 'Jul 1, 2026', 'deposited'),
  incomePayment('pmt-2606', 'Jun 1, 2026', 'deposited'),
  incomePayment('pmt-2605', 'May 1, 2026', 'deposited'),
  incomePayment('pmt-2604', 'Apr 1, 2026', 'deposited'),
  incomePayment('pmt-2603', 'Mar 1, 2026', 'deposited'),
  incomePayment('pmt-2602', 'Feb 1, 2026', 'deposited'),
  incomePayment('pmt-2601', 'Jan 1, 2026', 'deposited')
];

export interface PaymentSettings {
  frequency: string;
  paymentDay: string;
  bankName: string;
  accountType: 'Checking' | 'Savings';
  accountLast4: string;
  routingLast4: string;
}

export const paymentSettings: PaymentSettings = {
  frequency: 'Monthly',
  paymentDay: '1st of each month',
  bankName: 'Great Lakes Credit Union',
  accountType: 'Checking',
  accountLast4: '4411',
  routingLast4: '0732'
};

export interface TaxWithholding {
  federalPercent: number;
  statePercent: number;
  state: string;
  electionDate: string;
}

export const taxWithholding: TaxWithholding = {
  federalPercent: 10,
  statePercent: 4.25,
  state: 'Michigan',
  electionDate: 'Mar 3, 2025'
};

export interface Beneficiary {
  name: string;
  relationship: string;
  allocationPercent: number;
  type: 'Primary' | 'Contingent';
}

export const beneficiaries: Beneficiary[] = [
  { name: 'Pat Morgan', relationship: 'Spouse', allocationPercent: 70, type: 'Primary' },
  { name: 'Jordan Morgan', relationship: 'Child', allocationPercent: 30, type: 'Primary' },
  { name: 'Riley Morgan', relationship: 'Grandchild', allocationPercent: 100, type: 'Contingent' }
];

export type DocumentCategory = 'statements' | 'tax' | 'contract' | 'confirmations';

export interface AnnuityDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  date: string;
  description: string;
}

export const documentCategories: Record<DocumentCategory, { label: string; description: string }> =
  {
    statements: {
      label: 'Statements',
      description: 'Annual and quarterly statements for your contract'
    },
    tax: {
      label: 'Tax forms',
      description: '1099-R forms and your withholding election'
    },
    contract: {
      label: 'Contract and riders',
      description: 'Your annuity contract, rider endorsements, and disclosures'
    },
    confirmations: {
      label: 'Confirmations',
      description: 'Confirmations of transactions and changes to your contract'
    }
  };

export const documents: AnnuityDocument[] = [
  {
    id: 'stmt-2026-q3',
    title: 'Quarterly statement, Q3 2026',
    category: 'statements',
    date: 'Oct 5, 2026',
    description: 'Account value, strategy values, and payments for Jul 1 - Sep 30, 2026'
  },
  {
    id: 'stmt-2026-q2',
    title: 'Quarterly statement, Q2 2026',
    category: 'statements',
    date: 'Jul 6, 2026',
    description: 'Account value, strategy values, and payments for Apr 1 - Jun 30, 2026'
  },
  {
    id: 'stmt-2026-annual',
    title: 'Annual statement, contract year 7',
    category: 'statements',
    date: 'Mar 20, 2026',
    description: 'Interest credited, income base, and surrender value as of Mar 15, 2026'
  },
  {
    id: 'stmt-2025-annual',
    title: 'Annual statement, contract year 6',
    category: 'statements',
    date: 'Mar 20, 2025',
    description: 'Interest credited, income base, and surrender value as of Mar 15, 2025'
  },
  {
    id: 'tax-1099r-2025',
    title: 'Form 1099-R, tax year 2025',
    category: 'tax',
    date: 'Jan 28, 2026',
    description: 'Distributions of $19,350 and federal tax withheld of $1,935'
  },
  {
    id: 'tax-w4p-2025',
    title: 'Withholding election (Form W-4P)',
    category: 'tax',
    date: 'Mar 3, 2025',
    description: '10% federal and 4.25% Michigan withholding on income payments'
  },
  {
    id: 'contract-base',
    title: 'Annuity contract',
    category: 'contract',
    date: 'Mar 15, 2019',
    description: 'Horizon Secure Index 10 contract and specifications page'
  },
  {
    id: 'contract-income-rider',
    title: 'Lifetime Income Benefit Rider endorsement',
    category: 'contract',
    date: 'Mar 15, 2019',
    description: 'Income base roll-up, payout rates, and rider fee'
  },
  {
    id: 'contract-rates-2026',
    title: 'Renewal rates notice, 2026',
    category: 'contract',
    date: 'Feb 13, 2026',
    description: 'Caps, participation rates, and fixed rate for the term starting Mar 15, 2026'
  },
  {
    id: 'conf-withdrawal-2026',
    title: 'Additional withdrawal confirmation',
    category: 'confirmations',
    date: 'Jul 15, 2026',
    description: '$1,500 withdrawal within your penalty-free amount'
  },
  {
    id: 'conf-realloc-2026',
    title: 'Strategy allocation confirmation',
    category: 'confirmations',
    date: 'Mar 15, 2026',
    description: 'Allocation for the contract year starting Mar 15, 2026'
  },
  {
    id: 'conf-income-start',
    title: 'Lifetime income activation',
    category: 'confirmations',
    date: 'Apr 1, 2025',
    description: 'Guaranteed income of $2,150 per month started on joint life'
  }
];

export interface AccountAlert {
  id: string;
  title: string;
  body: string;
  href: string;
  linkLabel: string;
}

export const accountAlerts: AccountAlert[] = [
  {
    id: 'q3-statement',
    title: 'Your Q3 2026 statement is ready',
    body: 'See your account value and strategy values as of Sep 30, 2026.',
    href: '/documents',
    linkLabel: 'View statement'
  },
  {
    id: 'realloc-window',
    title: 'Reallocation window opens Feb 13, 2027',
    body: 'You can change how your account value is split across strategies until your Mar 15, 2027 anniversary.',
    href: '/strategies',
    linkLabel: 'Review strategies'
  },
  {
    id: 'tax-season',
    title: 'Your 2026 Form 1099-R will be available by Jan 31, 2027',
    body: 'We will notify you when it is ready to download.',
    href: '/documents',
    linkLabel: 'Go to tax forms'
  }
];
