'use client';

import { toast } from 'sonner';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { grossMonthlyPayment, pensionPlan } from '@/constants/mock-api-pension';
import { downloadPensionIncomeLetter } from '../documents';
import { pillButton } from '../styles';
import { usePension } from '../pension-context';

export function IncomeLetterCard() {
  const { participant, accounts } = usePension();

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Income verification letter</CardTitle>
        <CardDescription className='uppercase'>
          For {participant.firstName} {participant.lastName}
        </CardDescription>
      </CardHeader>
      <CardContent className='text-muted-foreground flex-1 text-sm'>
        Your income verification letter documents your income as a participant of{' '}
        {pensionPlan.planName}.
      </CardContent>
      <CardFooter>
        <Button
          variant='outline'
          size='sm'
          className={pillButton}
          onClick={() => {
            downloadPensionIncomeLetter(participant, accounts, grossMonthlyPayment);
            toast.success('Income verification letter downloaded');
          }}
        >
          <Icons.fileTypePdf />
          Download letter
        </Button>
      </CardFooter>
    </Card>
  );
}
