import { ArrowLeftIcon, SealCheckIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { AvatarGroup } from "@sb-components/composites/lists/AvatarGroup/AvatarGroup"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
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
}

/** The block's own count → label vocabulary (§14d.1) — never handed in pre-formatted. */
const replyLabel = (replyCount: number): string =>
    replyCount > 0 ? `${replyCount} people have answered` : "Be the first to answer"

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
}: QaConversationHeaderProps) => {
    const nameRow = (
        <StackH
            gap={2}
            principles="icon-text"
            align="center"
            isSkeleton={isSkeleton}

            items={isSkeleton
                ? [() => <Typography size="sm" weight="medium" isSkeleton />]
                : [
                    () => <Typography size="sm" weight="medium" text={asker.displayName} />,
                    ...(isFounderAsker ? [() => (
                        <SealCheckIcon weight="fill" aria-hidden focusable="false" className="size-3.5 shrink-0 text-accent-soft-foreground" />
                    )] : []),
                ]}
        />
    )

    const identityColumn = (
        <StackV
            gap={1}
            classNames={["min-w-0", "flex-1"]}
            isSkeleton={isSkeleton}

            items={[
                () => nameRow,
                () => (isSkeleton ? (
                    <Typography size="xs" color="muted" isSkeleton />
                ) : (
                    <Typography size="xs" color="muted" text={replyLabel(replyCount)} />
                )),
            ]}
        />
    )

    const headerRow = (
        <>
            <Button
                isIconOnly
                variant="ghost"
                size="sm"
                prefixIcon={ArrowLeftIcon}
                ariaLabel="Collapse conversation"
                onPress={onCollapse}
                isDisabled={isSkeleton}

            />

            <Avatar
                src={asker.avatarUrl}
                name={asker.displayName}
                seed={asker.id}
                size="sm"
                isSkeleton={isSkeleton}

            />

            {identityColumn}

            {participants.length > 0 ? (
                <AvatarGroup
                    items={participants.map((p) => ({ key: p.id, src: p.avatarUrl, name: p.displayName, seed: p.id }))}
                    size="sm"
                    isSkeleton={isSkeleton}

                />
            ) : null}

            {canFollow ? (
                <Button
                    variant={isFollowing ? "secondary" : "primary"}
                    size="sm"
                    label={isFollowing ? "Following" : "Follow"}
                    onPress={onToggleFollow}
                    isDisabled={isSkeleton || isFollowPending}

                />
            ) : null}
        </>
    )

    return (
        <div>
            <StackH gap={4} principles="content-row" align="center" isSkeleton={isSkeleton} items={[() => headerRow]} />
        </div>
    )
}

export { QaConversationHeader }
