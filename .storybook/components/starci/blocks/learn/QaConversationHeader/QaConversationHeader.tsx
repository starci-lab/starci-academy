import { ArrowLeftIcon, SealCheckIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { AvatarGroup } from "@sb-components/atoms/display/Avatar/AvatarGroup"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `QaConversationHeader`: the top of an EXPANDED `QaQuestionThread` —
 * a collapse control, the asker's identity, who else joined in (an
 * {@link AvatarGroup}), and the reply count (or a "be first" nudge when
 * nobody has answered yet). Split out of `QaQuestionThread` rather than
 * inlined because that block's own header notes it is one of four siblings
 * `QaQuestionThread` composes but does not itself build (§"ASSUMED CONTRACTS").
 *
 * ⚠️ `canFollow`/`isFollowing`/`onToggleFollow`/`isFollowPending` are on the
 * contract but UNUSED by `QaQuestionThread`'s current call site — kept
 * optional so a future caller (or a later pass wiring the real follow
 * toggle back in) can light it up without a prop-shape change. Rendering
 * nothing when `canFollow` is falsy/absent is the correct default, not a
 * missing feature.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Minimal identity this header needs for the asker or a participant. */
export interface QaConversationHeaderPerson {
    /** Stable id. */
    id: string
    /** Display name, already resolved by the caller. */
    displayName: string
    /** Avatar image url. Omitted → generated/initials fallback. */
    avatarUrl?: string
}

/** Props for {@link QaConversationHeader}. */
export interface QaConversationHeaderProps {
    /** Who asked the question. */
    asker: QaConversationHeaderPerson
    /** `true` → a verified badge rides beside the asker's name. */
    isFounderAsker?: boolean
    /** Distinct people who have answered so far — rendered as an overlapping avatar row. */
    participants: ReadonlyArray<QaConversationHeaderPerson>
    /** Total replies (top-level + flattened). `0` swaps the count for a "be first" nudge. */
    replyCount: number
    /** Collapse back to the inbox-row view. */
    onCollapse: () => void
    /** `true` → the viewer can follow this thread for updates. Omit to hide the control entirely. */
    canFollow?: boolean
    /** `true` → the viewer already follows this thread. Only read when {@link canFollow}. */
    isFollowing?: boolean
    /** Follow/unfollow toggle. Only rendered when {@link canFollow}. */
    onToggleFollow?: () => void
    /** `true` → the follow toggle is mid-request (disables it). */
    isFollowPending?: boolean
    /** `true` → every part draws its own shimmer mirror. */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it. */
    anatPart?: string
}

/** The block's own count → label vocabulary (§14d.1) — never handed in pre-formatted. */
const replyLabel = (replyCount: number): string =>
    replyCount > 0 ? `${replyCount} người đã trả lời` : "Hãy là người đầu tiên trả lời"

/**
 * Collapse control + asker identity + who joined in + reply-count nudge, atop
 * an expanded {@link QaQuestionThread}.
 *
 * @param props - {@link QaConversationHeaderProps}
 */
const QaConversationHeader = ({
    asker,
    isFounderAsker,
    participants,
    replyCount,
    onCollapse,
    canFollow,
    isFollowing,
    onToggleFollow,
    isFollowPending,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: QaConversationHeaderProps) => (
    <div data-anat-part={anatPart}>
        <StackH gap="grouped" align="center" anatPart={showAnatomy ? "StackH" : undefined}>
            <Button
                isIconOnly
                variant="ghost"
                size="sm"
                prefixIcon={ArrowLeftIcon}
                ariaLabel="Thu gọn cuộc trò chuyện"
                onPress={onCollapse}
                isDisabled={isSkeleton}
                anatPart={showAnatomy ? "Button" : undefined}
            />

            <Avatar
                src={asker.avatarUrl}
                name={asker.displayName}
                seed={asker.id}
                size="sm"
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />

            <StackV gap="flush" className="min-w-0 flex-1" anatPart={showAnatomy ? "StackV" : undefined}>
                <StackH gap="tight" align="center" anatPart={showAnatomy ? "StackH" : undefined}>
                    {isSkeleton ? (
                        <Typography size="sm" weight="medium" isSkeleton className="w-24" anatPart={showAnatomy ? "Typography" : undefined} />
                    ) : (
                        <>
                            <Typography size="sm" weight="medium" text={asker.displayName} anatPart={showAnatomy ? "Typography" : undefined} />
                            {isFounderAsker ? (
                                <SealCheckIcon weight="fill" aria-hidden focusable="false" className="size-3.5 shrink-0 text-accent-soft-foreground" />
                            ) : null}
                        </>
                    )}
                </StackH>
                {isSkeleton ? (
                    <Typography size="xs" color="muted" isSkeleton className="w-32" anatPart={showAnatomy ? "Typography" : undefined} />
                ) : (
                    <Typography size="xs" color="muted" text={replyLabel(replyCount)} anatPart={showAnatomy ? "Typography" : undefined} />
                )}
            </StackV>

            {participants.length > 0 ? (
                <AvatarGroup
                    items={participants.map((p) => ({ key: p.id, src: p.avatarUrl, name: p.displayName, seed: p.id }))}
                    size="sm"
                    isSkeleton={isSkeleton}
                    showAnatomy={showAnatomy}
                />
            ) : null}

            {canFollow ? (
                <Button
                    variant={isFollowing ? "secondary" : "primary"}
                    size="sm"
                    label={isFollowing ? "Đang theo dõi" : "Theo dõi"}
                    onPress={onToggleFollow}
                    isDisabled={isSkeleton || isFollowPending}
                    anatPart={showAnatomy ? "Button" : undefined}
                />
            ) : null}
        </StackH>
    </div>
)

export { QaConversationHeader }
