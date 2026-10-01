import { describe, expect, it } from 'vitest'
import {
  createOpaqueValue,
  createPkceMaterial,
  derivePkceChallenge
} from '../src/runtime/core/random'

describe('OIDC entropy and PKCE', () => {
  it('creates unpadded base64url state and nonce values', () => {
    const value = createOpaqueValue(() => new Uint8Array(32).fill(255))
    expect(value).toMatch(/^[A-Za-z0-9_-]{43}$/u)
    expect(value).not.toContain('=')
  })

  it('requires at least 256 bits of entropy', () => {
    expect(() => createOpaqueValue(() => new Uint8Array(31))).toThrow(/32 bytes/u)
  })

  it('derives the RFC 7636 S256 challenge', async () => {
    const verifier = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'
    await expect(derivePkceChallenge(verifier)).resolves.toBe(
      'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM'
    )
  })

  it('generates independent state, nonce, and verifier material', async () => {
    let value = 0
    const random = () => new Uint8Array(32).fill(++value)
    const material = await createPkceMaterial(random)
    expect(new Set([material.state, material.nonce, material.verifier]).size).toBe(3)
    expect(material.challengeMethod).toBe('S256')
  })
})
