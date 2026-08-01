import React from "react"
import { AsyncContentEmpty } from "@sb-components/composites/async/AsyncContent/AsyncContent"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `FoundationResourceEmpty`: the message shown when a foundation
 * resource id resolved to nothing (a stale link, a removed resource).
 *
 * WHY THIS EXISTS. §0's import boundary is exact: a screen calls blocks and
 * frames, never a composite directly (the one documented exception,
 * `CourseContents`'s `AsyncContentEmpty`, replaces the ENTIRE screen, not one
 * phase's one node — see `QuizPage.tsx`/`MockInterviewPage.tsx`/
 * `FlashcardReviewPage.tsx` for the same rule stated at each of their own
 * partial swaps). `FoundationResourcePage`'s `isEmpty` branch replaces only
 * its identity + body pair, not the whole screen, so it cannot reach for
 * `AsyncContentEmpty` itself — this one-node block holds that composite
 * instead, the same idiom `MockInterviewAnswerAction` uses to hold a bare
 * `Button` out of `MockInterviewPage`'s own tree.
 *
 * EARNS ITS LAYER (§10/`check-passthrough-block`): it owns its own Vietnamese
 * wording (§14d.1) — the caller passes no title/description in, this block's
 * copy is fixed to the one message this empty state means.
 *
 * NO `isSkeleton`. A resolved-to-nothing message has no loading shape of its
 * own to mirror — either the id resolved or it didn't.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link FoundationResourceEmpty}. */
export interface FoundationResourceEmptyProps {
    /** When on, emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * The foundation resource's own empty message. See the file header for why
 * this exists as its own block instead of a bare `AsyncContentEmpty` in the
 * screen tree.
 *
 * @param props - {@link FoundationResourceEmptyProps}
 */
const FoundationResourceEmpty = ({ showAnatomy = false, anatPart }: FoundationResourceEmptyProps) => (
    <AsyncContentEmpty
        anatPart={anatPart ?? (showAnatomy ? "AsyncContentEmpty" : undefined)}
        title="This category doesn't have any resources yet."
    />
)

export { FoundationResourceEmpty }
