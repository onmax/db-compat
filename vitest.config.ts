import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 30000,
    projects: [
      { extends: true, test: { name: 'better-sqlite3', include: ['tests/targets/better-sqlite3.test.ts'] } },
      { extends: true, test: { name: 'libsql', include: ['tests/targets/libsql.test.ts'] } },
      { extends: true, test: { name: 'pglite', include: ['tests/targets/pglite.test.ts'] } },
      { extends: true, test: { name: 'sqlite3', include: ['tests/targets/sqlite3.test.ts'] } },
      { extends: true, test: { name: 'node-sqlite', include: ['tests/targets/node-sqlite.test.ts'] } },
      { extends: true, test: { name: 'postgresql', include: ['tests/targets/postgresql.test.ts'] } },
      { extends: true, test: { name: 'mysql2', include: ['tests/targets/mysql2.test.ts'] } },
      { extends: true, test: { name: 'bun-sqlite', include: ['tests/targets/bun-sqlite.test.ts'] } },
      { extends: true, test: { name: 'cloudflare-d1', include: ['tests/targets/cloudflare-d1.test.ts'] } },
      { extends: true, test: { name: 'planetscale', include: ['tests/targets/planetscale.test.ts'] } },
      { extends: true, test: { name: 'hyperdrive-postgresql', include: ['tests/targets/hyperdrive-postgresql.test.ts'] } },
      { extends: true, test: { name: 'hyperdrive-mysql', include: ['tests/targets/hyperdrive-mysql.test.ts'] } },
    ],
  },
})
