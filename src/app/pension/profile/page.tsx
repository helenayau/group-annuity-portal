import { Profile } from '@/features/pension/components/profile';

export const metadata = { title: 'Profile' };

export default async function Page({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  return <Profile editPersonal={edit === 'personal'} />;
}
