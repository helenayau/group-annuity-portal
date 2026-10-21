import PageContainer from '@/components/layout/page-container';
import { IncomeWithdrawals } from '@/features/annuity/components/income-withdrawals';
import { annuityGlossary } from '@/features/annuity/glossary';

export const metadata = { title: 'Income & Withdrawals' };

export default function Page() {
  return (
    <PageContainer
      pageTitle='Income & Withdrawals'
      pageDescription='Your guaranteed income, payments, and withdrawal options'
      infoContent={annuityGlossary}
    >
      <IncomeWithdrawals />
    </PageContainer>
  );
}
