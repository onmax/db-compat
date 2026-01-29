import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'type_uuid',
  category: 'types',
  description: 'UUID type',
  async test(db) {
    try {
      await db.exec('CREATE TABLE IF NOT EXISTS _test_uuid (val UUID)')
      await db.exec(`INSERT INTO _test_uuid (val) VALUES ('550e8400-e29b-41d4-a716-446655440000')`)
      const result = await db.sql`SELECT * FROM _test_uuid`
      await db.exec('DROP TABLE _test_uuid')
      return { supported: (result.rows?.length ?? 0) >= 1 }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_uuid')
      }
      catch {}
      return { supported: false, error: (error as Error).message, notes: 'UUID type only native in PostgreSQL' }
    }
  },
}
