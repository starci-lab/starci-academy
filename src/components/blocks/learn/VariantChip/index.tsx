/**
 * `VariantChip.*` — a chip family (design tier) that applies one meaningful role
 * (difficulty, language, platform) on top of the `Chip.*` atom, attaching the
 * role's meaning and colour scale to the shape the atom already owns. Each member
 * is a meaningful role, not a shape variant. Never exposes `custom` or `bare`: no
 * caller-chosen label or shape swap — each member is the one canonical form of
 * its role (use `Chip.*` directly for a free-form chip). No `Base` member. Grows
 * `.Language`/`.HostPlatform`/`.AiCategory` as screens need them.
 */

export type { Difficulty, VariantChipDifficultyProps } from "./types"
export { DIFFICULTY_COLOR } from "./types"
export { VariantChipDifficulty } from "./VariantChipDifficulty"

/**
 * `VariantChip.*` — the family of chips carrying a meaningful role. Members are
 * named by ROLE (§14d), not by shape. No `Base` (see the doc at the top of this
 * file).
 */
