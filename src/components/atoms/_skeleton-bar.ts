/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Shimmer bar that stands in for ONE LINE OF TEXT.
 *
 * WHY the arbitrary pixels are real work, not sloppiness: the bar has to occupy the same
 * LINE BOX as the text it replaces, otherwise the row changes height the moment data lands
 * — which is the one thing a skeleton exists to prevent. A `body-sm` line box is 20px and a
 * `body` line box is 24px; the bar itself is 14px, so it needs 3px / 5px of vertical margin
 * to fill the box. Neither 20, 24, 3 nor 5 is on the 10 scale (`0 · 1 · 2 · 3 · 6 · 8`
 * are gaps between things, not type metrics), so snapping them to the scale would move the
 * row by 6-10px. That is exactly the 4a case: do not bend a pinned metric to satisfy a
 * rule written for a different axis.
 *
 * WHY it lives here: the same string was hand-copied in SIX places (`Choice` x4,
 * `RemovableToken`, `Disclosure`). Six copies are six chances to drift, and the rule's own
 * escape hatch is "a real exception -> eslint-disable + a reason" — so the honest move is to
 * declare it once, with the reason, rather than six times without one.
 *
 * Prefer `Typography.Base isSkeleton` when the shimmer replaces a Typography line: the atom
 * owns its own resting shape (12c). Reach for these constants only where the row is built
 * from a raw HeroUI control and there is no Typography to ask.
 *
 * KNOWN HOLE, do not lean on it: `starci-fe/no-arbitrary-token` only inspects `className` in
 * JSX, so moving a class string into a `.ts` constant makes it INVISIBLE to that rule rather
 * than declaring an exception to it — an `eslint-disable` placed here is reported as unused.
 * That means this file is a pattern anyone could copy to smuggle off-scale classes past the
 * gate. It is used here because the values are genuinely type metrics (see above) and living
 * in one named place beats six copies, but the rule should be taught to read string constants
 * too; until then this file is the ONLY sanctioned home for such a string.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** 14px bar centred in the 24px line box of `body` — the default label line. */
export const SKELETON_TEXT_BAR = "my-[5px] h-[14px] rounded"

/** 14px bar centred in the 20px line box of `body-sm` — the tighter row label. */
export const SKELETON_TEXT_BAR_SM = "my-[3px] h-[14px] rounded"
