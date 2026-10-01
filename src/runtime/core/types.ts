export type IdentityLocale = 'ja' | 'en'
export type AuthenticatorKind =
  | 'passkey'
  | 'authenticator_app'
  | 'security_key'
  | 'totp'

export interface ServiceSummary {
  readonly id: string
  readonly name: string
  readonly status: 'active' | 'suspended'
}

export interface AccountProjection {
  readonly displayName: string
  readonly email?: string
  readonly services: readonly ServiceSummary[]
}

export interface AuthenticatorProjection {
  readonly id: string
  readonly kind: AuthenticatorKind
  readonly label: string
  readonly createdAt: string
  readonly lastUsedAt?: string
}

export interface DeviceProjection {
  readonly id: string
  readonly name: string
  readonly platform: string
  readonly current: boolean
  readonly status: 'active' | 'revoked'
  readonly lastUsedAt: string
}

export interface SessionProjection {
  readonly authenticated: boolean
  readonly account: AccountProjection | null
  readonly expiresAt?: string
}

export type IdentityUiIntent =
  | { readonly type: 'begin_login' }
  | { readonly type: 'retry_callback' }
  | { readonly type: 'add_passkey' }
  | { readonly type: 'add_authenticator_app' }
  | { readonly type: 'remove_authenticator'; readonly authenticatorId: string }
  | { readonly type: 'rename_device'; readonly deviceId: string }
  | { readonly type: 'revoke_device'; readonly deviceId: string }
  | { readonly type: 'confirm_logout' }
  | { readonly type: 'cancel_logout' }
