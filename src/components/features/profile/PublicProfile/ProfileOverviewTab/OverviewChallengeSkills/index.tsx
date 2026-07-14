"use client"

import React from "react"
import { Typography } from "@heroui/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useProfileUsername } from "../../hooks/useProfileUsername"
import { buildDifficultySegments } from "../../ProfileChallengesTab/ProfileChallenges/difficultyMeta"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { useQueryUserSolvedChallengesSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserSolvedChallengesSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SegmentBar } from "@/components/blocks/stats/SegmentBar"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { StatPair } from "@/components/blocks/stats/StatPair"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { getLanguageColor, getLanguageLabel } from "@/modules/utils/language"

/** Props for {@link OverviewChallengeSkills}. */
export interface OverviewChallengeSkillsProps extends WithClassNames<undefined> {
    /** Section label, rendered outside the card (owned here, like every other self-contained section). */
    label: React.ReactNode
    /** Optional "see more" link on the label row. */
    onSeeMore?: () => void
    /** Text for the see-more link. */
    seeMoreLabel?: React.ReactNode
    /** Stretch the section (and its card) to fill the row's height. */
    fillHeight?: boolean
}

/**
 * Overview snapshot — skills proven by graded CHALLENGES, mirroring the "Kỹ năng
 * qua Luyện tập" card: a passed-count headline, the 4-tone DIFFICULTY
 * {@link SegmentBar}, then a language {@link SegmentBar} (brand legend, same as the
 * Challenges tab). A teaser only — the full submission list lives behind "Xem
 * thêm" in the Challenges tab. Owns its own `LabeledCard`, with `frameless`
 * computed HERE (not hardcoded) so the loaded snapshot (self-framed as a
 * `SurfaceListCard`) skips the outer `Card` — but the skeleton/empty/error
 * states, which have no bounded surface of their own, still get one. The fetch
 * goes through {@link AsyncContent}.
 *
 * @param props - {@link OverviewChallengeSkillsProps}
 */
export const OverviewChallengeSkills = ({ className, label, onSeeMore, seeMoreLabel, fillHeight }: OverviewChallengeSkillsProps) => {
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
            className={className}
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
                            <div className="flex flex-col gap-3">
                                {/* StatPair (count + label) + difficulty bar + language */}
                                <Skeleton.Metric />
                                <Skeleton.SegmentBar legendItems={4} />
                                <div className="flex flex-col gap-2">
                                    <Skeleton.Typography type="body-xs" width="1/4" />
                                    <Skeleton.SegmentBar legendItems={4} />
                                </div>
                            </div>
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
                        <div className="flex flex-col gap-3">
                            {/* passed count headline + difficulty distribution (4-tone) */}
                            <StatPair
                                value={challenges.length}
                                label={t("publicProfile.challengesCount")}
                            />
                            {difficultySegments.length > 0 ? (
                                <SegmentBar
                                    ariaLabel={`${challenges.length} ${t("publicProfile.challengesCount")}`}
                                    segments={difficultySegments}
                                />
                            ) : null}
                            {/* language breadth — same SegmentBar + brand legend as the Challenges tab */}
                            {langs.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                    <Typography type="body-xs" color="muted">
                                        {t("publicProfile.skillsSnapshot.languagesLabel")}
                                    </Typography>
                                    <SegmentBar
                                        ariaLabel={t("publicProfile.skillsSnapshot.languagesLabel")}
                                        segments={langs.map(([lang, count]) => ({
                                            key: lang,
                                            label: getLanguageLabel(lang),
                                            value: count,
                                            color: getLanguageColor(lang),
                                        }))}
                                    />
                                </div>
                            ) : null}
                        </div>
                    </SurfaceListCardItem>
                </SurfaceListCard>
            </AsyncContent>
        </LabeledCard>
    )
}
