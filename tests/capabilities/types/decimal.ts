import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'type_decimal',
  category: 'types',
  description: 'DECIMAL/NUMERIC type',
  async test(driver) {
    try {
      await driver.exec('CREATE TABLE IF NOT EXISTS _test_decimal (val DECIMAL(10,2))')
      await driver.exec('INSERT INTO _test_decimal (val) VALUES (12345.67)')
      const result = await driver.query('SELECT * FROM _test_decimal')
      await driver.exec('DROP TABLE _test_decimal')
      return { supported: result.rows.length >= 1 }
    }
    catch (error) {
      try {
        await driver.exec('DROP TABLE _test_decimal')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
