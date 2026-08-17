/**
 * Branding and copy for the fet.cx landing page.
 *
 * Deliberately kept out of `app/app.config.ts`, which upstream Sink owns and
 * changes: keeping local brand values in their own file means pulling from the
 * fork never conflicts here.
 */
export const landingConfig = {
  domain: 'fet.cx',
  origin: 'https://fet.cx',
  tagline: 'Short links, kept sharp.',
  description:
    'fet.cx is a private link shortener running on Cloudflare\'s edge — every short link resolves in milliseconds, with analytics, QR codes and expiry built in.',
  /** Shown on the draggable hero card. Purely illustrative. */
  sampleSlug: 'hello',
}
