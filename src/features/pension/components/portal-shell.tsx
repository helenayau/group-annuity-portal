'use client';

import { Home, Logout, UserAvatar } from '@carbon/icons-react';
import {
  Button,
  Column,
  Content,
  Grid,
  Header,
  SkipToContent,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Theme
} from '@carbon/react';
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

// Each tab is its own route, so the tab bar and its panels share one Tabs
// context: the selected panel renders the current page. Profile is where
// personal details are edited, so it keeps that tab active.
function AccountTabs({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const portalHref = usePortalHref();
  const current = pathname.endsWith('/profile')
    ? 1
    : Math.max(
        tabs.findIndex((tab) => portalHref(tab.path) === pathname),
        0
      );

  return (
    <Tabs
      selectedIndex={current}
      onChange={({ selectedIndex }) => router.push(portalHref(tabs[selectedIndex].path))}
    >
      <Theme theme='white' className={styles.band}>
        <Grid>
          <Column sm={4} md={8} lg={16}>
            <p className={styles.eyebrow}>Your retirement account as of {pensionPlan.asOfDate}</p>
            <h1 className={styles.title}>{pensionPlan.planName}</h1>
            <p className={styles.eyebrow}>Contract {pensionPlan.contractNumber}</p>
            {/* Manual activation: arrow keys move focus, Enter opens the page. */}
            <TabList aria-label='Account sections' activation='manual' className={styles.tabs}>
              {tabs.map((tab) => (
                <Tab key={tab.path}>{tab.label}</Tab>
              ))}
            </TabList>
          </Column>
        </Grid>
      </Theme>
      <Theme theme='g10' className={styles.panels}>
        <TabPanels>
          {tabs.map((tab, i) => (
            <TabPanel key={tab.path}>{i === current ? children : null}</TabPanel>
          ))}
        </TabPanels>
      </Theme>
    </Tabs>
  );
}

export function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.root}>
      <ToastProvider>
        <PortalHeader />
        <Content id='main-content' className={styles.content}>
          <AccountTabs>{children}</AccountTabs>
        </Content>
      </ToastProvider>
    </div>
  );
}
