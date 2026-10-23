import { GrossPaymentsCard } from '@/features/pension/components/gross-payments-card';
import { IncomeLetterCard } from '@/features/pension/components/income-letter-card';
import { PensionPaymentHistory } from '@/features/pension/components/pension-payment-history';
import { TaxWithholdingFormsCard } from '@/features/pension/components/tax-withholding-forms-card';

export const metadata = { title: 'Account details' };

export default function Page() {
  return (
    <div className='flex flex-col gap-4'>
      <h2 className='sr-only'>Account details</h2>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <GrossPaymentsCard />
        <TaxWithholdingFormsCard />
        <IncomeLetterCard />
      </div>
      <PensionPaymentHistory />
    </div>
  );
}
