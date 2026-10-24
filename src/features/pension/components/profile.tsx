'use client';

import { Edit } from '@carbon/icons-react';
import { Button, ButtonSet, Column, Grid, Stack, TextInput, Tile, Toggle } from '@carbon/react';
import { useStore } from '@tanstack/react-form';
import { useState } from 'react';
import * as z from 'zod';
import type { Participant } from '@/constants/mock-api-pension';
import { useAppForm } from '@/lib/form';
import { usePension } from '../pension-context';
import styles from '../portal.module.scss';
import { fieldError } from './field-error';
import { PersonalDetailsSection } from './personal-details';
import { useNotify } from './toasts';

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
  const notify = useNotify();
  const form = useAppForm({
    defaultValues: { email: participant.email, phone: participant.phone },
    validators: { onSubmit: contactSchema },
    onSubmit: ({ value }) => {
      onSave({ ...participant, ...value });
      notify('Contact information updated');
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
      <Grid>
        <Column sm={4} md={6} lg={8}>
          <Stack gap={7}>
            <form.Field
              name='email'
              children={(field) => (
                <TextInput
                  id='contact-email'
                  type='email'
                  labelText='Email address'
                  value={field.state.value}
                  invalid={field.state.meta.errors.length > 0}
                  invalidText={fieldError(field.state.meta.errors)}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
            <form.Field
              name='phone'
              children={(field) => (
                <TextInput
                  id='contact-phone'
                  type='tel'
                  labelText='Phone'
                  value={field.state.value}
                  invalid={field.state.meta.errors.length > 0}
                  invalidText={fieldError(field.state.meta.errors)}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
            <ButtonSet>
              <Button type='button' kind='secondary' size='lg' onClick={onCancel}>
                Cancel
              </Button>
              <Button type='submit' kind='primary' size='lg' disabled={!isDirty}>
                Save changes
              </Button>
            </ButtonSet>
          </Stack>
        </Column>
      </Grid>
    </form>
  );
}

function ContactSection() {
  const { participant, setParticipant } = usePension();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Tile>
      <Stack gap={5}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.tileTitle}>Contact information</h2>
            <p className={styles.tileBody}>How the plan reaches you about your payments.</p>
          </div>
          {!isEditing && (
            <Button kind='tertiary' size='sm' renderIcon={Edit} onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>
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
          <dl className={styles.details}>
            <dt className={styles.label}>Email address</dt>
            <dd className={styles.value}>{participant.email}</dd>
            <dt className={styles.label}>Phone</dt>
            <dd className={styles.value}>{participant.phone}</dd>
          </dl>
        )}
      </Stack>
    </Tile>
  );
}

const preferences = [
  {
    id: 'paperless-tax',
    label: 'Paperless tax forms',
    description: 'Post your 1099-R to E-documents instead of mailing it.'
  },
  {
    id: 'payment-email',
    label: 'Payment emails',
    description: 'Email me when each monthly payment is sent.'
  },
  {
    id: 'plan-news',
    label: 'Plan news',
    description: 'Get annual notices and plan updates from the trust.'
  }
];

function PreferencesSection() {
  const notify = useNotify();
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    'paperless-tax': true,
    'payment-email': true,
    'plan-news': false
  });

  return (
    <Tile>
      <h2 className={styles.tileTitle}>Preferences</h2>
      <p className={styles.tileBody}>
        Pick which emails and notices you want to get from the plan.
      </p>
      <div className={styles.section}>
        {preferences.map((pref) => (
          <Stack key={pref.id} gap={3} className={styles.toggleRow}>
            <Toggle
              id={pref.id}
              labelText={pref.label}
              labelA='Off'
              labelB='On'
              size='sm'
              toggled={enabled[pref.id]}
              onToggle={(checked) => {
                setEnabled({ ...enabled, [pref.id]: checked });
                notify(`${pref.label} turned ${checked ? 'on' : 'off'}`);
              }}
            />
            <p className={styles.tileBody}>{pref.description}</p>
          </Stack>
        ))}
      </div>
    </Tile>
  );
}

export function Profile({ editPersonal = false }: { editPersonal?: boolean }) {
  return (
    <Grid>
      <Column sm={4} md={8} lg={16}>
        <h2 className={styles.pageTitle}>Profile</h2>
        <Stack gap={5}>
          <PersonalDetailsSection defaultEditing={editPersonal} />
          <ContactSection />
          <PreferencesSection />
        </Stack>
      </Column>
    </Grid>
  );
}
