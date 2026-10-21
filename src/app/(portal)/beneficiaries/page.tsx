import PageContainer from '@/components/layout/page-container';
import { BeneficiariesView } from '@/features/annuity/components/beneficiaries-view';

export const metadata = { title: 'Beneficiaries' };

export default function Page() {
  return (
    <PageContainer pageTitle='Beneficiaries' pageDescription='Who receives your death benefit'>
      <BeneficiariesView />
    </PageContainer>
  );
}
