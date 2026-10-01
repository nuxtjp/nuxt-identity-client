const SESSION_ID = /^[A-Za-z0-9_-]{16,128}$/u

export interface SessionRotationPlan {
  readonly revokeSessionId: string
  readonly issueSessionId: string
}

export function assertSessionId(value: string): string {
  if (!SESSION_ID.test(value)) {
    throw new Error('session ID must be 16 to 128 base64url characters')
  }
  return value
}

export function secureStringEqual(left: string, right: string): boolean {
  const length = Math.max(left.length, right.length)
  let difference = left.length ^ right.length
  for (let index = 0; index < length; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0)
  }
  return difference === 0
}

export function planSessionRotation(
  transactionSessionId: string,
  currentSessionId: string,
  authenticatedSessionId: string
): SessionRotationPlan {
  for (const value of [transactionSessionId, currentSessionId, authenticatedSessionId]) {
    assertSessionId(value)
  }
  if (!secureStringEqual(transactionSessionId, currentSessionId)) {
    throw new Error('pre-authentication session changed during the authorization flow')
  }
  if (secureStringEqual(currentSessionId, authenticatedSessionId)) {
    throw new Error('authenticated session must use a fresh identifier')
  }
  return Object.freeze({
    revokeSessionId: currentSessionId,
    issueSessionId: authenticatedSessionId
  })
}
