'use client';

import { Edit } from '@carbon/icons-react';
import { Button, Stack, TextInput, Tile } from '@carbon/react';
import { useStore } from '@tanstack/react-form';
import Link from 'next/link';
import { useState } from 'react';
import * as z from 'zod';
import type { Participant } from '@/constants/mock-api-pension';
import { useAppForm } from '@/lib/form';
import { usePension, usePortalHref } from '../pension-context';
import styles from '../portal.module.scss';
import { fieldError } from './field-error';
import { useNotify } from './toasts';

function Address({ participant }: { participant: Participant }) {
  return (
    <address className={`${styles.tileBody} ${styles.address}`}>
      {participant.firstName} {participant.lastName}
      <br />
      {participant.addressLine1}
      <br />
      {participant.city}, {participant.state} {participant.zip}
    </address>
  );
}

// Personal details tab: what's on file, plus a pointer to the profile page.
export function PersonalDetails() {
  const { participant } = usePension();
  const portalHref = usePortalHref();

  return (
    <div className={styles.grid2}>
      <Tile className={styles.tile}>
        <h2 className={styles.tileTitle}>Personal details</h2>
        <Address participant={participant} />
        <div className={styles.tileActions}>
          <Button as={Link} href={portalHref('/profile?edit=personal')} kind='tertiary' size='sm'>
            Edit personal details
          </Button>
        </div>
      </Tile>
      <Tile className={styles.tile}>
        <h2 className={styles.tileTitle}>Need to update other details?</h2>
        <p className={styles.tileBody}>
          You can update your email address, password, and other preferences on your profile.
        </p>
        <div className={styles.tileActions}>
          <Button as={Link} href={portalHref('/profile')} kind='tertiary' size='sm'>
            Go to profile
          </Button>
        </div>
      </Tile>
    </div>
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

const personalFields = [
  { name: 'firstName', label: 'First name' },
  { name: 'lastName', label: 'Last name' },
  { name: 'addressLine1', label: 'Street address', wide: true },
  { name: 'city', label: 'City' },
  { name: 'state', label: 'State' },
  { name: 'zip', label: 'ZIP' }
] as const;

function PersonalDetailsForm({
  participant,
  onCancel,
  onSave
}: {
  participant: Participant;
  onCancel: () => void;
  onSave: (participant: Participant) => void;
}) {
  const notify = useNotify();
  const form = useAppForm({
    defaultValues: {
      firstName: participant.firstName,
      lastName: participant.lastName,
      addressLine1: participant.addressLine1,
      city: participant.city,
      state: participant.state,
      zip: participant.zip
    },
    validators: { onSubmit: personalSchema },
    onSubmit: ({ value }) => {
      onSave({ ...participant, ...value, state: value.state.toUpperCase() });
      notify('Personal details updated');
    }
  });
  const isDirty = useStore(form.store, (state) => state.isDirty);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className={styles.formGrid}>
        {personalFields.map(({ name, label, ...rest }) => (
          <div key={name} className={'wide' in rest ? styles.formGridWide : undefined}>
            <form.Field
              name={name}
              children={(field) => (
                <TextInput
                  id={`personal-${name}`}
                  labelText={label}
                  value={field.state.value}
                  invalid={field.state.meta.errors.length > 0}
                  invalidText={fieldError(field.state.meta.errors)}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
          </div>
        ))}
      </div>
      <div className={styles.tileActions}>
        <Button type='submit' kind='primary' size='md' disabled={!isDirty}>
          Save changes
        </Button>
        <Button type='button' kind='secondary' size='md' onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Profile page section. Opens in edit mode when arriving from
// "Edit personal details".
export function PersonalDetailsSection({ defaultEditing = false }: { defaultEditing?: boolean }) {
  const { participant, setParticipant } = usePension();
  const [isEditing, setIsEditing] = useState(defaultEditing);

  return (
    <Tile>
      <Stack gap={5}>
        <div className={styles.docRow}>
          <div>
            <h2 className={styles.tileTitle}>Personal details</h2>
            <p className={styles.tileBody}>
              Your name and mailing address are used on tax forms and plan notices.
            </p>
          </div>
          {!isEditing && (
            <Button kind='tertiary' size='sm' renderIcon={Edit} onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>
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
          <Address participant={participant} />
        )}
      </Stack>
    </Tile>
  );
}
