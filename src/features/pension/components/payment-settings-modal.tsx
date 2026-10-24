'use client';

import { Modal, NumberInput, Stack } from '@carbon/react';
import { useStore } from '@tanstack/react-form';
import * as z from 'zod';
import { grossMonthlyPayment, type DepositAccount } from '@/constants/mock-api-pension';
import { formatCurrencyCents } from '@/features/annuity/utils';
import { useAppForm } from '@/lib/form';
import styles from '../portal.module.scss';
import { fieldError } from './field-error';
import { useNotify } from './toasts';

const amountSchema = z
  .number({ error: 'Enter an amount' })
  .min(0, 'Must be $0 or more')
  .max(grossMonthlyPayment, `Must be ${formatCurrencyCents(grossMonthlyPayment)} or less`);

export function PaymentSettingsModal({
  accounts,
  onClose,
  onSave
}: {
  accounts: DepositAccount[];
  onClose: () => void;
  onSave: (accounts: DepositAccount[]) => void;
}) {
  const notify = useNotify();
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
      notify('Payment settings updated. Changes apply from your next payment.');
    }
  });
  const isDirty = useStore(form.store, (state) => state.isDirty);
  const total = useStore(form.store, (state) =>
    state.values.amounts.reduce<number>((sum, amount) => sum + (amount ?? 0), 0)
  );

  return (
    <Modal
      open
      modalHeading='Edit payment settings'
      primaryButtonText='Save changes'
      secondaryButtonText='Cancel'
      primaryButtonDisabled={!isDirty}
      onRequestClose={onClose}
      onRequestSubmit={() => form.handleSubmit()}
      size='sm'
    >
      <p className={styles.tileBody}>
        Choose how much of each monthly payment goes to each of your accounts.
      </p>
      <form
        className={styles.section}
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Stack gap={5}>
          {accounts.map((account, i) => (
            <form.Field
              key={account.id}
              name={`amounts[${i}]`}
              children={(field) => (
                <NumberInput
                  id={`amount-${account.id}`}
                  label={`${account.bankName} ${account.accountType.toLowerCase()} *****${account.accountLast4}`}
                  value={field.state.value ?? ''}
                  min={0}
                  step={10}
                  allowEmpty
                  invalid={field.state.meta.errors.length > 0}
                  invalidText={fieldError(field.state.meta.errors)}
                  onBlur={field.handleBlur}
                  onChange={(_event, { value }) =>
                    field.handleChange(
                      value === '' || value === undefined ? undefined : Number(value)
                    )
                  }
                />
              )}
            />
          ))}
        </Stack>
        <div className={styles.formTotal}>
          <span>Gross monthly payments</span>
          <strong>
            {formatCurrencyCents(total)} of {formatCurrencyCents(grossMonthlyPayment)}
          </strong>
        </div>
      </form>
    </Modal>
  );
}
