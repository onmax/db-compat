import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'type_decimal',
  kind: 'sql',
  category: 'types',
  description: 'DECIMAL/NUMERIC type',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_decimal (val DECIMAL(10,2))')
      await db.exec('INSERT INTO _test_decimal (val) VALUES (12345.67)')
      const result = await db.sql`SELECT * FROM _test_decimal`
      await db.exec('DROP TABLE _test_decimal')
      return { supported: (result.rows?.length ?? 0) >= 1 }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_decimal')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
