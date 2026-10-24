import { PensionProfile } from '@/features/pension/components/pension-profile';

export const metadata = { title: 'Profile' };

export default async function Page({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  return (
    <>
      <h2 className='mb-4 text-lg font-semibold'>Profile</h2>
      <PensionProfile editPersonal={edit === 'personal'} />
    </>
  );
}
