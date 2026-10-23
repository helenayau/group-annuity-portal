'use client';

import { useStore } from '@tanstack/react-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import {
  grossMonthlyPayment,
  pensionDocumentCategories,
  type DepositAccount,
  type Participant,
  type PensionPaymentStatus
} from '@/constants/mock-api-pension';
import { formatCurrency, formatCurrencyCents } from '@/features/annuity/utils';
import { useAppForm } from '@/lib/form';
import { copy } from '../copy';
import { usePension } from '../pension-context';
import { DocumentList } from './document-list';
import { PaymentStatusBadge, statusDescriptions, statusLabels } from './payment-status';
import { ProfileSheet } from './profile-sheet';

const amountSchema = z
  .number({ error: 'Enter an amount' })
  .min(0, 'Must be $0 or more')
  .max(grossMonthlyPayment, `Must be ${formatCurrency(grossMonthlyPayment)} or less`);

function PaymentSettingsForm({
  accounts,
  onCancel,
  onSave
}: {
  accounts: DepositAccount[];
  onCancel: () => void;
  onSave: (accounts: DepositAccount[]) => void;
}) {
  const form = useAppForm({
    defaultValues: {
      amounts: accounts.map((account) => account.amount as number | undefined)
    },
    validators: {
      onSubmit: z
        .object({ amounts: z.array(amountSchema) })
        .refine(
          (value) => value.amounts.reduce((sum, amount) => sum + amount, 0) === grossMonthlyPayment,
          {
            message: `Amounts must add up to ${formatCurrency(grossMonthlyPayment)}`,
            path: ['amounts', accounts.length - 1]
          }
        )
    },
    onSubmit: ({ value }) => {
      onSave(accounts.map((account, i) => ({ ...account, amount: value.amounts[i] ?? 0 })));
      toast.success('Payment settings updated. Changes apply from your next payment.');
    }
  });
  const isDirty = useStore(form.store, (state) => state.isDirty);
  const total = useStore(form.store, (state) =>
    state.values.amounts.reduce<number>((sum, amount) => sum + (amount ?? 0), 0)
  );

  return (
    <form
      className='flex flex-col gap-4'
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup className='grid grid-cols-1 gap-4'>
        {accounts.map((account, i) => (
          <form.AppField
            key={account.id}
            name={`amounts[${i}]`}
            children={(field) => (
              <field.TextField
                label={`${account.bankName} ${account.accountType.toLowerCase()} *****${account.accountLast4}`}
                required
                type='number'
                step='0.01'
                min='0'
              />
            )}
          />
        ))}
      </FieldGroup>
      <div className='flex justify-between rounded-lg border p-3 text-sm'>
        <span className='text-muted-foreground'>{copy.grossMonthly.title}</span>
        <span className='font-medium tabular-nums'>
          {formatCurrencyCents(total)} of {formatCurrencyCents(grossMonthlyPayment)}
        </span>
      </div>
      <DialogFooter>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <form.AppForm>
          <form.SubmitButton disabled={!isDirty}>Save changes</form.SubmitButton>
        </form.AppForm>
      </DialogFooter>
    </form>
  );
}

const personalSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  addressLine1: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().regex(/^[A-Za-z]{2}$/, 'Use the 2-letter state code'),
  zip: z.string().regex(/^\d{5}$/, 'ZIP codes are 5 digits')
});

function PersonalDetailsForm({
  participant,
  onCancel,
  onSave
}: {
  participant: Participant;
  onCancel: () => void;
  onSave: (participant: Participant) => void;
}) {
  const form = useAppForm({
    defaultValues: {
      firstName: participant.firstName,
      lastName: participant.lastName,
      addressLine1: participant.addressLine1,
      city: participant.city,
      state: participant.state,
      zip: participant.zip
    },
    validators: {
      onSubmit: personalSchema
    },
    onSubmit: ({ value }) => {
      onSave({ ...participant, ...value, state: value.state.toUpperCase() });
      toast.success('Personal details updated');
    }
  });
  const isDirty = useStore(form.store, (state) => state.isDirty);

  return (
    <form
      className='flex flex-col gap-4'
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <form.AppField
          name='firstName'
          children={(field) => <field.TextField label='First name' required />}
        />
        <form.AppField
          name='lastName'
          children={(field) => <field.TextField label='Last name' required />}
        />
        <div className='sm:col-span-2'>
          <form.AppField
            name='addressLine1'
            children={(field) => <field.TextField label='Street address' required />}
          />
        </div>
        <form.AppField
          name='city'
          children={(field) => <field.TextField label='City' required />}
        />
        <div className='grid grid-cols-2 gap-4'>
          <form.AppField
            name='state'
            children={(field) => <field.TextField label='State' required maxLength={2} />}
          />
          <form.AppField
            name='zip'
            children={(field) => <field.TextField label='ZIP' required inputMode='numeric' />}
          />
        </div>
      </FieldGroup>
      <DialogFooter>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <form.AppForm>
          <form.SubmitButton disabled={!isDirty}>Save changes</form.SubmitButton>
        </form.AppForm>
      </DialogFooter>
    </form>
  );
}

// One host for every dialog, so the three layouts only differ in arrangement.
export function PensionDialogs() {
  const { dialog, setDialog, accounts, setAccounts, participant, setParticipant } = usePension();
  const close = () => setDialog(null);
  const onOpenChange = (open: boolean) => !open && close();
  const payment = dialog?.kind === 'payment' ? dialog.payment : null;
  const category = dialog?.kind === 'documents' ? pensionDocumentCategories[dialog.category] : null;

  return (
    <>
      <Dialog open={dialog?.kind === 'payment-settings'} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>{copy.grossMonthly.action}</DialogTitle>
            <DialogDescription>
              Choose how much of each monthly payment goes to each of your accounts.
            </DialogDescription>
          </DialogHeader>
          {dialog?.kind === 'payment-settings' && (
            <PaymentSettingsForm
              accounts={accounts}
              onCancel={close}
              onSave={(updated) => {
                setAccounts(updated);
                close();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={dialog?.kind === 'personal-details'} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>{copy.personalDetails.action}</DialogTitle>
            <DialogDescription>
              Your name and mailing address are used on tax forms and plan notices.
            </DialogDescription>
          </DialogHeader>
          {dialog?.kind === 'personal-details' && (
            <PersonalDetailsForm
              participant={participant}
              onCancel={close}
              onSave={(updated) => {
                setParticipant(updated);
                close();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={dialog?.kind === 'status-help'} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>{copy.paymentHistory.statusHelp}</DialogTitle>
          </DialogHeader>
          <dl className='flex flex-col gap-3'>
            {(Object.keys(statusLabels) as PensionPaymentStatus[]).map((status) => (
              <div key={status} className='rounded-lg border p-3'>
                <dt>
                  <PaymentStatusBadge status={status} />
                </dt>
                <dd className='text-muted-foreground mt-1.5 text-sm'>
                  {statusDescriptions[status]}
                </dd>
              </div>
            ))}
          </dl>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>

      <Dialog open={payment !== null} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Payment details</DialogTitle>
            <DialogDescription>{payment && statusDescriptions[payment.status]}</DialogDescription>
          </DialogHeader>
          {payment && (
            <dl className='flex flex-col gap-2 text-sm'>
              <div className='flex items-center justify-between'>
                <dt className='text-muted-foreground'>{copy.paymentHistory.columns.status}</dt>
                <dd>
                  <PaymentStatusBadge status={payment.status} />
                </dd>
              </div>
              {(
                [
                  [copy.paymentHistory.columns.netAmount, formatCurrency(payment.netAmount)],
                  [copy.paymentHistory.columns.method, payment.method],
                  [copy.paymentHistory.columns.accountNumber, `*****${payment.accountLast4}`],
                  [copy.paymentHistory.columns.paymentDate, payment.date]
                ] as const
              ).map(([label, value]) => (
                <div key={label} className='flex justify-between gap-4'>
                  <dt className='text-muted-foreground'>{label}</dt>
                  <dd className='text-right tabular-nums'>{value}</dd>
                </div>
              ))}
            </dl>
          )}
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>

      <Dialog open={category !== null} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>{category?.label}</DialogTitle>
            <DialogDescription>{category?.description}</DialogDescription>
          </DialogHeader>
          {category && <DocumentList documents={category.documents} />}
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>

      <ProfileSheet open={dialog?.kind === 'profile'} onOpenChange={onOpenChange} />
    </>
  );
}
