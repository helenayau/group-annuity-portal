'use client';

import { useState } from 'react';
import { useStore } from '@tanstack/react-form';
import * as z from 'zod';
import { toast } from 'sonner';
import PageContainer from '@/components/layout/page-container';
import { useAppForm } from '@/lib/form';
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
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { accountHolder, type AccountHolder } from '@/constants/mock-api-annuity';
import { Icons } from '@/components/icons';

const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.email('Enter a valid email address'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  dateOfBirth: z.date(),
  addressLine1: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required').max(2, 'Use a 2-letter abbreviation'),
  zip: z.string().min(5, 'Enter a valid ZIP code')
});

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });
}

function PersonalInfoView({ holder, onEdit }: { holder: AccountHolder; onEdit: () => void }) {
  const fields: Array<[string, string]> = [
    ['First name', holder.firstName],
    ['Last name', holder.lastName],
    ['Email', holder.email],
    ['Phone', holder.phone],
    ['Date of birth', formatDate(holder.dateOfBirth)],
    ['Mailing address', holder.addressLine1],
    ['City', holder.city],
    ['State', holder.state],
    ['ZIP code', holder.zip]
  ];

  return (
    <>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Your contact details and mailing address</CardDescription>
        <CardAction>
          <Button variant='outline' size='sm' onClick={onEdit}>
            <Icons.edit className='mr-2 h-4 w-4' />
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <dl className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt className='text-foreground text-sm font-bold'>{label}</dt>
              <dd className='text-muted-foreground text-sm'>{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </>
  );
}

function PersonalInfoForm({
  holder,
  onCancel,
  onSave
}: {
  holder: AccountHolder;
  onCancel: () => void;
  onSave: (holder: AccountHolder) => void;
}) {
  const form = useAppForm({
    defaultValues: {
      firstName: holder.firstName,
      lastName: holder.lastName,
      email: holder.email,
      phone: holder.phone,
      dateOfBirth: new Date(holder.dateOfBirth),
      addressLine1: holder.addressLine1,
      city: holder.city,
      state: holder.state,
      zip: holder.zip
    },
    validators: {
      onSubmit: personalInfoSchema
    },
    onSubmit: ({ value }) => {
      onSave({
        ...value,
        dateOfBirth: value.dateOfBirth.toISOString().slice(0, 10)
      });
      toast.success('Profile updated');
    }
  });

  return (
    <>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your contact details and mailing address</CardDescription>
      </CardHeader>
      <form
        className='flex flex-col gap-(--card-spacing)'
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <CardContent>
          <FieldGroup className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <form.AppField
              name='firstName'
              children={(field) => <field.TextField label='First name' required />}
            />
            <form.AppField
              name='lastName'
              children={(field) => <field.TextField label='Last name' required />}
            />
            <form.AppField
              name='email'
              children={(field) => <field.TextField label='Email' required type='email' />}
            />
            <form.AppField
              name='phone'
              children={(field) => <field.TextField label='Phone' required type='tel' />}
            />
            <form.AppField
              name='dateOfBirth'
              children={(field) => (
                <field.DatePickerField
                  label='Date of birth'
                  disabledDates={(date) => date > new Date()}
                />
              )}
            />
            <form.AppField
              name='addressLine1'
              children={(field) => <field.TextField label='Mailing address' required />}
            />
            <form.AppField
              name='city'
              children={(field) => <field.TextField label='City' required />}
            />
            <div className='grid grid-cols-2 gap-4'>
              <form.AppField
                name='state'
                children={(field) => <field.TextField label='State' required placeholder='MI' />}
              />
              <form.AppField
                name='zip'
                children={(field) => <field.TextField label='ZIP code' required />}
              />
            </div>
          </FieldGroup>
        </CardContent>
        <CardFooter className='gap-2'>
          <form.AppForm>
            <form.SubmitButton>Save changes</form.SubmitButton>
          </form.AppForm>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancel
          </Button>
        </CardFooter>
      </form>
    </>
  );
}

export default function ProfileViewPage() {
  const [holder, setHolder] = useState(accountHolder);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);

  const preferencesForm = useAppForm({
    defaultValues: {
      paperlessStatements: true,
      paymentAlerts: true,
      smsReminders: false
    },
    onSubmit: ({ value }) => {
      preferencesForm.reset(value);
      toast.success('Preferences saved');
    }
  });
  const preferencesDirty = useStore(preferencesForm.store, (state) => state.isDirty);

  const displayUser = {
    imageUrl: '',
    fullName: `${holder.firstName} ${holder.lastName}`,
    emailAddresses: [{ emailAddress: holder.email }]
  };

  return (
    <PageContainer
      pageTitle='Profile'
      pageDescription='Keep this up to date so your payments and statements reach you.'
    >
      <div className='flex flex-col gap-4'>
        <Card>
          <CardContent className='flex items-center gap-4'>
            <UserAvatarProfile user={displayUser} className='h-16 w-16 rounded-full' />
            <div>
              <div className='text-lg font-semibold'>{displayUser.fullName}</div>
              <div className='text-muted-foreground text-sm'>{holder.email}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          {isEditingPersonal ? (
            <PersonalInfoForm
              holder={holder}
              onCancel={() => setIsEditingPersonal(false)}
              onSave={(updated) => {
                setHolder(updated);
                setIsEditingPersonal(false);
              }}
            />
          ) : (
            <PersonalInfoView holder={holder} onEdit={() => setIsEditingPersonal(true)} />
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Communication Preferences</CardTitle>
            <CardDescription>Choose how we keep you updated</CardDescription>
          </CardHeader>
          <form
            className='flex flex-col gap-(--card-spacing)'
            onSubmit={(e) => {
              e.preventDefault();
              preferencesForm.handleSubmit();
            }}
          >
            <CardContent className='flex flex-col gap-3'>
              <div className='rounded-lg border p-4'>
                <preferencesForm.AppField
                  name='paperlessStatements'
                  children={(field) => (
                    <field.SwitchField
                      label='Paperless statements'
                      description='Get statements by email instead of mail'
                    />
                  )}
                />
              </div>
              <div className='rounded-lg border p-4'>
                <preferencesForm.AppField
                  name='paymentAlerts'
                  children={(field) => (
                    <field.SwitchField
                      label='Payment deposit alerts'
                      description='Notify me when a guaranteed income payment is deposited'
                    />
                  )}
                />
              </div>
              <div className='rounded-lg border p-4'>
                <preferencesForm.AppField
                  name='smsReminders'
                  children={(field) => (
                    <field.SwitchField
                      label='SMS reminders'
                      description='Text me reminders about upcoming payments and reviews'
                    />
                  )}
                />
              </div>
              <preferencesForm.AppForm>
                <preferencesForm.SubmitButton disabled={!preferencesDirty} className='self-start'>
                  Save preferences
                </preferencesForm.SubmitButton>
              </preferencesForm.AppForm>
            </CardContent>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
}
