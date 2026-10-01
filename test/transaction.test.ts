import { describe, expect, it } from 'vitest'
import {
  consumeAuthorizationTransaction,
  createAuthorizationTransaction
} from '../src/runtime/core/transaction'

const now = Date.parse('2026-08-03T00:00:00.000Z')
const input = {
  state: 'state_value_1234567890123456789012345678901',
  nonce: 'nonce_value_1234567890123456789012345678901',
  pkceVerifier: 'verifier_value_1234567890123456789012345678901234',
  redirectUri: 'https://service.example/auth/callback',
  initialSessionId: 'preauth_session_1234',
  createdAt: now,
  lifetimeSeconds: 300
}

describe('authorization transaction', () => {
  it('binds state, nonce, redirect URI, session, and expiry', () => {
    const transaction = createAuthorizationTransaction(input, [input.redirectUri])
    expect(transaction.expiresAt).toBe(now + 300_000)
    expect(Object.isFrozen(transaction)).toBe(true)
  })

  it('rejects a redirect URI that is not an exact allow-list member', () => {
    expect(() => createAuthorizationTransaction(
      { ...input, redirectUri: 'https://other.example/auth/callback' },
      [input.redirectUri]
    )).toThrow(/not allow-listed/u)
  })

  it('is consumed once after all bindings match', () => {
    const transaction = createAuthorizationTransaction(input, [input.redirectUri])
    const consumed = consumeAuthorizationTransaction(transaction, {
      state: input.state,
      nonce: input.nonce,
      currentSessionId: input.initialSessionId,
      providerClaimsVerified: true,
      now: now + 1_000
    })
    expect(consumed.consumedAt).toBe(now + 1_000)
    expect(() => consumeAuthorizationTransaction(consumed, {
      state: input.state,
      nonce: input.nonce,
      currentSessionId: input.initialSessionId,
      providerClaimsVerified: true,
      now: now + 2_000
    })).toThrow(/already consumed/u)
  })

  it.each([
    ['state', { state: 'wrong_state_12345678901234567890123456789012' }],
    ['nonce', { nonce: 'wrong_nonce_12345678901234567890123456789012' }],
    ['session', { currentSessionId: 'other_session_12345' }],
    ['expiry', { now: now + 300_001 }]
  ])('rejects a mismatched %s binding', (_name, override) => {
    const transaction = createAuthorizationTransaction(input, [input.redirectUri])
    const callback = {
      state: input.state,
      nonce: input.nonce,
      currentSessionId: input.initialSessionId,
      providerClaimsVerified: true as const,
      now: now + 1_000,
      ...override
    }
    expect(() => consumeAuthorizationTransaction(transaction, callback)).toThrow()
  })

  it('rejects a nonce without independently verified provider claims', () => {
    const transaction = createAuthorizationTransaction(input, [input.redirectUri])
    expect(() => consumeAuthorizationTransaction(transaction, {
      state: input.state,
      nonce: input.nonce,
      currentSessionId: input.initialSessionId,
      providerClaimsVerified: false as unknown as true,
      now: now + 1_000
    })).toThrow(/provider claims/u)
  })
})
