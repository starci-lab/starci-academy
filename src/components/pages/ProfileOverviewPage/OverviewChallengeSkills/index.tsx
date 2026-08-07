"use client"

import React from "react"
import { Typography } from "@heroui/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useProfileUsername } from "@/hooks/profile/useProfileUsername"
import { buildDifficultySegments } from "@/modules/utils/challenge-difficulty"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { useQueryUserSolvedChallengesSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserSolvedChallengesSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SegmentBar } from "@/components/composites/stats/SegmentBar"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { StatPair } from "@/components/composites/stats/StatPair"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { StackV } from "@/components/frames/Stack"
import { getLanguageColor, getLanguageLabel } from "@/modules/utils/language"

/** Props for {@link OverviewChallengeSkills}. */
export interface OverviewChallengeSkillsProps extends WithClassNames<undefined> {
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
 * more" in the Challenges tab. Owns its own `LabeledCard`, with `frameless`
 * computed HERE (not hardcoded) so the loaded snapshot (self-framed as a
 * `SurfaceListCard`) skips the outer `Card` — but the skeleton/empty/error
 * states, which have no bounded surface of their own, still get one. The fetch
 * goes through {@link AsyncContent}.
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
    const hasChallenges = !(isLoading || !userId) && !error && challenges.length > 0

    return (
        <LabeledCard

            label={label}
            onSeeMore={onSeeMore}
            seeMoreLabel={seeMoreLabel}
            fillHeight={fillHeight}
            frameless={hasChallenges}
        >
            <AsyncContent
                isLoading={(isLoading || !userId) && challenges.length === 0}
                skeleton={(
                    <SurfaceListCard>
                        <SurfaceListCardItem>
                            {/* gap-only column: vertical peers at house step 4 (12px) — no step-4 peer-stack token */}
                            <StackV gap={4} items={[
                                () => <Skeleton.Metric />,
                                () => <Skeleton.SegmentBar legendItems={4} />,
                                () => (
                                    <StackV gap={3} principle="sibling-stack"
                                        explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                        items={[
                                            () => <Skeleton.Typography type="body-xs" width="1/4" />,
                                            () => <Skeleton.SegmentBar legendItems={4} />,
                                        ]} />
                                ),
                            ]} />
                        </SurfaceListCardItem>
                    </SurfaceListCard>
                )}
                isEmpty={challenges.length === 0}
                emptyContent={{ title: t("publicProfile.skills.empty") }}
                error={challenges.length === 0 ? error : undefined}
                errorContent={{
                    title: t("publicProfile.loadError"),
                    onRetry: () => { void mutate() },
                    retryLabel: t("publicProfile.loadErrorRetry"),
                }}
            >
                <SurfaceListCard className="h-full">
                    <SurfaceListCardItem>
                        <StackV gap={4} items={[
                            () => (
                                <StatPair
                                    value={String(challenges.length)}
                                    label={t("publicProfile.challengesCount")}
                                />
                            ),
                            ...(difficultySegments.length > 0
                                ? [() => (
                                    <SegmentBar
                                        ariaLabel={`${challenges.length} ${t("publicProfile.challengesCount")}`}
                                        segments={difficultySegments}
                                    />
                                )]
                                : []),
                            ...(langs.length > 0
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
                                                <SegmentBar
                                                    ariaLabel={t("publicProfile.skillsSnapshot.languagesLabel")}
                                                    segments={langs.map(([lang, count]) => ({
                                                        key: lang,
                                                        label: getLanguageLabel(lang),
                                                        value: count,
                                                        color: getLanguageColor(lang),
                                                    }))}
                                                />
                                            ),
                                        ]} />
                                )]
                                : []),
                        ]} />
                    </SurfaceListCardItem>
                </SurfaceListCard>
            </AsyncContent>
        </LabeledCard>
    )
}
