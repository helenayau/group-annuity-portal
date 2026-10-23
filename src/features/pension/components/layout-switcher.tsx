'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export const pensionLayouts = [
  {
    href: '/pension',
    label: 'Overview',
    summary: 'One page, no tabs. Payment front and center, everything else one glance away.'
  },
  {
    href: '/pension/sidebar',
    label: 'Sidebar',
    summary:
      'Sections in a side nav, with each E-documents type listed inline instead of in a popup.'
  },
  {
    href: '/pension/tasks',
    label: 'Task list',
    summary: 'Mobile-first single column. Every action is a large, labelled row grouped by topic.'
  }
];

export function LayoutSwitcher() {
  const pathname = usePathname();
  const current = pensionLayouts.find((layout) => layout.href === pathname) ?? pensionLayouts[0];

  return (
    <div className='border-b border-dashed bg-amber-50 text-amber-950'>
      <div className='mx-auto flex max-w-6xl flex-col gap-2 px-4 py-2 md:flex-row md:items-center md:gap-4 md:px-6'>
        <span className='text-xs font-semibold tracking-wide uppercase'>Layout option</span>
        <nav aria-label='Layout options' className='flex gap-1'>
          {pensionLayouts.map((layout, i) => {
            const isActive = layout.href === current.href;
            return (
              <Link
                key={layout.href}
                href={layout.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'rounded-md px-2.5 py-1 text-sm font-medium transition-colors',
                  isActive ? 'bg-amber-950 text-amber-50' : 'hover:bg-amber-100'
                )}
              >
                {i + 1}. {layout.label}
              </Link>
            );
          })}
        </nav>
        <p className='text-xs text-amber-900/80'>{current.summary}</p>
      </div>
    </div>
  );
}
