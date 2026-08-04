"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { getTimeAgoLabel, getTimeAgoMessage } from "@/modules/dayjs"
import { _CommunityPostCard, type CommunityPostCardProps } from "./component"

/** Props the connected {@link CommunityPostCard} takes from its caller. */
export type CommunityPostCardConnectedProps = Omit<CommunityPostCardProps, "timeAgoLabel" | "channelLabel">

/**
 * One community feed post — the CONNECTED half: resolves the relative
 * timestamp + channel name via `t()`. See `design/storybook/architecture/split.md`.
 *
 * @param props - {@link CommunityPostCardConnectedProps}
 */
export const CommunityPostCard = ({ post, ...props }: CommunityPostCardConnectedProps) => {
    const t = useTranslations()

    return (
        <_CommunityPostCard
            {...props}
            post={post}
            timeAgoLabel={getTimeAgoLabel(getTimeAgoMessage(post.createdAt), t)}
            channelLabel={t(`community.channel.${post.channel}`)}
        />
    )
}
