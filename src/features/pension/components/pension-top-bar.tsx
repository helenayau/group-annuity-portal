'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { Icons } from '@/components/icons';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { copy } from '../copy';
import { usePension, usePensionActions } from '../pension-context';
import { pensionLayouts } from './layout-switcher';

export function PensionTopBar() {
  const { participant } = usePension();
  const { goToProfile } = usePensionActions();
  const pathname = usePathname();
  // Home stays inside whichever layout option is being reviewed.
  const home = pensionLayouts.find((layout) => layout.href === pathname)?.href ?? '/pension';

  return (
    <header className='bg-background border-b'>
      <div className='mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 md:px-6'>
        <Link href={home} className='flex items-center gap-2 font-semibold'>
          <Icons.piggyBank className='text-primary size-5' />
          <span className='hidden sm:inline'>Pension Center</span>
        </Link>
        <nav aria-label='Account' className='flex items-center gap-1'>
          <Link href={home} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            <Icons.dashboard />
            {copy.home}
          </Link>
          <Separator orientation='vertical' className='h-5' />
          <Button variant='ghost' size='sm' onClick={goToProfile}>
            <Icons.account />
            {participant.firstName.toUpperCase()}
          </Button>
          <Separator orientation='vertical' className='h-5' />
          <Button
            variant='ghost'
            size='sm'
            onClick={() =>
              toast.info('Sign-in is turned off in this demo, so there is nothing to log out of.')
            }
          >
            <Icons.logout />
            {copy.logOut}
          </Button>
        </nav>
      </div>
    </header>
  );
}
