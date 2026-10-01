import type { AuthenticatorKind, IdentityLocale } from './types'

export const identityMessages = {
  ja: {
    loginTitle: 'iHATでログイン',
    loginDescription: '認証アプリまたはPasskeyを使用して続行します。',
    loginAction: 'ログイン', callbackTitle: 'ログインを確認しています',
    callbackPending: 'この画面を閉じずにお待ちください。',
    callbackSuccess: 'ログインしました。', callbackFailed: 'ログインを完了できませんでした。',
    retry: 'もう一度試す', accountTitle: 'アカウント', email: 'メールアドレス',
    services: '利用中のサービス', noServices: '利用中のサービスはありません。',
    securityTitle: '認証方法', passkey: 'Passkey', authenticator_app: '認証アプリ',
    security_key: 'セキュリティキー', totp: '確認コード', addPasskey: 'Passkeyを追加',
    addAuthenticator: '認証アプリを追加', remove: '削除', noAuthenticators: '認証方法がありません。',
    devicesTitle: '登録済み端末', currentDevice: '現在の端末', lastUsed: '最終利用',
    rename: '名前を変更', revoke: 'この端末を解除', noDevices: '登録済み端末はありません。',
    logoutTitle: 'ログアウト', logoutDescription: 'この端末のセッションを終了します。',
    logoutAction: 'ログアウトする', cancel: 'キャンセル'
  },
  en: {
    loginTitle: 'Sign in with iHAT',
    loginDescription: 'Continue with an authenticator app or passkey.',
    loginAction: 'Sign in', callbackTitle: 'Checking your sign-in',
    callbackPending: 'Keep this page open while we finish.',
    callbackSuccess: 'You are signed in.', callbackFailed: 'We could not complete sign-in.',
    retry: 'Try again', accountTitle: 'Account', email: 'Email address',
    services: 'Your services', noServices: 'You have no active services.',
    securityTitle: 'Sign-in methods', passkey: 'Passkey', authenticator_app: 'Authenticator app',
    security_key: 'Security key', totp: 'Verification code', addPasskey: 'Add passkey',
    addAuthenticator: 'Add authenticator app', remove: 'Remove',
    noAuthenticators: 'No sign-in methods are registered.', devicesTitle: 'Registered devices',
    currentDevice: 'Current device', lastUsed: 'Last used', rename: 'Rename',
    revoke: 'Remove this device', noDevices: 'No devices are registered.',
    logoutTitle: 'Sign out', logoutDescription: 'End the session on this device.',
    logoutAction: 'Sign out', cancel: 'Cancel'
  }
} as const

export type IdentityMessageKey = keyof typeof identityMessages.ja

export function identityMessage(
  key: IdentityMessageKey,
  locale: IdentityLocale = 'ja'
): string {
  return identityMessages[locale][key]
}

export function authenticatorKindMessage(
  kind: AuthenticatorKind,
  locale: IdentityLocale = 'ja'
): string {
  return identityMessage(kind, locale)
}
