import { ArrowLeftIcon, SealCheckIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { AvatarGroup } from "@sb-components/composites/lists/AvatarGroup/AvatarGroup"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { FillAvailable } from "@sb-components/frames/FillAvailable/FillAvailable"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * BLOCK — `QaConversationHeader`: the top of an EXPANDED question thread —
 * collapse control, asker identity, who joined in, reply count.
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

/** Finite copy vocabulary for {@link QaConversationHeader} — never ReactNode. */
export interface QaConversationHeaderLabels {
    /** Accessible label for the collapse control. */
    collapse: string
    /** Formats the asker identity line from a display name. */
    askedBy: (displayName: string) => string
    /** Formats the reply-count fact when `replyCount > 0`. */
    replies: (count: number) => string
    /** Nudge shown when nobody has answered yet. */
    beFirst: string
    /** Accessible label for the founder seal beside the asker. */
    founderBadge: string
    /** Follow control label when the viewer is not following. */
    follow: string
    /** Follow control label when the viewer is already following. */
    following: string
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
    /**
     * Optional copy override. Omitted → English defaults owned inside the block.
     * Named strings/formatters only — not ReactNode.
     */
    labels?: QaConversationHeaderLabels
}

/** English defaults — match prior Storybook copy when `labels` is omitted. */
const DEFAULT_LABELS: QaConversationHeaderLabels = {
    collapse: "Collapse conversation",
    askedBy: (displayName) => displayName,
    replies: (count) => `${count} people have answered`,
    beFirst: "Be the first to answer",
    founderBadge: "Founder",
    follow: "Follow",
    following: "Following",
}

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
    labels,
}: QaConversationHeaderProps) => {
    const L = labels ?? DEFAULT_LABELS
    const replyLine = replyCount > 0 ? L.replies(replyCount) : L.beFirst

    const nameRow = (
        <StackH
            gap={2}
            principle="icon-text"
            explain="Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity."
            align="center"
            isSkeleton={isSkeleton}
            items={isSkeleton
                ? [() => <Typography size="sm" weight="medium" isSkeleton />]
                : [
                    () => <Typography size="sm" weight="medium" text={L.askedBy(asker.displayName)} />,
                    ...(isFounderAsker ? [() => (
                        <SealCheckIcon
                            weight="fill"
                            aria-label={L.founderBadge}
                            focusable="false"
                            className="size-3.5 shrink-0 text-accent-soft-foreground"
                        />
                    )] : []),
                ]}
        />
    )

    const identityColumn = (
        <FillAvailable
            at="base"
            isSkeleton={isSkeleton}
            body={() => (
                <StackV
                    gap={1}
                    isSkeleton={isSkeleton}
                    items={[
                        () => nameRow,
                        () => (isSkeleton ? (
                            <Typography size="xs" color="muted" isSkeleton />
                        ) : (
                            <Typography size="xs" color="muted" text={replyLine} />
                        )),
                    ]}
                />
            )}
        />
    )

    return (
        <StackH
            identity={{ tier: "block", component: "QaConversationHeader" }}
            gap={4}
            principle="content-row"
            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
            align="center"
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <Button
                        isIconOnly
                        variant="ghost"
                        size="sm"
                        prefixIcon={ArrowLeftIcon}
                        ariaLabel={L.collapse}
                        onPress={onCollapse}
                        isDisabled={isSkeleton}
                    />
                ),
                () => (
                    <Avatar
                        src={asker.avatarUrl}
                        name={asker.displayName}
                        seed={asker.id}
                        size="sm"
                        isSkeleton={isSkeleton}
                    />
                ),
                () => identityColumn,
                ...(participants.length > 0 ? [() => (
                    <AvatarGroup
                        items={participants.map((p) => ({ key: p.id, src: p.avatarUrl, name: p.displayName, seed: p.id }))}
                        size="sm"
                        isSkeleton={isSkeleton}
                    />
                )] : []),
                ...(canFollow ? [() => (
                    <Button
                        variant={isFollowing ? "secondary" : "primary"}
                        size="sm"
                        label={isFollowing ? L.following : L.follow}
                        onPress={onToggleFollow}
                        isDisabled={isSkeleton || isFollowPending}
                    />
                )] : []),
            ]}
        />
    )
}

export { QaConversationHeader }
