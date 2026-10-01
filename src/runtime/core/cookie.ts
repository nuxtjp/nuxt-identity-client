import { assertSessionId } from './session'

export interface SessionCookiePolicy {
  readonly name: '__Host-ihat_session'
  readonly httpOnly: true
  readonly secure: true
  readonly sameSite: 'Lax'
  readonly path: '/'
  readonly maxAgeSeconds: number
}

export const SESSION_COOKIE_POLICY: SessionCookiePolicy = Object.freeze({
  name: '__Host-ihat_session',
  httpOnly: true,
  secure: true,
  sameSite: 'Lax',
  path: '/',
  maxAgeSeconds: 28_800
})

export function sessionCookieHeader(sessionId: string): string {
  assertSessionId(sessionId)
  const policy = SESSION_COOKIE_POLICY
  return [
    `${policy.name}=${sessionId}`,
    `Path=${policy.path}`,
    `Max-Age=${policy.maxAgeSeconds}`,
    'HttpOnly',
    'Secure',
    `SameSite=${policy.sameSite}`
  ].join('; ')
}

export function expiredSessionCookieHeader(): string {
  return [
    `${SESSION_COOKIE_POLICY.name}=`,
    'Path=/',
    'Max-Age=0',
    'HttpOnly',
    'Secure',
    'SameSite=Lax'
  ].join('; ')
}
