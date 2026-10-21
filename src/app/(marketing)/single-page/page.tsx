import type { Metadata } from 'next';
import { RegistrationShell } from '../stages-registration/_components/registration-shell';
import { SingleStepRegistrationForm } from '../stages-registration/_components/single-step-registration-form';

export const metadata: Metadata = {
  title: 'Create your account'
};

/**
 * Variant A of the registration A/B test: all fields on a single page.
 * Variant B lives at `/multi-step`.
 *
 * The h1 and its supporting line come from the form, which swaps both for the
 * confirmation screen once the account is created.
 */
export default function CreateAccountPage() {
  return (
    <RegistrationShell>
      <SingleStepRegistrationForm />
    </RegistrationShell>
  );
}
