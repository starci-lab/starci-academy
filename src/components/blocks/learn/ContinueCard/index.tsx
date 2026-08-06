/**
 * `ContinueCard` family — a "come back to where you left off" card, in two
 * members that differ in role: `ContinueCardHero` is a single highlighted card
 * face with a light streak and a CTA button; `ContinueCardItem` is one flat
 * card among many in a list with a CTA link. The component owns its own CTA
 * label and watermark glyph; callers supply only data
 * (`title`/`subtitle`/`meta`/`timeLeft` as strings).
 */

export type { ContinueCardHeroProps, ContinueCardItemProps } from "./types"
export { ContinueCardHero } from "./ContinueCardHero"
export { ContinueCardItem } from "./ContinueCardItem"
