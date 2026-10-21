import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { annuitySummary, beneficiaries, type Beneficiary } from '@/constants/mock-api-annuity';
import { formatCurrency } from '../utils';
import { BeneficiaryFormButton } from './beneficiary-form-button';
import { ContractStrip } from './contract-strip';

function BeneficiaryList({
  title,
  description,
  items
}: {
  title: string;
  description: string;
  items: Beneficiary[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-3'>
        {items.map((beneficiary) => (
          <div
            key={beneficiary.name}
            className='flex items-center justify-between rounded-lg border p-4'
          >
            <div>
              <div className='font-medium'>{beneficiary.name}</div>
              <div className='text-muted-foreground text-sm'>{beneficiary.relationship}</div>
            </div>
            <div className='text-right'>
              <Badge variant='outline'>{beneficiary.allocationPercent}%</Badge>
              <div className='text-muted-foreground mt-1 text-xs tabular-nums'>
                {formatCurrency(
                  (annuitySummary.deathBenefit * beneficiary.allocationPercent) / 100
                )}{' '}
                today
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function BeneficiariesView() {
  const primary = beneficiaries.filter((b) => b.type === 'Primary');
  const contingent = beneficiaries.filter((b) => b.type === 'Contingent');

  return (
    <div className='flex min-w-0 flex-1 flex-col gap-4'>
      <ContractStrip />

      <Card className='bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card'>
        <CardHeader>
          <CardTitle>Death Benefit</CardTitle>
          <CardDescription className='text-2xl font-normal text-foreground tabular-nums'>
            {formatCurrency(annuitySummary.deathBenefit)}
          </CardDescription>
        </CardHeader>
        <CardContent className='text-muted-foreground flex flex-col gap-2 text-sm'>
          <p>
            Equal to your account value, with no surrender charges applied. It goes down as income
            payments are taken from your account value.
          </p>
          <p>
            Because Pat Morgan is your spouse and joint annuitant, Pat can choose to continue the
            contract and keep receiving guaranteed income instead of taking a lump sum.
          </p>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <BeneficiaryList
          title='Primary Beneficiaries'
          description='Receive the death benefit first, split by percentage'
          items={primary}
        />
        <BeneficiaryList
          title='Contingent Beneficiaries'
          description='Receive the death benefit only if no primary beneficiary survives you'
          items={contingent}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Change Your Beneficiaries</CardTitle>
          <CardDescription>
            Beneficiary changes need your signature. Download the form, sign it, and return it by
            mail or to your advisor. Changes take effect once we process the form, usually within 5
            business days.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <BeneficiaryFormButton />
        </CardFooter>
      </Card>
    </div>
  );
}
