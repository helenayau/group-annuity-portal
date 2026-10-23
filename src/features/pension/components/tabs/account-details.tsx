'use client';

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
import { grossMonthlyPayment, pensionPayments } from '@/constants/mock-api-pension';
import { formatCurrency } from '@/features/annuity/utils';
import { copy } from '../../copy';
import { useLayoutOption } from '../../layout-option';
import { usePension, usePensionActions } from '../../pension-context';
import { PaymentHistoryTable, usePaymentRows, ViewAllButton } from '../payment-history-table';
import { PaymentStatusBadge } from '../payment-status';
import { ActionGroup, ActionRow, Amount, Description, SettingRow, Title } from '../typography';

function useFullName() {
  const { participant } = usePension();
  return `${participant.firstName} ${participant.lastName}`;
}

function PaymentHistoryCard({ className }: { className?: string }) {
  const actions = usePensionActions();
  const { rows, showAll, toggle } = usePaymentRows();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{copy.paymentHistory.title}</CardTitle>
        <CardDescription>{copy.paymentHistory.asOf}</CardDescription>
        <CardAction>
          <Button variant='link' size='sm' onClick={actions.showStatusHelp}>
            <Icons.help />
            {copy.paymentHistory.statusHelp}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className='flex-1'>
        <PaymentHistoryTable rows={rows} />
      </CardContent>
      <CardFooter>
        <ViewAllButton showAll={showAll} onClick={toggle} />
      </CardFooter>
    </Card>
  );
}

// Cards: the payment is a hero panel with the latest payment beside it;
// the two document actions stack in a side column next to the history.
function CardsFormat() {
  const { accounts } = usePension();
  const actions = usePensionActions();
  const fullName = useFullName();
  const latest = pensionPayments[0];

  return (
    <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
      <Card className='bg-primary text-primary-foreground lg:col-span-2'>
        <CardContent className='flex h-full flex-col justify-between gap-6 md:flex-row'>
          <div className='flex flex-col gap-1'>
            <Title>{copy.grossMonthly.title}</Title>
            <Amount value={grossMonthlyPayment} className='mt-1' />
            <p className='text-sm opacity-80'>{copy.grossMonthly.paidTo(accounts.length)}</p>
            <Button
              variant='secondary'
              size='sm'
              className='mt-4 self-start md:mt-auto'
              onClick={actions.editPaymentSettings}
            >
              {copy.grossMonthly.action}
            </Button>
          </div>
          <dl className='bg-primary-foreground/10 flex flex-col gap-3 self-start rounded-lg p-4 text-sm md:min-w-56'>
            <div>
              <dt className='opacity-80'>{copy.paymentHistory.columns.paymentDate}</dt>
              <dd className='font-medium tabular-nums'>{latest.date}</dd>
            </div>
            <div>
              <dt className='opacity-80'>{copy.paymentHistory.columns.status}</dt>
              <dd className='mt-1'>
                <PaymentStatusBadge
                  status={latest.status}
                  className='bg-primary-foreground text-primary border-transparent'
                />
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div className='flex flex-col gap-4 lg:row-span-2'>
        <Card>
          <CardHeader>
            <CardTitle>{copy.taxWithholding.title}</CardTitle>
            <CardDescription>{copy.taxWithholding.body}</CardDescription>
          </CardHeader>
          <CardFooter className='flex-wrap gap-2'>
            <Button variant='outline' size='sm' onClick={actions.viewFederalTaxes}>
              {copy.taxWithholding.federal}
            </Button>
            <Button variant='outline' size='sm' onClick={actions.viewStateTaxes}>
              {copy.taxWithholding.state}
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{copy.incomeLetter.title}</CardTitle>
            <CardDescription>{copy.incomeLetter.for(fullName)}</CardDescription>
          </CardHeader>
          <CardContent className='text-muted-foreground text-sm'>
            {copy.incomeLetter.body}
          </CardContent>
          <CardFooter>
            <Button variant='outline' size='sm' onClick={actions.downloadLetter}>
              <Icons.fileTypePdf />
              {copy.incomeLetter.action}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <PaymentHistoryCard className='lg:col-span-2' />
    </div>
  );
}

// List: everything you can act on is one scannable list, history below.
function ListFormat() {
  const { accounts } = usePension();
  const actions = usePensionActions();
  const fullName = useFullName();

  return (
    <div className='flex flex-col gap-4'>
      <Card className='gap-0 py-0'>
        <div className='divide-y'>
          <SettingRow
            title={copy.grossMonthly.title}
            description={
              <>
                <Amount value={grossMonthlyPayment} />
                <Description>{copy.grossMonthly.paidTo(accounts.length)}</Description>
              </>
            }
          >
            <Button variant='outline' size='sm' onClick={actions.editPaymentSettings}>
              {copy.grossMonthly.action}
            </Button>
          </SettingRow>
          <SettingRow
            title={copy.taxWithholding.title}
            description={<Description>{copy.taxWithholding.body}</Description>}
          >
            <Button variant='outline' size='sm' onClick={actions.viewFederalTaxes}>
              {copy.taxWithholding.federal}
            </Button>
            <Button variant='outline' size='sm' onClick={actions.viewStateTaxes}>
              {copy.taxWithholding.state}
            </Button>
          </SettingRow>
          <SettingRow
            title={copy.incomeLetter.title}
            description={
              <>
                <Description>{copy.incomeLetter.for(fullName)}</Description>
                <Description>{copy.incomeLetter.body}</Description>
              </>
            }
          >
            <Button variant='outline' size='sm' onClick={actions.downloadLetter}>
              <Icons.fileTypePdf />
              {copy.incomeLetter.action}
            </Button>
          </SettingRow>
        </div>
      </Card>
      <PaymentHistoryCard />
    </div>
  );
}

// Task list: one column, big tap targets, history as stacked rows.
function TasksFormat() {
  const { accounts } = usePension();
  const actions = usePensionActions();
  const fullName = useFullName();
  const { rows, showAll, toggle } = usePaymentRows();

  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col gap-8'>
      <section className='bg-card flex flex-col items-center gap-1 rounded-xl border p-6 text-center'>
        <Title>{copy.grossMonthly.title}</Title>
        <Amount value={grossMonthlyPayment} className='mt-1' />
        <Description>{copy.grossMonthly.paidTo(accounts.length)}</Description>
        <Button className='mt-4 w-full sm:w-auto' size='lg' onClick={actions.editPaymentSettings}>
          {copy.grossMonthly.action}
        </Button>
      </section>

      <ActionGroup
        title={copy.paymentHistory.title}
        description={
          <Description className='flex flex-wrap items-center gap-x-3'>
            {copy.paymentHistory.asOf}
            <Button
              variant='link'
              size='sm'
              className='h-auto px-0'
              onClick={actions.showStatusHelp}
            >
              {copy.paymentHistory.statusHelp}
            </Button>
          </Description>
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
              <span className='text-base font-medium tabular-nums'>
                {formatCurrency(payment.netAmount)}
              </span>
              <span className='text-muted-foreground text-sm font-normal tabular-nums'>
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

      <ActionGroup
        title={copy.taxWithholding.title}
        description={<Description>{copy.taxWithholding.body}</Description>}
      >
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
            <Description>{copy.incomeLetter.for(fullName)}</Description>
            <Description>{copy.incomeLetter.body}</Description>
          </>
        }
      >
        <ActionRow
          icon={Icons.post}
          label={copy.incomeLetter.action}
          onClick={actions.downloadLetter}
        />
      </ActionGroup>
    </div>
  );
}

export function AccountDetailsTab() {
  const [layout] = useLayoutOption();
  if (layout === 'list') return <ListFormat />;
  if (layout === 'tasks') return <TasksFormat />;
  return <CardsFormat />;
}
