import type { IdentityLocale, SessionProjection } from './types'

export const IDENTITY_BFF_BOUNDARY = Object.freeze({
  beginLogin: { method: 'POST', path: '/api/identity/login' },
  completeCallback: { method: 'GET', path: '/api/identity/callback' },
  readSession: { method: 'GET', path: '/api/identity/session' },
  endSession: { method: 'POST', path: '/api/identity/logout' }
} as const)

export interface BeginLoginRequest {
  readonly locale: IdentityLocale
  readonly returnTo: string
  readonly csrf: string
}

export interface BeginLoginResult {
  readonly redirectTo: string
}

export interface CompleteCallbackRequest {
  readonly code: string
  readonly state: string
}

export interface LogoutRequest {
  readonly csrf: string
}

export interface IdentityBffPort {
  beginLogin(request: BeginLoginRequest): Promise<BeginLoginResult>
  completeCallback(request: CompleteCallbackRequest): Promise<SessionProjection>
  readSession(): Promise<SessionProjection>
  endSession(request: LogoutRequest): Promise<void>
}

export function assertLocalReturnPath(value: string): string {
  if (!value.startsWith('/')
    || value.startsWith('//')
    || value.includes('\\')
    || /[\u0000-\u001f\u007f]/u.test(value)) {
    throw new Error('return path must be an absolute same-origin path')
  }
  const pathname = value.split(/[?#]/u, 1)[0] ?? ''
  const segments = pathname.split('/').filter(Boolean)
  const unsafe = segments.some(segment => {
    try {
      const decoded = decodeURIComponent(segment)
      return decoded === '.'
        || decoded === '..'
        || decoded.includes('/')
        || decoded.includes('\\')
        || /%[0-9a-f]{2}/iu.test(decoded)
        || /[\u0000-\u001f\u007f]/u.test(decoded)
    } catch {
      return true
    }
  })
  if (unsafe) {
    throw new Error('return path must not traverse directories')
  }
  return value
}
