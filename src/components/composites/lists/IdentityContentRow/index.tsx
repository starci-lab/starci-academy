import { Avatar, type AvatarSize } from "@/components/atoms/display/Avatar"
import { StackH, StackV } from "@/components/frames/Stack"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import type { ComponentTypeWithSkeleton } from "@/components/composites/_slot"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * COMPOSITE — `IdentityContentRow`: avatar leading a byline line + whatever
 * content sits under it (comment body, actions, nested replies…). Extracted
 * 2026-07-29 (teacher: "group the recurring shape into its own block") from
 * `ContentCommentThread`, which had this exact avatar+column shape hand-rolled
 * inline — a second real occurrence (`QaQuestionThread`'s own avatar+byline+body
 * row) makes it a genuine repeat, not a premature abstraction.
 *
 * ⭐⭐ GAP HISTORY (teacher, 2026-07-29, both revisions on the SAME day): the
 * first decision was "all 3 seams tight" (a deliberate denser override, not a
 * `src`-fidelity port). After seeing the actual render, the teacher corrected
 * avatar↔column back to `grouped` (a visibly wider `gap-3`) — too cramped in
 * practice — while byline↔children stayed `tight`. So: root `StackH`
 * (avatar↔column) = `grouped`, inner `StackV` (byline↔children) = `tight`. This
 * is STILL the opposite call from `ContentCommentThread`'s own byline-INTERNAL
 * gap (`related`, matched to real `CommentItem.tsx:101` `gap-2`) — that one
 * lives INSIDE the caller-supplied `byline` slot, unaffected by either of this
 * composite's own seams. Lesson: a gap decision made before seeing the real
 * render is provisional — verify empirically once it's actually on screen,
 * don't treat the first decision as final just because it was explicit.
 *
 * `byline` and `body` are both free-form slots (§13b) — this composite has
 * no opinion on what a byline or a body IS (founder badge count differs between
 * `ContentCommentThread` and `QaQuestionThread`), only on the SHAPE: avatar
 * beside a column, byline on top of whatever comes after it.
 *
 * 2026-07-31 (COMPOSITE-8 fix): `byline` and the former `children` prop are now
 * COMPONENT references (`ComponentType<{ isSkeleton?: boolean }>`), not built
 * nodes — the row calls each itself and forwards `isSkeleton`, so it can
 * actually shimmer them instead of only mirroring the `Avatar`. The former
 * `children` prop is renamed `body` to make the "you must pass a component, not
 * JSX children" contract explicit at the call site. This DOES break the one
 * live caller, `ContentCommentThread` (`.storybook/components/starci/blocks/
 * learn/ContentCommentThread/ContentCommentThread.tsx`) — that block lives
 * outside this composite's own folder, so its edit is recorded rather than
 * applied here (see the task's `externalCallerEdits`).
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
    /**
     * The byline line — name/handle + any badges + timestamp. A COMPONENT
     * reference (COMPOSITE-8): the row calls it itself, forwarding `isSkeleton`,
     * so the whole row — not just `Avatar` — can shimmer while loading.
     */
    byline: ComponentTypeWithSkeleton
    /**
     * Whatever sits under the byline — body text, actions, nested replies… Same
     * COMPONENT-reference contract as {@link IdentityContentRowProps.byline}
     * above. Named `body` (not `children`) so the "pass a component, not JSX
     * children" contract is explicit at the call site.
     */
    body: ComponentTypeWithSkeleton
    /** `true` → the whole row (avatar + byline) renders as its skeleton mirror. */
    isSkeleton?: boolean
    /** Layout utilities on the root, from the closed positioning union. */
    classNames?: Array<AllowedClassName>
}

/**
 * Avatar + byline + content column. See the file header for the full contract.
 *
 * @param props - {@link IdentityContentRowProps}
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "IdentityContentRow" } as const

const IdentityContentRow = ({
    avatarSrc,
    avatarName,
    avatarSeed,
    avatarSize = "sm",
    nested = false,
    byline: Byline,
    body: Body,
    isSkeleton = false,
    classNames}: IdentityContentRowProps) => (
    <StackH
        gap={4}
        pattern="content-row"
        align="start"
        nested={nested}
        classNames={classNames}
        items={[
            () => (
                <Avatar
                    src={avatarSrc}
                    name={avatarName}
                    seed={avatarSeed}
                    size={avatarSize}
                    isSkeleton={isSkeleton}
                />
            ),
            () => (
                <StackV
                    gap={2}
                    classNames={["min-w-0", "flex-1"]}
                    items={[
                        () => <Byline isSkeleton={isSkeleton} />,
                        () => <Body isSkeleton={isSkeleton} />,
                    ]}
                />
            ),
        ]}
    />
)

export { IdentityContentRow }
