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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { Participant } from '@/constants/mock-api-pension';
import { useAppForm } from '@/lib/form';
import { usePension } from '../pension-context';
import { pillButton } from '../styles';

const contactSchema = z.object({
  email: z.email('Enter a valid email address'),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Use the format (555) 555-5555')
});

function ContactForm({
  participant,
  onCancel,
  onSave
}: {
  participant: Participant;
  onCancel: () => void;
  onSave: (participant: Participant) => void;
}) {
  const form = useAppForm({
    defaultValues: { email: participant.email, phone: participant.phone },
    validators: { onSubmit: contactSchema },
    onSubmit: ({ value }) => {
      onSave({ ...participant, ...value });
      toast.success('Contact information updated');
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
            name='email'
            children={(field) => <field.TextField label='Email address' type='email' required />}
          />
          <form.AppField
            name='phone'
            children={(field) => <field.TextField label='Phone' type='tel' required />}
          />
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

function ContactCard() {
  const { participant, setParticipant } = usePension();
  const [isEditing, setIsEditing] = useState(false);

  const fields: Array<[string, string]> = [
    ['Email address', participant.email],
    ['Phone', participant.phone]
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact information</CardTitle>
        <CardDescription>How the plan reaches you about your payments</CardDescription>
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
        <ContactForm
          participant={participant}
          onCancel={() => setIsEditing(false)}
          onSave={(updated) => {
            setParticipant(updated);
            setIsEditing(false);
          }}
        />
      ) : (
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
      )}
    </Card>
  );
}

const preferences = [
  {
    id: 'paperless-tax',
    label: 'Paperless tax forms',
    description: 'Post your 1099-R to E-documents instead of mailing it'
  },
  {
    id: 'payment-email',
    label: 'Payment emails',
    description: 'Email me when each monthly payment is sent'
  },
  {
    id: 'plan-news',
    label: 'Plan news',
    description: 'Annual notices and updates from the trust'
  }
];

function PreferencesCard() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    'paperless-tax': true,
    'payment-email': true,
    'plan-news': false
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Choose what we send you and how</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-3'>
        {preferences.map((pref) => (
          <div
            key={pref.id}
            className='flex items-center justify-between gap-4 rounded-lg border p-4'
          >
            <div>
              <Label htmlFor={pref.id}>{pref.label}</Label>
              <p className='text-muted-foreground mt-1 text-sm'>{pref.description}</p>
            </div>
            <Switch
              id={pref.id}
              checked={enabled[pref.id]}
              onCheckedChange={(checked) => {
                setEnabled({ ...enabled, [pref.id]: checked });
                toast.success(`${pref.label} turned ${checked ? 'on' : 'off'}`);
              }}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function PasswordCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Password changes go through the sign-in provider in the full version of this app, so this
          is disabled in this demo deployment.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant='outline' size='sm' className={pillButton} disabled>
          Change password
        </Button>
      </CardFooter>
    </Card>
  );
}

export function PensionProfile() {
  return (
    <div className='flex flex-col gap-4'>
      <ContactCard />
      <PreferencesCard />
      <PasswordCard />
    </div>
  );
}
