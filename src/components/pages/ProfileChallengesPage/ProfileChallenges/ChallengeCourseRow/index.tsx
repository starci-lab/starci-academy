"use client"

import React from "react"
import {
    Typography,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    PuzzlePieceIcon,
} from "@phosphor-icons/react"
import {
    buildDifficultySegments,
} from "@/modules/utils/challenge-difficulty"
import { pathConfig } from "@/resources/path"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { SegmentBar } from "@/components/composites/stats/SegmentBar"
import { SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { StackH, StackV } from "@/components/frames/Stack"
import type { QueryUserSolvedChallengeItemData } from "@/modules/api/graphql/queries/types/user-solved-challenges"

/** Props for {@link ChallengeCourseRow}. */
export interface ChallengeCourseRowProps {
    /** Profile owner's username — routes the row to `.challenges().course(courseSlug)`. */
    username: string | null
    /** Course title for this group, or null for ungrouped (V1-legacy) rows. */
    courseTitle: string | null
    /** SEO-friendly slug of the course, or null when unresolved (V1-legacy) — the row is non-interactive without it. */
    courseSlug: string | null
    /** Solved-challenge rows under this course, in source order (list-item data). */
    items: Array<QueryUserSolvedChallengeItemData>
    /**
     * Total challenges in the course — makes the bar a PROGRESS bar (done coloured
     * by difficulty, the rest the empty track). Omit/0 → pure passed-mix (100% fill).
     */
    totalChallenges?: number
}

/**
 * One course group on the Challenges tab: a framed puzzle {@link IconTile}, the
 * course title, a 4-tone difficulty {@link SegmentBar} and a passed-count summary.
 * The WHOLE glance row is a nav link (row-as-link, hover underlines the title) to
 * the per-course MANAGE page (`.challenges().course(courseSlug)`) — search /
 * filter / sort of that course's submissions lives there, not inline here.
 *
 * @param props - {@link ChallengeCourseRowProps}
 */
export const ChallengeCourseRow = ({
    username,
    courseTitle,
    courseSlug,
    items,
    totalChallenges}: ChallengeCourseRowProps) => {
    const t = useTranslations()
    const locale = useLocale()

    const segments = buildDifficultySegments(items)
    const href = username && courseSlug
        ? pathConfig().locale(locale).profile(username).challenges().course(courseSlug).build()
        : undefined

    return (
        <SurfaceListCardItem
            href={href}
            hover="underline"
        >
            <StackH gap={4} principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                align="start" items={[
                    () => (
                        <IconTile
                            size="sm"
                            icon={<PuzzlePieceIcon aria-hidden focusable="false" />}
                        />
                    ),
                    () => (
                        <StackV gap={3} principle="sibling-stack"
                            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                            classNames={["min-w-0", "flex-1"]} items={[
                                () => (
                                    <Typography
                                        type="body-sm"
                                        weight="medium"
                                        truncate
                                        className={href ? "underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline" : undefined}
                                    >
                                        {courseTitle ?? t("publicProfile.challengesTab.ungrouped")}
                                    </Typography>
                                ),
                                () => (
                                    <SegmentBar
                                        hideLegend
                                        max={totalChallenges && totalChallenges > 0 ? totalChallenges : undefined}
                                        ariaLabel={t("publicProfile.challengesTab.submissionCount", { count: items.length })}
                                        segments={segments}
                                    />
                                ),
                                () => (
                                    <Typography type="body-xs" color="muted">
                                        {totalChallenges && totalChallenges > 0
                                            ? t("publicProfile.challengesTab.submissionProgress", { passed: items.length, total: totalChallenges })
                                            : t("publicProfile.challengesTab.submissionCount", { count: items.length })}
                                    </Typography>
                                ),
                            ]} />
                    ),
                ]} />
        </SurfaceListCardItem>
    )
}
