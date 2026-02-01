# How It Works

db-compat tests database capabilities across different SQL drivers to help you choose the right database for your project.

## Methodology

Each capability in the matrix represents a specific SQL feature test:

1. **Raw Drivers** - Tests run directly against native database drivers (better-sqlite3, pg, mysql2, etc.)
2. **Automated Testing** - Each capability has a corresponding test function that runs SQL queries
3. **Real Databases** - Tests run against actual database instances (in-memory or Docker containers)
4. **Structured Results** - Results are stored in `packages/data/data.json` and rendered in this matrix

## Test Categories

- **Transactions** - BEGIN, COMMIT, ROLLBACK, SAVEPOINT, batch atomicity
- **Types** - Boolean, JSON, arrays, dates, UUIDs, decimals
- **JSON** - JSON extraction, modification, array creation
- **Queries** - CTEs, window functions, RETURNING, upsert variants
- **FTS** - Full-text search and ranking
- **Constraints** - Foreign keys, CHECK, UNIQUE
- **Other** - Prepared statements, EXPLAIN

## Contributing

### Adding a New Target

1. Create driver implementation in `tests/drivers/`
2. Add target definition in `packages/data/src/index.ts`
3. Add driver to `scripts/generate.ts`
4. Run `pnpm generate` to test all capabilities

### Adding a New Capability

1. Create a test function in `tests/capabilities/`
2. Export it from the appropriate category file
3. Add capability definition in `packages/data/src/index.ts`
4. Run `pnpm generate` to update results

### Running Tests Locally

```bash
pnpm install
pnpm generate
```

Some targets require Docker or external databases. Check the README for specific requirements.
