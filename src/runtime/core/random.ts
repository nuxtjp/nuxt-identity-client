import { Buffer } from 'node:buffer'

export type RandomSource = (length: number) => Uint8Array

export interface PkceMaterial {
  readonly state: string
  readonly nonce: string
  readonly verifier: string
  readonly challenge: string
  readonly challengeMethod: 'S256'
}

function base64Url(value: Uint8Array): string {
  return Buffer.from(value).toString('base64url')
}

export const secureRandom: RandomSource = (length) => {
  const value = new Uint8Array(length)
  globalThis.crypto.getRandomValues(value)
  return value
}

export function createOpaqueValue(
  random: RandomSource = secureRandom,
  byteLength = 32
): string {
  if (!Number.isInteger(byteLength) || byteLength < 32 || byteLength > 96) {
    throw new Error('opaque values require between 32 and 96 bytes')
  }
  const value = random(byteLength)
  if (!(value instanceof Uint8Array) || value.byteLength !== byteLength) {
    throw new Error(`random source must return exactly ${byteLength} bytes`)
  }
  return base64Url(value)
}

export async function derivePkceChallenge(verifier: string): Promise<string> {
  if (!/^[A-Za-z0-9._~-]{43,128}$/u.test(verifier)) {
    throw new Error('PKCE verifier must be 43 to 128 unreserved characters')
  }
  const encoded = new TextEncoder().encode(verifier)
  const digest = await globalThis.crypto.subtle.digest('SHA-256', encoded)
  return base64Url(new Uint8Array(digest))
}

export async function createPkceMaterial(
  random: RandomSource = secureRandom
): Promise<PkceMaterial> {
  const state = createOpaqueValue(random)
  const nonce = createOpaqueValue(random)
  const verifier = createOpaqueValue(random)
  const challenge = await derivePkceChallenge(verifier)
  return Object.freeze({ state, nonce, verifier, challenge, challengeMethod: 'S256' })
}
