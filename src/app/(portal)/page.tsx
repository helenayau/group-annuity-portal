import PageContainer from '@/components/layout/page-container';
import { AnnuityOverview } from '@/features/annuity/components/annuity-overview';

export const metadata = { title: 'Overview' };

export default function Page() {
  return (
    <PageContainer
      pageTitle='Overview'
      pageDescription='Your annuity value, guaranteed income, and recent activity'
    >
      <AnnuityOverview />
    </PageContainer>
  );
}
