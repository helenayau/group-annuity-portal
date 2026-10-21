/**
 * Prudential Stages registration palette, sampled from the design-system
 * mockup. Both A/B arms of the registration flow import from here so the
 * visual treatment stays byte-identical — the only variable under test is
 * how the fields are paginated, never the styling.
 */
export const pru = {
  navy: '#001F45',
  pageBg: '#E2F4FF',
  blue: '#0066CC',
  blueHover: '#00539E',
  blueDisabled: '#99C2EB',
  cardBorder: '#7ECAF2',
  teal: '#018786',
  white: '#FFFFFF'
} as const;

/** Shared class fragments so the two arms cannot drift apart. */
export const pruClass = {
  /** White, square-cornered input with the navy hairline border.
   *  The `dark:` fragments re-state the light values on purpose: the shadcn
   *  input carries `dark:bg-input/30`, which otherwise wins over `bg-white`
   *  for any visitor whose device is set to dark mode and turns the empty
   *  fields grey. This page is a fixed light design, so it opts out. */
  input:
    'h-11 w-full rounded-none border border-[#001F45] bg-white px-3 text-base text-[#001F45] transition-shadow outline-none placeholder:text-[#001F45]/40 focus-visible:ring-2 focus-visible:ring-[#0066CC] focus-visible:ring-offset-1 aria-invalid:border-destructive aria-invalid:ring-0 md:text-sm dark:bg-white dark:aria-invalid:border-destructive dark:aria-invalid:ring-0',
  /** Consent checkbox: square, navy hairline, and white whether or not it is
   *  checked — checking it adds a navy check mark rather than filling the box.
   *  Pinned to light for the same reason as `input`. */
  checkbox:
    'size-5 rounded-none border-[#001F45] bg-white text-[#001F45] data-checked:border-[#001F45] data-checked:bg-white data-checked:text-[#001F45] dark:bg-white dark:data-checked:bg-white',
  label: 'text-sm font-semibold text-[#001F45]',
  /** Page h1. */
  h1: 'text-4xl leading-tight font-bold tracking-tight text-[#001F45] sm:text-5xl',
  /** The supporting line under the h1: 18px at every width, and held to the
   *  same measure as the fields so it breaks on the same column they do. */
  copy: 'w-full max-w-[560px] text-[18px] leading-snug text-[#001F45]',
  /** Measure of the form column. Widened once the right rail came out, so
   *  the fields and the step rail are not squeezed into a third of the page. */
  formWidth: 'w-full max-w-[560px]',
  /** Pill CTA — solid blue when enabled, pale blue when disabled. */
  cta: 'h-11 w-full max-w-[200px] rounded-full bg-[#0066CC] px-6 text-base font-semibold text-white transition-colors hover:bg-[#00539E] disabled:pointer-events-none disabled:bg-[#99C2EB] disabled:text-white disabled:opacity-100',
  /** Secondary pill CTA (Back): the same shape and size as `cta`, outlined
   *  in the CTA blue on white. Pinned light under `dark:` like `input`. */
  ctaSecondary:
    'h-11 w-full max-w-[200px] rounded-full border-2 border-[#0066CC] bg-white px-6 text-base font-semibold text-[#0066CC] transition-colors hover:border-[#00539E] hover:bg-[#E2F4FF] hover:text-[#00539E] dark:border-[#0066CC] dark:bg-white dark:hover:bg-[#E2F4FF]',
  link: 'font-semibold text-[#0066CC] underline-offset-2 hover:underline'
} as const;
