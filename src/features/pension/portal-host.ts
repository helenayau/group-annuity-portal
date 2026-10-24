// The group annuity portal's own address. On this host the portal is served
// at the root (next.config.ts rewrites to /pension), so links drop the
// /pension prefix. Everywhere else it stays under /pension.
export const PORTAL_HOST = 'group-annuity-portal.vercel.app';

export function portalBasePath(host: string | null) {
  return host?.split(':')[0] === PORTAL_HOST ? '' : '/pension';
}
