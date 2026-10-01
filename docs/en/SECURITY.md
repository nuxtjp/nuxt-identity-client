# Security boundary

[日本語](../../SECURITY.md)

`@nuxtjp/identity-client` is not an identity provider. It supplies identity UI
components and pure validation logic for a same-origin BFF. It does not store or
exchange access tokens, refresh tokens, ID tokens, passwords, OTP seeds, private
keys, or WebAuthn assertions.

The host BFF must bind state, nonce, the exact redirect URI, the pre-authentication
session, and expiry in a short-lived one-use transaction. It must rotate the
session ID after callback, revoke the prior session, apply CSRF protection to
state-changing endpoints, validate provider signature and claims, and keep all
credentials in server-side custody.

UI projections are untrusted. Keep them metadata-only, use Vue text bindings,
and never send raw provider errors to the browser. Do not log codes, tokens,
cookies, PKCE verifiers, or assertions.

The nonce passed to `consumeAuthorizationTransaction` must come from an ID token
whose signature, issuer, audience, and time claims have already been validated.
Set `providerClaimsVerified: true` only after that validation. Loopback HTTP
redirects use an explicit IPv4/IPv6 loopback address and a port of 1024 or
higher, never a DNS hostname.
