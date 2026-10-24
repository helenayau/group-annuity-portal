// Accessibility test for the group annuity portal, using IBM's Equal Access
// rules engine (the ruleset behind IBM's Accessibility Checker). Scans every
// portal page and modal state in a real browser and exits with an error if
// any confirmed violation is found.
//
// Usage: start the app (`bun run build && bun run start`), then
//   PORTAL_URL=http://localhost:3000 bun test:a11y [state name filter]
// Set CHROMIUM_PATH to use a preinstalled Chromium instead of Playwright's.
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const ace = require.resolve('accessibility-checker-engine/ace.js');
const base = (process.env.PORTAL_URL ?? 'http://localhost:3000') + '/pension';

const states = [
  ['Account details', '', null],
  ['Edit payment settings modal', '', (p) => p.getByRole('button', { name: 'Edit payment settings' }).click()],
  ['Payment details modal', '', (p) => p.getByRole('button', { name: /View payment to account/ }).first().click()],
  ['Status tooltip', '', (p) => p.getByRole('button', { name: 'What does status mean?' }).focus()],
  ['Personal details', '/personal-details', null],
  ['E-documents', '/e-documents', null],
  ['Tax forms modal', '/e-documents', (p) => p.getByRole('button', { name: 'View tax forms' }).click()],
  ['Profile (editing personal details)', '/profile?edit=personal', null],
  ['Profile (editing contact)', '/profile', (p) => p.getByRole('button', { name: 'Edit' }).nth(1).click()]
];

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
);
const filter = process.argv[2];
let failures = 0;

for (const [label, path, open] of states) {
  if (filter && !label.includes(filter)) continue;
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(base + path, { waitUntil: 'networkidle' });
  if (open) {
    await open(page);
    await page.waitForTimeout(800);
  }
  await page.addScriptTag({ path: ace });
  const violations = await page.evaluate(async () => {
    const report = await new window.ace.Checker().check(document, ['IBM_Accessibility']);
    return report.results
      .filter((r) => r.value[0] === 'VIOLATION' && r.value[1] === 'FAIL')
      .map((r) => `${r.ruleId}: ${r.message}\n      ${(r.snippet ?? '').slice(0, 160)}`);
  });
  console.log(`${violations.length ? '✗' : '✓'} ${label}: ${violations.length} violation(s)`);
  for (const v of violations) console.log(`    - ${v}`);
  failures += violations.length;
  await page.close();
}

await browser.close();
if (failures) {
  console.error(`\n${failures} accessibility violation(s) found.`);
  process.exit(1);
}
