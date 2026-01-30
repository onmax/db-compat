import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'db0_sql_template',
  kind: 'db0',
  category: 'api',
  description: 'sql tagged template for params',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_sql (id INTEGER, name TEXT)')
      const name = 'test'
      await db.sql`INSERT INTO _test_sql (id, name) VALUES (1, ${name})`
      const result = await db.sql`SELECT * FROM _test_sql WHERE name = ${name}`
      await db.exec('DROP TABLE _test_sql')
      return { supported: (result.rows?.length ?? 0) >= 1 }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_sql')
      }
      catch { /* ignore */ }
      return { supported: false, error: (error as Error).message }
    }
  },
}
