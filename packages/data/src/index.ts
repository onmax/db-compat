import type { CapabilityId, CapabilityResult, CompatibilityData, TargetDefinition, TargetId } from './types'

export * from './types'

export const targets: TargetDefinition[] = [
  { id: 'db0-better-sqlite3', name: 'better-sqlite3', dialect: 'sqlite', connector: 'better-sqlite3' },
  { id: 'db0-libsql', name: 'libSQL', dialect: 'sqlite', connector: 'libsql' },
  { id: 'db0-pglite', name: 'PGlite', dialect: 'postgresql', connector: 'pglite' },
  { id: 'db0-cloudflare-d1', name: 'Cloudflare D1', dialect: 'sqlite', connector: 'cloudflare-d1' },
  { id: 'db0-postgresql', name: 'PostgreSQL', dialect: 'postgresql', connector: 'postgresql' },
  { id: 'db0-mysql2', name: 'MySQL', dialect: 'mysql', connector: 'mysql2' },
  { id: 'db0-planetscale', name: 'PlanetScale', dialect: 'mysql', connector: 'planetscale' },
]

export const capabilities: { id: CapabilityId, category: string, description: string }[] = [
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
  { id: 'jsonb_operators', category: 'json', description: 'PostgreSQL JSONB operators (@>, ->, etc.)' },
  // Queries
  { id: 'RETURNING', category: 'queries', description: 'RETURNING clause' },
  { id: 'UPSERT_on_conflict', category: 'queries', description: 'ON CONFLICT clause (PostgreSQL/SQLite)' },
  { id: 'UPSERT_on_duplicate', category: 'queries', description: 'ON DUPLICATE KEY (MySQL)' },
  { id: 'UPSERT_replace', category: 'queries', description: 'REPLACE INTO (SQLite)' },
  { id: 'CTE', category: 'queries', description: 'Common Table Expressions (WITH)' },
  { id: 'CTE_recursive', category: 'queries', description: 'Recursive CTEs (WITH RECURSIVE)' },
  { id: 'window_functions', category: 'queries', description: 'Window functions (ROW_NUMBER, etc.)' },
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

export function isSupported(data: CompatibilityData, target: TargetId, capability: CapabilityId): boolean {
  return data[target]?.[capability]?.supported ?? false
}

export function getResult(data: CompatibilityData, target: TargetId, capability: CapabilityId): CapabilityResult | undefined {
  return data[target]?.[capability]
}

export function getTargetsByDialect(dialect: 'sqlite' | 'postgresql' | 'mysql'): TargetDefinition[] {
  return targets.filter(t => t.dialect === dialect)
}

export function getCapabilitiesByCategory(category: string): typeof capabilities {
  return capabilities.filter(c => c.category === category)
}
