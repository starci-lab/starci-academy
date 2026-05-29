"use client"

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
    CheckCircleIcon,
    ClockIcon,
    CodeIcon,
    SwordIcon,
} from "@phosphor-icons/react"
import {
    useAppSelector,
} from "@/redux"
import {
    getContentChallengeCount,
    getContentCodeExplainings,
    getContentCodeImplementations,
} from "@/modules/types"

/**
 * Title, description and meta-chip row (reading time, code lessons, challenges,
 * read state) for the loaded content view.
 *
 * Self-contained section (single-use): reads the content entity + read state
 * from redux and derives its own meta counts (code lessons, challenges), so the
 * container renders `<ContentHeader />` with no props.
 */
export const ContentHeader = () => {
    const t = useTranslations()
    const content = useAppSelector((state) => state.content.entity)
    const isRead = useAppSelector((state) => state.content.isRead)

    const title = content?.title
    const description = content?.description
    const minutesRead = content?.minutesRead ?? 0

    /** Combined count of code explainings + implementations for the meta chip. */
    const codeLessonCount = useMemo(
        () => getContentCodeExplainings(content).length
            + getContentCodeImplementations(content).length,
        [content],
    )

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
            <div className="flex items-center gap-2 flex-wrap">
                <Chip variant="secondary" color="accent">
                    <ClockIcon className="size-5" />
                    <Chip.Label>
                        {t("content.minutesRead", {
                            minutes: minutesRead,
                        })}
                    </Chip.Label>
                </Chip>
                <Chip variant="secondary" color="accent">
                    <CodeIcon className="size-5" />
                    <Chip.Label>
                        {t("content.codeLessonCount", {
                            count: codeLessonCount,
                        })}
                    </Chip.Label>
                </Chip>
                <Chip variant="secondary" color="accent">
                    <SwordIcon className="size-5" />
                    <Chip.Label>
                        {t("content.challengeCount", {
                            count: challengeCount,
                        })}
                    </Chip.Label>
                </Chip>
                {isRead && (
                    <Chip variant="secondary" color="success">
                        <CheckCircleIcon className="size-5" weight="fill" />
                        <Chip.Label>
                            {t("content.read")}
                        </Chip.Label>
                    </Chip>
                )}
            </div>
        </div>
    )
}
