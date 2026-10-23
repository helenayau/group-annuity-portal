'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { layoutOptions, useLayoutOption, withLayout } from '../layout-option';

export function LayoutSwitcher() {
  const pathname = usePathname();
  const [layout] = useLayoutOption();
  const current = layoutOptions.find((option) => option.value === layout) ?? layoutOptions[0];

  return (
    <div className='border-b border-dashed bg-amber-50 text-amber-950'>
      <div className='mx-auto flex max-w-6xl flex-col gap-2 px-4 py-2 text-sm md:flex-row md:items-center md:gap-4 md:px-6'>
        <span className='font-medium'>Layout option</span>
        <nav aria-label='Layout options' className='flex gap-1'>
          {layoutOptions.map((option, i) => {
            const isActive = option.value === current.value;
            return (
              <Link
                key={option.value}
                href={withLayout(pathname, option.value)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'rounded-md px-2.5 py-1 font-medium transition-colors',
                  isActive ? 'bg-amber-950 text-amber-50' : 'hover:bg-amber-100'
                )}
              >
                {i + 1}. {option.label}
              </Link>
            );
          })}
        </nav>
        <p className='text-amber-900/80'>{current.summary}</p>
      </div>
    </div>
  );
}
