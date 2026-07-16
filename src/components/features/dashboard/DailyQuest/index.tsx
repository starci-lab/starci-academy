"use client"

import React, {
    useCallback,
} from "react"
import {
    Button,
    Chip,
    Typography,
} from "@heroui/react"
import {
    CheckCircleIcon,
    CircleIcon,
} from "@phosphor-icons/react"
import {
    useTranslations,
} from "next-intl"
import {
    useSWRConfig,
} from "swr"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { useQueryMyDailyQuestSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyDailyQuestSwr"
import { useMutateClaimDailyQuestRewardSwr } from "@/hooks/swr/api/graphql/mutations/useMutateClaimDailyQuestRewardSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { useGraphQLWithToast } from "@/modules/toast/hooks"

/** Props for {@link DailyQuest}. */
export type DailyQuestProps = WithClassNames<undefined>

/**
 * "Nhiệm vụ hôm nay" content — today's daily-quest checklist (read content · pass
 * challenge · review flashcards), each row showing today's progress, plus a claim
 * action that grants the reward once all tasks are done. Content only (the parent
 * {@link import("@/components/blocks").LabeledCard} frames it). Self-fetches the
 * daily-quest leaf query; claiming refetches the quest + reward wallet.
 * @param props - optional root class name (placement only)
 */
export const DailyQuest = ({
    className,
}: DailyQuestProps) => {
    const t = useTranslations()
    const { mutate: globalMutate } = useSWRConfig()
    const runGraphQL = useGraphQLWithToast()
    const {
        data,
        isLoading,
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

    // claim state (only meaningful once loaded) → the LabeledCard's `description`,
    // rendered BELOW the card (gap-2), never inside the surface.
    const claimState = data ? (
        data.claimed ? (
            <Chip color="success" variant="soft" size="sm" className="self-start">
                <Chip.Label>{t("dashboard.dailyQuest.claimed")}</Chip.Label>
            </Chip>
        ) : data.allDone ? (
            <Button
                variant="primary"
                size="sm"
                className="self-start"
                isPending={isMutating}
                onPress={onClaim}
            >
                {t("dashboard.dailyQuest.claim", { count: data.reward })}
            </Button>
        ) : (
            <Typography type="body-xs" color="muted">
                {t("dashboard.dailyQuest.completePrompt", { count: data.reward })}
            </Typography>
        )
    ) : undefined

    return (
        <LabeledCard
            label={t("dashboard.dailyQuest.title")}
            className={className}
            frameless
            description={claimState}
        >
            <AsyncContent
                isLoading={data === null || data === undefined || isLoading}
                skeleton={(
                    <SurfaceListCard>
                        {[0, 1, 2, 3, 4].map((row) => (
                            <Skeleton.ListRow key={row} withSubtitle={false} withTrailing className="px-3" />
                        ))}
                    </SurfaceListCard>
                )}
                isEmpty={!data}
                error={!data ? error : undefined}
                errorContent={{
                    title: t("dashboard.loadError"),
                    onRetry: () => { void mutate() },
                    retryLabel: t("dashboard.retry"),
                }}
            >
                {/* canonical labeled-list-card: frameless LabeledCard → SurfaceListCard → rows (one surface) */}
                {data ? (
                    <SurfaceListCard>
                        {data.tasks.map((task) => {
                            const done = task.current >= task.target
                            return (
                                <SurfaceListCardRow
                                    key={task.key}
                                    leading={done ? (
                                        <CheckCircleIcon aria-hidden focusable="false" className="size-5 shrink-0 text-success-soft-foreground" />
                                    ) : (
                                        <CircleIcon aria-hidden focusable="false" className="size-5 shrink-0 text-foreground" />
                                    )}
                                    // buộc icon+title cùng màu theo state (icon.md §6): done = success, todo = foreground (mặc định).
                                    // Tô màu qua title NODE (span), KHÔNG `titleClassName` — lint `no-modal-title-classname` cấm prop đó
                                    // toàn cục; row này không underline nên span-con an toàn (§6 carve-out).
                                    title={done ? (
                                        <span className="text-success-soft-foreground">{t(`dashboard.dailyQuest.tasks.${task.key}`)}</span>
                                    ) : (
                                        t(`dashboard.dailyQuest.tasks.${task.key}`)
                                    )}
                                    meta={(
                                        <Typography type="body-xs" color="muted">
                                            {task.current}/{task.target}
                                        </Typography>
                                    )}
                                />
                            )
                        })}
                    </SurfaceListCard>
                ) : null}
            </AsyncContent>
        </LabeledCard>
    )
}
