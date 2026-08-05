/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FRAME TIER -- the SHARED IDENTITY vocabulary: how a root-capable frame (or a
 * composite standing in as one, e.g. `ModalShell`/`DrawerShell`) decides which
 * `data-tier`/`data-component` pair to wear on the element it renders.
 * Internal module (`_`-prefixed): it is a type + a resolver, NOT a component,
 * same convention as `_principles.ts`/`_spacing.ts` next to it.
 *
 * WHY THIS FILE EXISTS (teacher's ruling, 2026-08-05). Canon settled two rules
 * that read fine apart and fought on contact: `split.md`'s identity section
 * says every component emits `data-tier`/`data-component` unconditionally, and
 * `tiers/block.md` BLOCK-2 (mirrored by `layout.md`/`overlay.md`/`page.md`)
 * says a block never draws a shape of its own. ~85 files reconciled that by
 * keeping BOTH literally:
 *
 *     <div data-tier="page" data-component="X"><Container>...</Container></div>
 *
 * -- the page's identity hand-drawn on a raw div, wrapping the frame that draws
 * the REAL shape underneath it. That div is exactly the shape BLOCK-2 forbids;
 * the wrapper is not a compromise, it is the bug.
 *
 * THE FIX: the frame that is already the root wears the CALLER's identity
 * instead of its own. One element, one identity, drawn once -- never a second
 * div stacked on top just to hold a name. `ModalRoot`/`DrawerRoot` and
 * `ResponsiveCluster` already lived a version of this, each with its own
 * hand-typed `data-tier`/`data-component` pair; this file pulls that pattern
 * into ONE resolver so every root-capable frame reads it the same way instead
 * of N slightly different hand-rolled versions.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * The sentence tiers whose components never draw a shape of their own
 * (`tiers/block.md` BLOCK-2, and the matching rule in `layout.md` / `overlay.md`
 * / `page.md`) and therefore hand their identity down to whichever frame is
 * standing in as their root element. Closed to exactly those four -- `atom` /
 * `composite` / `frame` are vocabulary tiers that always name themselves
 * (`split.md`'s identity section) and never take a caller's name instead, so
 * they are not members of this union.
 */
export type IdentityTier = "block" | "layout" | "overlay" | "page"

/**
 * The identity a caller -- a `block`/`layout`/`overlay`/`page` component -- hands
 * down to the frame standing in as its root element, e.g.
 * `{ tier: "overlay", component: "PremiumGateModal" }`. Passed as the optional
 * `identity` prop every root-capable frame in this folder now takes.
 */
export interface CallerIdentity {
    /** The sentence tier the caller sits at -- see {@link IdentityTier}. */
    tier: IdentityTier
    /** The caller's own `data-component` name, e.g. `"PremiumGateModal"`. */
    component: string
}

/**
 * The resolved `data-tier`/`data-component` pair, spread directly onto a root
 * element (`<div {...resolveIdentity(identity, own)} ...>`). Both keys are
 * optional so an unresolved pair (`{}`) spreads onto JSX as no attributes at
 * all, rather than as `data-tier="undefined"`.
 */
export interface IdentityAttrs {
    "data-tier"?: string
    "data-component"?: string
}

/**
 * Resolve which `data-tier`/`data-component` pair a root element should carry.
 *
 * - `identity` supplied → the CALLER's pair. This element IS the caller's
 *   shape (BLOCK-2), so it wears the caller's name, not its own.
 * - `identity` absent, `own` supplied → the frame's OWN pair -- an ordinary
 *   frame instance with nobody standing on it. Every root-capable frame that
 *   already hard-codes `data-tier="frame" data-component="X"` today keeps
 *   doing exactly that by passing `{ tier: "frame", name: "X" }` (the same
 *   shape as its own `meta` export) as `own`.
 * - Both absent → `{}`. A frame with no identity of its own yet
 *   (`ResponsiveCluster` before this file, `LabeledCard`) renders no
 *   `data-tier`/`data-component` at all until a caller hands one down --
 *   identical to today's behaviour for every existing call site.
 *
 * `own` is typed as a plain `{ tier: string; name: string }`, not
 * {@link IdentityTier}, on purpose: it is the FRAME's own tier (`"frame"`,
 * or a composite's `"composite"`), never one of the four sentence tiers a
 * caller hands down -- the two vocabularies are different closed sets, and
 * `own` is not a member of {@link IdentityTier}'s.
 *
 * @param identity - The caller's identity, when this root is standing in for one.
 * @param own - This component's own `{ tier, name }`, when it has one to fall back to.
 */
export const resolveIdentity = (
    identity: CallerIdentity | undefined,
    own?: { tier: string; name: string },
): IdentityAttrs => {
    if (identity) return { "data-tier": identity.tier, "data-component": identity.component }
    if (own) return { "data-tier": own.tier, "data-component": own.name }
    return {}
}
