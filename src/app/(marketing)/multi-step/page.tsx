import type { Metadata } from 'next';
import { RegistrationShell } from '../stages-registration/_components/registration-shell';
import { MultiStepRegistrationForm } from '../stages-registration/_components/multi-step-registration-form';

export const metadata: Metadata = {
  title: 'Create your account'
};

/**
 * Variant B of the registration A/B test: the same fields as variant A,
 * paginated across three steps. Variant A lives at `/single-page`.
 *
 * The h1 and its supporting line come from the form here rather than from the
 * page, because the supporting line is the current step's own copy.
 */
export default function CreateAccountMultiStepPage() {
  return (
    <RegistrationShell>
      <MultiStepRegistrationForm />
    </RegistrationShell>
  );
}
