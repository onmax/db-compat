import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'subqueries',
  category: 'queries',
  description: 'Subqueries',
  async test(driver) {
    try {
      await driver.exec('CREATE TABLE IF NOT EXISTS _test_sub (id INTEGER, val INTEGER)')
      await driver.exec('INSERT INTO _test_sub VALUES (1, 10), (2, 20), (3, 30)')
      const result = await driver.query<{ id: number }>('SELECT * FROM _test_sub WHERE val > (SELECT AVG(val) FROM _test_sub)')
      await driver.exec('DROP TABLE _test_sub')
      return { supported: result.rows.length >= 1 && result.rows[0].id === 3 }
    }
    catch (error) {
      try {
        await driver.exec('DROP TABLE _test_sub')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
