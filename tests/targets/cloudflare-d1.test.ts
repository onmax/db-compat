import type { D1Database } from '../drivers/cloudflare-d1'
import { afterAll, describe, expect, it } from 'vitest'
import { createD1Driver } from '../drivers/cloudflare-d1'
import { capabilities, runTest } from '../runner'

const skipReason = typeof (globalThis as Record<string, unknown>).D1_DATABASE === 'undefined' ? 'D1 binding not available' : undefined

describe.skipIf(skipReason)('cloudflare-d1', () => {
  const driver = createD1Driver((globalThis as unknown as Record<string, D1Database>).D1_DATABASE)
  afterAll(async () => {
    await driver.close()
  })

  for (const cap of capabilities) {
    it(cap.id, async () => {
      const result = await runTest(driver, cap.id as Parameters<typeof runTest>[1])
      expect(result).toHaveProperty('supported')
    })
  }
})
