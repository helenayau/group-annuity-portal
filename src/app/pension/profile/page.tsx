import { PensionProfile } from '@/features/pension/components/pension-profile';

export const metadata = { title: 'Profile' };

export default function Page() {
  return (
    <>
      <h2 className='mb-4 text-lg font-semibold'>Profile</h2>
      <PensionProfile />
    </>
  );
}
