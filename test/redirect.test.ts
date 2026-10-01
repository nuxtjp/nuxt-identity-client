import { describe, expect, it } from 'vitest'
import {
  assertAllowedRedirectUri,
  defineRedirectAllowList,
  isAllowedRedirectUri
} from '../src/runtime/core/redirect'

const allowed = defineRedirectAllowList([
  'https://service.example/auth/callback',
  'http://127.0.0.1:3000/auth/callback'
])

describe('redirect URI allow-list', () => {
  it('accepts only exact configured redirect URIs', () => {
    expect(isAllowedRedirectUri('https://service.example/auth/callback', allowed)).toBe(true)
    expect(isAllowedRedirectUri('https://service.example/auth/callback/', allowed)).toBe(false)
    expect(isAllowedRedirectUri('https://evil.example/auth/callback', allowed)).toBe(false)
  })

  it('rejects fragments, credentials, wildcard hosts, and insecure remote origins', () => {
    for (const uri of [
      'https://service.example/auth/callback#token',
      'https://user@service.example/auth/callback',
      'https://*.example/auth/callback',
      'http://service.example/auth/callback',
      'http://localhost:3000/auth/callback',
      'http://127.0.0.1/auth/callback'
    ]) expect(() => defineRedirectAllowList([uri])).toThrow()
  })

  it('accepts HTTPS and loopback HTTP without normalizing an input match', () => {
    expect(allowed).toEqual([
      'https://service.example/auth/callback',
      'http://127.0.0.1:3000/auth/callback'
    ])
  })

  it('fails closed for a candidate outside the list', () => {
    expect(() => assertAllowedRedirectUri('https://other.example/callback', allowed))
      .toThrow(/not allow-listed/u)
  })
})
