export type RedirectAllowList = readonly string[]

function validRedirectUri(value: string): boolean {
  if (value.trim() !== value || value.includes('*')) return false
  try {
    const parsed = new URL(value)
    if (parsed.href !== value || parsed.hash || parsed.username || parsed.password) return false
    if (parsed.protocol === 'https:') return true
    if (parsed.protocol !== 'http:') return false
    const port = Number(parsed.port)
    return ['127.0.0.1', '[::1]'].includes(parsed.hostname)
      && parsed.port !== '' && Number.isInteger(port) && port >= 1024
  } catch {
    return false
  }
}

export function defineRedirectAllowList(values: readonly string[]): RedirectAllowList {
  if (values.length === 0 || values.length > 32) {
    throw new Error('redirect allow-list must contain between 1 and 32 entries')
  }
  if (values.some(value => !validRedirectUri(value))) {
    throw new Error('redirect URI must be canonical HTTPS or loopback HTTP without a fragment')
  }
  if (new Set(values).size !== values.length) {
    throw new Error('redirect allow-list must not contain duplicates')
  }
  return Object.freeze([...values])
}

export function isAllowedRedirectUri(
  candidate: string,
  allowList: RedirectAllowList
): boolean {
  return validRedirectUri(candidate) && allowList.includes(candidate)
}

export function assertAllowedRedirectUri(
  candidate: string,
  allowList: RedirectAllowList
): string {
  if (!isAllowedRedirectUri(candidate, allowList)) {
    throw new Error('redirect URI is not allow-listed')
  }
  return candidate
}
