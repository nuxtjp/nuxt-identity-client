import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { IDENTITY_UI_CONTRACTS } from '../src/runtime/core'

const componentRoot = new URL('../src/runtime/app/components/', import.meta.url)

function sourceName(component: string): string {
  return `${component.replace(/^NuxtJp/u, '')}.vue`
}

describe('identity components', () => {
  it('implements every declared UI contract as an accessible section', async () => {
    for (const contract of IDENTITY_UI_CONTRACTS) {
      const path = fileURLToPath(new URL(sourceName(contract.component), componentRoot))
      const source = await readFile(path, 'utf8')
      expect(source, contract.id).toContain('<section')
      expect(source, contract.id).toContain('aria-labelledby')
      if (contract.liveRegion !== 'off') {
        expect(source, contract.id).toContain(`aria-live="${contract.liveRegion}"`)
      }
    }
  })

  it('keeps credentials, network calls, and browser persistence out of UI code', async () => {
    const sources = await Promise.all(IDENTITY_UI_CONTRACTS.map(async contract => {
      const path = fileURLToPath(new URL(sourceName(contract.component), componentRoot))
      return await readFile(path, 'utf8')
    }))
    const runtime = sources.join('\n')
    expect(runtime).not.toMatch(/\b(?:fetch|\$fetch)\s*\(/u)
    expect(runtime).not.toMatch(/localStorage|sessionStorage|document\.cookie/iu)
    expect(runtime).not.toMatch(/access[_-]?token|refresh[_-]?token|pkce[_-]?verifier/iu)
  })
})
