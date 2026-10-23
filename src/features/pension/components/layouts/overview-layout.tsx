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
import { Separator } from '@/components/ui/separator';
import {
  grossMonthlyPayment,
  pensionDocumentCategories,
  pensionPayments,
  type PensionDocumentCategory
} from '@/constants/mock-api-pension';
import { formatCurrency } from '@/features/annuity/utils';
import { copy } from '../../copy';
import { usePension, usePensionActions } from '../../pension-context';
import { PaymentHistoryTable, usePaymentRows, ViewAllButton } from '../payment-history-table';
import { PaymentStatusBadge } from '../payment-status';
import { PlanHeading } from '../plan-heading';

const categories = Object.keys(pensionDocumentCategories) as PensionDocumentCategory[];

const categoryIcons: Record<PensionDocumentCategory, keyof typeof Icons> = {
  'tax-forms': 'fileTypePdf',
  'welcome-kits': 'post',
  'annuity-certificates': 'badgeCheck',
  'smr-output': 'fileTypeXls'
};

// Everything on one page: the payment (what people come to check) is the
// hero, quick actions sit in a right rail, documents are a tile row at the end.
export function OverviewLayout() {
  const { accounts, participant } = usePension();
  const actions = usePensionActions();
  const { rows, showAll, toggle } = usePaymentRows();
  const latest = pensionPayments[0];
  const fullName = `${participant.firstName} ${participant.lastName}`;

  return (
    <div className='flex flex-col gap-6'>
      <PlanHeading />

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <Card className='bg-primary text-primary-foreground lg:col-span-2'>
          <CardContent className='flex h-full flex-col justify-between gap-6 md:flex-row'>
            <div className='flex flex-col'>
              <p className='text-sm font-medium opacity-80'>{copy.grossMonthly.title}</p>
              <p className='mt-2 text-5xl font-semibold tracking-tight tabular-nums'>
                {formatCurrency(grossMonthlyPayment)}
              </p>
              <p className='mt-2 text-sm opacity-80'>{copy.grossMonthly.paidTo(accounts.length)}</p>
              <Button
                variant='secondary'
                size='sm'
                className='mt-5 self-start md:mt-auto'
                onClick={actions.editPaymentSettings}
              >
                {copy.grossMonthly.action}
              </Button>
            </div>
            <div className='bg-primary-foreground/10 self-start rounded-lg p-4 text-sm md:min-w-56'>
              <p className='opacity-80'>{copy.paymentHistory.columns.paymentDate}</p>
              <p className='mt-0.5 font-medium tabular-nums'>{latest.date}</p>
              <p className='mt-3 opacity-80'>{copy.paymentHistory.columns.status}</p>
              <div className='mt-1'>
                <PaymentStatusBadge
                  status={latest.status}
                  className='bg-primary-foreground text-primary border-transparent'
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{copy.personalDetails.title}</CardTitle>
            <CardAction>
              <Button
                variant='outline'
                size='sm'
                aria-label={copy.personalDetails.action}
                onClick={actions.editPersonalDetails}
              >
                <Icons.edit />
                Edit
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            <address className='text-sm leading-6 not-italic uppercase'>
              {fullName}
              <br />
              {participant.addressLine1}
              <br />
              {participant.city}, {participant.state} {participant.zip}
            </address>
            <Separator />
            <div>
              <p className='text-sm font-medium'>{copy.otherDetails.title}</p>
              <p className='text-muted-foreground mt-1 text-sm'>{copy.otherDetails.body}</p>
              <Button
                variant='link'
                size='sm'
                className='mt-1 h-auto px-0'
                onClick={actions.goToProfile}
              >
                {copy.otherDetails.action}
                <Icons.arrowRight />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className='lg:col-span-2'>
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

        <div className='flex flex-col gap-4'>
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
              <CardDescription className='uppercase'>
                {copy.incomeLetter.for(fullName)}
              </CardDescription>
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
      </div>

      <section aria-labelledby='e-documents-heading' className='flex flex-col gap-3'>
        <h2 id='e-documents-heading' className='text-lg font-semibold'>
          {copy.sections.documents}
        </h2>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {categories.map((category) => {
            const details = pensionDocumentCategories[category];
            const Icon = Icons[categoryIcons[category]];
            return (
              <Card key={category} size='sm'>
                <CardHeader>
                  <div className='bg-muted mb-2 flex size-9 items-center justify-center rounded-lg'>
                    <Icon className='size-5' />
                  </div>
                  <CardTitle>{details.label}</CardTitle>
                  <CardDescription>{details.description}</CardDescription>
                </CardHeader>
                <CardFooter className='mt-auto'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => actions.viewDocuments(category)}
                  >
                    {details.actionLabel}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
