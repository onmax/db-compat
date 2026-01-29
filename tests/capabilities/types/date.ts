import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'type_date',
  category: 'types',
  description: 'DATE type',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_date (val DATE)')
      await db.exec(`INSERT INTO _test_date (val) VALUES ('2024-01-15')`)
      const result = await db.sql`SELECT * FROM _test_date`
      await db.exec('DROP TABLE _test_date')
      return { supported: (result.rows?.length ?? 0) >= 1 }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_date')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
