import type { Dialect } from '../../packages/data/src/types'

export interface TestDriver {
  dialect: Dialect
  exec: (sql: string) => Promise<void>
  query: (sql: string, params?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }>
  close: () => Promise<void>
}
