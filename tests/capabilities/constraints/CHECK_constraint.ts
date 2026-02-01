import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'CHECK_constraint',
  category: 'constraints',
  description: 'CHECK constraints',
  async test(driver) {
    try {
      await driver.exec('CREATE TABLE IF NOT EXISTS _test_check (val INTEGER CHECK (val > 0))')
      await driver.exec('INSERT INTO _test_check (val) VALUES (1)')

      let checkEnforced = false
      try {
        await driver.exec('INSERT INTO _test_check (val) VALUES (-1)')
      }
      catch {
        checkEnforced = true
      }

      await driver.exec('DROP TABLE _test_check')
      return { supported: checkEnforced, notes: checkEnforced ? undefined : 'CHECK constraints not enforced' }
    }
    catch (error) {
      try {
        await driver.exec('DROP TABLE _test_check')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
