'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useStore } from '@tanstack/react-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Icons } from '@/components/icons';
import { Button, buttonVariants } from '@/components/ui/button';
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
import type { Participant } from '@/constants/mock-api-pension';
import { useAppForm } from '@/lib/form';
import { cn } from '@/lib/utils';
import { pillButton } from '../styles';
import { usePension, usePortalHref } from '../pension-context';

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
      className='flex flex-col gap-(--card-spacing)'
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <CardContent>
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
      </CardContent>
      <CardFooter className='gap-2'>
        <form.AppForm>
          <form.SubmitButton variant='outline' className={pillButton} disabled={!isDirty}>
            Save changes
          </form.SubmitButton>
        </form.AppForm>
        <Button type='button' variant='outline' className={pillButton} onClick={onCancel}>
          Cancel
        </Button>
      </CardFooter>
    </form>
  );
}

function Address() {
  const { participant } = usePension();
  return (
    <address className='text-muted-foreground text-sm leading-6 not-italic'>
      {participant.firstName} {participant.lastName}
      <br />
      {participant.addressLine1}
      <br />
      {participant.city}, {participant.state} {participant.zip}
    </address>
  );
}

// Personal details tab: shows what's on file and sends you to the profile
// page, where the details open ready to edit.
export function PersonalDetailsCard() {
  const portalHref = usePortalHref();
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Personal details</CardTitle>
      </CardHeader>
      <CardContent className='flex-1'>
        <Address />
      </CardContent>
      <CardFooter>
        <Link
          href={portalHref('/profile?edit=personal')}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), pillButton)}
        >
          Edit personal details
        </Link>
      </CardFooter>
    </Card>
  );
}

// Profile page section, opened in edit mode when arriving from the tab.
export function PersonalDetailsSection({ defaultEditing = false }: { defaultEditing?: boolean }) {
  const { participant, setParticipant } = usePension();
  const [isEditing, setIsEditing] = useState(defaultEditing);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal details</CardTitle>
        <CardDescription>
          Your name and mailing address are used on tax forms and plan notices.
        </CardDescription>
        {!isEditing && (
          <CardAction>
            <Button
              variant='outline'
              size='sm'
              className={pillButton}
              onClick={() => setIsEditing(true)}
            >
              <Icons.edit />
              Edit
            </Button>
          </CardAction>
        )}
      </CardHeader>
      {isEditing ? (
        <PersonalDetailsForm
          participant={participant}
          onCancel={() => setIsEditing(false)}
          onSave={(updated) => {
            setParticipant(updated);
            setIsEditing(false);
          }}
        />
      ) : (
        <CardContent>
          <Address />
        </CardContent>
      )}
    </Card>
  );
}
