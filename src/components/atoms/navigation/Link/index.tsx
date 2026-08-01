import { LinkBack } from "./LinkBack"
import { LinkSeeMore } from "./LinkSeeMore"

/**
 * `Link.*` — namespace of the arrow text-link family. This file only gathers
 * the members together; no logic of its own.
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
