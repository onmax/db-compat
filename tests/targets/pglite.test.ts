import { afterAll, describe, expect, it } from 'vitest'
import { createPgliteDriver } from '../drivers/pglite'
import { capabilities, runTest } from '../runner'

describe('pglite', () => {
  const driver = createPgliteDriver()
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
