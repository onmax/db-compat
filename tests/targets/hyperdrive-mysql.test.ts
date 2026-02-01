import type { HyperdriveBinding } from '../drivers/hyperdrive'
import type { TestDriver } from '../drivers/types'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createHyperdriveMysqlDriver } from '../drivers/hyperdrive'
import { capabilities, runTest } from '../runner'

const skipReason = typeof (globalThis as Record<string, unknown>).HYPERDRIVE_MYSQL === 'undefined' ? 'Hyperdrive MySQL binding not available' : undefined

describe.skipIf(skipReason)('hyperdrive-mysql', () => {
  let driver: TestDriver
  beforeAll(async () => {
    driver = await createHyperdriveMysqlDriver((globalThis as unknown as Record<string, HyperdriveBinding>).HYPERDRIVE_MYSQL)
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
