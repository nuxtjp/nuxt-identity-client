import { assertAllowedRedirectUri, defineRedirectAllowList } from './redirect'
import { assertSessionId, secureStringEqual } from './session'

const OPAQUE = /^[A-Za-z0-9._~-]{43,128}$/u

export interface AuthorizationTransaction {
  readonly state: string
  readonly nonce: string
  readonly pkceVerifier: string
  readonly redirectUri: string
  readonly initialSessionId: string
  readonly createdAt: number
  readonly expiresAt: number
  readonly consumedAt?: number
}

export interface AuthorizationTransactionInput {
  readonly state: string
  readonly nonce: string
  readonly pkceVerifier: string
  readonly redirectUri: string
  readonly initialSessionId: string
  readonly createdAt: number
  readonly lifetimeSeconds: number
}

export interface AuthorizationCallbackBinding {
  readonly state: string
  readonly nonce: string
  readonly currentSessionId: string
  readonly providerClaimsVerified: true
  readonly now: number
}

function assertOpaque(value: string, label: string): void {
  if (!OPAQUE.test(value)) throw new Error(`${label} has an invalid format`)
}

export function createAuthorizationTransaction(
  input: AuthorizationTransactionInput,
  allowedRedirectUris: readonly string[]
): AuthorizationTransaction {
  assertOpaque(input.state, 'state')
  assertOpaque(input.nonce, 'nonce')
  assertOpaque(input.pkceVerifier, 'PKCE verifier')
  assertSessionId(input.initialSessionId)
  if (!Number.isSafeInteger(input.createdAt)) throw new Error('createdAt must be epoch milliseconds')
  if (!Number.isInteger(input.lifetimeSeconds)
    || input.lifetimeSeconds < 60
    || input.lifetimeSeconds > 600) {
    throw new Error('authorization transaction lifetime must be 60 to 600 seconds')
  }
  const allowList = defineRedirectAllowList(allowedRedirectUris)
  assertAllowedRedirectUri(input.redirectUri, allowList)
  return Object.freeze({
    state: input.state,
    nonce: input.nonce,
    pkceVerifier: input.pkceVerifier,
    redirectUri: input.redirectUri,
    initialSessionId: input.initialSessionId,
    createdAt: input.createdAt,
    expiresAt: input.createdAt + input.lifetimeSeconds * 1_000
  })
}

export function consumeAuthorizationTransaction(
  transaction: AuthorizationTransaction,
  callback: AuthorizationCallbackBinding
): AuthorizationTransaction {
  if (transaction.consumedAt !== undefined) throw new Error('authorization transaction already consumed')
  if (callback.providerClaimsVerified !== true) {
    throw new Error('provider claims were not independently verified')
  }
  assertOpaque(callback.state, 'callback state')
  assertOpaque(callback.nonce, 'provider nonce')
  assertSessionId(callback.currentSessionId)
  if (!Number.isSafeInteger(callback.now) || callback.now < transaction.createdAt) {
    throw new Error('callback time is outside the authorization transaction')
  }
  if (callback.now >= transaction.expiresAt) throw new Error('authorization transaction expired')
  if (!secureStringEqual(transaction.state, callback.state)) throw new Error('state binding mismatch')
  if (!secureStringEqual(transaction.nonce, callback.nonce)) throw new Error('nonce binding mismatch')
  if (!secureStringEqual(transaction.initialSessionId, callback.currentSessionId)) {
    throw new Error('session binding mismatch')
  }
  return Object.freeze({ ...transaction, consumedAt: callback.now })
}
