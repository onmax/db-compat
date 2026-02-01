import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'FTS_basic',
  category: 'fts',
  description: 'Full-text search',
  async test(driver) {
    const errors: string[] = []
    try {
      // Try SQLite FTS5
      try {
        await driver.exec('CREATE VIRTUAL TABLE _test_fts USING fts5(content)')
        await driver.exec(`INSERT INTO _test_fts (content) VALUES ('hello world')`)
        const result = await driver.query(`SELECT * FROM _test_fts WHERE _test_fts MATCH 'hello'`)
        await driver.exec('DROP TABLE _test_fts')
        return { supported: result.rows.length >= 1, notes: 'SQLite FTS5' }
      }
      catch (e) { errors.push(`FTS5: ${(e as Error).message}`) }

      // Try PostgreSQL tsvector
      try {
        await driver.exec('CREATE TABLE IF NOT EXISTS _test_fts (content TEXT)')
        await driver.exec(`INSERT INTO _test_fts (content) VALUES ('hello world')`)
        const result = await driver.query(`SELECT * FROM _test_fts WHERE to_tsvector('english', content) @@ to_tsquery('hello')`)
        await driver.exec('DROP TABLE _test_fts')
        return { supported: result.rows.length >= 1, notes: 'PostgreSQL tsvector' }
      }
      catch (e) { errors.push(`tsvector: ${(e as Error).message}`) }

      // Try MySQL FULLTEXT
      try {
        await driver.exec('CREATE TABLE IF NOT EXISTS _test_fts (content TEXT, FULLTEXT(content)) ENGINE=InnoDB')
        await driver.exec(`INSERT INTO _test_fts (content) VALUES ('hello world')`)
        const result = await driver.query(`SELECT * FROM _test_fts WHERE MATCH(content) AGAINST('hello')`)
        await driver.exec('DROP TABLE _test_fts')
        return { supported: result.rows.length >= 1, notes: 'MySQL FULLTEXT' }
      }
      catch (e) { errors.push(`FULLTEXT: ${(e as Error).message}`) }

      return { supported: false, error: errors.join('; ') }
    }
    catch (error) {
      try {
        await driver.exec('DROP TABLE _test_fts')
      }
      catch {}
      return { supported: false, error: (error as Error).message }
    }
  },
}
