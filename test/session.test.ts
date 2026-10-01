import { describe, expect, it } from 'vitest'
import {
  SESSION_COOKIE_POLICY,
  sessionCookieHeader
} from '../src/runtime/core/cookie'
import { planSessionRotation } from '../src/runtime/core/session'

describe('BFF session controls', () => {
  it('uses a host-only secure session cookie', () => {
    expect(SESSION_COOKIE_POLICY).toEqual({
      name: '__Host-ihat_session',
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      path: '/',
      maxAgeSeconds: 28_800
    })
    expect(sessionCookieHeader('new_session_1234567890')).not.toContain('Domain=')
    expect(sessionCookieHeader('new_session_1234567890')).toContain('HttpOnly; Secure')
  })

  it('rotates rather than reuses the pre-authentication session', () => {
    expect(planSessionRotation(
      'preauth_session_1234',
      'preauth_session_1234',
      'authenticated_session_9876'
    )).toEqual({
      revokeSessionId: 'preauth_session_1234',
      issueSessionId: 'authenticated_session_9876'
    })
  })

  it('rejects stale or reused session identifiers', () => {
    expect(() => planSessionRotation('expected_session_1', 'stale_session_234', 'new_session_123456'))
      .toThrow(/changed/u)
    expect(() => planSessionRotation('same_session_12345', 'same_session_12345', 'same_session_12345'))
      .toThrow(/fresh/u)
  })

  it('rejects unsafe values before producing cookie syntax', () => {
    expect(() => sessionCookieHeader('contains whitespace')).toThrow(/session ID/u)
    expect(() => sessionCookieHeader('short')).toThrow(/session ID/u)
  })
})
