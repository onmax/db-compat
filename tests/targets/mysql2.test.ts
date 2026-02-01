import type { TestDriver } from '../drivers/types'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createMysql2Driver } from '../drivers/mysql2'
import { capabilities, runTest } from '../runner'

const skipReason = process.env.MYSQL_URL ? undefined : 'MYSQL_URL not set'

describe.skipIf(skipReason)('mysql2', () => {
  let driver: TestDriver
  beforeAll(async () => {
    driver = await createMysql2Driver(process.env.MYSQL_URL!)
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
