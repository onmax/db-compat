export interface CapabilityResult {
  supported: boolean
  error?: string
  notes?: string
}

export type CapabilityCategory = 'transactions' | 'types' | 'json' | 'queries' | 'fts' | 'constraints' | 'other'
export type Dialect = 'sqlite' | 'postgresql' | 'mysql'

export interface CapabilityEntry {
  description: string
  support: Record<TargetId, { supported: boolean, notes?: string, error?: string }>
}

export interface CompatibilityDataV2 {
  __meta: {
    version: string
    generatedAt: string
    targets: Record<TargetId, { driver: string, version: string, dialect: Dialect, generatedAt: string }>
  }
  sql: Record<CapabilityCategory, Record<string, CapabilityEntry>>
}

export interface CapabilityDefinition {
  id: CapabilityId
  category: CapabilityCategory
  description: string
}

export type CapabilityId
  // Transactions
  = | 'BEGIN' | 'COMMIT' | 'ROLLBACK' | 'SAVEPOINT' | 'batch_atomicity'
  // Types
    | 'type_boolean' | 'type_json' | 'type_array' | 'type_date' | 'type_timestamp' | 'type_uuid' | 'type_bigint' | 'type_decimal'
  // JSON
    | 'JSON_EXTRACT' | 'JSON_SET' | 'JSON_ARRAY' | 'jsonb_operators'
  // Queries
    | 'RETURNING' | 'UPSERT_on_conflict' | 'UPSERT_on_duplicate' | 'UPSERT_replace' | 'CTE' | 'CTE_recursive' | 'window_functions' | 'LIMIT_OFFSET' | 'subqueries'
  // FTS
    | 'FTS_basic' | 'FTS_ranking'
  // Constraints
    | 'foreign_keys' | 'CHECK_constraint' | 'UNIQUE_constraint'
  // Other
    | 'prepared_statements' | 'EXPLAIN'

export type CapabilityResults = Record<CapabilityId, CapabilityResult>

export type TargetId = 'better-sqlite3' | 'libsql' | 'pglite' | 'cloudflare-d1' | 'postgresql' | 'mysql2' | 'planetscale' | 'bun-sqlite' | 'node-sqlite' | 'sqlite3' | 'hyperdrive-mysql' | 'hyperdrive-postgresql'

export type CompatibilityData = Record<TargetId, CapabilityResults>

export interface TargetDefinition {
  id: TargetId
  name: string
  dialect: Dialect
  driver: string
}
