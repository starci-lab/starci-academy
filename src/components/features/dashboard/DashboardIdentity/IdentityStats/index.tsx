"use client"

import React from "react"
import {
    Typography,
    Skeleton,
    cn,
} from "@heroui/react"
import {
    FlameIcon,
    LightningIcon,
    GiftIcon,
} from "@phosphor-icons/react"
import {
    useTranslations,
} from "next-intl"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { useQueryMyWeeklyStatsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyWeeklyStatsSwr"
import { useQueryMyAiQuotaSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiQuotaSwr"
import { useQueryMyRewardWalletSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyRewardWalletSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"

/** Skeleton mirroring one `icon + label + value` stat row while its SWR leaf resolves. */
const SkeletonStatRow = () => (
    <div className="flex items-center gap-2">
        <Skeleton className="size-5 shrink-0 rounded-full" />
        <Skeleton className="my-1 h-3 flex-1 rounded" />
        <Skeleton className="my-1 h-3 w-10 rounded" />
    </div>
)

/** Props for {@link IdentityStats}. */
export type IdentityStatsProps = WithClassNames<undefined>

/**
 * Viewer "standing" stat rows for the identity column — `icon + label + value`
 * lines (replacing the cramped chip row), so each metric reads clearly in the
 * 288px sidebar: current streak, remaining weekly AI credit, reward balance.
 * Bare (mirrors profile meta rows); each row self-hides until its leaf resolves.
 * Self-fetches; no data props.
 * @param props - optional className for the root list.
 */
export const IdentityStats = ({
    className,
}: IdentityStatsProps) => {
    const t = useTranslations()
    const weeklySwr = useQueryMyWeeklyStatsSwr()
    const quotaSwr = useQueryMyAiQuotaSwr()
    const walletSwr = useQueryMyRewardWalletSwr()
    const { data: weekly } = weeklySwr
    const { data: quota } = quotaSwr
    const { data: wallet } = walletSwr

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <AsyncContent
                isLoading={weeklySwr.isLoading && !weekly}
                skeleton={<SkeletonStatRow />}
                isEmpty={!weekly}
            >
                <div className="flex items-center gap-2">
                    <FlameIcon aria-hidden focusable="false" className="size-5 shrink-0 text-accent-soft-foreground" />
                    <Typography type="body-sm" color="muted" className="flex-1 truncate">
                        {t("dashboard.identityStats.streak")}
                    </Typography>
                    <Typography type="body-sm" weight="medium">
                        {t("dashboard.identityStats.streakValue", { count: weekly?.streak ?? 0 })}
                    </Typography>
                </div>
            </AsyncContent>
            <AsyncContent
                isLoading={quotaSwr.isLoading && !quota}
                skeleton={<SkeletonStatRow />}
                isEmpty={!quota}
            >
                <div className="flex items-center gap-2">
                    <LightningIcon aria-hidden focusable="false" className="size-5 shrink-0 text-accent-soft-foreground" />
                    <Typography type="body-sm" color="muted" className="flex-1 truncate">
                        {t("dashboard.identityStats.credit")}
                    </Typography>
                    <Typography type="body-sm" weight="medium">
                        {quota?.credit.remainingWeek}/{quota?.credit.limitWeek}
                    </Typography>
                </div>
            </AsyncContent>
            <AsyncContent
                isLoading={walletSwr.isLoading && !wallet}
                skeleton={<SkeletonStatRow />}
                isEmpty={!wallet}
            >
                <div className="flex items-center gap-2">
                    <GiftIcon aria-hidden focusable="false" className="size-5 shrink-0 text-accent-soft-foreground" />
                    <Typography type="body-sm" color="muted" className="flex-1 truncate">
                        {t("dashboard.identityStats.reward")}
                    </Typography>
                    <Typography type="body-sm" weight="medium">
                        {t("dashboard.rewardBalance", { count: wallet?.balance ?? 0 })}
                    </Typography>
                </div>
            </AsyncContent>
        </div>
    )
}
