# reCAPTCHA signup reliability (8 October 2026)

The previous client used 12-second loading and execution deadlines and replaced
every failure with a connection-related message. That did not establish the cause
of the reported production failure; a slow-network font warning alone is not proof.

The loader now allows 40 seconds per loading attempt and 40 seconds for execution,
reuses initialized clients, ignores late callbacks from failed attempts, and retries
one failed script load using Google's documented `www.recaptcha.net` alternative.
Registration requests are never automatically retried. Tokens are still generated
at submission time and verified by the unchanged backend guard.

Failures expose safe codes in the console and in the existing API-shaped error:
`recaptcha_configuration`, `recaptcha_script_load`, `recaptcha_ready_timeout`,
`recaptcha_execute_timeout`, and `recaptcha_execute_failed`. Raw Google errors,
keys, passwords, and tokens are not logged. The form remains populated on failure.

## Checks

- `node --test scripts/recaptcha.test.mjs` tests timing, bounded fallback,
  configuration failures, late callbacks, token absence, and manual retry.
- `cypress/e2e/22_recaptcha.cy.ts` verifies protected forms with isolated mock
  security scripts and API responses, including no signup on configuration failure.

## Production rollout

Deploy the frontend; no backend update or database migration is needed. Keep
`NEXT_PUBLIC_RECAPTCHA_SITE_KEY` in Vercel Production and the matching secret in
Render. Do not copy test-only build keys into production. After deployment, refresh
the signup page and test with a user-authorized disposable account. Automated
checks do not validate the real Google key pair or guarantee production signup.
If failure persists, use the safe console code and confirm the key's domain/type in
Google's console; do not disable verification or share secret keys.

References: https://developers.google.com/recaptcha/docs/v3 and
https://developers.google.com/recaptcha/docs/faq (alternative host).
