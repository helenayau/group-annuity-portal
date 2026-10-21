'use client';

import { toast } from 'sonner';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { downloadIncomeVerificationLetter } from '../documents';

export function IncomeLetterButton() {
  return (
    <Button
      variant='outline'
      size='sm'
      onClick={() => {
        downloadIncomeVerificationLetter();
        toast.success('Income verification letter downloaded');
      }}
    >
      <Icons.fileTypePdf className='mr-1 h-4 w-4' />
      Download letter
    </Button>
  );
}
