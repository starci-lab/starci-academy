/**
 * `ContinueCard.*` — a "come back to where you left off" card, in two members that
 * differ in role: `.Hero` is a single highlighted card face with a light streak and
 * a CTA button; `.Item` is one flat card among many in a list with a CTA link.
 * The component owns its own CTA label and watermark glyph; callers supply only data
 * (`title`/`subtitle`/`meta`/`timeLeft` as strings).
 */

import { ContinueCardHero } from "./ContinueCardHero"
import { ContinueCardItem } from "./ContinueCardItem"

export type { ContinueCardHeroProps, ContinueCardItemProps } from "./types"
export { ContinueCardHero, ContinueCardItem }

/**
 * `ContinueCard.*` — namespace (§12a). Root callable = `.Hero` (the one-highlight
 * case, also the most-used case in the blueprint).
 * Folder-matching compound namespace (export-matches-folder). Existing named exports stay public.
 */
export const ContinueCard = {
    Hero: ContinueCardHero,
    Item: ContinueCardItem,
} as const
