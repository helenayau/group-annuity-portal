'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { Icons } from '@/components/icons';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { usePension } from '../pension-context';

export function PensionTopBar() {
  const { participant } = usePension();

  return (
    <header className='bg-background border-b'>
      <div className='mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 md:px-6'>
        <Link href='/pension' className='flex items-center gap-2 font-semibold'>
          <Icons.piggyBank className='text-primary size-5' />
          <span className='hidden sm:inline'>Pension Center</span>
        </Link>
        <nav aria-label='Account' className='flex items-center gap-1'>
          <Link href='/pension' className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            <Icons.dashboard />
            Home
          </Link>
          <Separator orientation='vertical' className='h-5' />
          <Link
            href='/pension/profile'
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            <Icons.account />
            {participant.firstName}
          </Link>
          <Separator orientation='vertical' className='h-5' />
          <Button
            variant='ghost'
            size='sm'
            onClick={() =>
              toast.info('Sign-in is turned off in this demo, so there is nothing to log out of.')
            }
          >
            <Icons.logout />
            Log out
          </Button>
        </nav>
      </div>
    </header>
  );
}
