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
import { indexStrategies } from '@/constants/mock-api-annuity';

const chartData = indexStrategies.map((strategy, index) => ({
  strategy: strategy.name,
  percent: strategy.allocationPercent,
  fill: `var(--chart-${index + 1})`
}));

const chartConfig = indexStrategies.reduce((config, strategy, index) => {
  config[strategy.name] = { label: strategy.name, color: `var(--chart-${index + 1})` };
  return config;
}, {} as ChartConfig);

export function StrategyAllocationPie() {
  return (
    <Card className='flex h-full flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Strategy Allocation</CardTitle>
        <CardDescription>
          How your account value is split across crediting strategies
        </CardDescription>
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
                  nameKey='strategy'
                  hideLabel
                  valueFormatter={(value) => `${value}%`}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey='percent'
              nameKey='strategy'
              innerRadius={60}
              cornerRadius={8}
              paddingAngle={4}
            />
            <ChartLegend
              itemSorter={null}
              content={
                <ChartLegendContent
                  nameKey='strategy'
                  className='flex-wrap gap-x-6 gap-y-2 text-sm'
                />
              }
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
