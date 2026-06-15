/**
 * Account level derived from the user's unified `points` balance.
 *
 * Curve: a triangular cost so early levels come fast and later ones cost more.
 * The cumulative points required to REACH level `L` is `BASE * L * (L - 1) / 2`
 * (level 1 = 0). With `BASE = 100`: L1=0, L2=100, L3=300, L4=600, L5=1000, …
 */
const BASE = 100

/** Cumulative points required to reach a given level. */
const floorFor = (level: number): number => (BASE * level * (level - 1)) / 2

/** A user's level standing: the level + progress toward the next one. */
export interface LevelInfo {
    /** Current level (1-based). */
    level: number
    /** Points accumulated within the current level. */
    into: number
    /** Points needed to span the current level → next. */
    needed: number
    /** Progress through the current level, 0–1. */
    progress: number
}

/**
 * Resolve a points balance into its level standing.
 *
 * @param points - the user's total points (>= 0).
 * @returns the {@link LevelInfo} for that balance.
 */
export const getLevel = (points: number): LevelInfo => {
    const safe = Math.max(0, Math.floor(points))
    // invert the triangular cost: largest L with floorFor(L) <= points
    const level = Math.max(1, Math.floor((1 + Math.sqrt(1 + (8 * safe) / BASE)) / 2))
    const current = floorFor(level)
    const next = floorFor(level + 1)
    const into = safe - current
    const needed = next - current
    return {
        level,
        into,
        needed,
        progress: needed > 0 ? into / needed : 0,
    }
}
