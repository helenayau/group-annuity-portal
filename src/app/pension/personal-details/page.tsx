import { OtherDetailsCard } from '@/features/pension/components/other-details-card';
import { PersonalDetailsCard } from '@/features/pension/components/personal-details-card';

export const metadata = { title: 'Personal details' };

export default function Page() {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      <h2 className='sr-only'>Personal details</h2>
      <PersonalDetailsCard />
      <OtherDetailsCard />
    </div>
  );
}
