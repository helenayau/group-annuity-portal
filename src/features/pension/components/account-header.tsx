'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { copy } from '../copy';
import { useLayoutOption, withLayout } from '../layout-option';

export const pensionTabs = [
  { href: '/pension', label: copy.sections.account },
  { href: '/pension/personal-details', label: copy.sections.personal },
  { href: '/pension/e-documents', label: copy.sections.documents }
];

export function AccountHeader() {
  const pathname = usePathname();
  const [layout] = useLayoutOption();

  return (
    <div className='bg-background border-b'>
      <div className='mx-auto max-w-6xl px-4 pt-6 md:px-6 md:pt-8'>
        <p className='text-muted-foreground text-sm'>{copy.asOf}</p>
        <h1 className='mt-1 text-2xl font-semibold tracking-tight'>{copy.planName}</h1>
        <p className='text-muted-foreground mt-1 text-sm'>{copy.contract}</p>
        <nav aria-label='Account sections' className='-mb-px mt-6 flex gap-6 overflow-x-auto'>
          {pensionTabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={withLayout(tab.href, layout)}
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
