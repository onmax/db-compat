import { createSqlite3Driver } from '../drivers/sqlite3'
import { testTarget } from '../target-suite'

testTarget({
  name: 'sqlite3',
  createDriver: createSqlite3Driver,
})
