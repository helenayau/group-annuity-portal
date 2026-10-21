'use client';

import * as React from 'react';
import { revalidateLogic } from '@tanstack/react-form';
import { useAppForm } from '@/lib/form';
import {
  ConsentCallout,
  ConsentDisclosure,
  ConsentField,
  ContactFields,
  NameFields,
  PasswordFieldSection,
  RegistrationCta
} from './registration-fields';
import { registrationDefaults, registrationIntro, registrationSchema } from './registration-schema';
import { RegistrationHeading } from './registration-shell';
import { RegistrationSuccess } from './registration-success';

/** h asked for a narrower column on this version only: the fields and
 *  consent copy share this measure; the line under the h1 keeps its own. */
const SINGLE_PAGE_WIDTH = 'max-w-[420px]';

/**
 * Variant A of the registration A/B test — every field on one page, exactly
 * as the design-system mockup specifies. Variant B
 * (`multi-step-registration-form`) renders these same sections across three
 * steps; keep the two in step when either changes. Both end on the shared
 * confirmation screen.
 */
export function SingleStepRegistrationForm() {
  const [isComplete, setIsComplete] = React.useState(false);

  const form = useAppForm({
    defaultValues: registrationDefaults,
    /* Same validation timing as variant B: the first press paints whatever
       is wrong, and from then on the fields revalidate as they are typed in.
       Both arms have to tell a user the same thing at the same moment. */
    validationLogic: revalidateLogic(),
    validators: { onDynamic: registrationSchema },
    onSubmit: () => {
      setIsComplete(true);
    }
  });

  if (isComplete) {
    return <RegistrationSuccess />;
  }

  return (
    <>
      <RegistrationHeading description={registrationIntro} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        noValidate
        className={`mt-12 flex w-full flex-col gap-8 ${SINGLE_PAGE_WIDTH}`}
        data-registration-variant='single-page'
      >
        <NameFields form={form} />
        <ContactFields form={form} />
        <PasswordFieldSection form={form} />

        <div className='mt-4 flex flex-col gap-6'>
          <ConsentField form={form} />
          <ConsentCallout />
          {/* Faded until every field on the page is valid, but pressable
              throughout: a press with something still wrong paints that
              field's error rather than leaving a button that never lights
              up. */}
          <form.Subscribe
            selector={(state) => [state.values, state.isSubmitting] as const}
            children={([values, isSubmitting]) => (
              <RegistrationCta
                disabled={isSubmitting}
                inactive={!registrationSchema.safeParse(values).success}
              />
            )}
          />
        </div>

        <ConsentDisclosure />
      </form>
    </>
  );
}
