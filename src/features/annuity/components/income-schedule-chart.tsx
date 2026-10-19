'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { incomeSchedule } from '@/constants/mock-api-annuity';
import { formatCurrency } from '../utils';

const chartConfig = {
  guaranteed: {
    label: 'Guaranteed Income',
    color: 'var(--chart-1)'
  },
  bonus: {
    label: 'Bonus Payout',
    color: 'var(--chart-2)'
  }
} satisfies ChartConfig;

export function IncomeScheduleChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Schedule</CardTitle>
        <CardDescription>Payouts disbursed so far this year</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={incomeSchedule}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='month' tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              content={
                <ChartTooltipContent valueFormatter={(value) => formatCurrency(Number(value))} />
              }
            />
            <Bar
              dataKey='guaranteed'
              stackId='a'
              fill='var(--color-guaranteed)'
              radius={[0, 0, 4, 4]}
            />
            <Bar dataKey='bonus' stackId='a' fill='var(--color-bonus)' radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
