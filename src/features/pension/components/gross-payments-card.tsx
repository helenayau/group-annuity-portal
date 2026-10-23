'use client';

import { useState } from 'react';
import { useStore } from '@tanstack/react-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import { grossMonthlyPayment, type DepositAccount } from '@/constants/mock-api-pension';
import { formatCurrencyCents } from '@/features/annuity/utils';
import { useAppForm } from '@/lib/form';
import { pillButton } from '../styles';
import { usePension } from '../pension-context';

const amountSchema = z
  .number({ error: 'Enter an amount' })
  .min(0, 'Must be $0 or more')
  .max(grossMonthlyPayment, `Must be ${formatCurrencyCents(grossMonthlyPayment)} or less`);

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
            message: `Amounts must add up to ${formatCurrencyCents(grossMonthlyPayment)}`,
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
        <span className='text-muted-foreground'>Total of gross monthly payment</span>
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

export function GrossPaymentsCard() {
  const { accounts, setAccounts } = usePension();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Gross monthly payments</CardTitle>
      </CardHeader>
      <CardContent className='flex-1'>
        <div className='text-3xl font-semibold tabular-nums'>
          {formatCurrencyCents(grossMonthlyPayment)}
        </div>
        <p className='text-muted-foreground mt-1 text-sm'>Paid to {accounts.length} account(s)</p>
      </CardContent>
      <CardFooter>
        <Button
          variant='outline'
          size='sm'
          className={pillButton}
          onClick={() => setIsEditing(true)}
        >
          Edit payment settings
        </Button>
      </CardFooter>
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Edit payment settings</DialogTitle>
            <DialogDescription>
              Choose how much of each monthly payment goes to each of your accounts.
            </DialogDescription>
          </DialogHeader>
          {isEditing && (
            <PaymentSettingsForm
              accounts={accounts}
              onCancel={() => setIsEditing(false)}
              onSave={(updated) => {
                setAccounts(updated);
                setIsEditing(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
