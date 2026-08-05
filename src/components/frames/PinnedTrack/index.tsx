import { cn } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import type { ComponentTypeWithSkeleton } from "@/components/composites/_slot"
import { principlesAttr, explainAttr, type PrincipleToken, type ExplainReason } from "@/components/frames/_principles"
import { resolveIdentity, type CallerIdentity } from "@/components/frames/_identity"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FRAME (frame) — `PinnedTrack`: a VERTICAL TRACK of exactly two roles — a
 * member that PINS to the top of its own scroll region, and a member that
 * FILLS whatever height the track has left below it.
 *
 * ⭐ WHY THIS FRAME EXISTS (teacher's ruling: when vocabulary is missing, CREATE
 * it). Real `src` — `InnerLayout/component.tsx` — hand-rolled both halves of
 * this shape and flagged the gap in place, twice over:
 *
 *   • `className="sticky top-0 z-40"` (~line 52), wrapping `Navbar`, with the
 *     comment *"Sticky positioning is a SHELL concern (only the root scroll
 *     container knows where the nav should pin)"* — no frame expressed "pin
 *     one item of a vertical track to the viewport top with a z-index".
 *   • `className="min-w-0 flex-1"` (~line 57), wrapping `children` — no frame
 *     expressed "a caller slot that grows to fill the remaining height of a
 *     vertical track".
 *
 * ONE FRAME, NOT TWO. The two gaps are the same shape read from either end: a
 * track's first member pins, its second fills the rest — one seam, two roles
 * of the same track, not two unrelated concerns. Checked `Stack` first
 * (§ the teacher's own instruction) and it cannot host this: `StackV`'s
 * `items`/`body` are anonymous — FRAME-2 forbids it from asking what a member
 * IS, and "pin the first one, stretch this one, tag that one `<main>`" is
 * exactly that question asked per-member. That is FRAME-9's "holds several
 * roles ⇒ one named slot each", the same reasoning that produced `Split` and
 * `SplitWorkspace` instead of overloading `Stack` for two-region shapes.
 *
 * FRAME API LAW (§13b): TWO distinct roles ⇒ TWO named slots (`pinned`/
 * `body`), never a single `children` — same contract as `SplitWorkspace`'s
 * `main`/`aside`.
 *
 * ⭐ `top-0 z-40` STAYS HARD-OWNED (§6c, same discipline as `SplitWorkspace`'s
 * `w-[360px]`). The one real consumer pins flush to the viewport top at the
 * app shell's own stacking layer — there is no second shape to generalize a
 * prop for yet; add one only when a second real consumer disagrees. The same
 * restraint applies to `min-w-0 flex-1` on `body`: hard-owned, not a prop,
 * because a filling track member never needs to do anything else.
 *
 * `landmark` NAMES THE ONE STRUCTURAL CHOICE A CALLER ACTUALLY MAKES: whether
 * `body` renders as the page's `<main>` element. An app shell needs exactly
 * ONE `<main>` per document (WAI-ARIA); a `PinnedTrack` nested inside another
 * track's own `body` must not mint a second one, so the tag is a prop, not
 * baked in either direction.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link PinnedTrack}. */
export interface PinnedTrackProps {
    /**
     * The member that pins to the top of the track's own scroll region —
     * REQUIRED, a track with nothing pinned is not this shape (use `StackV`
     * instead). Hard-owns `sticky top-0 z-40` — see the file header.
     */
    pinned: ComponentTypeWithSkeleton
    /**
     * The member that fills whatever height the track has left below
     * `pinned` — REQUIRED. Hard-owns `min-w-0 flex-1`.
     */
    body: ComponentTypeWithSkeleton
    /**
     * `true` → `body` renders inside a `<main>` landmark element instead of
     * a `<div>`. Set by the ONE caller that owns the page's shell; a nested
     * `PinnedTrack` leaves this `false` (default) so it never mints a second
     * `<main>`. See the file header.
     */
    landmark?: boolean
    /** Renders `pinned` and `body` in their skeleton state. */
    isSkeleton?: boolean
    /** Where this sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
    /**
     * The layout pattern this frame's seam realises — a token from `test-runner/patterns.mjs`
     * (`flex-action`, `label-field`, `group-boundary`, …). Emitted as `data-principles` on the element
     * that carries the gap, so the rendered-tree test can assert the seam is the step the pattern names.
     * A frame does not KNOW its pattern — the caller does — so it is passed in.
     */
    principles?: Array<PrincipleToken>
    /**
     * Why this layer exists — one sentence, emitted as `data-explain` beside the tokens.
     * A reason, never a restatement of `principles`; see `_principles.ts`.
     */
    explain?: ExplainReason
    /**
     * Set when a sentence-tier component roots on this frame: the track then emits
     * THAT component's identity instead of its own, so the caller never wraps itself
     * in an identity div (see `_identity.ts`).
     */
    identity?: CallerIdentity
}

/**
 * The pin-then-fill vertical track. See the file header for why this is its
 * own frame and why `landmark` is its only prop beyond the two slots.
 *
 * @param props - {@link PinnedTrackProps}
 */
const PinnedTrack = ({
    pinned: Pinned,
    body: Body,
    landmark = false,
    isSkeleton,
    classNames,
    principles,
    explain,
    identity}: PinnedTrackProps) => {
    const BodyTag = landmark ? "main" : "div"
    return (
        <div
            {...resolveIdentity(identity, { tier: "frame", name: "PinnedTrack" })}
            data-principles={principlesAttr(principles)}
            data-explain={explainAttr(explain)}
            className={cn("flex flex-col", classNames)}
        >
            {/* `pinned`/`body` are CALLER SLOTS — the node inside belongs to whoever passed it, not
                to this frame, so neither gets a badge of its own (same restraint as
                `SplitWorkspace`'s `main`/`aside`). */}
            <div className="sticky top-0 z-40">
                <Pinned isSkeleton={isSkeleton} />
            </div>
            <BodyTag className="min-w-0 flex-1">
                <Body isSkeleton={isSkeleton} />
            </BodyTag>
        </div>
    )
}

export { PinnedTrack }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "frame", name: "PinnedTrack" } as const
