import type { ReactNode } from "react"
import { Avatar, type AvatarSize } from "@sb-components/atoms/display/Avatar/Avatar"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * COMPOSITE — `IdentityContentRow`: avatar leading a byline line + whatever
 * content sits under it (comment body, actions, nested replies…). Extracted
 * 2026-07-29 (thầy: "gom màu đen thành block riêng") from `ContentCommentThread`,
 * which had this exact avatar+column shape hand-rolled inline — a second real
 * occurrence (`QaQuestionThread`'s own avatar+byline+body row) makes it a genuine
 * repeat, not a premature abstraction.
 *
 * ⭐⭐ GAP HISTORY (thầy, 2026-07-29, both revisions on the SAME day): first
 * chốt was "all 3 seams tight" (a deliberate denser override, not a `src`-
 * fidelity port). After seeing the actual render, thầy corrected avatar↔column
 * back to `grouped` ("xanh la gap-3") — too cramped in practice — while
 * byline↔children stayed `tight`. So: root `StackH` (avatar↔column) = `grouped`,
 * inner `StackV` (byline↔children) = `tight`. This is STILL the opposite call
 * from `ContentCommentThread`'s own byline-INTERNAL gap (`related`, matched to
 * real `CommentItem.tsx:101` `gap-2`) — that one lives INSIDE the caller-
 * supplied `byline` slot, unaffected by either of this composite's own seams.
 * Lesson: a gap decision made before seeing the real render is provisional —
 * verify empirically once it's actually on screen, don't treat the first chốt
 * as final just because it was explicit.
 *
 * `byline` and `children` are both free-form slots (§13b) — this composite has
 * no opinion on what a byline or a body IS (founder badge count differs between
 * `ContentCommentThread` and `QaQuestionThread`), only on the SHAPE: avatar
 * beside a column, byline on top of whatever comes after it.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link IdentityContentRow}. */
export interface IdentityContentRowProps {
    /** Avatar image url. Omitted → `Avatar`'s own generated/initials fallback chain. */
    avatarSrc?: string
    /** Display name driving the avatar's fallback + accessible label. */
    avatarName: string
    /** Stable seed for the avatar's generated fallback (usually the author id). */
    avatarSeed: string
    /** Avatar preset. Defaults to `"sm"`. */
    avatarSize?: AvatarSize
    /** Forwarded to the root `Stack` — draws the reply-thread indent guide one level deeper. */
    nested?: boolean
    /** The byline line — name/handle + any badges + timestamp. Caller composes it. */
    byline: ReactNode
    /** Whatever sits under the byline — body text, actions, nested replies… */
    children: ReactNode
    /** `true` → the whole row (avatar + byline) renders as its skeleton mirror. */
    isSkeleton?: boolean
    /** Extra classes on the root. */
    className?: string
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this composite so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Avatar + byline + content column. See the file header for the full contract.
 *
 * @param props - {@link IdentityContentRowProps}
 */
const IdentityContentRow = ({
    avatarSrc,
    avatarName,
    avatarSeed,
    avatarSize = "sm",
    nested = false,
    byline,
    children,
    isSkeleton = false,
    className,
    showAnatomy = false,
    anatPart,
}: IdentityContentRowProps) => (
    <StackH gap="grouped" align="start" nested={nested} className={className} anatPart={anatPart}>
        <Avatar
            src={avatarSrc}
            name={avatarName}
            seed={avatarSeed}
            size={avatarSize}
            isSkeleton={isSkeleton}
            showAnatomy={showAnatomy}
        />
        <StackV gap="tight" className="min-w-0 flex-1" anatPart={showAnatomy ? "StackV" : undefined}>
            {byline}
            {children}
        </StackV>
    </StackH>
)

export { IdentityContentRow }
