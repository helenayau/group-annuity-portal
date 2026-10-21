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
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  annuitySummary,
  contract,
  creditingHistory,
  indexStrategies,
  reallocationWindow
} from '@/constants/mock-api-annuity';
import { formatCurrency, formatPercent } from '../utils';
import { ContractStrip } from './contract-strip';
import { CreditingHistoryChart } from './crediting-history-chart';
import { StrategyAllocationPie } from './strategy-allocation-pie';

const termConcepts = [
  {
    title: 'Cap',
    description:
      'The most indexed interest a strategy can credit for a term. If the S&P 500 rises 15% and the cap is 9.25%, you are credited 9.25%.'
  },
  {
    title: 'Participation rate',
    description:
      'The share of the index gain you are credited. At 45% participation, a 20% index gain credits 9%.'
  },
  {
    title: 'Floor',
    description:
      'The least a strategy can credit. Every strategy in your contract has a 0% floor, so index losses never reduce your account value.'
  }
];

export function IndexStrategies() {
  return (
    <div className='flex min-w-0 flex-1 flex-col gap-4'>
      <ContractStrip />

      <Card>
        <CardHeader>
          <CardTitle>Current Strategies</CardTitle>
          <CardDescription>
            Rates are locked for each term. Indexed interest is credited when a term ends.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Strategy</TableHead>
                <TableHead>Crediting method</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Term ends</TableHead>
                <TableHead className='text-right'>Allocation</TableHead>
                <TableHead className='text-right'>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {indexStrategies.map((strategy) => (
                <TableRow key={strategy.id}>
                  <TableCell className='font-medium'>{strategy.name}</TableCell>
                  <TableCell className='text-muted-foreground'>{strategy.method}</TableCell>
                  <TableCell>
                    <Badge variant='outline'>
                      {strategy.rateLabel} {formatPercent(strategy.rate)}
                    </Badge>
                  </TableCell>
                  <TableCell className='tabular-nums'>{formatPercent(strategy.floor)}</TableCell>
                  <TableCell className='text-muted-foreground'>{strategy.termEnd}</TableCell>
                  <TableCell className='text-right tabular-nums'>
                    {strategy.allocationPercent}%
                  </TableCell>
                  <TableCell className='text-right tabular-nums'>
                    {formatCurrency(strategy.value)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5}>Total account value</TableCell>
                <TableCell className='text-right tabular-nums'>100%</TableCell>
                <TableCell className='text-right tabular-nums'>
                  {formatCurrency(annuitySummary.accountValue)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <div className='lg:col-span-3'>
          <StrategyAllocationPie />
        </div>
        <Card className='lg:col-span-4'>
          <CardHeader>
            <CardTitle>Reallocation Window</CardTitle>
            <CardDescription>
              You can move your account value between strategies once a year, in the 30 days before
              your contract anniversary.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-3'>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <div className='rounded-lg border p-4'>
                <div className='text-muted-foreground text-sm'>Window opens</div>
                <div className='text-lg font-semibold'>{reallocationWindow.opens}</div>
              </div>
              <div className='rounded-lg border p-4'>
                <div className='text-muted-foreground text-sm'>Next anniversary</div>
                <div className='text-lg font-semibold'>{contract.nextAnniversary}</div>
              </div>
            </div>
            <p className='text-muted-foreground text-sm'>
              New caps and participation rates for the next term are announced at least 30 days
              before your anniversary. Your Nasdaq-100 2-year strategy is mid-term and can only be
              reallocated when its term ends.
            </p>
            <p className='text-muted-foreground text-sm'>
              Changing your allocation is disabled until the window opens on{' '}
              {reallocationWindow.opens}.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant='outline' size='sm' disabled>
              Change allocation
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <div className='lg:col-span-3'>
          <CreditingHistoryChart />
        </div>
        <Card className='lg:col-span-4'>
          <CardHeader>
            <CardTitle>Anniversary History</CardTitle>
            <CardDescription>
              Interest credited and account value at each anniversary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Anniversary</TableHead>
                  <TableHead className='text-right'>Credited</TableHead>
                  <TableHead className='text-right'>Interest</TableHead>
                  <TableHead className='text-right'>Account value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creditingHistory.toReversed().map((year) => (
                  <TableRow key={year.anniversary}>
                    <TableCell>
                      <div>{year.anniversary}</div>
                      {year.note && (
                        <div className='text-muted-foreground text-xs whitespace-normal'>
                          {year.note}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {formatPercent(year.creditedPercent)}
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {formatCurrency(year.creditedAmount)}
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {formatCurrency(year.accountValue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How Indexed Interest Works</CardTitle>
          <CardDescription>
            Your account value is never invested directly in the market. Interest is calculated from
            index performance, within these limits.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid grid-cols-1 gap-3 md:grid-cols-3'>
          {termConcepts.map((concept) => (
            <div key={concept.title} className='rounded-lg border p-4'>
              <div className='font-medium'>{concept.title}</div>
              <p className='text-muted-foreground mt-1 text-sm'>{concept.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
