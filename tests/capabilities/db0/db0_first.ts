import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'db0_first',
  kind: 'db0',
  category: 'api',
  description: 'First row via rows[0]',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_first (id INTEGER, name TEXT)')
      await db.exec(`INSERT INTO _test_first VALUES (1, 'a'), (2, 'b')`)
      const result = await db.sql`SELECT * FROM _test_first ORDER BY id`
      await db.exec('DROP TABLE _test_first')
      const first = result.rows?.[0]
      return { supported: !!(first && (first as Record<string, unknown>).id === 1) }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_first')
      }
      catch { /* ignore */ }
      return { supported: false, error: (error as Error).message }
    }
  },
}
