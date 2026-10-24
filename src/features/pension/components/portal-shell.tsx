'use client';

import { Home, Logout, UserAvatar } from '@carbon/icons-react';
import { Button, Header, SkipToContent, Tab, TabList, Tabs, Theme } from '@carbon/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { pensionPlan } from '@/constants/mock-api-pension';
import { usePension, usePortalHref } from '../pension-context';
import styles from '../portal.module.scss';
import { ToastProvider, useNotify } from './toasts';

const tabs = [
  { path: '', label: 'Account details' },
  { path: '/personal-details', label: 'Personal details' },
  { path: '/e-documents', label: 'E-documents' }
];

function PortalHeader() {
  const { participant } = usePension();
  const portalHref = usePortalHref();
  const notify = useNotify();

  return (
    <Header aria-label='Group annuity portal'>
      <SkipToContent />
      <div className={styles.headerActions}>
        <Button as={Link} href={portalHref('')} kind='ghost' size='lg' renderIcon={Home}>
          Home
        </Button>
        <Button
          as={Link}
          href={portalHref('/profile')}
          kind='ghost'
          size='lg'
          renderIcon={UserAvatar}
        >
          {participant.firstName}
        </Button>
        <Button
          kind='ghost'
          size='lg'
          renderIcon={Logout}
          onClick={() =>
            notify('Sign-in is turned off in this demo, so there is nothing to log out of.', 'info')
          }
        >
          Log out
        </Button>
      </div>
    </Header>
  );
}

function AccountHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const portalHref = usePortalHref();
  // Profile is where personal details are edited, so it keeps that tab active.
  const current = pathname.endsWith('/profile')
    ? 1
    : Math.max(
        tabs.findIndex((tab) => portalHref(tab.path) === pathname),
        0
      );

  return (
    <div className={styles.band}>
      <div className={`${styles.container} ${styles.accountHeader}`}>
        <p className={styles.eyebrow}>Your retirement account as of {pensionPlan.asOfDate}</p>
        <h1 className={styles.title}>{pensionPlan.planName}</h1>
        <p className={styles.eyebrow}>Contract {pensionPlan.contractNumber}</p>
        <div className={styles.tabs}>
          <Tabs
            selectedIndex={current}
            onChange={({ selectedIndex }) => router.push(portalHref(tabs[selectedIndex].path))}
          >
            <TabList aria-label='Account sections'>
              {tabs.map((tab) => (
                <Tab key={tab.path}>{tab.label}</Tab>
              ))}
            </TabList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.root}>
      <ToastProvider>
        <Theme theme='white'>
          <PortalHeader />
          <div className={styles.headerSpacer} />
          <AccountHeader />
        </Theme>
        <Theme theme='g10' className={styles.main}>
          <main id='main-content' className={styles.container}>
            {children}
          </main>
        </Theme>
      </ToastProvider>
    </div>
  );
}
