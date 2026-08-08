"use client"

import React from "react"
import { Typography } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useProfileUsername } from "@/hooks/profile/useProfileUsername"
import { useQueryUserCodingSkillsSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserCodingSkillsSwr"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { SegmentBar } from "@/components/composites/stats/SegmentBar"
import { StatPair } from "@/components/composites/stats/StatPair"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import type { SkeletonProps } from "@/components/frames/_slot"
import { StackV } from "@/components/frames/Stack"
import { getLanguageColor, getLanguageLabel } from "@/modules/utils/language"

/** Props for {@link OverviewCodeSkills}. */
export interface OverviewCodeSkillsProps {
    /** Section label, rendered outside the card (owned here, like every other self-contained section). */
    label: string
    /** Optional "see more" link on the label row. */
    onSeeMore?: () => void
    /** Text for the see-more link. */
    seeMoreLabel?: string
    /** Stretch the section (and its card) to fill the row's height. */
    fillHeight?: boolean
}

/** Capitalize the first character of a key for display. */
const capitalizeKey = (key: string): string =>
    key.charAt(0).toUpperCase() + key.slice(1)

/** Slice colour per difficulty bucket (semantic). */
const DIFF_COLOR: Record<string, string> = {
    easy: "var(--success)",
    medium: "var(--warning)",
    hard: "var(--danger)",
}

/**
 * Overview content — skills proven by solving CODE PROBLEMS (the practice judge):
 * total solved + difficulty depth chips + top-language chips with real counts.
 * One labeled {@link SurfaceCardList} owns the section header, empty/error, and
 * `isSkeleton` (B37 class C collapse — no outer `LabeledCard` frameless shell).
 * Counts are real, never relative-to-max, so 2 solves never looks like mastery.
 *
 * @param props - {@link OverviewCodeSkillsProps}
 */
export const OverviewCodeSkills = ({ label, onSeeMore, seeMoreLabel, fillHeight }: OverviewCodeSkillsProps) => {
    const t = useTranslations()
    const username = useProfileUsername()
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const { data, isLoading, error, mutate } = useQueryUserCodingSkillsSwr(userId)

    const byLanguage = data?.byLanguage ?? []
    const byDifficulty = data?.byDifficulty ?? []
    const totalSolved = byDifficulty.reduce((acc, d) => acc + d.solved, 0)
        || byLanguage.reduce((acc, l) => acc + l.solved, 0)
    const orderedLanguages = [...byLanguage].sort((a, b) => b.solved - a.solved)
    const isFirstLoad = (isLoading || !userId) && totalSolved === 0 && !data
    const showError = !data && error

    /** Localized label for a difficulty bucket; falls back to the capitalized key. */
    const diffLabel = (key: string): string => {
        const labels: Record<string, string> = {
            easy: t("publicProfile.skillsSnapshot.diffEasy"),
            medium: t("publicProfile.skillsSnapshot.diffMedium"),
            hard: t("publicProfile.skillsSnapshot.diffHard"),
        }
        return labels[key] ?? capitalizeKey(key)
    }

    const snapshotItems: Array<SurfaceCardListItem> = [{
        key: "snapshot",
        content: ({ isSkeleton: rowSkeleton }: SkeletonProps) => {
            const shimmer = rowSkeleton ?? isFirstLoad
            return (
                <StackV gap={4} items={[
                    () => (
                        shimmer
                            ? <StatPair isSkeleton />
                            : (
                                <StatPair
                                    value={String(totalSolved)}
                                    label={t("publicProfile.skillsSnapshot.solvedLabel")}
                                />
                            )
                    ),
                    () => (
                        shimmer
                            ? (
                                <SegmentBar
                                    isSkeleton
                                    ariaLabel={`${totalSolved} ${t("publicProfile.skillsSnapshot.solvedLabel")}`}
                                />
                            )
                            : (
                                <SegmentBar
                                    ariaLabel={`${totalSolved} ${t("publicProfile.skillsSnapshot.solvedLabel")}`}
                                    segments={byDifficulty.map((d) => ({
                                        key: d.key,
                                        label: diffLabel(d.key),
                                        value: d.solved,
                                        color: DIFF_COLOR[d.key],
                                    }))}
                                />
                            )
                    ),
                    ...(shimmer || orderedLanguages.length > 0
                        ? [() => (
                            <StackV gap={3} principle="sibling-stack"
                                explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                items={[
                                    () => (
                                        <Typography type="body-xs" color="muted">
                                            {t("publicProfile.skillsSnapshot.languagesLabel")}
                                        </Typography>
                                    ),
                                    () => (
                                        shimmer
                                            ? (
                                                <SegmentBar
                                                    isSkeleton
                                                    ariaLabel={t("publicProfile.skillsSnapshot.languagesLabel")}
                                                />
                                            )
                                            : (
                                                <SegmentBar
                                                    ariaLabel={t("publicProfile.skillsSnapshot.languagesLabel")}
                                                    segments={orderedLanguages.map((lang) => ({
                                                        key: lang.key,
                                                        label: getLanguageLabel(lang.key),
                                                        value: lang.solved,
                                                        color: getLanguageColor(lang.key),
                                                    }))}
                                                />
                                            )
                                    ),
                                ]} />
                        )]
                        : []),
                ]} />
            )
        },
    }]

    return (
        <SurfaceCardList
            label={label}
            onSeeMore={onSeeMore}
            seeMoreLabel={seeMoreLabel}
            fillHeight={fillHeight}
            isSkeleton={isFirstLoad}
            error={showError ? error : undefined}
            errorState={() => (
                <AsyncContentError
                    title={t("publicProfile.loadError")}
                    onRetry={() => { void mutate() }}
                    retryLabel={t("publicProfile.loadErrorRetry")}
                />
            )}
            emptyState={() => (
                <AsyncContentEmpty
                    title={t("publicProfile.skills.empty")}
                    description={t("publicProfile.skills.emptyHint")}
                />
            )}
            items={isFirstLoad || totalSolved > 0 ? snapshotItems : []}
        />
    )
}
