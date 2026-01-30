import type { CapabilityCategory, CapabilityDefinition, CapabilityId, CapabilityResult, CompatibilityData, CompatibilityDataV2, CompatKind, Db0Category, Dialect, TargetDefinition, TargetId } from './types'
import _compatData from '../data.json'

export * from './types'

export const compatData = _compatData as unknown as CompatibilityDataV2

export const targets: TargetDefinition[] = [
  // SQLite
  { id: 'db0-better-sqlite3', name: 'better-sqlite3', dialect: 'sqlite', connector: 'better-sqlite3' },
  { id: 'db0-libsql', name: 'libSQL', dialect: 'sqlite', connector: 'libsql' },
  { id: 'db0-bun-sqlite', name: 'Bun SQLite', dialect: 'sqlite', connector: 'bun-sqlite' },
  { id: 'db0-node-sqlite', name: 'Node SQLite', dialect: 'sqlite', connector: 'node-sqlite' },
  { id: 'db0-sqlite3', name: 'sqlite3', dialect: 'sqlite', connector: 'sqlite3' },
  { id: 'db0-cloudflare-d1', name: 'Cloudflare D1', dialect: 'sqlite', connector: 'cloudflare-d1' },
  // PostgreSQL
  { id: 'db0-pglite', name: 'PGlite', dialect: 'postgresql', connector: 'pglite' },
  { id: 'db0-postgresql', name: 'PostgreSQL', dialect: 'postgresql', connector: 'postgresql' },
  { id: 'db0-hyperdrive-postgresql', name: 'Hyperdrive PostgreSQL', dialect: 'postgresql', connector: 'cloudflare-hyperdrive-postgresql' },
  // MySQL
  { id: 'db0-mysql2', name: 'MySQL', dialect: 'mysql', connector: 'mysql2' },
  { id: 'db0-planetscale', name: 'PlanetScale', dialect: 'mysql', connector: 'planetscale' },
  { id: 'db0-hyperdrive-mysql', name: 'Hyperdrive MySQL', dialect: 'mysql', connector: 'cloudflare-hyperdrive-mysql' },
]

export const capabilities: CapabilityDefinition[] = [
  // SQL - Transactions
  { id: 'BEGIN', kind: 'sql', category: 'transactions', description: 'Explicit transaction start' },
  { id: 'COMMIT', kind: 'sql', category: 'transactions', description: 'Commit transaction' },
  { id: 'ROLLBACK', kind: 'sql', category: 'transactions', description: 'Rollback transaction' },
  { id: 'SAVEPOINT', kind: 'sql', category: 'transactions', description: 'Transaction savepoints' },
  { id: 'batch_atomicity', kind: 'sql', category: 'transactions', description: 'Atomic batch execution' },
  // SQL - Types
  { id: 'type_boolean', kind: 'sql', category: 'types', description: 'Boolean type support' },
  { id: 'type_json', kind: 'sql', category: 'types', description: 'JSON/JSONB column type' },
  { id: 'type_array', kind: 'sql', category: 'types', description: 'Array column type' },
  { id: 'type_date', kind: 'sql', category: 'types', description: 'DATE type' },
  { id: 'type_timestamp', kind: 'sql', category: 'types', description: 'TIMESTAMP type' },
  { id: 'type_uuid', kind: 'sql', category: 'types', description: 'UUID type' },
  { id: 'type_bigint', kind: 'sql', category: 'types', description: 'BIGINT type' },
  { id: 'type_decimal', kind: 'sql', category: 'types', description: 'DECIMAL/NUMERIC type' },
  // SQL - JSON
  { id: 'JSON_EXTRACT', kind: 'sql', category: 'json', description: 'Extract JSON values' },
  { id: 'JSON_SET', kind: 'sql', category: 'json', description: 'Modify JSON values' },
  { id: 'JSON_ARRAY', kind: 'sql', category: 'json', description: 'Create JSON arrays' },
  { id: 'jsonb_operators', kind: 'sql', category: 'json', description: 'PostgreSQL JSONB operators (@>, ->, etc.)' },
  // SQL - Queries
  { id: 'RETURNING', kind: 'sql', category: 'queries', description: 'RETURNING clause' },
  { id: 'UPSERT_on_conflict', kind: 'sql', category: 'queries', description: 'ON CONFLICT clause (PostgreSQL/SQLite)' },
  { id: 'UPSERT_on_duplicate', kind: 'sql', category: 'queries', description: 'ON DUPLICATE KEY (MySQL)' },
  { id: 'UPSERT_replace', kind: 'sql', category: 'queries', description: 'REPLACE INTO (SQLite)' },
  { id: 'CTE', kind: 'sql', category: 'queries', description: 'Common Table Expressions (WITH)' },
  { id: 'CTE_recursive', kind: 'sql', category: 'queries', description: 'Recursive CTEs (WITH RECURSIVE)' },
  { id: 'window_functions', kind: 'sql', category: 'queries', description: 'Window functions (ROW_NUMBER, etc.)' },
  { id: 'LIMIT_OFFSET', kind: 'sql', category: 'queries', description: 'LIMIT and OFFSET' },
  { id: 'subqueries', kind: 'sql', category: 'queries', description: 'Subqueries' },
  // SQL - FTS
  { id: 'FTS_basic', kind: 'sql', category: 'fts', description: 'Full-text search' },
  { id: 'FTS_ranking', kind: 'sql', category: 'fts', description: 'FTS ranking/scoring' },
  // SQL - Constraints
  { id: 'foreign_keys', kind: 'sql', category: 'constraints', description: 'Foreign key constraints' },
  { id: 'CHECK_constraint', kind: 'sql', category: 'constraints', description: 'CHECK constraints' },
  { id: 'UNIQUE_constraint', kind: 'sql', category: 'constraints', description: 'UNIQUE constraints' },
  // SQL - Other
  { id: 'prepared_statements', kind: 'sql', category: 'other', description: 'Prepared statements' },
  { id: 'EXPLAIN', kind: 'sql', category: 'other', description: 'Query explain/analysis' },
  // db0 - API
  { id: 'db0_sql_template', kind: 'db0', category: 'api', description: 'sql tagged template for params' },
  { id: 'db0_exec', kind: 'db0', category: 'api', description: 'Raw SQL execution via exec()' },
  { id: 'db0_batch', kind: 'db0', category: 'api', description: 'Multi-statement batch execution' },
  { id: 'db0_prepare', kind: 'db0', category: 'api', description: 'Prepared statement API' },
  { id: 'db0_first', kind: 'db0', category: 'api', description: 'First row helper' },
  { id: 'db0_rows', kind: 'db0', category: 'api', description: 'Rows array access' },
  // db0 - Connection
  { id: 'db0_close', kind: 'db0', category: 'connection', description: 'Connection cleanup' },
  { id: 'db0_transaction', kind: 'db0', category: 'connection', description: 'Transaction helper API' },
]

export const sqlCapabilities = capabilities.filter(c => c.kind === 'sql')
export const db0Capabilities = capabilities.filter(c => c.kind === 'db0')

export const sqlCategories: CapabilityCategory[] = ['transactions', 'types', 'json', 'queries', 'fts', 'constraints', 'other']
export const db0Categories: Db0Category[] = ['api', 'connection']

export function isSupported(data: CompatibilityData, target: TargetId, capability: CapabilityId): boolean {
  return data[target]?.[capability]?.supported ?? false
}

export function getResult(data: CompatibilityData, target: TargetId, capability: CapabilityId): CapabilityResult | undefined {
  return data[target]?.[capability]
}

export function getTargetsByDialect(dialect: 'sqlite' | 'postgresql' | 'mysql'): TargetDefinition[] {
  return targets.filter(t => t.dialect === dialect)
}

export function getCapabilitiesByCategory(category: CapabilityCategory | Db0Category): CapabilityDefinition[] {
  return capabilities.filter(c => c.category === category)
}

export function getCapabilitiesByKind(kind: CompatKind): CapabilityDefinition[] {
  return capabilities.filter(c => c.kind === kind)
}

// V2 helpers
export function isSupportedV2(data: CompatibilityDataV2, target: TargetId, kind: CompatKind, category: string, capabilityId: string): boolean {
  const kindData = data[kind] as Record<string, Record<string, { support: Record<TargetId, { supported: boolean }> }>>
  return kindData?.[category]?.[capabilityId]?.support[target]?.supported ?? false
}

export function getResultV2(data: CompatibilityDataV2, target: TargetId, kind: CompatKind, category: string, capabilityId: string): { supported: boolean, notes?: string, error?: string } | undefined {
  const kindData = data[kind] as Record<string, Record<string, { support: Record<TargetId, { supported: boolean, notes?: string, error?: string }> }>>
  return kindData?.[category]?.[capabilityId]?.support[target]
}

export function getTargetsByDialectV2(data: CompatibilityDataV2, dialect: Dialect): TargetId[] {
  return (Object.entries(data.__meta.targets) as [TargetId, { dialect: Dialect }][])
    .filter(([_, meta]) => meta.dialect === dialect)
    .map(([id]) => id)
}

export function getCoverageV2(data: CompatibilityDataV2, target: TargetId, kind?: CompatKind): { supported: number, total: number, percentage: number } {
  let supported = 0
  let total = 0
  const kinds = kind ? [kind] : ['sql', 'db0'] as const
  for (const k of kinds) {
    for (const cat of Object.values(data[k])) {
      for (const cap of Object.values(cat)) {
        total++
        if (cap.support[target]?.supported)
          supported++
      }
    }
  }
  return { supported, total, percentage: total > 0 ? Math.round((supported / total) * 100) : 0 }
}
