import { createMysql2Driver } from '../drivers/mysql2'
import { testTarget } from '../target-suite'

testTarget({
  name: 'mysql2',
  createDriver: () => createMysql2Driver(process.env.MYSQL_URL!),
  skipReason: process.env.MYSQL_URL ? undefined : 'MYSQL_URL not set',
})
