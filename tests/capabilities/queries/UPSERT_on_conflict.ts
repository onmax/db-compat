import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'UPSERT_on_conflict',
  category: 'queries',
  description: 'ON CONFLICT clause (PostgreSQL/SQLite)',
  async test(driver) {
    try {
      await driver.exec('CREATE TABLE IF NOT EXISTS _test_upsert (id INTEGER PRIMARY KEY, name TEXT)')
      await driver.exec(`INSERT INTO _test_upsert (id, name) VALUES (1, 'first')`)
      await driver.exec(`INSERT INTO _test_upsert (id, name) VALUES (1, 'second') ON CONFLICT(id) DO UPDATE SET name = 'updated'`)
      const result = await driver.query<{ name: string }>('SELECT name FROM _test_upsert WHERE id = 1')
      await driver.exec('DROP TABLE _test_upsert')
      return { supported: result.rows[0]?.name === 'updated' }
    }
    catch (error) {
      try {
        await driver.exec('DROP TABLE _test_upsert')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
