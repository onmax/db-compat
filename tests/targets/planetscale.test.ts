import { afterAll, describe, expect, it } from 'vitest'
import { createPlanetscaleDriver } from '../drivers/planetscale'
import { capabilities, runTest } from '../runner'

const skipReason = process.env.PLANETSCALE_URL ? undefined : 'PLANETSCALE_URL not set'

describe.skipIf(skipReason)('planetscale', () => {
  const driver = createPlanetscaleDriver(process.env.PLANETSCALE_URL!)
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
