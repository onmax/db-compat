import type { TestDriver } from '../drivers/types'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createSqlite3Driver } from '../drivers/sqlite3'
import { capabilities, runTest } from '../runner'

describe('sqlite3', () => {
  let driver: TestDriver
  beforeAll(async () => {
    driver = await createSqlite3Driver()
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
