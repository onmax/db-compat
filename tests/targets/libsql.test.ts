import { createLibsqlDriver } from '../drivers/libsql'
import { testTarget } from '../target-suite'

testTarget({
  name: 'libsql',
  createDriver: createLibsqlDriver,
})
