import type { Metadata } from 'next';
import { AccountHeader } from '@/features/pension/components/account-header';
import { LayoutSwitcher } from '@/features/pension/components/layout-switcher';
import { PensionAlerts } from '@/features/pension/components/pension-alerts';
import { PensionDialogs } from '@/features/pension/components/pension-dialogs';
import { PensionTopBar } from '@/features/pension/components/pension-top-bar';
import { PensionProvider } from '@/features/pension/pension-context';

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

export default function PensionLayout({ children }: { children: React.ReactNode }) {
  return (
    <PensionProvider>
      <div className='bg-muted/40 flex min-h-svh flex-col'>
        <LayoutSwitcher />
        <div className='bg-background'>
          <div className='mx-auto max-w-6xl px-4 pt-4 md:px-6'>
            <PensionAlerts />
          </div>
        </div>
        <PensionTopBar />
        <AccountHeader />
        <main
          id='main-content'
          className='mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-8'
        >
          {children}
        </main>
      </div>
      <PensionDialogs />
    </PensionProvider>
  );
}
