'use client';

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { creditingHistory } from '@/constants/mock-api-annuity';
import { formatCurrency } from '../utils';

const chartConfig = {
  creditedPercent: {
    label: 'Interest credited',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig;

export function CreditingHistoryChart() {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Interest Credited</CardTitle>
        <CardDescription>
          Indexed interest added at each contract anniversary. Your 0% floor means a down year
          credits nothing rather than a loss.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='max-h-[300px] w-full'>
          <BarChart accessibilityLayer data={creditingHistory} margin={{ top: 24 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='year' tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => payload?.[0]?.payload.anniversary}
                  formatter={(value, _name, item) => (
                    <div className='flex w-full justify-between gap-4'>
                      <span className='text-muted-foreground'>Interest credited</span>
                      <span className='font-mono tabular-nums'>
                        {value}% ({formatCurrency(item.payload.creditedAmount)})
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Bar
              dataKey='creditedPercent'
              fill='var(--color-creditedPercent)'
              radius={4}
              minPointSize={2}
            >
              <LabelList
                dataKey='creditedPercent'
                position='top'
                className='fill-foreground'
                fontSize={12}
                formatter={(value) => `${value}%`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
