import PageContainer from '@/components/layout/page-container';
import { IndexStrategies } from '@/features/annuity/components/index-strategies';
import { annuityGlossary } from '@/features/annuity/glossary';

export const metadata = { title: 'Index Strategies' };

export default function Page() {
  return (
    <PageContainer
      pageTitle='Index Strategies'
      pageDescription='How your account value earns interest, and what it has earned'
      infoContent={annuityGlossary}
    >
      <IndexStrategies />
    </PageContainer>
  );
}
