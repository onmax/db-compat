#!/bin/bash
set -e

FILTER="${1:-}"

# Start postgres and mysql (skip if already running, e.g. in CI with services)
if ! nc -z localhost 5432 2>/dev/null || ! nc -z localhost 3306 2>/dev/null; then
  docker compose up -d --wait postgres mysql
fi

# Run bun-sqlite tests in Bun container
if [ -z "$FILTER" ] || [[ "bun-sqlite" == *"$FILTER"* ]]; then
  echo "Running bun-sqlite tests..."
  docker compose run --rm bun
fi

# Run D1 tests via miniflare
if [ -z "$FILTER" ] || [[ "d1" == *"$FILTER"* ]]; then
  echo "Running D1 tests..."
  pnpm run generate:d1
fi

# Run Hyperdrive tests via miniflare (needs docker databases)
if [ -z "$FILTER" ] || [[ "hyperdrive" == *"$FILTER"* ]]; then
  echo "Running Hyperdrive tests..."
  POSTGRESQL_URL=postgres://postgres:postgres@localhost:5432/test \
  MYSQL_URL=mysql://root:mysql@localhost:3306/test \
  pnpm run generate:hyperdrive
fi

# Run main generation with all env vars
echo "Running main generation..."
POSTGRESQL_URL=postgres://postgres:postgres@localhost:5432/test \
MYSQL_URL=mysql://root:mysql@localhost:3306/test \
BUN_RESULTS_PATH=.bun-results.json \
D1_RESULTS_PATH=.d1-results.json \
HYPERDRIVE_RESULTS_PATH=.hyperdrive-results.json \
pnpm run generate:node $FILTER

# Cleanup
rm -f .bun-results.json .d1-results.json .hyperdrive-results.json
