# @nuxtjp/identity-client

[日本語](../../README.md)

This Nuxt 4 module provides a shared UI contract for sign-in, callback status,
account details, sign-in methods, registered devices, and sign-out. Japanese is
the default locale and English is included.

The package does not contact an identity provider, exchange authorization codes,
store tokens, own users, or make authorization decisions. It registers six
presentational components. Consumers own the routes listed by
`IDENTITY_UI_CONTRACTS`, pass sanitized projections as props, and handle typed
UI events.

```ts
import identityClient from '@nuxtjp/identity-client'

export default defineNuxtConfig({
  modules: [[identityClient, { componentPrefix: 'NuxtJp' }]]
})
```

The exact route contract is `/login`, `/auth/callback`, `/account`,
`/account/security`, `/account/devices`, and `/logout`. Routes are not inserted
automatically, so the module cannot overwrite a consumer's existing pages or
authentication middleware.

## OIDC BFF boundary

Use Authorization Code Flow with PKCE behind a same-origin BFF. The browser
boundary contains only four endpoints:

- `POST /api/identity/login`
- `GET /api/identity/callback` (the provider redirect target)
- `GET /api/identity/session`
- `POST /api/identity/logout`

The provider redirects to the BFF callback, not the presentational
`/auth/callback` page. The BFF exchanges the code, rotates the session, removes
the code, and only then redirects to the UI status page.

`@nuxtjp/identity-client/core` provides CSPRNG state and nonce generation, S256
PKCE, an exact redirect allow-list, one-use transaction binding, session ID
rotation, a host-only cookie policy, and same-origin return-path validation.
PKCE verifiers and provider tokens remain server-side and are not part of the
browser projection.

The host must validate signature, issuer, audience, nonce, and time before
accepting provider evidence. It must also provide CSRF protection, persistent
one-use transaction storage, server-side credential custody, and account-linking
policy. See [SECURITY.md](../../SECURITY.md).

## Verification

```bash
pnpm install --offline --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
```

The playground uses synthetic data and performs no authorization request.
