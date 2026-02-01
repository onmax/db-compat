import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'type_date',
  category: 'types',
  description: 'DATE type',
  async test(driver) {
    try {
      await driver.exec('CREATE TABLE IF NOT EXISTS _test_date (val DATE)')
      await driver.exec(`INSERT INTO _test_date (val) VALUES ('2024-01-15')`)
      const result = await driver.query('SELECT * FROM _test_date')
      await driver.exec('DROP TABLE _test_date')
      return { supported: result.rows.length >= 1 }
    }
    catch (error) {
      try {
        await driver.exec('DROP TABLE _test_date')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
