import type { Dialect } from '../../packages/data/src/types'

export interface TestDriver {
  dialect: Dialect
  exec: (sql: string) => Promise<void>
  query: <T = Record<string, unknown>>(sql: string, params?: unknown[]) => Promise<{ rows: T[] }>
  close: () => Promise<void>
}
