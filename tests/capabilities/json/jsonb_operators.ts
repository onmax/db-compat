import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'jsonb_operators',
  category: 'json',
  description: 'PostgreSQL JSONB operators (@>, ->, etc.)',
  async test(driver) {
    try {
      const result = await driver.query(`SELECT '{"a": 1, "b": 2}'::jsonb @> '{"a": 1}'::jsonb as val`)
      return { supported: result.rows.length >= 1 }
    }
    catch (error) {
      return { supported: false, error: (error as Error).message, notes: 'PostgreSQL-specific feature' }
    }
  },
}
