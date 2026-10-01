export type IdentityPageId =
  | 'login'
  | 'callback'
  | 'account'
  | 'security'
  | 'devices'
  | 'logout'

export interface IdentityUiContract {
  readonly id: IdentityPageId
  readonly path: string
  readonly component: string
  readonly access: 'public' | 'system' | 'authenticated'
  readonly liveRegion: 'off' | 'polite' | 'assertive'
}

export const IDENTITY_UI_CONTRACTS: readonly IdentityUiContract[] = Object.freeze([
  {
    id: 'login', path: '/login', component: 'NuxtJpIdentityLoginCard',
    access: 'public', liveRegion: 'polite'
  },
  {
    id: 'callback', path: '/auth/callback', component: 'NuxtJpIdentityCallbackStatus',
    access: 'system', liveRegion: 'polite'
  },
  {
    id: 'account', path: '/account', component: 'NuxtJpIdentityAccountPanel',
    access: 'authenticated', liveRegion: 'off'
  },
  {
    id: 'security', path: '/account/security', component: 'NuxtJpIdentitySecurityPanel',
    access: 'authenticated', liveRegion: 'polite'
  },
  {
    id: 'devices', path: '/account/devices', component: 'NuxtJpIdentityDeviceList',
    access: 'authenticated', liveRegion: 'polite'
  },
  {
    id: 'logout', path: '/logout', component: 'NuxtJpIdentityLogoutPanel',
    access: 'authenticated', liveRegion: 'assertive'
  }
])
