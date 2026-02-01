import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'type_bigint',
  category: 'types',
  description: 'BIGINT type',
  async test(driver) {
    try {
      await driver.exec('CREATE TABLE IF NOT EXISTS _test_bigint (val BIGINT)')
      await driver.exec('INSERT INTO _test_bigint (val) VALUES (9223372036854775807)')
      const result = await driver.query('SELECT * FROM _test_bigint')
      await driver.exec('DROP TABLE _test_bigint')
      return { supported: result.rows.length >= 1 }
    }
    catch (error) {
      try {
        await driver.exec('DROP TABLE _test_bigint')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
