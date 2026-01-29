import type { CapabilityTest } from '../types'

import { capability as CHECK_constraint } from './constraints/CHECK_constraint'
// Constraints
import { capability as foreign_keys } from './constraints/foreign_keys'
import { capability as UNIQUE_constraint } from './constraints/UNIQUE_constraint'
import { capability as JSON_ARRAY } from './json/JSON_ARRAY'
// JSON
import { capability as JSON_EXTRACT } from './json/JSON_EXTRACT'

import { capability as JSON_SET } from './json/JSON_SET'
import { capability as jsonb_operators } from './json/jsonb_operators'
import { capability as EXPLAIN } from './other/EXPLAIN'
// FTS
import { capability as FTS_basic } from './other/FTS_basic'
import { capability as FTS_ranking } from './other/FTS_ranking'
// Other
import { capability as prepared_statements } from './other/prepared_statements'
import { capability as CTE } from './queries/CTE'
import { capability as CTE_recursive } from './queries/CTE_recursive'

import { capability as LIMIT_OFFSET } from './queries/LIMIT_OFFSET'
// Queries
import { capability as RETURNING } from './queries/RETURNING'
import { capability as subqueries } from './queries/subqueries'
import { capability as UPSERT_on_conflict } from './queries/UPSERT_on_conflict'

import { capability as UPSERT_on_duplicate } from './queries/UPSERT_on_duplicate'
import { capability as UPSERT_replace } from './queries/UPSERT_replace'
import { capability as window_functions } from './queries/window_functions'
import { capability as batch_atomicity } from './transactions/batch_atomicity'
// Transactions
import { capability as BEGIN } from './transactions/BEGIN'
import { capability as COMMIT } from './transactions/COMMIT'
import { capability as ROLLBACK } from './transactions/ROLLBACK'
import { capability as SAVEPOINT } from './transactions/SAVEPOINT'
import { capability as type_array } from './types/array'

import { capability as type_bigint } from './types/bigint'
// Types
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
