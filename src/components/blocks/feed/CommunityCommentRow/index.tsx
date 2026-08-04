"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { getTimeAgoLabel, getTimeAgoMessage } from "@/modules/dayjs"
import { _CommunityCommentRow, type CommunityCommentRowProps } from "./component"

/** Props the connected {@link CommunityCommentRow} takes from its caller. */
export type CommunityCommentRowConnectedProps = Omit<CommunityCommentRowProps, "deletedLabel" | "timeAgoLabel">

/**
 * One community comment row — the CONNECTED half: resolves the deleted
 * placeholder + relative timestamp via `t()`. See `design/storybook/architecture/split.md`.
 *
 * @param props - {@link CommunityCommentRowConnectedProps}
 */
export const CommunityCommentRow = ({ comment, ...props }: CommunityCommentRowConnectedProps) => {
    const t = useTranslations()

    return (
        <_CommunityCommentRow
            {...props}
            comment={comment}
            deletedLabel={t("community.comments.deleted")}
            timeAgoLabel={getTimeAgoLabel(getTimeAgoMessage(comment.createdAt), t)}
        />
    )
}
