'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { accountAlerts } from '@/constants/mock-api-annuity';

export function AccountAlerts() {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || accountAlerts.length === 0) return null;

  const alert = accountAlerts[index];

  return (
    <Alert role='status' className='border-primary/30 bg-primary/5 pr-10'>
      <Icons.info className='text-primary' />
      <AlertTitle>{alert.title}</AlertTitle>
      <AlertDescription>
        <p>
          {alert.body}{' '}
          <Link href={alert.href} className='text-primary'>
            {alert.linkLabel}
          </Link>
        </p>
        <div className='mt-1 flex items-center gap-1'>
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
            {index + 1} of {accountAlerts.length}
          </span>
          <Button
            variant='link'
            size='xs'
            className='px-0'
            disabled={index === accountAlerts.length - 1}
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
