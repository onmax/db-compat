import { createNodeSqliteDriver } from '../drivers/node-sqlite'
import { testTarget } from '../target-suite'

const nodeMajor = typeof process.versions.node === 'string' ? Number.parseInt(process.versions.node.split('.')[0]) : 0

testTarget({
  name: 'node-sqlite',
  createDriver: createNodeSqliteDriver,
  skipReason: nodeMajor < 22 ? 'Node.js 22+ required for node:sqlite' : undefined,
})
