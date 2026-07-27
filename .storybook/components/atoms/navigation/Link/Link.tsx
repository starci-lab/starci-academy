import { LinkBack } from "./LinkBack"
import { LinkSeeMore } from "./LinkSeeMore"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Link.*`: namespace of the arrow text-link family. This file ONLY
 * gathers them together, no logic of its own.
 *
 * 2026-07-26 (teacher's call, §12a): merged `BackLink` + `SeeMoreLink` — two
 * SEPARATE components before, both wrapping HeroUI `Link` directly and both
 * being ONE shape ("text-link + arrow"), differing only by arrow direction +
 * text. "Back" and "see more" aren't two different concepts — keeping them
 * apart = two entry points into the same thing, the exact disease `Chip.*`
 * already cured.
 *
 * Each member gets its own FILE (following the `Button/`/`Choice/` mould) so
 * the relationship between them is a REAL, readable `import`:
 *   • `Link.Back`    → ./LinkBack     — "← Back" / "← Back to {target}".
 *   • `Link.SeeMore` → ./LinkSeeMore  — "Xem thêm →" / "Tiếp tục →".
 *
 * §12a: declared via `Object.assign` (NOT a bare object literal) — the root
 * must be a callable-namespace. Calling the root directly = `Link.Back`, the
 * SIMPLEST shape of the family (no `size`/`decorative` union) — same
 * convention `Choice` follows with `Choice.Checkbox` as root. The two
 * members do NOT rebuild each other (neither imports the other), so this
 * family has no internal deps.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const Link = Object.assign(LinkBack, {
    Back: LinkBack,
    SeeMore: LinkSeeMore,
})

export type { LinkBackProps } from "./LinkBack"
export type { LinkSeeMoreProps, LinkSeeMoreSize } from "./LinkSeeMore"
