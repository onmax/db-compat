export interface CapabilityResult {
  supported: boolean
  error?: string
  notes?: string
}

export type CapabilityCategory = 'transactions' | 'types' | 'json' | 'queries' | 'fts' | 'constraints' | 'other'

export interface CapabilityDefinition {
  id: string
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

export type TargetId = 'db0-better-sqlite3' | 'db0-libsql' | 'db0-pglite' | 'db0-cloudflare-d1' | 'db0-postgresql' | 'db0-mysql2' | 'db0-planetscale'

export type CompatibilityData = Record<TargetId, CapabilityResults>

export interface TargetDefinition {
  id: TargetId
  name: string
  dialect: 'sqlite' | 'postgresql' | 'mysql'
  connector: string
}
