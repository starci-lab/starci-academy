"use client"

import React from "react"
import { Typography, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import {
    useQueryUserProfileSwr,
    useQueryUserSolvedChallengesSwr,
} from "@/hooks"
import {
    AsyncContent,
    SegmentBar,
    Skeleton,
    StatPair,
} from "@/components/blocks"
import {
    getLanguageColor,
    getLanguageLabel,
} from "@/modules/utils"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useProfileUsername } from "../../hooks/useProfileUsername"
import { buildDifficultySegments } from "../../ProfileChallengesTab/ProfileChallenges/difficultyMeta"

/** Props for {@link OverviewChallengeSkills}. */
export type OverviewChallengeSkillsProps = WithClassNames<undefined>

/**
 * Overview snapshot — skills proven by graded CHALLENGES, mirroring the "Kỹ năng
 * qua Luyện tập" card: a passed-count headline, the 4-tone DIFFICULTY
 * {@link SegmentBar}, then a language {@link SegmentBar} (brand legend, same as the
 * Challenges tab). A teaser only — the full submission list lives behind "Xem
 * thêm" in the Challenges tab. Content only (no card): the parent
 * {@link import("@/components/blocks").LabeledCard} supplies the frame; the fetch
 * goes through {@link AsyncContent}.
 *
 * @param props - optional root class name (placement only)
 */
export const OverviewChallengeSkills = ({ className }: OverviewChallengeSkillsProps) => {
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

    return (
        <AsyncContent
            debug={true}
            isLoading={(isLoading || !userId) && challenges.length === 0}
            skeleton={(
                <div className="flex flex-col gap-3">
                    {/* StatPair (count + label) */}
                    <Skeleton.Metric />
                    {/* difficulty bar */}
                    <Skeleton.SegmentBar legendItems={4} />
                    {/* language label + bar */}
                    <div className="flex flex-col gap-2">
                        <Skeleton.Typography type="body-xs" width="1/4" />
                        <Skeleton.SegmentBar legendItems={4} />
                    </div>
                </div>
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
            <div className={cn("flex flex-col gap-3", className)}>
                {/* passed count headline */}
                <StatPair
                    value={challenges.length}
                    label={t("publicProfile.challengesCount")}
                />
                {/* difficulty distribution (4-tone) */}
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
        </AsyncContent>
    )
}
