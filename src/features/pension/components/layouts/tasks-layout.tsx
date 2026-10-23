'use client';

import { Children } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  grossMonthlyPayment,
  pensionDocumentCategories,
  type PensionDocumentCategory
} from '@/constants/mock-api-pension';
import { formatCurrency } from '@/features/annuity/utils';
import { copy } from '../../copy';
import { usePension, usePensionActions } from '../../pension-context';
import { usePaymentRows, ViewAllButton } from '../payment-history-table';
import { PaymentStatusBadge } from '../payment-status';
import { PlanHeading } from '../plan-heading';

const categories = Object.keys(pensionDocumentCategories) as PensionDocumentCategory[];

// A full-width, tappable row with a large hit area for each action.
function ActionRow({
  label,
  hint,
  icon: Icon,
  onClick
}: {
  label: string;
  hint?: string;
  icon: (typeof Icons)[keyof typeof Icons];
  onClick: () => void;
}) {
  return (
    <Button
      variant='ghost'
      className='h-auto w-full justify-start gap-3 rounded-none px-4 py-3.5 text-left whitespace-normal'
      onClick={onClick}
    >
      <span className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-full'>
        <Icon className='size-4' />
      </span>
      <span className='flex min-w-0 flex-1 flex-col'>
        <span className='text-base font-medium'>{label}</span>
        {hint && <span className='text-muted-foreground text-sm font-normal'>{hint}</span>}
      </span>
      <Icons.chevronRight className='text-muted-foreground' />
    </Button>
  );
}

function ActionGroup({
  title,
  description,
  children
}: {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className='flex flex-col gap-2'>
      <div className='px-1'>
        <h2 className='font-semibold'>{title}</h2>
        {description && <div className='text-muted-foreground mt-0.5 text-sm'>{description}</div>}
      </div>
      <div className='bg-card divide-y overflow-hidden rounded-xl border'>
        {Children.map(children, (child) => child && <div>{child}</div>)}
      </div>
    </section>
  );
}

export function TasksLayout() {
  const { accounts, participant } = usePension();
  const actions = usePensionActions();
  const { rows, showAll, toggle } = usePaymentRows();
  const fullName = `${participant.firstName} ${participant.lastName}`;

  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col gap-8'>
      <PlanHeading compact />

      <section className='bg-card rounded-2xl border p-6 text-center'>
        <p className='text-muted-foreground text-sm font-medium'>{copy.grossMonthly.title}</p>
        <p className='mt-2 text-5xl font-semibold tracking-tight tabular-nums'>
          {formatCurrency(grossMonthlyPayment)}
        </p>
        <p className='text-muted-foreground mt-2 text-sm'>
          {copy.grossMonthly.paidTo(accounts.length)}
        </p>
        <Button className='mt-5 w-full sm:w-auto' size='lg' onClick={actions.editPaymentSettings}>
          {copy.grossMonthly.action}
        </Button>
      </section>

      <ActionGroup
        title={copy.paymentHistory.title}
        description={
          <span className='flex flex-wrap items-center gap-x-3'>
            {copy.paymentHistory.asOf}
            <Button
              variant='link'
              size='sm'
              className='h-auto px-0'
              onClick={actions.showStatusHelp}
            >
              {copy.paymentHistory.statusHelp}
            </Button>
          </span>
        }
      >
        {rows.map((payment) => (
          <Button
            key={payment.id}
            variant='ghost'
            aria-label={`${copy.paymentHistory.view} payment on ${payment.date}`}
            className='h-auto w-full justify-between gap-3 rounded-none px-4 py-3 text-left'
            onClick={() => actions.viewPayment(payment)}
          >
            <span className='flex flex-col'>
              <span className='text-base font-semibold tabular-nums'>
                {formatCurrency(payment.netAmount)}
              </span>
              <span className='text-muted-foreground text-xs font-normal tabular-nums'>
                {payment.date} · {payment.method} · *****{payment.accountLast4}
              </span>
            </span>
            <span className='flex items-center gap-2'>
              <PaymentStatusBadge status={payment.status} />
              <Icons.chevronRight className='text-muted-foreground' />
            </span>
          </Button>
        ))}
        <div className='p-3'>
          <ViewAllButton showAll={showAll} onClick={toggle} />
        </div>
      </ActionGroup>

      <ActionGroup title={copy.taxWithholding.title} description={copy.taxWithholding.body}>
        <ActionRow
          icon={Icons.fileTypePdf}
          label={copy.taxWithholding.federal}
          onClick={actions.viewFederalTaxes}
        />
        <ActionRow
          icon={Icons.fileTypePdf}
          label={copy.taxWithholding.state}
          onClick={actions.viewStateTaxes}
        />
      </ActionGroup>

      <ActionGroup
        title={copy.incomeLetter.title}
        description={
          <>
            <span className='block text-xs uppercase'>{copy.incomeLetter.for(fullName)}</span>
            {copy.incomeLetter.body}
          </>
        }
      >
        <ActionRow
          icon={Icons.post}
          label={copy.incomeLetter.action}
          onClick={actions.downloadLetter}
        />
      </ActionGroup>

      <ActionGroup
        title={copy.personalDetails.title}
        description={
          <address className='not-italic uppercase'>
            {fullName}, {participant.addressLine1}, {participant.city}, {participant.state}{' '}
            {participant.zip}
          </address>
        }
      >
        <ActionRow
          icon={Icons.userPen}
          label={copy.personalDetails.action}
          onClick={actions.editPersonalDetails}
        />
        <ActionRow
          icon={Icons.settings}
          label={copy.otherDetails.action}
          hint={`${copy.otherDetails.title} ${copy.otherDetails.body}`}
          onClick={actions.goToProfile}
        />
      </ActionGroup>

      <ActionGroup title={copy.sections.documents}>
        {categories.map((category) => {
          const details = pensionDocumentCategories[category];
          return (
            <ActionRow
              key={category}
              icon={Icons.workspace}
              label={details.actionLabel}
              hint={`${details.label}: ${details.description}`}
              onClick={() => actions.viewDocuments(category)}
            />
          );
        })}
      </ActionGroup>
    </div>
  );
}
