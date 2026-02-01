import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'JSON_EXTRACT',
  category: 'json',
  description: 'Extract JSON values',
  async test(driver) {
    try {
      try {
        const result = await driver.query(`SELECT '{"key": "value"}'::jsonb->>'key' as val`)
        if (result.rows.length >= 1)
          return { supported: true, notes: 'PostgreSQL JSONB syntax' }
      }
      catch {}
      const result = await driver.query(`SELECT json_extract('{"key": "value"}', '$.key') as val`)
      return { supported: result.rows.length >= 1, notes: 'json_extract function' }
    }
    catch (error) {
      return { supported: false, error: (error as Error).message }
    }
  },
}
