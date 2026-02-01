import type { CapabilityTest } from '../types'

// Constraints
import { capability as CHECK_constraint } from './constraints/CHECK_constraint'
import { capability as foreign_keys } from './constraints/foreign_keys'
import { capability as UNIQUE_constraint } from './constraints/UNIQUE_constraint'
// FTS
import { capability as FTS_basic } from './fts/FTS_basic'
import { capability as FTS_ranking } from './fts/FTS_ranking'
// JSON
import { capability as JSON_ARRAY } from './json/JSON_ARRAY'
import { capability as JSON_EXTRACT } from './json/JSON_EXTRACT'
import { capability as JSON_SET } from './json/JSON_SET'
import { capability as jsonb_operators } from './json/jsonb_operators'
// Other
import { capability as EXPLAIN } from './other/EXPLAIN'
import { capability as prepared_statements } from './other/prepared_statements'
// Queries
import { capability as CTE } from './queries/CTE'
import { capability as CTE_recursive } from './queries/CTE_recursive'
import { capability as LIMIT_OFFSET } from './queries/LIMIT_OFFSET'
import { capability as RETURNING } from './queries/RETURNING'
import { capability as subqueries } from './queries/subqueries'
import { capability as UPSERT_on_conflict } from './queries/UPSERT_on_conflict'
import { capability as UPSERT_on_duplicate } from './queries/UPSERT_on_duplicate'
import { capability as UPSERT_replace } from './queries/UPSERT_replace'
import { capability as window_functions } from './queries/window_functions'
// Transactions
import { capability as batch_atomicity } from './transactions/batch_atomicity'
import { capability as BEGIN } from './transactions/BEGIN'
import { capability as COMMIT } from './transactions/COMMIT'
import { capability as ROLLBACK } from './transactions/ROLLBACK'
import { capability as SAVEPOINT } from './transactions/SAVEPOINT'
// Types
import { capability as type_array } from './types/array'
import { capability as type_bigint } from './types/bigint'
import { capability as type_boolean } from './types/boolean'
import { capability as type_date } from './types/date'
import { capability as type_decimal } from './types/decimal'
import { capability as type_json } from './types/json'
import { capability as type_timestamp } from './types/timestamp'
import { capability as type_uuid } from './types/uuid'

export const capabilities: CapabilityTest[] = [
  BEGIN,
  COMMIT,
  ROLLBACK,
  SAVEPOINT,
  batch_atomicity,
  type_boolean,
  type_json,
  type_array,
  type_date,
  type_timestamp,
  type_uuid,
  type_bigint,
  type_decimal,
  JSON_EXTRACT,
  JSON_SET,
  JSON_ARRAY,
  jsonb_operators,
  RETURNING,
  UPSERT_on_conflict,
  UPSERT_on_duplicate,
  UPSERT_replace,
  CTE,
  CTE_recursive,
  window_functions,
  LIMIT_OFFSET,
  subqueries,
  FTS_basic,
  FTS_ranking,
  foreign_keys,
  CHECK_constraint,
  UNIQUE_constraint,
  prepared_statements,
  EXPLAIN,
]
