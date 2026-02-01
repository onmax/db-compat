import { afterAll, describe, expect, it } from 'vitest'
import { createPgDriver } from '../drivers/pg'
import { capabilities, runTest } from '../runner'

const skipReason = process.env.POSTGRESQL_URL ? undefined : 'POSTGRESQL_URL not set'

describe.skipIf(skipReason)('postgresql', () => {
  const driver = createPgDriver(process.env.POSTGRESQL_URL!)
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
