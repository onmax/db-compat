export type Dialect = 'sqlite' | 'postgresql' | 'mysql'
export type CapabilityCategory = 'transactions' | 'types' | 'json' | 'queries' | 'fts' | 'constraints' | 'other'

export interface CapabilitySupport { supported: boolean; notes?: string; error?: string }
export interface Capability { description: string; support: Record<string, CapabilitySupport> }
export interface TargetMeta { version: string; dialect: Dialect }

export interface CompatibilityDataV2 {
  __meta: { version: string; generatedAt: string; targets: Record<string, TargetMeta> }
  capabilities: Record<CapabilityCategory, Record<string, Capability>>
}
