import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'window_functions',
  kind: 'sql',
  category: 'queries',
  description: 'Window functions (ROW_NUMBER, etc.)',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_window (id INTEGER, val INTEGER)')
      await db.exec('INSERT INTO _test_window VALUES (1, 10), (2, 20), (3, 30)')
      const result = await db.sql`SELECT id, val, ROW_NUMBER() OVER (ORDER BY id) as rn FROM _test_window`
      await db.exec('DROP TABLE _test_window')
      return { supported: (result.rows?.length ?? 0) >= 3 }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_window')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
