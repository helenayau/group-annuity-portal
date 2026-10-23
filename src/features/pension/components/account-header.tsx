'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { pensionPlan } from '@/constants/mock-api-pension';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/pension', label: 'Account details' },
  { href: '/pension/personal-details', label: 'Personal details' },
  { href: '/pension/e-documents', label: 'E-documents' }
];

export function AccountHeader() {
  const pathname = usePathname();

  return (
    <div className='bg-card border-b'>
      <div className='mx-auto max-w-6xl px-4 pt-6 md:px-6 md:pt-8'>
        <p className='text-muted-foreground text-sm'>
          Your retirement account as of {pensionPlan.asOfDate}
        </p>
        <h1 className='mt-1 text-2xl font-semibold tracking-tight uppercase md:text-3xl'>
          {pensionPlan.planName}
        </h1>
        <p className='text-muted-foreground mt-1 text-sm'>Contract {pensionPlan.contractNumber}</p>
        <nav aria-label='Account sections' className='-mb-px mt-6 flex gap-6 overflow-x-auto'>
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'border-b-2 pb-3 text-sm font-medium whitespace-nowrap transition-colors',
                  isActive
                    ? 'border-primary text-foreground'
                    : 'text-muted-foreground hover:text-foreground border-transparent'
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
