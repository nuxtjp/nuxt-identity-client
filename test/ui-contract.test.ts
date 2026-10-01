import { describe, expect, it } from 'vitest'
import {
  IDENTITY_BFF_BOUNDARY,
  IDENTITY_UI_CONTRACTS,
  identityMessage,
  identityMessages
} from '../src/runtime/core'

describe('identity UI contract', () => {
  it('defines the six stable service routes', () => {
    expect(IDENTITY_UI_CONTRACTS.map(route => route.path)).toEqual([
      '/login',
      '/auth/callback',
      '/account',
      '/account/security',
      '/account/devices',
      '/logout'
    ])
    expect(new Set(IDENTITY_UI_CONTRACTS.map(route => route.component)).size).toBe(6)
  })

  it('keeps the browser boundary same-origin and token-free', () => {
    expect(IDENTITY_BFF_BOUNDARY).toEqual({
      beginLogin: { method: 'POST', path: '/api/identity/login' },
      completeCallback: { method: 'GET', path: '/api/identity/callback' },
      readSession: { method: 'GET', path: '/api/identity/session' },
      endSession: { method: 'POST', path: '/api/identity/logout' }
    })
    expect(JSON.stringify(IDENTITY_BFF_BOUNDARY)).not.toMatch(/token|secret|verifier/iu)
  })

  it('defaults to Japanese and provides the same English keys', () => {
    expect(Object.keys(identityMessages.ja).sort()).toEqual(Object.keys(identityMessages.en).sort())
    expect(identityMessage('loginTitle')).toBe('iHATでログイン')
    expect(identityMessage('loginTitle', 'en')).toBe('Sign in with iHAT')
  })

  it('does not expose internal policy terminology to users', () => {
    const visibleText = Object.values(identityMessages).flatMap(Object.values).join(' ')
    expect(visibleText).not.toMatch(/\b(?:PA|Grant|IPC|Workload)\b/u)
  })
})
