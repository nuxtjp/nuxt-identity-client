# Using @nuxtjp/identity-client

Provide consistent sign-in, account, authenticator and device-management screens in a Nuxt service.

## Before you start

The application owns IdP communication, token exchange, custody, user records and authorization.

## First steps

Run from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
```

## How to assess the result

- Reuse Japanese and English identity presentation components.
- Apply declared pure security primitives to caller-owned flows.

A passing source-level check establishes only what that check observes. Keep missing configuration, unavailable services and unverified deployment paths visible.

## Continue reading

[Repository overview](../README.md)
