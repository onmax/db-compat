import { createBetterSqlite3Driver } from '../drivers/better-sqlite3'
import { testTarget } from '../target-suite'

testTarget({
  name: 'better-sqlite3',
  createDriver: createBetterSqlite3Driver,
})
