"use client"

import React, {
    useCallback,
} from "react"
import {
    Button,
    Skeleton,
    Typography,
} from "@heroui/react"
import {
    ArrowRightIcon,
} from "@phosphor-icons/react"
import {
    useTranslations,
    useLocale,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    QuotaLane,
} from "../QuotaLane"
import {
    QuotaLaneVariant,
} from "../types"
import { useAiQuotaOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useQueryMyAiQuotaSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiQuotaSwr"
import { pathConfig } from "@/resources/path"

/**
 * AI quota modal — subscription tab (Premium lane + subscribe CTA).
 */
export const AiQuotaSubscriptionTab = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { setOpen } = useAiQuotaOverlayState()
    const { data: quota, isLoading } = useQueryMyAiQuotaSwr()

    const onSubscribe = useCallback(() => {
        setOpen(false)
        router.push(`${pathConfig().locale(locale).profile().build()}/ai-subscription`)
    }, [
        setOpen,
        router,
        locale,
    ])

    if (isLoading || !quota) {
        return (
            <div className="flex flex-col gap-3">
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-9 w-40 rounded-xl" />
            </div>
        )
    }

    if (!quota.tier) {
        return (
            <div className="flex flex-col gap-3 rounded-2xl border border-default p-4">
                <Typography type="body-sm" color="muted">
                    {t("aiQuota.subscriptionNone")}
                </Typography>
                <Button
                    variant="primary"
                    size="lg"
                    className="self-start"
                    onPress={onSubscribe}
                >
                    {t("aiQuota.subscribeCta")}
                    <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            <QuotaLane variant={QuotaLaneVariant.Premium} />
            <Typography type="body-sm" color="muted">
                {t("aiQuota.subscriptionActive", { tier: quota.tier.toUpperCase() })}
            </Typography>
        </div>
    )
}
