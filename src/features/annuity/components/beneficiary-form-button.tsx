'use client';

import { toast } from 'sonner';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { downloadBeneficiaryChangeForm } from '../documents';

export function BeneficiaryFormButton() {
  return (
    <Button
      variant='outline'
      size='sm'
      onClick={() => {
        downloadBeneficiaryChangeForm();
        toast.success('Beneficiary change form downloaded');
      }}
    >
      <Icons.fileTypePdf className='mr-1 h-4 w-4' />
      Download change form
    </Button>
  );
}
