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
import { contract, taxWithholding, type TaxWithholding } from '@/constants/mock-api-annuity';
import { useAppForm } from '@/lib/form';
import { formatPercent } from '../utils';

const withholdingSchema = z.object({
  federalPercent: z
    .number({ error: 'Enter a percentage' })
    .min(0, 'Must be 0% or more')
    .max(100, 'Must be 100% or less'),
  statePercent: z
    .number({ error: 'Enter a percentage' })
    .min(0, 'Must be 0% or more')
    .max(100, 'Must be 100% or less')
});

function WithholdingForm({
  withholding,
  onCancel,
  onSave
}: {
  withholding: TaxWithholding;
  onCancel: () => void;
  onSave: (withholding: TaxWithholding) => void;
}) {
  const form = useAppForm({
    defaultValues: {
      federalPercent: withholding.federalPercent as number | undefined,
      statePercent: withholding.statePercent as number | undefined
    },
    validators: {
      onSubmit: withholdingSchema
    },
    onSubmit: ({ value }) => {
      onSave({
        ...withholding,
        federalPercent: value.federalPercent ?? 0,
        statePercent: value.statePercent ?? 0,
        electionDate: contract.asOfDate
      });
      toast.success('Withholding election updated');
    }
  });
  const isDirty = useStore(form.store, (state) => state.isDirty);

  return (
    <>
      <CardHeader>
        <CardTitle>Tax Withholding</CardTitle>
        <CardDescription>Percent of each payment withheld for taxes</CardDescription>
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
              name='federalPercent'
              children={(field) => (
                <field.TextField
                  label='Federal withholding (%)'
                  description='Applies to income payments and withdrawals'
                  required
                  type='number'
                  step='0.25'
                />
              )}
            />
            <form.AppField
              name='statePercent'
              children={(field) => (
                <field.TextField
                  label={`${withholding.state} withholding (%)`}
                  required
                  type='number'
                  step='0.25'
                />
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

export function TaxWithholdingCard() {
  const [withholding, setWithholding] = useState(taxWithholding);
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <Card>
        <WithholdingForm
          withholding={withholding}
          onCancel={() => setIsEditing(false)}
          onSave={(updated) => {
            setWithholding(updated);
            setIsEditing(false);
          }}
        />
      </Card>
    );
  }

  const fields: Array<[string, string]> = [
    ['Federal', formatPercent(withholding.federalPercent)],
    [withholding.state, formatPercent(withholding.statePercent)],
    ['Election on file since', withholding.electionDate]
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Withholding</CardTitle>
        <CardDescription>Percent of each payment withheld for taxes</CardDescription>
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
