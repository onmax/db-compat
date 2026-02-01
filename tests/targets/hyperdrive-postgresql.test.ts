import type { HyperdriveBinding } from '../drivers/hyperdrive'
import type { TestDriver } from '../drivers/types'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createHyperdrivePgDriver } from '../drivers/hyperdrive'
import { capabilities, runTest } from '../runner'

const skipReason = typeof (globalThis as Record<string, unknown>).HYPERDRIVE_PG === 'undefined' ? 'Hyperdrive PostgreSQL binding not available' : undefined

describe.skipIf(skipReason)('hyperdrive-postgresql', () => {
  let driver: TestDriver
  beforeAll(() => {
    driver = createHyperdrivePgDriver((globalThis as unknown as Record<string, HyperdriveBinding>).HYPERDRIVE_PG)
  })
  afterAll(async () => {
    await driver?.close()
  })

  for (const cap of capabilities) {
    it(cap.id, async () => {
      const result = await runTest(driver, cap.id as Parameters<typeof runTest>[1])
      expect(result).toHaveProperty('supported')
    })
  }
})
