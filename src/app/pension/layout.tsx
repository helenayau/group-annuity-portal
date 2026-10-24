import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { AccountHeader } from '@/features/pension/components/account-header';
import { PensionTopBar } from '@/features/pension/components/pension-top-bar';
import { PensionProvider } from '@/features/pension/pension-context';
import { portalBasePath } from '@/features/pension/portal-host';

export const metadata: Metadata = {
  title: {
    default: 'Pension Center',
    template: '%s | Pension Center'
  },
  description: 'Monthly pension payments, personal details, and documents',
  robots: {
    index: false,
    follow: false
  }
};

export default async function PensionLayout({ children }: { children: React.ReactNode }) {
  const basePath = portalBasePath((await headers()).get('host'));
  return (
    <PensionProvider basePath={basePath}>
      <div data-pension-theme className='bg-background flex min-h-svh flex-col'>
        <PensionTopBar />
        <AccountHeader />
        <main id='main-content' className='mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6'>
          {children}
        </main>
      </div>
    </PensionProvider>
  );
}
