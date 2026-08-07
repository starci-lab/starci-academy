import { LinkBack } from "./LinkBack"
import { LinkSeeMore } from "./LinkSeeMore"

/**
 * `LinkBack` / `LinkSeeMore` — arrow text-link family. This file gathers the
 * direct named exports; no runtime namespace object.
 *
 *   • `LinkBack`    → ./LinkBack     — "← Back" / "← Back to {target}".
 *   • `LinkSeeMore` → ./LinkSeeMore  — "See more →" / "Continue →".
 */
export { LinkBack, LinkSeeMore }

export type { LinkBackProps } from "./LinkBack"
export type { LinkSeeMoreProps, LinkSeeMoreSize } from "./LinkSeeMore"

/** Combined tier meta for the `Link.*` family — each member also exports its own. */
export const meta = [
    { tier: "atom", name: "LinkBack" },
    { tier: "atom", name: "LinkSeeMore" },
] as const
