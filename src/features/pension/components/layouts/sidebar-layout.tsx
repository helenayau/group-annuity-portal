'use client';

import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  grossMonthlyPayment,
  pensionDocumentCategories,
  type PensionDocumentCategory
} from '@/constants/mock-api-pension';
import { formatCurrency } from '@/features/annuity/utils';
import { cn } from '@/lib/utils';
import { copy } from '../../copy';
import { usePension, usePensionActions } from '../../pension-context';
import { DocumentList } from '../document-list';
import { PaymentHistoryTable, usePaymentRows, ViewAllButton } from '../payment-history-table';
import { PlanHeading } from '../plan-heading';

const categories = Object.keys(pensionDocumentCategories) as PensionDocumentCategory[];
const sections = ['account', 'personal', ...categories] as const;
type Section = (typeof sections)[number];

function isCategory(section: Section): section is PensionDocumentCategory {
  return (categories as string[]).includes(section);
}

function NavItem({
  active,
  onClick,
  icon: Icon,
  children,
  nested = false
}: {
  active: boolean;
  onClick: () => void;
  icon?: (typeof Icons)[keyof typeof Icons];
  children: React.ReactNode;
  nested?: boolean;
}) {
  return (
    <Button
      variant='ghost'
      aria-current={active ? 'page' : undefined}
      className={cn(
        'h-9 shrink-0 justify-start font-normal lg:w-full',
        nested && 'lg:pl-9',
        active && 'bg-muted text-foreground font-medium'
      )}
      onClick={onClick}
    >
      {Icon && <Icon />}
      {children}
    </Button>
  );
}

// A row in a settings-style list: label and copy on the left, actions right.
function SettingRow({
  title,
  eyebrow,
  description,
  children
}: {
  title: string;
  eyebrow?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between md:gap-8'>
      <div className='min-w-0'>
        <p className='font-medium'>{title}</p>
        {eyebrow}
        {description && <div className='text-muted-foreground mt-1 text-sm'>{description}</div>}
      </div>
      <div className='flex shrink-0 flex-wrap gap-2'>{children}</div>
    </div>
  );
}

function AccountSection() {
  const { accounts, participant } = usePension();
  const actions = usePensionActions();
  const { rows, showAll, toggle } = usePaymentRows();

  return (
    <div className='flex flex-col gap-4'>
      <Card className='gap-0 py-0'>
        <div className='divide-y'>
          <SettingRow
            title={copy.grossMonthly.title}
            eyebrow={
              <p className='mt-1 text-3xl font-semibold tabular-nums'>
                {formatCurrency(grossMonthlyPayment)}
              </p>
            }
            description={copy.grossMonthly.paidTo(accounts.length)}
          >
            <Button variant='outline' size='sm' onClick={actions.editPaymentSettings}>
              {copy.grossMonthly.action}
            </Button>
          </SettingRow>
          <SettingRow title={copy.taxWithholding.title} description={copy.taxWithholding.body}>
            <Button variant='outline' size='sm' onClick={actions.viewFederalTaxes}>
              {copy.taxWithholding.federal}
            </Button>
            <Button variant='outline' size='sm' onClick={actions.viewStateTaxes}>
              {copy.taxWithholding.state}
            </Button>
          </SettingRow>
          <SettingRow
            title={copy.incomeLetter.title}
            eyebrow={
              <p className='text-muted-foreground text-xs uppercase'>
                {copy.incomeLetter.for(`${participant.firstName} ${participant.lastName}`)}
              </p>
            }
            description={copy.incomeLetter.body}
          >
            <Button variant='outline' size='sm' onClick={actions.downloadLetter}>
              <Icons.fileTypePdf />
              {copy.incomeLetter.action}
            </Button>
          </SettingRow>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.paymentHistory.title}</CardTitle>
          <CardDescription>{copy.paymentHistory.asOf}</CardDescription>
          <CardAction>
            <Button variant='link' size='sm' onClick={actions.showStatusHelp}>
              {copy.paymentHistory.statusHelp}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <PaymentHistoryTable rows={rows} />
        </CardContent>
        <CardFooter>
          <ViewAllButton showAll={showAll} onClick={toggle} />
        </CardFooter>
      </Card>
    </div>
  );
}

function PersonalSection() {
  const { participant } = usePension();
  const actions = usePensionActions();

  return (
    <Card className='gap-0 py-0'>
      <div className='divide-y'>
        <SettingRow
          title={copy.personalDetails.title}
          description={
            <address className='not-italic uppercase'>
              {participant.firstName} {participant.lastName}
              <br />
              {participant.addressLine1}
              <br />
              {participant.city}, {participant.state} {participant.zip}
            </address>
          }
        >
          <Button variant='outline' size='sm' onClick={actions.editPersonalDetails}>
            {copy.personalDetails.action}
          </Button>
        </SettingRow>
        <SettingRow title={copy.otherDetails.title} description={copy.otherDetails.body}>
          <Button variant='outline' size='sm' onClick={actions.goToProfile}>
            {copy.otherDetails.action}
          </Button>
        </SettingRow>
      </div>
    </Card>
  );
}

function DocumentsSection({ category }: { category: PensionDocumentCategory }) {
  const details = pensionDocumentCategories[category];
  return (
    <Card>
      <CardHeader>
        <CardTitle>{details.label}</CardTitle>
        <CardDescription>{details.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <DocumentList documents={details.documents} />
      </CardContent>
    </Card>
  );
}

const sectionTitles: Record<Section, string> = {
  account: copy.sections.account,
  personal: copy.sections.personal,
  ...Object.fromEntries(
    categories.map((category) => [
      category,
      `${copy.sections.documents}: ${pensionDocumentCategories[category].label}`
    ])
  )
} as Record<Section, string>;

export function SidebarLayout() {
  const [section, setSection] = useQueryState(
    'section',
    parseAsStringLiteral(sections).withDefault('account')
  );

  return (
    <div className='flex flex-col gap-6'>
      <PlanHeading compact />
      <div className='flex flex-col gap-6 lg:flex-row lg:items-start'>
        <nav
          aria-label='Account sections'
          className='bg-background -mx-4 flex gap-1 overflow-x-auto border-y px-4 py-2 lg:sticky lg:top-4 lg:mx-0 lg:w-60 lg:shrink-0 lg:flex-col lg:rounded-xl lg:border lg:p-2'
        >
          <NavItem
            icon={Icons.billing}
            active={section === 'account'}
            onClick={() => setSection('account')}
          >
            {copy.sections.account}
          </NavItem>
          <NavItem
            icon={Icons.user}
            active={section === 'personal'}
            onClick={() => setSection('personal')}
          >
            {copy.sections.personal}
          </NavItem>
          <p className='text-muted-foreground hidden px-3 pt-3 pb-1 text-xs font-medium lg:flex lg:items-center lg:gap-2'>
            <Icons.workspace className='size-4' />
            {copy.sections.documents}
          </p>
          {categories.map((category) => (
            <NavItem
              key={category}
              nested
              active={section === category}
              onClick={() => setSection(category)}
            >
              {pensionDocumentCategories[category].label}
            </NavItem>
          ))}
        </nav>

        <section aria-label={sectionTitles[section]} className='min-w-0 flex-1'>
          <h2 className='mb-4 text-lg font-semibold'>{sectionTitles[section]}</h2>
          {section === 'account' && <AccountSection />}
          {section === 'personal' && <PersonalSection />}
          {isCategory(section) && <DocumentsSection category={section} />}
        </section>
      </div>
    </div>
  );
}
