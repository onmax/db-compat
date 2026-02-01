import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'JSON_SET',
  category: 'json',
  description: 'Modify JSON values',
  async test(driver) {
    try {
      try {
        const result = await driver.query(`SELECT jsonb_set('{"key": "old"}'::jsonb, '{key}', '"new"') as val`)
        if (result.rows.length >= 1)
          return { supported: true, notes: 'PostgreSQL jsonb_set' }
      }
      catch {}
      const result = await driver.query(`SELECT json_set('{"key": "old"}', '$.key', 'new') as val`)
      return { supported: result.rows.length >= 1, notes: 'json_set function' }
    }
    catch (error) {
      return { supported: false, error: (error as Error).message }
    }
  },
}
