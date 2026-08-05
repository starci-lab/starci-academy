"use client"

import React, {
    useCallback,
} from "react"
import {
    useTranslations,
} from "next-intl"
import {
    useSWRConfig,
} from "swr"
import { useQueryMyDailyQuestSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyDailyQuestSwr"
import { useMutateClaimDailyQuestRewardSwr } from "@/hooks/swr/api/graphql/mutations/useMutateClaimDailyQuestRewardSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { _DailyQuest, type DailyQuestTask } from "./component"

/**
 * "Today's quest" — the CONNECTED half: self-fetches the daily-quest leaf query,
 * resolves every task's translated title plus the reward-interpolated claim/prompt
 * copy, and hands the result to the presentational {@link _DailyQuest}. Claiming
 * refetches the quest + the reward wallet chip. See `tiers/split.md`.
 */
export const DailyQuest = () => {
    const t = useTranslations()
    const { mutate: globalMutate } = useSWRConfig()
    const runGraphQL = useGraphQLWithToast()
    const {
        data,
        error,
        mutate,
    } = useQueryMyDailyQuestSwr()
    const { trigger, isMutating } = useMutateClaimDailyQuestRewardSwr()

    /** Claim today's reward, then refresh the quest + the reward-balance chip. */
    const onClaim = useCallback(
        async () => {
            const ok = await runGraphQL(async () => {
                const result = await trigger()
                return result.data!.claimDailyQuestReward
            })
            if (ok) {
                await mutate()
                // reward balance changed → refresh the identity standing chip
                await globalMutate(["QUERY_MY_REWARD_WALLET_SWR"])
            }
        },
        [
            runGraphQL,
            trigger,
            mutate,
            globalMutate,
        ],
    )

    // each task's title is a dynamic i18n key — resolved here, next to the fetch
    // (tiers/split.md: t() lives in the connected file, never below it).
    const tasks: Array<DailyQuestTask> = (data?.tasks ?? []).map((task) => ({
        key: task.key,
        title: t(`dashboard.dailyQuest.tasks.${task.key}`),
        current: task.current,
        target: task.target,
    }))

    return (
        <_DailyQuest
            // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
            isSkeleton={!data && !error}
            // only a settled fetch error (nothing in hand) reaches the block
            error={!data ? error : undefined}
            onRetry={() => { void mutate() }}
            claimed={data?.claimed}
            allDone={data?.allDone}
            onClaim={() => { void onClaim() }}
            isClaiming={isMutating}
            tasks={tasks}
            labels={{
                title: t("dashboard.dailyQuest.title"),
                loadError: t("dashboard.loadError"),
                retry: t("dashboard.retry"),
                claimed: t("dashboard.dailyQuest.claimed"),
                claim: t("dashboard.dailyQuest.claim", { count: data?.reward ?? 0 }),
                completePrompt: t("dashboard.dailyQuest.completePrompt", { count: data?.reward ?? 0 }),
            }}
        />
    )
}
