import { createDatabase } from 'db0'
import cloudflareD1 from 'db0/connectors/cloudflare-d1'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { capabilities, runTest } from '../runner'

// D1 requires Cloudflare Workers environment with D1 binding
const skipReason = typeof (globalThis as Record<string, unknown>).D1_DATABASE === 'undefined' ? 'D1 binding not available' : undefined

describe.skipIf(skipReason)('db0-cloudflare-d1', () => {
  const db = createDatabase(cloudflareD1({ bindingName: 'D1_DATABASE' }))

  beforeAll(() => {})

  afterAll(async () => {})

  for (const cap of capabilities) {
    it(cap.id, async () => {
      const result = await runTest(db, cap.id as Parameters<typeof runTest>[1])
      expect(result.error).toBeUndefined()
      expect(result.supported).toBe(true)
    })
  }
})
