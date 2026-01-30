import { createDatabase } from 'db0'
import hyperdriveMysql from 'db0/connectors/cloudflare-hyperdrive-mysql'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { capabilities, runTest } from '../runner'

// Hyperdrive requires Cloudflare Workers environment with Hyperdrive binding
const skipReason = typeof (globalThis as Record<string, unknown>).HYPERDRIVE_MYSQL === 'undefined' ? 'Hyperdrive MySQL binding not available' : undefined

describe.skipIf(skipReason)('db0-hyperdrive-mysql', () => {
  const db = createDatabase(hyperdriveMysql({ bindingName: 'HYPERDRIVE_MYSQL' }))

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
