"use client"

import React, {
    useMemo,
    useState,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import { useQueryWeeklyChallengeSwr } from "@/hooks/swr/api/graphql/queries/useQueryWeeklyChallengeSwr"
import { useMutateClaimWeeklyChallengeRewardSwr } from "@/hooks/swr/api/graphql/mutations/useMutateClaimWeeklyChallengeRewardSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { _WeeklyChallengeCard } from "./component"

/** How many leaderboard rows to show before truncating. */
const TOP_ROWS = 5

/** Props for {@link WeeklyChallengeCard}. */
export type WeeklyChallengeCardProps = Record<string, never>
/**
 * "This week's challenge" section — the CONNECTED half: it self-fetches the featured
 * weekly-challenge event, computes the countdown/claim state and every "x ago" label, resolves
 * every display string (incl. interpolation), and hands them to the presentational
 * {@link _WeeklyChallengeCard}. See `design/storybook/architecture/split.md`.
 *
 * @param props - optional className for the root element.
 */
export const WeeklyChallengeCard = () => {
    const t = useTranslations()
    const locale = useLocale()
    const challengeSwr = useQueryWeeklyChallengeSwr()
    const { data } = challengeSwr
    const { trigger: triggerClaimReward } = useMutateClaimWeeklyChallengeRewardSwr()
    const runGraphQL = useGraphQLWithToast()
    const [isClaiming, setIsClaiming] = useState(false)

    /** Claim the weekly-challenge coin reward, then revalidate. */
    const onClaim = async () => {
        setIsClaiming(true)
        try {
            const ok = await runGraphQL(async () => {
                const result = await triggerClaimReward()
                const env = result?.data?.claimWeeklyChallengeReward
                if (!env) {
                    throw new Error(t("weeklyChallenge.claimError"))
                }
                return env
            })
            if (ok) {
                await challengeSwr.mutate()
            }
        } finally {
            setIsClaiming(false)
        }
    }

    /** Days/hours left until the event closes (computed from `weekEndAt`). */
    const countdown = useMemo(
        () => {
            if (!data) {
                return null
            }
            const remaining = Math.max(
                0,
                new Date(data.weekEndAt).getTime() - Date.now(),
            )
            return {
                days: Math.floor(remaining / 86_400_000),
                hours: Math.floor((remaining % 86_400_000) / 3_600_000),
            }
        },
        [
            data,
        ],
    )

    /** Locale-aware relative-time formatter for the "passed N ago" labels. */
    const relativeFormatter = useMemo(
        () => new Intl.RelativeTimeFormat(locale, { numeric: "auto" }),
        [
            locale,
        ],
    )

    /** Render a coarse "x ago" label for an ISO timestamp. */
    const formatRelative = (iso: string) => {
        const diffMs = new Date(iso).getTime() - Date.now()
        const minutes = Math.round(diffMs / 60_000)
        if (Math.abs(minutes) < 60) {
            return relativeFormatter.format(minutes, "minute")
        }
        const hours = Math.round(minutes / 60)
        if (Math.abs(hours) < 24) {
            return relativeFormatter.format(hours, "hour")
        }
        return relativeFormatter.format(Math.round(hours / 24), "day")
    }

    // recent finishers — sliced + localized here, so the presentational half never resolves i18n
    const leaderboard = (data?.leaderboard.slice(0, TOP_ROWS) ?? []).map((entry) => ({
        username: entry.username,
        avatar: entry.avatar,
        relativeLabel: formatRelative(entry.passedAt),
    }))

    return (
        <_WeeklyChallengeCard
            // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
            isSkeleton={challengeSwr.isLoading && !data}
            // error beats loading + empty; only a settled fetch error (nothing in hand) reaches the block
            error={!data ? challengeSwr.error : undefined}
            onRetry={() => { void challengeSwr.mutate() }}
            // settled with no active event
            isEmpty={!data}
            challengeGlobalId={data?.challengeGlobalId}
            challengeTitle={data?.title}
            viewerPassed={data?.viewerPassed}
            claimed={data?.claimed}
            isClaiming={isClaiming}
            onClaim={() => { void onClaim() }}
            leaderboard={leaderboard}
            labels={{
                title: t("weeklyChallenge.title"),
                errorTitle: t("weeklyChallenge.errorTitle"),
                retry: t("weeklyChallenge.retry"),
                emptyTitle: t("weeklyChallenge.emptyTitle"),
                emptyDescription: t("weeklyChallenge.emptyDescription"),
                endsIn: countdown ? t("weeklyChallenge.endsIn", {
                    days: countdown.days,
                    hours: countdown.hours,
                }) : undefined,
                passed: t("weeklyChallenge.passed"),
                claimReward: t("weeklyChallenge.claimReward", {
                    count: data?.coinReward ?? 0,
                }),
                tryNow: t("weeklyChallenge.tryNow"),
                passedCount: t("weeklyChallenge.passedCount", {
                    count: data?.passedCount ?? 0,
                }),
            }}
        />
    )
}
