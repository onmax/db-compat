import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'type_timestamp',
  category: 'types',
  description: 'TIMESTAMP type',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_ts (val TIMESTAMP)')
      await db.exec(`INSERT INTO _test_ts (val) VALUES ('2024-01-15 12:30:00')`)
      const result = await db.sql`SELECT * FROM _test_ts`
      await db.exec('DROP TABLE _test_ts')
      return { supported: (result.rows?.length ?? 0) >= 1 }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_ts')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
