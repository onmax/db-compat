import type { CompatibilityDataV2, Dialect, TargetId } from "./types.ts";
import { compatData } from "./index.ts";

export interface Db0Capabilities {
  readonly supportsJSON: boolean;
  readonly supportsBooleans: boolean;
  readonly supportsArrays: boolean;
  readonly supportsDates: boolean;
  readonly supportsUUIDs: boolean;
  readonly supportsTransactions: boolean;
  readonly supportsBatch: boolean;
}

// Map db0 connector names to db-compat target IDs
const targetMapping: Record<string, TargetId> = {
  "cloudflare-hyperdrive-postgresql": "hyperdrive-postgresql",
  "cloudflare-hyperdrive-mysql": "hyperdrive-mysql",
};

export function getDb0Capabilities(data: CompatibilityDataV2, targetId: string): Db0Capabilities {
  const id = (targetMapping[targetId] || targetId) as TargetId;
  const target = data.__meta.targets[id];
  const types = data.sql.types;
  const tx = data.sql.transactions;

  return {
    supportsJSON: types.type_json.support[id].supported,
    supportsBooleans: target.dialect !== "sqlite",
    supportsArrays: types.type_array.support[id].supported,
    supportsDates: types.type_date.support[id].supported,
    supportsUUIDs: types.type_uuid.support[id].supported,
    supportsTransactions: tx.BEGIN.support[id].supported,
    supportsBatch: tx.batch_atomicity.support[id].supported,
  };
}

// Pre-computed capabilities for all targets
export const db0Capabilities: Record<string, Db0Capabilities> = Object.fromEntries(
  Object.keys(compatData.__meta.targets).map((id) => [id, getDb0Capabilities(compatData, id)]),
);

// By dialect (for db0's dialectCapabilities)
export const db0DialectCapabilities: Record<Dialect, Db0Capabilities> = {
  sqlite: getDb0Capabilities(compatData, "better-sqlite3"),
  postgresql: getDb0Capabilities(compatData, "postgresql"),
  mysql: getDb0Capabilities(compatData, "mysql2"),
};
