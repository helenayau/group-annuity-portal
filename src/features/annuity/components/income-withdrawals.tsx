import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  annuitySummary,
  contract,
  freeWithdrawal,
  incomeRider,
  payments,
  surrenderSchedule
} from '@/constants/mock-api-annuity';
import { formatCurrency, formatPercent } from '../utils';
import { ContractStrip } from './contract-strip';
import { IncomeLetterButton } from './income-letter-button';
import { PaymentHistory } from './payment-history';
import { PaymentSettingsCard } from './payment-settings-card';
import { TaxWithholdingCard } from './tax-withholding-card';

const paidThisYear = payments
  .filter((payment) => payment.status !== 'scheduled')
  .reduce((total, payment) => total + payment.grossAmount, 0);
const freeRemaining = freeWithdrawal.annualAllowance - freeWithdrawal.usedThisYear;
const currentCharge = surrenderSchedule.find((year) => year.contractYear === contract.contractYear);

export function IncomeWithdrawals() {
  const riderFields: Array<[string, string]> = [
    ['Income base', formatCurrency(incomeRider.incomeBase)],
    ['Payout rate', formatPercent(incomeRider.payoutRate)],
    ['Guaranteed annual income', formatCurrency(incomeRider.annualIncome)],
    ['Income started', incomeRider.incomeStartDate],
    ['Coverage', incomeRider.coverage],
    ['Annual rider fee', `${formatPercent(incomeRider.riderFee)} of income base`]
  ];

  return (
    <div className='flex min-w-0 flex-1 flex-col gap-4'>
      <ContractStrip />

      <div className='grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card md:grid-cols-2 lg:grid-cols-4'>
        <Card className='@container/card'>
          <CardHeader>
            <CardTitle>Gross Monthly Payment</CardTitle>
            <CardDescription className='text-2xl font-normal text-foreground tabular-nums @[250px]/card:text-3xl'>
              {formatCurrency(annuitySummary.guaranteedMonthlyIncome)}
            </CardDescription>
          </CardHeader>
          <CardFooter className='text-muted-foreground text-sm'>
            Guaranteed for life, next on {annuitySummary.nextPayoutDate}
          </CardFooter>
        </Card>
        <Card className='@container/card'>
          <CardHeader>
            <CardTitle>Paid in 2026</CardTitle>
            <CardDescription className='text-2xl font-normal text-foreground tabular-nums @[250px]/card:text-3xl'>
              {formatCurrency(paidThisYear)}
            </CardDescription>
          </CardHeader>
          <CardFooter className='text-muted-foreground text-sm'>
            Gross, before tax withholding
          </CardFooter>
        </Card>
        <Card className='@container/card'>
          <CardHeader>
            <CardTitle>Penalty-free Remaining</CardTitle>
            <CardDescription className='text-2xl font-normal text-foreground tabular-nums @[250px]/card:text-3xl'>
              {formatCurrency(freeRemaining)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress
              value={(freeWithdrawal.usedThisYear / freeWithdrawal.annualAllowance) * 100}
              aria-label='Penalty-free amount used this contract year'
            />
          </CardContent>
          <CardFooter className='text-muted-foreground text-sm'>
            {formatCurrency(freeWithdrawal.usedThisYear)} of{' '}
            {formatCurrency(freeWithdrawal.annualAllowance)} used until{' '}
            {freeWithdrawal.contractYearEnds}
          </CardFooter>
        </Card>
        <Card className='@container/card'>
          <CardHeader>
            <CardTitle>Surrender Charge</CardTitle>
            <CardDescription className='text-2xl font-normal text-foreground tabular-nums @[250px]/card:text-3xl'>
              {formatPercent(currentCharge?.chargePercent ?? 0)}
            </CardDescription>
          </CardHeader>
          <CardFooter className='text-muted-foreground text-sm'>
            On withdrawals above your penalty-free amount
          </CardFooter>
        </Card>
      </div>

      <PaymentHistory />

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <PaymentSettingsCard />
        <TaxWithholdingCard />
        <Card>
          <CardHeader>
            <CardTitle>Income Verification Letter</CardTitle>
            <CardDescription>
              A letter confirming your guaranteed income of{' '}
              {formatCurrency(annuitySummary.guaranteedMonthlyIncome)} per month, for lenders,
              landlords, or benefit applications.
            </CardDescription>
          </CardHeader>
          <CardFooter className='mt-auto'>
            <IncomeLetterButton />
          </CardFooter>
        </Card>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>{incomeRider.name}</CardTitle>
            <CardDescription>
              Your income is calculated from the income base, not your account value, so it
              continues even if your account value reaches zero.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              {riderFields.map(([label, value]) => (
                <div key={label} className='rounded-lg border p-3'>
                  <dt className='text-muted-foreground text-sm'>{label}</dt>
                  <dd className='mt-1 font-medium tabular-nums'>{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Surrender Charge Schedule</CardTitle>
            <CardDescription>
              Charges apply only to amounts above your penalty-free allowance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract year</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead className='text-right'>Charge</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {surrenderSchedule.map((year) => {
                  const isCurrent = year.contractYear === contract.contractYear;
                  return (
                    <TableRow
                      key={year.contractYear}
                      data-state={isCurrent ? 'selected' : undefined}
                    >
                      <TableCell>
                        <span className='flex items-center gap-2'>
                          {year.contractYear === surrenderSchedule.length
                            ? `${year.contractYear}+`
                            : year.contractYear}
                          {isCurrent && <Badge variant='secondary'>Current</Badge>}
                        </span>
                      </TableCell>
                      <TableCell className='text-muted-foreground'>{year.period}</TableCell>
                      <TableCell className='text-right tabular-nums'>
                        {formatPercent(year.chargePercent)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request a Withdrawal</CardTitle>
          <CardDescription>
            You can take up to {formatCurrency(freeRemaining)} more this contract year without a
            surrender charge. Withdrawals beyond your guaranteed income may reduce your income base.
            Online withdrawal requests are disabled in this demo deployment, so contact your advisor
            to request one.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant='outline' size='sm' disabled>
            Request a withdrawal
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
