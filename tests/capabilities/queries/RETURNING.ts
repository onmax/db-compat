import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'RETURNING',
  category: 'queries',
  description: 'RETURNING clause',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_returning (id INTEGER PRIMARY KEY, name TEXT)')
      // Provide explicit id for PostgreSQL compatibility
      const result = await db.sql`INSERT INTO _test_returning (id, name) VALUES (1, 'test') RETURNING id, name`
      await db.exec('DROP TABLE _test_returning')
      return { supported: (result.rows?.length ?? 0) === 1 }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_returning')
      }
      catch {}
      return { supported: false, error: (error as Error).message, notes: 'Not supported in MySQL' }
    }
  },
}
