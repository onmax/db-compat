import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'type_bigint',
  kind: 'sql',
  category: 'types',
  description: 'BIGINT type',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_bigint (val BIGINT)')
      await db.exec('INSERT INTO _test_bigint (val) VALUES (9223372036854775807)')
      const result = await db.sql`SELECT * FROM _test_bigint`
      await db.exec('DROP TABLE _test_bigint')
      return { supported: (result.rows?.length ?? 0) >= 1 }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_bigint')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
