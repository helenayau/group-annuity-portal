'use client';

import { Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { fundAllocation } from '@/constants/mock-api-annuity';

const sortedFundAllocation = [...fundAllocation].sort((a, b) => b.percent - a.percent);

const chartData = sortedFundAllocation.map((item, index) => ({
  category: item.category,
  percent: item.percent,
  fill: `var(--chart-${index + 1})`
}));

const chartConfig = sortedFundAllocation.reduce((config, item, index) => {
  config[item.category] = { label: item.category, color: `var(--chart-${index + 1})` };
  return config;
}, {} as ChartConfig);

export function FundAllocationPie() {
  return (
    <Card className='flex h-full flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Fund Allocation</CardTitle>
        <CardDescription>How your annuity balance is invested</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col items-center justify-center pb-0'>
        <ChartContainer
          config={chartConfig}
          className='[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[360px] min-h-[300px]'
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey='category'
                  hideLabel
                  valueFormatter={(value) => `${value}%`}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey='percent'
              nameKey='category'
              innerRadius={60}
              cornerRadius={8}
              paddingAngle={4}
            />
            <ChartLegend
              content={
                <ChartLegendContent
                  nameKey='category'
                  className='flex-wrap gap-x-6 gap-y-2 text-base whitespace-nowrap'
                />
              }
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
