import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'type_uuid',
  category: 'types',
  description: 'UUID type',
  async test(driver) {
    try {
      await driver.exec('CREATE TABLE IF NOT EXISTS _test_uuid (val UUID)')
      await driver.exec(`INSERT INTO _test_uuid (val) VALUES ('550e8400-e29b-41d4-a716-446655440000')`)
      const result = await driver.query('SELECT * FROM _test_uuid')
      await driver.exec('DROP TABLE _test_uuid')
      return { supported: result.rows.length >= 1 }
    }
    catch (error) {
      try {
        await driver.exec('DROP TABLE _test_uuid')
      }
      catch {}
      return { supported: false, error: (error as Error).message, notes: 'UUID type only native in PostgreSQL' }
    }
  },
}
