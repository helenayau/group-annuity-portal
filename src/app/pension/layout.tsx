import type { Metadata } from 'next';
import { headers } from 'next/headers';
import '@carbon/styles/css/styles.min.css';
import '@ibm/plex-sans/css/ibm-plex-sans-default.min.css';
import { PortalShell } from '@/features/pension/components/portal-shell';
import { PensionProvider } from '@/features/pension/pension-context';
import { portalBasePath } from '@/features/pension/portal-host';

export const metadata: Metadata = {
  title: {
    default: 'Group Annuity Portal',
    template: '%s | Group Annuity Portal'
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
      <PortalShell>{children}</PortalShell>
    </PensionProvider>
  );
}
