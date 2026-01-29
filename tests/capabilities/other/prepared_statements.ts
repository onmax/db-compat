import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'prepared_statements',
  category: 'other',
  description: 'Prepared statements',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_prep (id INTEGER, name TEXT)')
      // Using db0's sql template literal uses prepared statements under the hood
      const name = 'test'
      await db.sql`INSERT INTO _test_prep (id, name) VALUES (1, ${name})`
      const result = await db.sql`SELECT * FROM _test_prep WHERE name = ${name}`
      await db.exec('DROP TABLE _test_prep')
      return { supported: (result.rows?.length ?? 0) >= 1 }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_prep')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
