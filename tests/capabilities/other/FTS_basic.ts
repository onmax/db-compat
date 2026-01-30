import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'FTS_basic',
  kind: 'sql',
  category: 'fts',
  description: 'Full-text search',
  async test(db) {
    const errors: string[] = []
    try {
      // Try SQLite FTS5
      try {
        await db.exec('CREATE VIRTUAL TABLE _test_fts USING fts5(content)')
        await db.exec(`INSERT INTO _test_fts (content) VALUES ('hello world')`)
        const result = await db.sql`SELECT * FROM _test_fts WHERE _test_fts MATCH 'hello'`
        await db.exec('DROP TABLE _test_fts')
        return { supported: (result.rows?.length ?? 0) >= 1, notes: 'SQLite FTS5' }
      }
      catch (e) { errors.push(`FTS5: ${(e as Error).message}`) }

      // Try PostgreSQL tsvector
      try {
        await db.exec('CREATE TABLE IF NOT EXISTS _test_fts (content TEXT)')
        await db.exec(`INSERT INTO _test_fts (content) VALUES ('hello world')`)
        const result = await db.sql`SELECT * FROM _test_fts WHERE to_tsvector('english', content) @@ to_tsquery('hello')`
        await db.exec('DROP TABLE _test_fts')
        return { supported: (result.rows?.length ?? 0) >= 1, notes: 'PostgreSQL tsvector' }
      }
      catch (e) { errors.push(`tsvector: ${(e as Error).message}`) }

      // Try MySQL FULLTEXT
      try {
        await db.exec('CREATE TABLE IF NOT EXISTS _test_fts (content TEXT, FULLTEXT(content)) ENGINE=InnoDB')
        await db.exec(`INSERT INTO _test_fts (content) VALUES ('hello world')`)
        const result = await db.sql`SELECT * FROM _test_fts WHERE MATCH(content) AGAINST('hello')`
        await db.exec('DROP TABLE _test_fts')
        return { supported: (result.rows?.length ?? 0) >= 1, notes: 'MySQL FULLTEXT' }
      }
      catch (e) { errors.push(`FULLTEXT: ${(e as Error).message}`) }

      return { supported: false, error: errors.join('; ') }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_fts')
      }
      catch { /* ignore */ }
      return { supported: false, error: (error as Error).message }
    }
  },
}
