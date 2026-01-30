import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'FTS_ranking',
  kind: 'sql',
  category: 'fts',
  description: 'FTS ranking/scoring',
  async test(db) {
    const errors: string[] = []
    try {
      // Try SQLite FTS5 with bm25
      try {
        await db.exec('CREATE VIRTUAL TABLE _test_fts_rank USING fts5(content)')
        await db.exec(`INSERT INTO _test_fts_rank (content) VALUES ('hello world'), ('hello hello')`)
        const result = await db.sql`SELECT *, bm25(_test_fts_rank) as rank FROM _test_fts_rank WHERE _test_fts_rank MATCH 'hello' ORDER BY rank`
        await db.exec('DROP TABLE _test_fts_rank')
        return { supported: (result.rows?.length ?? 0) >= 2, notes: 'SQLite FTS5 bm25' }
      }
      catch (e) { errors.push(`bm25: ${(e as Error).message}`) }

      // Try PostgreSQL ts_rank
      try {
        await db.exec('CREATE TABLE IF NOT EXISTS _test_fts_rank (content TEXT)')
        await db.exec(`INSERT INTO _test_fts_rank (content) VALUES ('hello world'), ('hello hello')`)
        const result = await db.sql`SELECT *, ts_rank(to_tsvector('english', content), to_tsquery('hello')) as rank FROM _test_fts_rank WHERE to_tsvector('english', content) @@ to_tsquery('hello') ORDER BY rank DESC`
        await db.exec('DROP TABLE _test_fts_rank')
        return { supported: (result.rows?.length ?? 0) >= 2, notes: 'PostgreSQL ts_rank' }
      }
      catch (e) { errors.push(`ts_rank: ${(e as Error).message}`) }

      return { supported: false, error: errors.join('; ') }
    }
    catch (error) {
      try {
        await db.exec('DROP TABLE _test_fts_rank')
      }
      catch { /* ignore */ }
      return { supported: false, error: (error as Error).message }
    }
  },
}
