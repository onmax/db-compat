import { afterAll, describe, expect, it } from 'vitest'
import { createBetterSqlite3Driver } from '../drivers/better-sqlite3'
import { capabilities, runTest } from '../runner'

describe('better-sqlite3', () => {
  const driver = createBetterSqlite3Driver()
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
