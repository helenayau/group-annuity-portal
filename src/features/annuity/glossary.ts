import type { InfobarContent } from '@/components/ui/infobar';

export const annuityGlossary: InfobarContent = {
  title: 'Understanding your annuity',
  sections: [
    {
      title: 'Account value',
      description:
        'Your premium plus interest credited, minus withdrawals, income payments, and rider fees. This is the amount your strategies earn interest on.'
    },
    {
      title: 'Surrender value',
      description:
        'What you would receive if you ended the contract today: your account value minus any surrender charge on amounts above your penalty-free allowance.'
    },
    {
      title: 'Income base',
      description:
        'The amount your guaranteed lifetime income is calculated from. It is not cash you can withdraw, and it is separate from your account value.'
    },
    {
      title: 'Cap and participation rate',
      description:
        'Limits on how much index gain is credited. A cap sets a maximum rate, and a participation rate credits a share of the gain.'
    },
    {
      title: 'Floor',
      description:
        'The least a strategy can credit in a term. With a 0% floor, a falling index credits nothing instead of a loss.'
    }
  ]
};
