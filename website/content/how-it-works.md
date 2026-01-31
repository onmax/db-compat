# How It Works

db-compat tests database capabilities across different db0 connectors to help you choose the right database for your project.

## Methodology

Each capability in the matrix represents a specific SQL or API feature test:

1. **Unified API** - All tests use [db0](https://github.com/unjs/db0) connectors, providing a consistent interface across databases
2. **Automated Testing** - Each capability has a corresponding test function that runs SQL queries or API calls
3. **Real Databases** - Tests run against actual database instances (in-memory or Docker containers)
4. **Structured Results** - Results are stored in `packages/data/data.json` and rendered in this matrix

## Test Categories

- **SQL** - Standard SQL features (transactions, JSON, arrays, CTEs, etc.)
- **db0 API** - db0-specific functionality (batch operations, raw queries, etc.)

## Contributing

### Adding a New Target

1. Add connector configuration in `packages/generate/generate.ts`
2. Ensure the database is available (Docker or in-memory)
3. Run `pnpm generate` to test all capabilities

### Adding a New Capability

1. Create a test function in `packages/generate/tests/capabilities/`
2. Export it from the appropriate category file
3. Run `pnpm generate` to update results

### Running Tests Locally

```bash
pnpm install
pnpm generate
```

Some targets require Docker. Check the README for specific requirements.
