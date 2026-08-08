import { LinkBack } from "./LinkBack"
import { LinkSeeMore } from "./LinkSeeMore"
import { InlineLink } from "./InlineLink"

/**
 * `LinkBack` / `LinkSeeMore` / `InlineLink` — text-link family. This file
 * gathers the direct named exports; no runtime namespace object.
 *
 *   • `LinkBack`    → ./LinkBack     — "← Back" / "← Back to {target}".
 *   • `LinkSeeMore` → ./LinkSeeMore  — "See more →" / "Continue →".
 *   • `InlineLink`  → ./InlineLink  — muted text/icon press-link (Footer).
 */
export { LinkBack, LinkSeeMore, InlineLink }

export type { LinkBackProps } from "./LinkBack"
export type { LinkSeeMoreProps, LinkSeeMoreSize } from "./LinkSeeMore"
export type { InlineLinkProps, InlineLinkSize } from "./InlineLink"

/** Combined tier meta for the `Link.*` family — each member also exports its own. */
export const meta = [
    { tier: "atom", name: "LinkBack" },
    { tier: "atom", name: "LinkSeeMore" },
    { tier: "atom", name: "InlineLink" },
] as const
