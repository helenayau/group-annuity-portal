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
import type { Participant } from '@/constants/mock-api-pension';
import { useAppForm } from '@/lib/form';
import { pillButton } from '../styles';
import { usePension } from '../pension-context';

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

export function PersonalDetailsCard() {
  const { participant, setParticipant } = usePension();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Personal details</CardTitle>
      </CardHeader>
      <CardContent className='flex-1'>
        <address className='text-muted-foreground text-sm leading-6 not-italic'>
          {participant.firstName} {participant.lastName}
          <br />
          {participant.addressLine1}
          <br />
          {participant.city}, {participant.state} {participant.zip}
        </address>
      </CardContent>
      <CardFooter>
        <Button
          variant='outline'
          size='sm'
          className={pillButton}
          onClick={() => setIsEditing(true)}
        >
          Edit personal details
        </Button>
      </CardFooter>
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>Edit personal details</DialogTitle>
            <DialogDescription>
              Your name and mailing address are used on tax forms and plan notices.
            </DialogDescription>
          </DialogHeader>
          {isEditing && (
            <PersonalDetailsForm
              participant={participant}
              onCancel={() => setIsEditing(false)}
              onSave={(updated) => {
                setParticipant(updated);
                setIsEditing(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
