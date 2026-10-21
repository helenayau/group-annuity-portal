'use client';

import * as React from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { withForm } from '@/lib/form';
import { registrationDefaults } from './registration-schema';
import { pruClass } from './registration-theme';

/**
 * The registration fields, as `withForm` sections shared by BOTH arms of the
 * A/B test. Neither arm styles a field itself — if a label or an input ever
 * needs to change, it changes here and both pages move together, which is
 * what keeps the test measuring pagination rather than visual differences.
 *
 * The Prudential design system's inputs (square corners, navy hairline
 * border, semibold navy labels) sit far enough from the app theme that these
 * are one-off fields on raw `form.Field` rather than `field.TextField` — the
 * doc conventions still hold: `data-invalid` on `<Field>`, `aria-invalid` on
 * the control, `<FieldError>` when touched and invalid.
 */

const sectionShape = { defaultValues: registrationDefaults };

/** Shared text input, wired to a raw `form.Field` render prop. */
function PruTextInput({
  id,
  label,
  type = 'text',
  autoComplete,
  inputMode,
  value,
  errors,
  isInvalid,
  onChange,
  onBlur,
  endAdornment
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  inputMode?: React.ComponentProps<'input'>['inputMode'];
  value: string;
  errors: Array<{ message?: string } | undefined>;
  isInvalid: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
  endAdornment?: React.ReactNode;
}) {
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id} className={pruClass.label}>
        {label}
      </FieldLabel>
      <div className='relative'>
        <Input
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={isInvalid}
          aria-describedby={isInvalid ? `${id}-error` : undefined}
          className={pruClass.input}
        />
        {endAdornment}
      </div>
      {isInvalid && <FieldError id={`${id}-error`} errors={errors} />}
    </Field>
  );
}

/** First and last name stacked at the full field width, in both arms. */
export const NameFields = withForm({
  ...sectionShape,
  render: function NameFieldsRender({ form }) {
    return (
      <div className='grid gap-6'>
        <form.Field
          name='firstName'
          children={(field) => (
            <PruTextInput
              id='firstName'
              label='First name'
              autoComplete='given-name'
              value={field.state.value}
              errors={field.state.meta.errors}
              isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
            />
          )}
        />
        <form.Field
          name='lastName'
          children={(field) => (
            <PruTextInput
              id='lastName'
              label='Last name'
              autoComplete='family-name'
              value={field.state.value}
              errors={field.state.meta.errors}
              isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
            />
          )}
        />
      </div>
    );
  }
});

export const ContactFields = withForm({
  ...sectionShape,
  render: function ContactFieldsRender({ form }) {
    return (
      <div className='grid gap-6'>
        <form.Field
          name='email'
          children={(field) => (
            <PruTextInput
              id='email'
              label='Email'
              type='email'
              autoComplete='email'
              value={field.state.value}
              errors={field.state.meta.errors}
              isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
            />
          )}
        />
        <form.Field
          name='mobile'
          children={(field) => (
            <PruTextInput
              id='mobile'
              label='Mobile number'
              type='tel'
              inputMode='tel'
              autoComplete='tel'
              value={field.state.value}
              errors={field.state.meta.errors}
              isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
            />
          )}
        />
      </div>
    );
  }
});

export const PasswordFieldSection = withForm({
  ...sectionShape,
  render: function PasswordFieldRender({ form }) {
    const [visible, setVisible] = React.useState(false);

    return (
      <form.Field
        name='password'
        children={(field) => (
          <PruTextInput
            id='password'
            label='Password'
            type={visible ? 'text' : 'password'}
            autoComplete='new-password'
            value={field.state.value}
            errors={field.state.meta.errors}
            isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            endAdornment={
              <button
                type='button'
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? 'Hide password' : 'Show password'}
                aria-pressed={visible}
                className='absolute top-1/2 right-3 -translate-y-1/2 text-[#001F45] outline-none focus-visible:ring-2 focus-visible:ring-[#0066CC]'
              >
                {visible ? <Icons.eyeOff className='size-5' /> : <Icons.eye className='size-5' />}
              </button>
            }
          />
        )}
      />
    );
  }
});

/**
 * Disclosure link in the consent copy. A button until the real document URLs
 * are supplied — the mockup shows the external-link affordance but no hrefs.
 */
function DisclosureLink({ children }: { children: React.ReactNode }) {
  return (
    <button type='button' className={pruClass.link}>
      {children}
      <Icons.externalLink className='mb-0.5 ml-0.5 inline size-3' aria-hidden />
    </button>
  );
}

export const ConsentField = withForm({
  ...sectionShape,
  render: function ConsentFieldRender({ form }) {
    return (
      <form.Field
        name='consent'
        children={(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field orientation='horizontal' data-invalid={isInvalid} className='items-start'>
              <Checkbox
                id='consent'
                name='consent'
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(checked === true)}
                onBlur={field.handleBlur}
                aria-invalid={isInvalid}
                aria-describedby={isInvalid ? 'consent-error' : undefined}
                className={`mt-0.5 ${pruClass.checkbox}`}
              />
              <div className='grid gap-1'>
                {/* FieldLabel is `flex w-fit` by default — the consent copy is
                    a running sentence with inline links, so it needs to lay
                    out as a block or the links break into columns. */}
                <FieldLabel
                  htmlFor='consent'
                  className='block w-full text-sm leading-relaxed font-normal text-[#001F45]'
                >
                  I consent to the electronic delivery of communications and have received{' '}
                  <DisclosureLink>Prudential&apos;s Privacy policies</DisclosureLink>,{' '}
                  <DisclosureLink>Customer Relationship Summary</DisclosureLink>,{' '}
                  <DisclosureLink>Wrap Fee Brochure</DisclosureLink> and{' '}
                  <DisclosureLink>Financial Planning Brochure</DisclosureLink>.
                </FieldLabel>
                {isInvalid && <FieldError id='consent-error' errors={field.state.meta.errors} />}
              </div>
            </Field>
          );
        }}
      />
    );
  }
});

/* Held as a string rather than JSX text: the legal copy has to render
   verbatim, and JSX would swallow the space after the bold lead-in. */
const consentBody =
  "I agree that The Prudential Insurance Company of America, Pruco Securities, LLC and their affiliates (collectively 'Prudential') can contact me for marketing purposes by phone call or text (message and data rates may apply) at the phone number and email address listed above. I understand I may be contacted even if I've requested not to be contacted by Prudential or am on a do-not-call/contact list. I also understand that consent isn't necessary to schedule an appointment or make an investment or purchase. To schedule an appointment without providing this consent, you may schedule online.";

/** The consent footnote that sits under the CTA in both arms. */
export function ConsentDisclosure() {
  return (
    <div className='space-y-4 text-xs leading-relaxed text-[#001F45]/90'>
      <p>
        <span className='font-bold'>*Consent to be contacted.</span>
        {` ${consentBody}`}
      </p>
      <p>
        Learn how we use and share your information by visiting our{' '}
        <button type='button' className={pruClass.link}>
          Privacy Center
        </button>
        .
      </p>
    </div>
  );
}

/**
 * The CTA, shared so both arms show the same pale-blue disabled treatment
 * the mockup specifies. The button stays disabled until the fields currently
 * on screen satisfy the schema. The label is "Get started" wherever the
 * press creates the account — the consent line above it says as much — and
 * "Next" only on a step that leads to another step.
 */
export function RegistrationCta({
  disabled,
  inactive = false,
  label = 'Get started'
}: {
  disabled: boolean;
  /** Fields on screen are not all valid yet: the button is faded so it reads
   *  as not-ready, but stays pressable so a press can say what is missing. */
  inactive?: boolean;
  label?: string;
}) {
  return (
    <Button
      type='submit'
      disabled={disabled}
      className={`${pruClass.cta} ${inactive ? 'opacity-50' : ''}`}
    >
      {label}
    </Button>
  );
}

/** The line above the CTA, shown in both arms at the point of submission. */
export function ConsentCallout() {
  return (
    <p className='text-sm text-[#001F45]'>
      By clicking on the &apos;Get started&apos; button, I agree to the consent below.*
    </p>
  );
}
