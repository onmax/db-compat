import type { CapabilityTest } from '../../types'
import { normalizeD1Error } from '../../types'

export const capability: CapabilityTest = {
  id: 'COMMIT',
  category: 'transactions',
  description: 'Commit transaction',
  async test(driver) {
    try {
      await driver.exec('CREATE TABLE IF NOT EXISTS _test_commit (id INTEGER PRIMARY KEY)')
      await driver.exec('BEGIN')
      await driver.exec('INSERT INTO _test_commit (id) VALUES (1)')
      await driver.exec('COMMIT')
      const result = await driver.query('SELECT * FROM _test_commit WHERE id = 1')
      await driver.exec('DROP TABLE _test_commit')
      return { supported: result.rows.length >= 1 }
    }
    catch (error) {
      try {
        await driver.exec('DROP TABLE _test_commit')
      }
      catch {}
      return { supported: false, ...normalizeD1Error(error as Error) }
    }
  },
}
