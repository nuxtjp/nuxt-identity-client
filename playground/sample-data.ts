import type {
  AccountProjection,
  AuthenticatorProjection,
  DeviceProjection
} from '../src/runtime/core'

export const sampleAccount: AccountProjection = {
  displayName: '山田 花子',
  email: 'hanako@example.invalid',
  services: [
    { id: 'nerp', name: 'NERP', status: 'active' },
    { id: 'hibee', name: 'Hibee', status: 'active' }
  ]
}

export const sampleAuthenticators: readonly AuthenticatorProjection[] = [
  {
    id: 'auth-demo-passkey', kind: 'passkey', label: 'Pixel Passkey',
    createdAt: '2026-08-01T02:00:00.000Z', lastUsedAt: '2026-08-03T01:20:00.000Z'
  },
  {
    id: 'auth-demo-app', kind: 'authenticator_app', label: 'Authenticator',
    createdAt: '2026-08-01T02:05:00.000Z'
  }
]

export const sampleDevices: readonly DeviceProjection[] = [
  {
    id: 'device-demo-current', name: 'HAT-DEV', platform: 'Windows / WSL',
    current: true, status: 'active', lastUsedAt: '2026-08-03T01:20:00.000Z'
  },
  {
    id: 'device-demo-phone', name: 'Pixel', platform: 'Android',
    current: false, status: 'active', lastUsedAt: '2026-08-02T12:10:00.000Z'
  }
]
