import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'UPSERT_replace',
  kind: 'sql',
  category: 'queries',
  description: 'REPLACE INTO (SQLite)',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_replace (id INTEGER PRIMARY KEY, name TEXT)')
      await db.exec(`INSERT INTO _test_replace (id, name) VALUES (1, 'first')`)
      await db.exec(`REPLACE INTO _test_replace (id, name) VALUES (1, 'replaced')`)
      const result = await db.sql`SELECT name FROM _test_replace WHERE id = 1`
      await db.exec('DROP TABLE _test_replace')
      return { supported: (result.rows?.[0] as { name: string })?.name === 'replaced' }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_replace')
      }
      catch {}
      return { supported: false, error: (error as Error).message, notes: 'SQLite/MySQL syntax' }
    }
  },
}
