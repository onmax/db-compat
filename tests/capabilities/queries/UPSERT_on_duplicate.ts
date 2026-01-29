import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'UPSERT_on_duplicate',
  category: 'queries',
  description: 'ON DUPLICATE KEY (MySQL)',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_dup (id INTEGER PRIMARY KEY, name TEXT)')
      await db.exec(`INSERT INTO _test_dup (id, name) VALUES (1, 'first')`)
      await db.exec(`INSERT INTO _test_dup (id, name) VALUES (1, 'second') ON DUPLICATE KEY UPDATE name = 'updated'`)
      const result = await db.sql`SELECT name FROM _test_dup WHERE id = 1`
      await db.exec('DROP TABLE _test_dup')
      return { supported: (result.rows?.[0] as { name: string })?.name === 'updated' }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_dup')
      }
      catch {}
      return { supported: false, error: (error as Error).message, notes: 'MySQL-specific syntax' }
    }
  },
}
