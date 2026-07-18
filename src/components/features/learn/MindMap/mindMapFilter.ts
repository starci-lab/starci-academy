import type { MindMapTier } from "./MindMapRail"

/** Numeric rank of a popularity tier — higher = more common. */
export const POP_RANK: Record<string, number> = {
    high: 3,
    medium: 2,
    low: 1,
}

/** The rank floor each filter selection requires. */
export const TIER_MIN: Record<MindMapTier, number> = {
    all: 1,
    medium: 2,
    high: 3,
}

/**
 * Does a node's popularity clear the active tier floor? Unknown popularity (e.g. the root) always
 * passes — the filter only ever hides real keyword tiers, never structural nodes.
 */
export const tierAllows = (popularity: string | null | undefined, tier: MindMapTier): boolean => {
    if (!popularity) {
        return true
    }
    return (POP_RANK[popularity] ?? 1) >= TIER_MIN[tier]
}
