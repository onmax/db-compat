import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'type_boolean',
  category: 'types',
  description: 'Boolean type support',
  async test(driver) {
    try {
      await driver.exec('CREATE TABLE IF NOT EXISTS _test_bool (val BOOLEAN)')
      await driver.exec('INSERT INTO _test_bool (val) VALUES (TRUE)')
      await driver.exec('INSERT INTO _test_bool (val) VALUES (FALSE)')
      const result = await driver.query('SELECT * FROM _test_bool')
      await driver.exec('DROP TABLE _test_bool')
      return { supported: result.rows.length >= 2 }
    }
    catch (error) {
      try {
        await driver.exec('DROP TABLE _test_bool')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
