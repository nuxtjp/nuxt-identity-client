import { describe, expect, it } from 'vitest'
import { assertLocalReturnPath } from '../src/runtime/core'

describe('same-origin BFF return paths', () => {
  it('accepts an absolute local path with a query', () => {
    expect(assertLocalReturnPath('/account/devices?from=login')).toBe(
      '/account/devices?from=login'
    )
  })

  it.each([
    'https://evil.example/account',
    '//evil.example/account',
    '/account\\devices',
    '/account/../admin',
    '/account/%2e%2e/admin',
    '/account/%5cadmin',
    '/account/%252F%252Fevil.example',
    '/account\u0000'
  ])('rejects a non-local or ambiguous return path: %s', value => {
    expect(() => assertLocalReturnPath(value)).toThrow(/return path/u)
  })
})
