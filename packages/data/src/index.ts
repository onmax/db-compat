import type { CapabilityCategory, CapabilityDefinition, CapabilityId, CapabilityResult, CompatibilityData, CompatibilityDataV2, Dialect, TargetDefinition, TargetId } from './types'
import _compatData from '../data.json'

export * from './types'

export const compatData = _compatData as unknown as CompatibilityDataV2

export const targets: TargetDefinition[] = [
  // SQLite
  { id: 'better-sqlite3', name: 'better-sqlite3', dialect: 'sqlite', driver: 'better-sqlite3' },
  { id: 'libsql', name: 'libSQL', dialect: 'sqlite', driver: '@libsql/client' },
  { id: 'bun-sqlite', name: 'Bun SQLite', dialect: 'sqlite', driver: 'bun:sqlite' },
  { id: 'node-sqlite', name: 'Node SQLite', dialect: 'sqlite', driver: 'node:sqlite' },
  { id: 'sqlite3', name: 'sqlite3', dialect: 'sqlite', driver: 'sqlite3' },
  { id: 'cloudflare-d1', name: 'Cloudflare D1', dialect: 'sqlite', driver: 'D1' },
  // PostgreSQL
  { id: 'pglite', name: 'PGlite', dialect: 'postgresql', driver: '@electric-sql/pglite' },
  { id: 'postgresql', name: 'PostgreSQL', dialect: 'postgresql', driver: 'pg' },
  { id: 'hyperdrive-postgresql', name: 'Hyperdrive PostgreSQL', dialect: 'postgresql', driver: 'pg+hyperdrive' },
  // MySQL
  { id: 'mysql2', name: 'MySQL', dialect: 'mysql', driver: 'mysql2' },
  { id: 'planetscale', name: 'PlanetScale', dialect: 'mysql', driver: '@planetscale/database' },
  { id: 'hyperdrive-mysql', name: 'Hyperdrive MySQL', dialect: 'mysql', driver: 'mysql2+hyperdrive' },
]

export const capabilities: CapabilityDefinition[] = [
  // Transactions
  { id: 'BEGIN', category: 'transactions', description: 'Explicit transaction start' },
  { id: 'COMMIT', category: 'transactions', description: 'Commit transaction' },
  { id: 'ROLLBACK', category: 'transactions', description: 'Rollback transaction' },
  { id: 'SAVEPOINT', category: 'transactions', description: 'Transaction savepoints' },
  { id: 'batch_atomicity', category: 'transactions', description: 'Atomic batch execution' },
  // Types
  { id: 'type_boolean', category: 'types', description: 'Boolean type support' },
  { id: 'type_json', category: 'types', description: 'JSON/JSONB column type' },
  { id: 'type_array', category: 'types', description: 'Array column type' },
  { id: 'type_date', category: 'types', description: 'DATE type' },
  { id: 'type_timestamp', category: 'types', description: 'TIMESTAMP type' },
  { id: 'type_uuid', category: 'types', description: 'UUID type' },
  { id: 'type_bigint', category: 'types', description: 'BIGINT type' },
  { id: 'type_decimal', category: 'types', description: 'DECIMAL/NUMERIC type' },
  // JSON
  { id: 'JSON_EXTRACT', category: 'json', description: 'Extract JSON values' },
  { id: 'JSON_SET', category: 'json', description: 'Modify JSON values' },
  { id: 'JSON_ARRAY', category: 'json', description: 'Create JSON arrays' },
  { id: 'jsonb_operators', category: 'json', description: 'JSONB operators' },
  // Queries
  { id: 'RETURNING', category: 'queries', description: 'RETURNING clause' },
  { id: 'UPSERT_on_conflict', category: 'queries', description: 'ON CONFLICT clause' },
  { id: 'UPSERT_on_duplicate', category: 'queries', description: 'ON DUPLICATE KEY (MySQL)' },
  { id: 'UPSERT_replace', category: 'queries', description: 'REPLACE INTO (SQLite)' },
  { id: 'CTE', category: 'queries', description: 'Common Table Expressions (WITH)' },
  { id: 'CTE_recursive', category: 'queries', description: 'Recursive CTEs (WITH RECURSIVE)' },
  { id: 'window_functions', category: 'queries', description: 'Window functions' },
  { id: 'LIMIT_OFFSET', category: 'queries', description: 'LIMIT and OFFSET' },
  { id: 'subqueries', category: 'queries', description: 'Subqueries' },
  // FTS
  { id: 'FTS_basic', category: 'fts', description: 'Full-text search' },
  { id: 'FTS_ranking', category: 'fts', description: 'FTS ranking/scoring' },
  // Constraints
  { id: 'foreign_keys', category: 'constraints', description: 'Foreign key constraints' },
  { id: 'CHECK_constraint', category: 'constraints', description: 'CHECK constraints' },
  { id: 'UNIQUE_constraint', category: 'constraints', description: 'UNIQUE constraints' },
  // Other
  { id: 'prepared_statements', category: 'other', description: 'Prepared statements' },
  { id: 'EXPLAIN', category: 'other', description: 'Query explain/analysis' },
]

export const sqlCategories: CapabilityCategory[] = ['transactions', 'types', 'json', 'queries', 'fts', 'constraints', 'other']

export function isSupported(data: CompatibilityData, target: TargetId, capability: CapabilityId): boolean {
  return data[target]?.[capability]?.supported ?? false
}

export function getResult(data: CompatibilityData, target: TargetId, capability: CapabilityId): CapabilityResult | undefined {
  return data[target]?.[capability]
}

export function getTargetsByDialect(dialect: Dialect): TargetDefinition[] {
  return targets.filter(t => t.dialect === dialect)
}

export function getCapabilitiesByCategory(category: CapabilityCategory): CapabilityDefinition[] {
  return capabilities.filter(c => c.category === category)
}

// V2 helpers
export function isSupportedV2(data: CompatibilityDataV2, target: TargetId, category: string, capabilityId: string): boolean {
  return data.sql?.[category as CapabilityCategory]?.[capabilityId]?.support[target]?.supported ?? false
}

export function getResultV2(data: CompatibilityDataV2, target: TargetId, category: string, capabilityId: string): { supported: boolean, notes?: string, error?: string } | undefined {
  return data.sql?.[category as CapabilityCategory]?.[capabilityId]?.support[target]
}

export function getTargetsByDialectV2(data: CompatibilityDataV2, dialect: Dialect): TargetId[] {
  return (Object.entries(data.__meta.targets) as [TargetId, { dialect: Dialect }][])
    .filter(([_, meta]) => meta.dialect === dialect)
    .map(([id]) => id)
}

export function getCoverageV2(data: CompatibilityDataV2, target: TargetId): { supported: number, total: number, percentage: number } {
  let supported = 0
  let total = 0
  for (const cat of Object.values(data.sql)) {
    for (const cap of Object.values(cat)) {
      total++
      if (cap.support[target]?.supported)
        supported++
    }
  }
  return { supported, total, percentage: total > 0 ? Math.round((supported / total) * 100) : 0 }
}
