import type { CapabilityTest } from '../../types'
import { normalizeD1Error } from '../../types'

export const capability: CapabilityTest = {
  id: 'SAVEPOINT',
  category: 'transactions',
  description: 'Transaction savepoints',
  async test(driver) {
    try {
      await driver.exec('CREATE TABLE IF NOT EXISTS _test_savepoint (id INTEGER PRIMARY KEY)')
      await driver.exec('BEGIN')
      await driver.exec('INSERT INTO _test_savepoint (id) VALUES (1)')
      await driver.exec('SAVEPOINT sp1')
      await driver.exec('INSERT INTO _test_savepoint (id) VALUES (2)')
      await driver.exec('ROLLBACK TO SAVEPOINT sp1')
      await driver.exec('COMMIT')
      const result = await driver.query('SELECT * FROM _test_savepoint')
      await driver.exec('DROP TABLE _test_savepoint')
      return { supported: result.rows.length === 1 && result.rows[0].id === 1 }
    }
    catch (error) {
      try {
        await driver.exec('ROLLBACK')
      }
      catch {}
      try {
        await driver.exec('DROP TABLE _test_savepoint')
      }
      catch {}
      return { supported: false, ...normalizeD1Error(error as Error) }
    }
  },
}
