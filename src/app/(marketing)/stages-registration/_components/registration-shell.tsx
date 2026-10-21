import { pruClass } from './registration-theme';
import { SiteHeader } from './site-header';

/**
 * The page chrome both A/B arms render into: navy header, pale-blue canvas,
 * and a single left-aligned form column. Arms supply only the form, so
 * nothing but pagination differs between them.
 */
export function RegistrationShell({ children }: { children: React.ReactNode }) {
  return (
    <main className='min-h-svh bg-[#E2F4FF] [color-scheme:light]'>
      <SiteHeader className='bg-[#001F45]' />
      <div className='mx-auto max-w-6xl px-6 py-10 sm:px-10 lg:py-14'>
        <div className='w-full lg:max-w-[760px]'>{children}</div>
      </div>
    </main>
  );
}

/** The h1 + supporting line, held constant across both arms. */
export function RegistrationHeading({ description }: { description: string }) {
  return (
    <header>
      <h1 className={pruClass.h1}>First, let&apos;s create your account</h1>
      <p className={`mt-5 ${pruClass.copy}`}>{description}</p>
    </header>
  );
}
