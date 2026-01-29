import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'UPSERT_on_conflict',
  category: 'queries',
  description: 'ON CONFLICT clause (PostgreSQL/SQLite)',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_upsert (id INTEGER PRIMARY KEY, name TEXT)')
      await db.exec(`INSERT INTO _test_upsert (id, name) VALUES (1, 'first')`)
      await db.exec(`INSERT INTO _test_upsert (id, name) VALUES (1, 'second') ON CONFLICT(id) DO UPDATE SET name = 'updated'`)
      const result = await db.sql`SELECT name FROM _test_upsert WHERE id = 1`
      await db.exec('DROP TABLE _test_upsert')
      return { supported: (result.rows?.[0] as { name: string })?.name === 'updated' }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_upsert')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
