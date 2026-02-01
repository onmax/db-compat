import type { TestDriver } from '../drivers/types'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { capabilities, runTest } from '../runner'

const skipReason = typeof (globalThis as Record<string, unknown>).Bun === 'undefined' ? 'Bun runtime required' : undefined

describe.skipIf(skipReason)('bun-sqlite', () => {
  let driver: TestDriver
  beforeAll(async () => {
    const { createBunSqliteDriver } = await import('../drivers/bun-sqlite')
    driver = createBunSqliteDriver()
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
