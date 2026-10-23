'use client';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { downloadWithholdingForm } from '../documents';
import { usePension } from '../pension-context';

export function TaxWithholdingFormsCard() {
  const { participant } = usePension();

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Tax withholding forms</CardTitle>
      </CardHeader>
      <CardContent className='text-muted-foreground flex-1 text-sm'>
        View your federal and state tax withholding forms.
      </CardContent>
      <CardFooter className='flex-wrap gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => {
            downloadWithholdingForm('federal', participant);
            toast.success('Federal withholding form downloaded');
          }}
        >
          View federal taxes
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => {
            downloadWithholdingForm('state', participant);
            toast.success('State withholding form downloaded');
          }}
        >
          View state taxes
        </Button>
      </CardFooter>
    </Card>
  );
}
