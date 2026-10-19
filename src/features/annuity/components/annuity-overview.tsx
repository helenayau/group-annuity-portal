import { Badge } from '@/components/ui/badge';
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
import { annuitySummary, beneficiaries, withdrawals } from '@/constants/mock-api-annuity';
import { formatCurrency } from '../utils';
import { FundAllocationPie } from './fund-allocation-pie';
import { IncomeScheduleChart } from './income-schedule-chart';

export function AnnuityOverview() {
  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card md:grid-cols-2 lg:grid-cols-4'>
        <Card className='@container/card'>
          <CardHeader>
            <CardTitle>Account Value</CardTitle>
            <CardDescription className='text-2xl font-normal text-foreground tabular-nums @[250px]/card:text-3xl'>
              {formatCurrency(annuitySummary.accountValue)}
            </CardDescription>
            <CardAction>
              <Badge variant='outline'>{annuitySummary.contractType}</Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className='text-muted-foreground text-sm'>
            Current value of your contract
          </CardFooter>
        </Card>
        <Card className='@container/card'>
          <CardHeader>
            <CardTitle>Guaranteed Monthly Income</CardTitle>
            <CardDescription className='text-2xl font-normal text-foreground tabular-nums @[250px]/card:text-3xl'>
              {formatCurrency(annuitySummary.guaranteedMonthlyIncome)}
            </CardDescription>
            <CardAction>
              <Badge variant='outline'>
                <Icons.check />
                Locked in
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className='text-muted-foreground text-sm'>
            Paid for {annuitySummary.payoutsRemaining.toLowerCase()}
          </CardFooter>
        </Card>
        <Card className='@container/card'>
          <CardHeader>
            <CardTitle>Next Payout</CardTitle>
            <CardDescription className='text-2xl font-normal text-foreground tabular-nums @[250px]/card:text-3xl'>
              {annuitySummary.nextPayoutDate}
            </CardDescription>
            <CardAction>
              <Badge variant='outline'>
                <Icons.calendar />
                Scheduled
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className='text-muted-foreground text-sm'>Deposited automatically</CardFooter>
        </Card>
        <Card className='@container/card'>
          <CardHeader>
            <CardTitle>Withdrawals (YTD)</CardTitle>
            <CardDescription className='text-2xl font-normal text-foreground tabular-nums @[250px]/card:text-3xl'>
              {formatCurrency(
                withdrawals.reduce((total, withdrawal) => total + withdrawal.amount, 0)
              )}
            </CardDescription>
            <CardAction>
              <Badge
                variant='outline'
                render={
                  <a
                    href='#withdrawal-history'
                    aria-label={`View ${withdrawals.length} withdrawal transactions`}
                  />
                }
                className='cursor-pointer hover:bg-accent'
              >
                {withdrawals.length} transactions
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className='text-muted-foreground text-sm'>Year to date</CardFooter>
        </Card>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <div className='lg:col-span-4'>
          <IncomeScheduleChart />
        </div>
        <div className='lg:col-span-3'>
          <FundAllocationPie />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <Card id='withdrawal-history' className='lg:col-span-4 scroll-mt-20'>
          <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
            <CardDescription>Your most recent payouts and withdrawals</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell className='text-muted-foreground'>{withdrawal.date}</TableCell>
                    <TableCell>{withdrawal.description}</TableCell>
                    <TableCell>
                      <Badge variant={withdrawal.status === 'completed' ? 'secondary' : 'outline'}>
                        {withdrawal.status === 'completed' ? 'Completed' : 'Processing'}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {formatCurrency(withdrawal.amount)}
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
              <CardTitle>Beneficiaries</CardTitle>
              <CardDescription>Who receives your remaining balance</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-3'>
              {beneficiaries.map((beneficiary) => (
                <div
                  key={beneficiary.name}
                  className='flex items-center justify-between rounded-lg border p-3'
                >
                  <div>
                    <div className='font-medium'>{beneficiary.name}</div>
                    <div className='text-muted-foreground text-sm'>{beneficiary.relationship}</div>
                  </div>
                  <Badge variant='outline'>{beneficiary.allocationPercent}%</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need help?</CardTitle>
              <CardDescription>
                Talk to your advisor about withdrawals, beneficiaries, or your payout schedule.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className='w-full'>
                <Icons.notification className='mr-2 h-4 w-4' />
                Contact my advisor
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
