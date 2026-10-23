'use client';

import { useState } from 'react';
import { Icons } from '@/components/icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { pensionAlerts } from '@/constants/mock-api-pension';

export function PensionAlerts() {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || pensionAlerts.length === 0) return null;

  const alert = pensionAlerts[index];

  return (
    <Alert role='status' className='border-primary/30 bg-primary/5 pr-10'>
      <Icons.info className='text-primary' />
      <AlertTitle>{alert.title}</AlertTitle>
      <AlertDescription>
        <p>{alert.body}</p>
        <div className='mt-1 flex items-center gap-2'>
          <Button
            variant='link'
            size='xs'
            className='px-0'
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
          >
            Previous
          </Button>
          <span className='text-xs tabular-nums' aria-live='polite'>
            {index + 1} of {pensionAlerts.length}
          </span>
          <Button
            variant='link'
            size='xs'
            className='px-0'
            disabled={index === pensionAlerts.length - 1}
            onClick={() => setIndex(index + 1)}
          >
            Next
          </Button>
        </div>
      </AlertDescription>
      <Button
        variant='ghost'
        size='icon-xs'
        className='absolute top-2 right-2'
        aria-label='Dismiss alerts'
        onClick={() => setDismissed(true)}
      >
        <Icons.close />
      </Button>
    </Alert>
  );
}
