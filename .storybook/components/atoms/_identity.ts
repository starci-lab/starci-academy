/**
 * Atom-safe identity resolver for Contract C roots that are atoms (Alert,
 * SearchAutocomplete). Mirrors `frames/_identity` without importing a higher
 * tier (ATOM-3). Keep in lockstep with `frames/_identity.ts`.
 */

/** Sentence tiers that hand identity to a vocabulary root. */
export type IdentityTier = "block" | "layout" | "overlay" | "page"

/** Caller identity passed to an atom standing in as a sentence root. */
export interface CallerIdentity {
    /** The sentence tier the caller sits at. */
    tier: IdentityTier
    /** The caller's `data-component` name. */
    component: string
}

/** Resolved `data-tier` / `data-component` attrs. */
export interface IdentityAttrs {
    "data-tier"?: string
    "data-component"?: string
}

/**
 * Resolve which `data-tier`/`data-component` pair a root element should carry.
 *
 * @param identity - Caller identity when this root stands in for a sentence component.
 * @param own - This atom's own `{ tier, name }` fallback.
 */
export const resolveIdentity = (
    identity: CallerIdentity | undefined,
    own?: { tier: string; name: string },
): IdentityAttrs => {
    if (identity) return { "data-tier": identity.tier, "data-component": identity.component }
    if (own) return { "data-tier": own.tier, "data-component": own.name }
    return {}
}
