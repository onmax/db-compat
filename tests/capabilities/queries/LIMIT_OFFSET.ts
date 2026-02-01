import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'LIMIT_OFFSET',
  category: 'queries',
  description: 'LIMIT and OFFSET',
  async test(driver) {
    try {
      await driver.exec('CREATE TABLE IF NOT EXISTS _test_limit (id INTEGER)')
      await driver.exec('INSERT INTO _test_limit VALUES (1), (2), (3), (4), (5)')
      const result = await driver.query<{ id: number }>('SELECT id FROM _test_limit ORDER BY id LIMIT 2 OFFSET 2')
      await driver.exec('DROP TABLE _test_limit')
      return { supported: result.rows.length >= 2 && result.rows[0].id === 3 }
    }
    catch (error) {
      try {
        await driver.exec('DROP TABLE _test_limit')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
