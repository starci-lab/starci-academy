"use client"

import React from "react"
import { Button, Typography, cn } from "@heroui/react"
import {
    CaretUpIcon,
    SealCheckIcon,
} from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { UserAvatar } from "@/components/blocks/identity/UserAvatar"
import { AvatarGroup } from "@/components/blocks/identity/AvatarGroup"
import type { AvatarGroupUser } from "@/components/blocks/identity/AvatarGroup"
import { FollowButton } from "@/components/features/community/FollowButton"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link QaConversationHeader}. */
export interface QaConversationHeaderProps extends WithClassNames<undefined> {
    /** The asker (whose question opens the conversation). */
    asker: {
        /** Asker username (drives avatar fallback). */
        username: string
        /** Asker display name; falls back to username. */
        displayName?: string | null
        /** Asker avatar url, or null. */
        avatar?: string | null
    }
    /** Whether the asker is the founder (drives the verified badge). */
    isFounderAsker?: boolean
    /** Distinct people who have answered — shown as an overlapping avatar group. */
    participants: ReadonlyArray<AvatarGroupUser>
    /** Total answers (top-level + replies) — the "N trả lời" line. */
    replyCount: number
    /** Collapse the conversation back to its inbox row. */
    onCollapse: () => void
    /** Show a follow control for the asker (hidden for one's own question / signed out). */
    canFollow?: boolean
    /** Whether the viewer currently follows the asker. */
    isFollowing?: boolean
    /** Toggle following the asker; the parent owns the `setFollow` mutation. */
    onToggleFollow?: () => void
    /** True while the follow toggle is in flight. */
    isFollowPending?: boolean
}

/**
 * Header of an opened course-Q&A conversation: a collapse control, the asker's
 * identity (avatar + name + founder badge), and — on the right — who has joined in
 * (an {@link AvatarGroup} of distinct answerers) plus the answer count. When nobody
 * has answered yet it shows a gentle, honest nudge inviting the viewer to be first,
 * turning the empty state into a social prompt rather than a dead end.
 *
 * Presentational: identity + participants + follow state arrive via props; the parent
 * owns the `setFollow` mutation and hides the control on one's own question / when signed out.
 *
 * @param props - {@link QaConversationHeaderProps}
 */
export const QaConversationHeader = ({
    asker,
    isFounderAsker,
    participants,
    replyCount,
    onCollapse,
    canFollow = false,
    isFollowing = false,
    onToggleFollow,
    isFollowPending = false,
    className,
}: QaConversationHeaderProps) => {
    const t = useTranslations()
    const displayName = asker.displayName || asker.username
    const hasAnswers = replyCount > 0

    return (
        <div className={cn("flex flex-wrap items-center justify-between gap-3 border-b border-default pb-3", className)}>
            {/* collapse + asker identity + follow */}
            <div className="flex min-w-0 items-center gap-2">
                <Button
                    isIconOnly
                    size="sm"
                    variant="tertiary"
                    aria-label={t("courseQa.collapse")}
                    onPress={onCollapse}
                >
                    <CaretUpIcon aria-hidden className="size-4" />
                </Button>
                <UserAvatar
                    size="sm"
                    username={asker.username}
                    avatar={asker.avatar}
                    seed={asker.username}
                    className="shrink-0"
                />
                <div className="flex min-w-0 items-center gap-2">
                    <Typography type="body-sm" weight="semibold" className="truncate">
                        {t("courseQa.askedBy", { name: displayName })}
                    </Typography>
                    {isFounderAsker ? (
                        <SealCheckIcon
                            weight="fill"
                            aria-label={t("courseQa.founderBadge")}
                            className="size-3.5 shrink-0 text-accent-soft-foreground"
                        />
                    ) : null}
                </div>
                {/* follow the asker — quiet so it never competes with the composer's primary */}
                {canFollow ? (
                    <FollowButton
                        quiet
                        following={isFollowing}
                        isPending={isFollowPending}
                        onToggle={onToggleFollow}
                        className="ml-1 shrink-0"
                    />
                ) : null}
            </div>

            {/* who joined in + answer count, or an invite-to-answer nudge */}
            {hasAnswers ? (
                <div className="flex shrink-0 items-center gap-2">
                    {participants.length > 0 ? (
                        <AvatarGroup users={participants} max={4} />
                    ) : null}
                    <Typography type="body-xs" color="muted">
                        {t("courseQa.replyCount", { count: replyCount })}
                    </Typography>
                </div>
            ) : (
                <Typography type="body-xs" color="muted" className="shrink-0">
                    {t("courseQa.beFirstToAnswer")}
                </Typography>
            )}
        </div>
    )
}
