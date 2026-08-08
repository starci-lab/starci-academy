"use client"

import React from "react"
import { Typography } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useProfileUsername } from "@/hooks/profile/useProfileUsername"
import { buildDifficultySegments } from "@/modules/utils/challenge-difficulty"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { useQueryUserSolvedChallengesSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserSolvedChallengesSwr"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { SegmentBar } from "@/components/composites/stats/SegmentBar"
import { StatPair } from "@/components/composites/stats/StatPair"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import type { SkeletonProps } from "@/components/frames/_slot"
import { StackV } from "@/components/frames/Stack"
import { getLanguageColor, getLanguageLabel } from "@/modules/utils/language"

/** Props for {@link OverviewChallengeSkills}. */
export interface OverviewChallengeSkillsProps {
    /** Section label, rendered outside the card (owned here, like every other self-contained section). */
    label: string
    /** Optional "see more" link on the label row. */
    onSeeMore?: () => void
    /** Text for the see-more link. */
    seeMoreLabel?: string
    /** Stretch the section (and its card) to fill the row's height. */
    fillHeight?: boolean
}

/**
 * Overview snapshot — skills proven by graded CHALLENGES, mirroring the "Skills
 * via Practice" card: a passed-count headline, the 4-tone DIFFICULTY
 * {@link SegmentBar}, then a language {@link SegmentBar} (brand legend, same as the
 * Challenges tab). A teaser only — the full submission list lives behind "See
 * more" in the Challenges tab. One labeled {@link SurfaceCardList} owns the
 * section header, empty/error, and `isSkeleton` (B37 class C collapse — no outer
 * `LabeledCard` frameless shell).
 *
 * @param props - {@link OverviewChallengeSkillsProps}
 */
export const OverviewChallengeSkills = ({ label, onSeeMore, seeMoreLabel, fillHeight }: OverviewChallengeSkillsProps) => {
    const t = useTranslations()
    const username = useProfileUsername()
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const { data, isLoading, error, mutate } = useQueryUserSolvedChallengesSwr(userId)

    const challenges = data ?? []
    // difficulty distribution across all passed challenges
    const difficultySegments = buildDifficultySegments(challenges)
    // language breadth: count per language, skipping rows with no language (V1-legacy)
    const langCounts = challenges.reduce<Record<string, number>>((acc, challenge) => {
        if (!challenge.selectedLang) {
            return acc
        }
        acc[challenge.selectedLang] = (acc[challenge.selectedLang] ?? 0) + 1
        return acc
    }, {})
    const langs = Object.entries(langCounts).sort((a, b) => b[1] - a[1])
    const isFirstLoad = (isLoading || !userId) && challenges.length === 0
    const showError = challenges.length === 0 && Boolean(error)

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
                                    value={String(challenges.length)}
                                    label={t("publicProfile.challengesCount")}
                                />
                            )
                    ),
                    ...(shimmer || difficultySegments.length > 0
                        ? [() => (
                            shimmer
                                ? (
                                    <SegmentBar
                                        isSkeleton
                                        ariaLabel={`${challenges.length} ${t("publicProfile.challengesCount")}`}
                                    />
                                )
                                : (
                                    <SegmentBar
                                        ariaLabel={`${challenges.length} ${t("publicProfile.challengesCount")}`}
                                        segments={difficultySegments}
                                    />
                                )
                        )]
                        : []),
                    ...(shimmer || langs.length > 0
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
                                                    segments={langs.map(([lang, count]) => ({
                                                        key: lang,
                                                        label: getLanguageLabel(lang),
                                                        value: count,
                                                        color: getLanguageColor(lang),
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
                <AsyncContentEmpty title={t("publicProfile.skills.empty")} />
            )}
            items={isFirstLoad || challenges.length > 0 ? snapshotItems : []}
        />
    )
}
