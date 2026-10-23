import { cn } from '@/lib/utils';
import { copy } from '../copy';

export function PlanHeading({
  className,
  compact = false
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={className}>
      <p className='text-muted-foreground text-sm'>{copy.asOf}</p>
      <h1
        className={cn(
          'mt-1 font-semibold tracking-tight text-balance uppercase',
          compact ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'
        )}
      >
        {copy.planName}
      </h1>
      <p className='text-muted-foreground mt-1 text-sm'>{copy.contract}</p>
    </div>
  );
}
