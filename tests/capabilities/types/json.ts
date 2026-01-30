import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'type_json',
  kind: 'sql',
  category: 'types',
  description: 'JSON/JSONB column type',
  async test(db) {
    try {
      // Try JSONB first (PostgreSQL), fall back to JSON
      try {
        await db.exec('CREATE TABLE IF NOT EXISTS _test_json (val JSONB)')
      }
      catch {
        await db.exec('CREATE TABLE IF NOT EXISTS _test_json (val JSON)')
      }
      await db.exec(`INSERT INTO _test_json (val) VALUES ('{"key": "value"}')`)
      const result = await db.sql`SELECT * FROM _test_json`
      await db.exec('DROP TABLE _test_json')
      return { supported: (result.rows?.length ?? 0) >= 1 }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_json')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
