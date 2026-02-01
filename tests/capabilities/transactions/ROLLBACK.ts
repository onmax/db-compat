import type { CapabilityTest } from '../../types'
import { normalizeD1Error } from '../../types'

export const capability: CapabilityTest = {
  id: 'ROLLBACK',
  category: 'transactions',
  description: 'Rollback transaction',
  async test(driver) {
    try {
      await driver.exec('CREATE TABLE IF NOT EXISTS _test_rollback (id INTEGER PRIMARY KEY)')
      await driver.exec('BEGIN')
      await driver.exec('INSERT INTO _test_rollback (id) VALUES (1)')
      await driver.exec('ROLLBACK')
      const result = await driver.query('SELECT * FROM _test_rollback WHERE id = 1')
      await driver.exec('DROP TABLE _test_rollback')
      return { supported: result.rows.length < 1 }
    }
    catch (error) {
      try {
        await driver.exec('DROP TABLE _test_rollback')
      }
      catch {}
      return { supported: false, ...normalizeD1Error(error as Error) }
    }
  },
}
