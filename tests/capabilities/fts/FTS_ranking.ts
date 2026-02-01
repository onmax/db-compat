import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'FTS_ranking',
  category: 'fts',
  description: 'FTS ranking/scoring',
  async test(driver) {
    const errors: string[] = []
    try {
      // Try SQLite FTS5 with bm25
      try {
        await driver.exec('CREATE VIRTUAL TABLE _test_fts_rank USING fts5(content)')
        await driver.exec(`INSERT INTO _test_fts_rank (content) VALUES ('hello world'), ('hello hello')`)
        const result = await driver.query(`SELECT *, bm25(_test_fts_rank) as rank FROM _test_fts_rank WHERE _test_fts_rank MATCH 'hello' ORDER BY rank`)
        await driver.exec('DROP TABLE _test_fts_rank')
        return { supported: result.rows.length >= 2, notes: 'SQLite FTS5 bm25' }
      }
      catch (e) { errors.push(`bm25: ${(e as Error).message}`) }

      // Try PostgreSQL ts_rank
      try {
        await driver.exec('CREATE TABLE IF NOT EXISTS _test_fts_rank (content TEXT)')
        await driver.exec(`INSERT INTO _test_fts_rank (content) VALUES ('hello world'), ('hello hello')`)
        const result = await driver.query(`SELECT *, ts_rank(to_tsvector('english', content), to_tsquery('hello')) as rank FROM _test_fts_rank WHERE to_tsvector('english', content) @@ to_tsquery('hello') ORDER BY rank DESC`)
        await driver.exec('DROP TABLE _test_fts_rank')
        return { supported: result.rows.length >= 2, notes: 'PostgreSQL ts_rank' }
      }
      catch (e) { errors.push(`ts_rank: ${(e as Error).message}`) }

      return { supported: false, error: errors.join('; ') }
    }
    catch (error) {
      try {
        await driver.exec('DROP TABLE _test_fts_rank')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
