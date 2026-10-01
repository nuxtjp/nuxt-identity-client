import type { IdentityLocale } from '../../src/runtime/core'

export function useDemoLocale() {
  return useState<IdentityLocale>('identity-demo-locale', () => 'ja')
}
