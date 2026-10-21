import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Icons } from '@/components/icons';
import {
  annuitySummary,
  beneficiaries,
  contract,
  incomeRider,
  payments,
  paymentSettings
} from '@/constants/mock-api-annuity';
import { formatCurrency, formatCurrencyCents } from '../utils';
import { AccountAlerts } from './account-alerts';
import { ContractStrip } from './contract-strip';
import { CreditingHistoryChart } from './crediting-history-chart';
import { IncomeLetterButton } from './income-letter-button';
import { PaymentStatusBadge } from './payment-status-badge';
import { StrategyAllocationPie } from './strategy-allocation-pie';

const nextPayment = payments.find((payment) => payment.status === 'scheduled');
const recentPayments = payments.filter((payment) => payment.status !== 'scheduled').slice(0, 4);
const primaryCount = beneficiaries.filter((b) => b.type === 'Primary').length;
const contingentCount = beneficiaries.filter((b) => b.type === 'Contingent').length;

export function AnnuityOverview() {
  return (
    <div className='flex min-w-0 flex-1 flex-col gap-4'>
      <AccountAlerts />
      <ContractStrip />

      <div className='grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card md:grid-cols-2 lg:grid-cols-4'>
        <Card className='@container/card'>
          <CardHeader>
            <CardTitle>Account Value</CardTitle>
            <CardDescription className='text-2xl font-normal text-foreground tabular-nums @[250px]/card:text-3xl'>
              {formatCurrency(annuitySummary.accountValue)}
            </CardDescription>
          </CardHeader>
          <CardFooter className='text-muted-foreground text-sm'>
            Current value across all strategies
          </CardFooter>
        </Card>
        <Card className='@container/card'>
          <CardHeader>
            <CardTitle>Surrender Value</CardTitle>
            <CardDescription className='text-2xl font-normal text-foreground tabular-nums @[250px]/card:text-3xl'>
              {formatCurrency(annuitySummary.surrenderValue)}
            </CardDescription>
          </CardHeader>
          <CardFooter className='text-muted-foreground text-sm'>
            What you would receive if you surrendered today
          </CardFooter>
        </Card>
        <Card className='@container/card'>
          <CardHeader>
            <CardTitle>Guaranteed Monthly Income</CardTitle>
            <CardDescription className='text-2xl font-normal text-foreground tabular-nums @[250px]/card:text-3xl'>
              {formatCurrency(annuitySummary.guaranteedMonthlyIncome)}
            </CardDescription>
          </CardHeader>
          <CardFooter className='text-muted-foreground text-sm'>
            Paid for as long as you or {contract.jointAnnuitant.split(' ')[0]} live
          </CardFooter>
        </Card>
        <Card className='@container/card'>
          <CardHeader>
            <CardTitle>Next Payment</CardTitle>
            <CardDescription className='text-2xl font-normal text-foreground tabular-nums @[250px]/card:text-3xl'>
              {annuitySummary.nextPayoutDate}
            </CardDescription>
          </CardHeader>
          <CardFooter className='text-muted-foreground text-sm'>
            {nextPayment ? formatCurrencyCents(nextPayment.netAmount) : ''} net to account ending{' '}
            {paymentSettings.accountLast4}
          </CardFooter>
        </Card>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <div className='lg:col-span-4'>
          <CreditingHistoryChart />
        </div>
        <div className='lg:col-span-3'>
          <StrategyAllocationPie />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <Card className='lg:col-span-4'>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Income payments and withdrawals from your contract</CardDescription>
            <CardAction>
              <Button
                variant='outline'
                size='sm'
                nativeButton={false}
                render={<Link href='/income#payment-history' aria-label='View all payments' />}
              >
                View all
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Net amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className='text-muted-foreground'>{payment.date}</TableCell>
                    <TableCell>{payment.type}</TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={payment.status} />
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {formatCurrencyCents(payment.netAmount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className='flex flex-col gap-4 lg:col-span-3'>
          <Card>
            <CardHeader>
              <CardTitle>Lifetime Income</CardTitle>
              <CardDescription>{incomeRider.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className='grid grid-cols-2 gap-4'>
                <div>
                  <dt className='text-muted-foreground text-sm'>Income base</dt>
                  <dd className='text-lg font-semibold tabular-nums'>
                    {formatCurrency(incomeRider.incomeBase)}
                  </dd>
                </div>
                <div>
                  <dt className='text-muted-foreground text-sm'>Annual income</dt>
                  <dd className='text-lg font-semibold tabular-nums'>
                    {formatCurrency(incomeRider.annualIncome)}
                  </dd>
                </div>
              </dl>
            </CardContent>
            <CardFooter>
              <Button
                variant='outline'
                size='sm'
                nativeButton={false}
                render={<Link href='/income' aria-label='Income and withdrawals' />}
              >
                Income and withdrawals
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need help?</CardTitle>
              <CardDescription>
                Talk to your advisor about withdrawals, beneficiaries, or your strategy allocation.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className='w-full'>
                <Icons.phone className='mr-2 h-4 w-4' />
                Contact my advisor
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle>Income Verification Letter</CardTitle>
            <CardDescription>
              Proof of your guaranteed income for lenders, landlords, or benefit applications.
            </CardDescription>
          </CardHeader>
          <CardFooter className='mt-auto'>
            <IncomeLetterButton />
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tax Forms</CardTitle>
            <CardDescription>
              Your 1099-R forms and federal and state withholding election.
            </CardDescription>
          </CardHeader>
          <CardFooter className='mt-auto'>
            <Button
              variant='outline'
              size='sm'
              nativeButton={false}
              render={<Link href='/documents?category=tax' aria-label='View tax forms' />}
            >
              View tax forms
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Beneficiaries</CardTitle>
            <CardDescription>
              {primaryCount} primary and {contingentCount} contingent beneficiaries receive the
              death benefit of {formatCurrency(annuitySummary.deathBenefit)}.
            </CardDescription>
          </CardHeader>
          <CardFooter className='mt-auto'>
            <Button
              variant='outline'
              size='sm'
              nativeButton={false}
              render={<Link href='/beneficiaries' aria-label='View beneficiaries' />}
            >
              View beneficiaries
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
