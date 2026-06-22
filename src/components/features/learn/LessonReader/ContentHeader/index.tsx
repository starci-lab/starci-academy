"use client"

import { CheckCircleIcon, ClockIcon, FlameIcon, TargetIcon } from "@phosphor-icons/react"
import _ from "lodash"
import { LabeledCard } from "@/components/blocks"
import React, {
    useMemo,
} from "react"
import {
    Chip,
    Typography,
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

    /** "What you'll learn" bullets, ordered (mount `# outcomes`); empty → callout hidden. */
    const outcomes = useMemo(
        () => _.sortBy(content?.outcomes ?? [], (outcome) => outcome.sortIndex),
        [content],
    )

    return (
        <div className="flex flex-col gap-6">
            {/* header proper (title + desc + meta) — all one content group → gap-3 */}
            <div className="flex flex-col gap-3">
                {/* title + description pair (gap-2 — same shape as the standard PageHeader) */}
                <div className="flex flex-col gap-2">
                    <Typography.Heading level={3} weight="bold">{title}</Typography.Heading>
                    {description ? (
                        <Typography type="body-sm" color="muted">{description}</Typography>
                    ) : null}
                </div>
                {/* Quiet meta row — default chips so the lesson title stays the one loud thing */}
                <div className="flex flex-wrap items-center gap-2">
                    <ReadBadge />
                    <Chip color="default">
                        <ClockIcon className="size-5" />
                        <Chip.Label>
                            {t("content.minutesRead", {
                                minutes: minutesRead,
                            })}
                        </Chip.Label>
                    </Chip>
                    <Chip color="default">
                        <FlameIcon className="size-5" />
                        <Chip.Label>
                            {t("content.challengeCount", {
                                count: challengeCount,
                            })}
                        </Chip.Label>
                    </Chip>
                </div>
            </div>
            {/* "What you'll learn" — separate section, OUTSIDE the header scope → gap-6 */}
            {outcomes.length > 0 ? (
                <LabeledCard
                    label={t("content.outcomes")}
                    icon={<TargetIcon className="size-5" />}
                >
                    <ul className="flex flex-col gap-2">
                        {outcomes.map((outcome) => (
                            <li key={outcome.id} className="flex items-start gap-2">
                                <CheckCircleIcon className="mt-0.5 size-5 shrink-0 text-success" />
                                <Typography type="body-sm">{outcome.text}</Typography>
                            </li>
                        ))}
                    </ul>
                </LabeledCard>
            ) : null}
        </div>
    )
}
