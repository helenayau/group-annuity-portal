'use client';

import * as React from 'react';
import { revalidateLogic } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { useAppForm } from '@/lib/form';
import { useFormStepper } from '@/hooks/use-stepper';
import {
  ConsentCallout,
  ConsentDisclosure,
  ConsentField,
  ContactFields,
  NameFields,
  PasswordFieldSection,
  RegistrationCta
} from './registration-fields';
import {
  registrationDefaults,
  registrationSchema,
  registrationStepSchemas,
  registrationSteps
} from './registration-schema';
import { RegistrationHeading } from './registration-shell';
import { RegistrationSuccess } from './registration-success';
import { pruClass } from './registration-theme';

const TOTAL_STEPS = registrationSteps.length;

const CIRCLE_PX = 40;
/** How far a rule stops short of the circle it runs into. */
const CLEARANCE_PX = 16;

/**
 * Where step `index`'s circle centres, measured from the rail's left edge.
 * The first and last circles sit flush with the rail's edges, so the centres
 * span `100% - CIRCLE_PX` and divide evenly between them.
 */
function circleCentre(index: number) {
  const ratio = index / (TOTAL_STEPS - 1);
  return `calc(${CIRCLE_PX / 2}px + (100% - ${CIRCLE_PX}px) * ${ratio})`;
}

/**
 * Numbered progress rail, built to the reference mockup: the reached circles
 * filled navy with a white numeral and the rest pale grey, joined by thin grey
 * rules that stop short of each circle. Numerals throughout — the reference
 * uses no checkmarks — so the current step is marked by its bold navy label
 * rather than by a different glyph.
 *
 * The rail is the width of the fields below it: the first circle sits flush
 * with the left edge of the inputs and the last with their right edge. The
 * outer labels are wider than their circles, so they align to those same
 * edges rather than centring on the circle — centring them is what pushed
 * them past the form column. The middle label centres on its circle.
 */
function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className='relative'>
      {registrationSteps.slice(1).map((step, i) => {
        const index = i + 1;
        return (
          <span
            key={step.label}
            aria-hidden
            className={`absolute top-[19px] h-0.5 ${
              index < currentStep ? 'bg-[#001F45]' : 'bg-[#D0D8E4]'
            }`}
            style={{
              left: `calc(${circleCentre(index - 1)} + ${CIRCLE_PX / 2 + CLEARANCE_PX}px)`,
              right: `calc(100% - (${circleCentre(index)} - ${CIRCLE_PX / 2 + CLEARANCE_PX}px))`
            }}
          />
        );
      })}
      <ol
        className='grid'
        style={{ gridTemplateColumns: `repeat(${TOTAL_STEPS}, minmax(0, 1fr))` }}
        aria-label={`Step ${currentStep} of ${TOTAL_STEPS}`}
      >
        {registrationSteps.map((step, index) => {
          const stepNumber = index + 1;
          const isReached = stepNumber <= currentStep;
          const isCurrent = stepNumber === currentStep;
          const align =
            index === 0 ? 'items-start' : index === TOTAL_STEPS - 1 ? 'items-end' : 'items-center';
          return (
            <li key={step.label} className={`flex flex-col gap-3 ${align}`}>
              <span
                aria-current={isCurrent ? 'step' : undefined}
                className={`flex size-10 items-center justify-center rounded-full text-base font-bold ${
                  isReached ? 'bg-[#001F45] text-white' : 'bg-[#D0D8E4] text-[#4A5A6A]'
                }`}
              >
                {stepNumber}
              </span>
              <span
                className={`text-[15px] leading-tight whitespace-nowrap ${
                  isCurrent ? 'font-bold text-[#001F45]' : 'font-normal text-[#5A6A7A]'
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/**
 * Variant B of the registration A/B test — the same fields as variant A
 * (`single-step-registration-form`), paginated across three steps. Both arms
 * render the shared `withForm` sections, so the fields, labels and validation
 * are identical. The step's own line of copy replaces the supporting line
 * under the h1 rather than adding a second heading, so the page carries one
 * title however many steps it has. Both arms end on the shared confirmation
 * screen.
 */
export function MultiStepRegistrationForm() {
  const [isComplete, setIsComplete] = React.useState(false);

  const {
    currentValidator,
    step,
    currentStep,
    isFirstStep,
    handleCancelOrBack,
    handleNextStepOrSubmit
  } = useFormStepper(registrationStepSchemas, { fullSchema: registrationSchema });

  const form = useAppForm({
    defaultValues: registrationDefaults,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: currentValidator as typeof registrationSchema },
    onSubmit: () => {
      setIsComplete(true);
    }
  });

  const isLastStep = step.isCompleted;

  if (isComplete) {
    return <RegistrationSuccess />;
  }

  return (
    <>
      <RegistrationHeading description={registrationSteps[currentStep - 1].title} />

      {/* Every submit — the Enter key included — routes through the stepper
          gate; calling form.handleSubmit directly on a non-final step would
          validate only that step's slice and then submit a half-filled form. */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void handleNextStepOrSubmit(form);
        }}
        noValidate
        className={`mt-12 flex flex-col gap-10 ${pruClass.formWidth}`}
        data-registration-variant='multi-step'
      >
        <StepIndicator currentStep={currentStep} />

        {currentStep === 1 && <NameFields form={form} stacked />}
        {currentStep === 2 && <ContactFields form={form} />}
        {currentStep === 3 && (
          <div className='flex flex-col gap-8'>
            <PasswordFieldSection form={form} />
            <ConsentField form={form} />
            <ConsentCallout />
          </div>
        )}

        {/* Both pills may shrink below their 200px cap so they share a phone-width row. */}
        <div className='flex items-center gap-4 *:min-w-0 *:shrink'>
          {!isFirstStep && (
            <Button
              type='button'
              onClick={() => handleCancelOrBack()}
              className={pruClass.ctaSecondary}
            >
              Back
            </Button>
          )}
          {/* Faded until this step's fields are valid, as in variant A, but
              pressable throughout: the step gate paints the offending
              field's error on a blocked press. */}
          <form.Subscribe
            selector={(state) => [state.values, state.isSubmitting] as const}
            children={([values, isSubmitting]) => (
              <RegistrationCta
                disabled={isSubmitting}
                inactive={!currentValidator.safeParse(values).success}
                label={currentStep === TOTAL_STEPS ? 'Get started' : 'Next'}
              />
            )}
          />
        </div>

        {isLastStep && <ConsentDisclosure />}
      </form>
    </>
  );
}
