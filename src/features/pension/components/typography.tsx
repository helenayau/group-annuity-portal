import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/features/annuity/utils';
import { cn } from '@/lib/utils';
import { Children } from 'react';

// One type scale for every layout: titles match CardTitle (text-base,
// medium), supporting copy is text-sm muted, and amounts share one size.

export function Amount({ value, className }: { value: number; className?: string }) {
  return (
    <p className={cn('text-4xl font-semibold tracking-tight tabular-nums', className)}>
      {formatCurrency(value)}
    </p>
  );
}

export function Title({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-base leading-snug font-medium', className)}>{children}</p>;
}

export function Description({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('text-muted-foreground text-sm', className)}>{children}</div>;
}

// A row in a settings-style list: copy on the left, actions on the right.
export function SettingRow({
  title,
  children,
  description
}: {
  title: string;
  children: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <div className='flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between md:gap-8'>
      <div className='flex min-w-0 flex-col gap-1'>
        <Title>{title}</Title>
        {description}
      </div>
      <div className='flex shrink-0 flex-wrap gap-2'>{children}</div>
    </div>
  );
}

export function ActionGroup({
  title,
  description,
  children
}: {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className='flex flex-col gap-2'>
      <div className='flex flex-col gap-1 px-1'>
        <Title>{title}</Title>
        {description}
      </div>
      <div className='bg-card divide-y overflow-hidden rounded-xl border'>
        {/* Wrapped so divide-y isn't overridden by Button's own border */}
        {Children.map(children, (child) => child && <div>{child}</div>)}
      </div>
    </section>
  );
}

// A full-width, tappable row with a large hit area.
export function ActionRow({
  label,
  hint,
  icon: Icon,
  onClick
}: {
  label: string;
  hint?: string;
  icon: (typeof Icons)[keyof typeof Icons];
  onClick: () => void;
}) {
  return (
    <Button
      variant='ghost'
      className='h-auto w-full justify-start gap-3 rounded-none px-4 py-3.5 text-left whitespace-normal'
      onClick={onClick}
    >
      <span className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-full'>
        <Icon className='size-4' />
      </span>
      <span className='flex min-w-0 flex-1 flex-col'>
        <span className='text-base font-medium'>{label}</span>
        {hint && <span className='text-muted-foreground text-sm font-normal'>{hint}</span>}
      </span>
      <Icons.chevronRight className='text-muted-foreground' />
    </Button>
  );
}

export function AddressLines({ lines }: { lines: string[] }) {
  return (
    <address className='text-muted-foreground text-sm leading-6 not-italic'>
      {lines.map((line) => (
        <span key={line} className='block'>
          {line}
        </span>
      ))}
    </address>
  );
}
