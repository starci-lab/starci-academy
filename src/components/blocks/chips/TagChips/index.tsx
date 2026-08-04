"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { _TagChips, type TagChipsProps } from "./component"

/** Props the connected {@link TagChips} takes from its caller. */
export type TagChipsConnectedProps = Omit<TagChipsProps, "overflowLabel">

const DEFAULT_MAX_VISIBLE = 3

/**
 * Renders tags as `Chip`s, collapsing overflow into a +N chip — the CONNECTED
 * half: resolves the "+N more" overflow label via `t()`. See
 * `design/storybook/architecture/split.md`.
 *
 * @param props - {@link TagChipsConnectedProps}
 */
export const TagChips = ({ tags, maxVisible = DEFAULT_MAX_VISIBLE, ...props }: TagChipsConnectedProps) => {
    const t = useTranslations()
    const overflowCount = Math.max(0, tags.length - maxVisible)
    return (
        <_TagChips
            {...props}
            tags={tags}
            maxVisible={maxVisible}
            overflowLabel={t("common.tagsMore", { count: overflowCount })}
        />
    )
}
