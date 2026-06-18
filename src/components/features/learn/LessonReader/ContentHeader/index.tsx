"use client"

import { ClockIcon, FlameIcon } from "@phosphor-icons/react"
import React, {
    useMemo,
} from "react"
import {
    Chip,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useAppSelector,
} from "@/redux"
import {
    getContentChallengeCount,
} from "@/modules/types"
import {
    ReadBadge,
} from "../ReadBadge"

/**
 * Title, description and meta-chip row (reading time, challenges, read state)
 * for the loaded content view.
 *
 * Self-contained section (single-use): reads the content entity + read state
 * from redux; the container renders `<ContentHeader />` with no props.
 */
export const ContentHeader = () => {
    const t = useTranslations()
    const content = useAppSelector((state) => state.content.entity)
    const title = content?.title
    const description = content?.description
    const minutesRead = content?.minutesRead ?? 0

    /** Challenge count for the meta chip, tolerant of a missing entity. */
    const challengeCount = useMemo(
        () => getContentChallengeCount(content ?? {}),
        [content],
    )

    return (
        <div className="p-3">
            <div className="text-2xl font-bold">{title}</div>
            <div className="h-3" />
            <div className="text-sm text-muted">{description}</div>
            <div className="h-3" />
            <div className="flex items-center gap-2">
                <ReadBadge />
                <Chip variant="secondary" color="accent">
                    <ClockIcon className="size-5" />
                    <Chip.Label>
                        {t("content.minutesRead", {
                            minutes: minutesRead,
                        })}
                    </Chip.Label>
                </Chip>
                <Chip variant="secondary" color="accent">
                    <FlameIcon className="size-5" />
                    <Chip.Label>
                        {t("content.challengeCount", {
                            count: challengeCount,
                        })}
                    </Chip.Label>
                </Chip>
            </div>
        </div>
    )
}
