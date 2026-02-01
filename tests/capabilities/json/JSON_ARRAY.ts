import type { CapabilityTest } from '../../types'

export const capability: CapabilityTest = {
  id: 'JSON_ARRAY',
  category: 'json',
  description: 'Create JSON arrays',
  async test(driver) {
    try {
      try {
        const result = await driver.query(`SELECT jsonb_build_array(1, 2, 3) as val`)
        if (result.rows.length >= 1)
          return { supported: true, notes: 'PostgreSQL jsonb_build_array' }
      }
      catch {}
      const result = await driver.query(`SELECT json_array(1, 2, 3) as val`)
      return { supported: result.rows.length >= 1, notes: 'json_array function' }
    }
    catch (error) {
      return { supported: false, error: (error as Error).message }
    }
  },
}
