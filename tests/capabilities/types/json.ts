import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'type_json',
  category: 'types',
  description: 'JSON/JSONB column type',
  async test(driver) {
    try {
      try {
        await driver.exec('CREATE TABLE IF NOT EXISTS _test_json (val JSONB)')
      }
      catch {
        await driver.exec('CREATE TABLE IF NOT EXISTS _test_json (val JSON)')
      }
      await driver.exec(`INSERT INTO _test_json (val) VALUES ('{"key": "value"}')`)
      const result = await driver.query('SELECT * FROM _test_json')
      await driver.exec('DROP TABLE _test_json')
      return { supported: result.rows.length >= 1 }
    }
    catch (error) {
      try {
        await driver.exec('DROP TABLE _test_json')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
