'use client';

import { Modal, NumberInput, Stack } from '@carbon/react';
import { useStore } from '@tanstack/react-form';
import { useEffect } from 'react';
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

function amountsOf(accounts: DepositAccount[]) {
  return { amounts: accounts.map((account) => account.amount as number | undefined) };
}

export function PaymentSettingsModal({
  open,
  accounts,
  onClose,
  onSave
}: {
  open: boolean;
  accounts: DepositAccount[];
  onClose: () => void;
  onSave: (accounts: DepositAccount[]) => void;
}) {
  const notify = useNotify();
  const form = useAppForm({
    defaultValues: amountsOf(accounts),
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

  // The modal stays mounted (Carbon's pattern), so start from the saved
  // amounts each time it opens; Cancel discards any edits.
  useEffect(() => {
    if (open) form.reset(amountsOf(accounts));
  }, [open, accounts, form]);

  return (
    <Modal
      open={open}
      modalHeading='Edit payment settings'
      primaryButtonText='Save changes'
      secondaryButtonText='Cancel'
      primaryButtonDisabled={!isDirty}
      onRequestClose={onClose}
      onRequestSubmit={() => form.handleSubmit()}
      // The fields live in the modal, whose footer holds the submit button,
      // so let Carbon handle Enter rather than a nested <form>.
      shouldSubmitOnEnter
      size='sm'
    >
      <p className={styles.tileBody}>
        Choose how much of each monthly payment goes to each of your accounts.
      </p>
      <Stack gap={7} className={styles.section}>
        {accounts.map((account, i) => (
          <form.Field
            key={account.id}
            name={`amounts[${i}]`}
            children={(field) => (
              <NumberInput
                id={`amount-${account.id}`}
                // Carbon: in a transactional modal, focus starts on the first input.
                data-modal-primary-focus={i === 0 ? true : undefined}
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
        <div className={styles.formTotal}>
          <span>Gross monthly payments</span>
          <strong>
            {formatCurrencyCents(total)} of {formatCurrencyCents(grossMonthlyPayment)}
          </strong>
        </div>
      </Stack>
    </Modal>
  );
}
