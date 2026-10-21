'use client';

import { useState } from 'react';
import { useStore } from '@tanstack/react-form';
import * as z from 'zod';
import { toast } from 'sonner';
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
import { FieldGroup } from '@/components/ui/field';
import { paymentSettings, type PaymentSettings } from '@/constants/mock-api-annuity';
import { useAppForm } from '@/lib/form';

const bankSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required'),
  accountType: z.enum(['Checking', 'Savings']),
  routingNumber: z.string().regex(/^\d{9}$/, 'Routing numbers are 9 digits'),
  accountNumber: z.string().regex(/^\d{4,17}$/, 'Enter 4 to 17 digits')
});

function PaymentSettingsForm({
  settings,
  onCancel,
  onSave
}: {
  settings: PaymentSettings;
  onCancel: () => void;
  onSave: (settings: PaymentSettings) => void;
}) {
  const form = useAppForm({
    defaultValues: {
      bankName: settings.bankName,
      accountType: settings.accountType as string,
      routingNumber: '',
      accountNumber: ''
    },
    validators: {
      onSubmit: bankSchema
    },
    onSubmit: ({ value }) => {
      onSave({
        ...settings,
        bankName: value.bankName,
        accountType: value.accountType as PaymentSettings['accountType'],
        accountLast4: value.accountNumber.slice(-4),
        routingLast4: value.routingNumber.slice(-4)
      });
      toast.success('Direct deposit updated. Changes apply from your next payment.');
    }
  });
  const isDirty = useStore(form.store, (state) => state.isDirty);

  return (
    <>
      <CardHeader>
        <CardTitle>Payment Settings</CardTitle>
        <CardDescription>Where your income payments are deposited</CardDescription>
      </CardHeader>
      <form
        className='flex flex-col gap-(--card-spacing)'
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <CardContent>
          <FieldGroup className='grid grid-cols-1 gap-4'>
            <form.AppField
              name='bankName'
              children={(field) => <field.TextField label='Bank name' required />}
            />
            <form.AppField
              name='accountType'
              children={(field) => (
                <field.SelectField
                  label='Account type'
                  required
                  options={[
                    { value: 'Checking', label: 'Checking' },
                    { value: 'Savings', label: 'Savings' }
                  ]}
                />
              )}
            />
            <form.AppField
              name='routingNumber'
              children={(field) => (
                <field.TextField label='Routing number' required inputMode='numeric' />
              )}
            />
            <form.AppField
              name='accountNumber'
              children={(field) => (
                <field.TextField label='Account number' required inputMode='numeric' />
              )}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter className='gap-2'>
          <form.AppForm>
            <form.SubmitButton disabled={!isDirty}>Save changes</form.SubmitButton>
          </form.AppForm>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancel
          </Button>
        </CardFooter>
      </form>
    </>
  );
}

export function PaymentSettingsCard() {
  const [settings, setSettings] = useState(paymentSettings);
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <Card>
        <PaymentSettingsForm
          settings={settings}
          onCancel={() => setIsEditing(false)}
          onSave={(updated) => {
            setSettings(updated);
            setIsEditing(false);
          }}
        />
      </Card>
    );
  }

  const fields: Array<[string, string]> = [
    ['Frequency', `${settings.frequency}, ${settings.paymentDay}`],
    ['Method', 'Direct deposit'],
    ['Bank', settings.bankName],
    ['Account', `${settings.accountType} ending ${settings.accountLast4}`],
    ['Routing number', `ending ${settings.routingLast4}`]
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Settings</CardTitle>
        <CardDescription>Where your income payments are deposited</CardDescription>
        <CardAction>
          <Button variant='outline' size='sm' onClick={() => setIsEditing(true)}>
            <Icons.edit className='mr-2 h-4 w-4' />
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <dl className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt className='text-sm font-medium'>{label}</dt>
              <dd className='text-muted-foreground mt-1 text-sm'>{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
