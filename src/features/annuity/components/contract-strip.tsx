import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { contract } from '@/constants/mock-api-annuity';

export function ContractStrip() {
  const details: Array<[string, string]> = [
    ['Contract', contract.contractNumber],
    ['Issued', contract.issueDate],
    ['Owner', contract.owner],
    ['Contract year', `${contract.contractYear} of 10`]
  ];

  return (
    <Card size='sm'>
      <CardContent className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <div>
          <div className='text-muted-foreground text-xs'>
            Your annuity as of {contract.asOfDate}
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-lg font-semibold'>{contract.productName}</span>
            <Badge variant='secondary'>{contract.status}</Badge>
          </div>
        </div>
        <dl className='grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4'>
          {details.map(([label, value]) => (
            <div key={label}>
              <dt className='text-muted-foreground text-xs'>{label}</dt>
              <dd className='text-sm font-medium tabular-nums'>{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
