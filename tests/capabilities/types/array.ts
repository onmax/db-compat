import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'type_array',
  category: 'types',
  description: 'Array column type',
  async test(driver) {
    try {
      await driver.exec('CREATE TABLE IF NOT EXISTS _test_array (val INTEGER[])')
      await driver.exec(`INSERT INTO _test_array (val) VALUES ('{1,2,3}')`)
      const result = await driver.query('SELECT * FROM _test_array')
      await driver.exec('DROP TABLE _test_array')
      return { supported: result.rows.length >= 1 }
    }
    catch (error) {
      try {
        await driver.exec('DROP TABLE _test_array')
      }
      catch {}
      return { supported: false, error: (error as Error).message, notes: 'Array types only supported in PostgreSQL' }
    }
  },
}
