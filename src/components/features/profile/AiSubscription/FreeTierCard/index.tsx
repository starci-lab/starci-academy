"use client"

import React from "react"
import {
    Button,
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import { TierLevelIcon } from "@/components/svg/TierLevelIcon"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { TierCardBase } from "../TierCardBase"

/**
 * Free-tier base credit allowance — mirrors the backend free auto quota default
 * (`systemConfig.ai.auto`, base 50 / 5h · 500 / week). Shown so the free card
 * states its credits like the paid tiers.
 */
const FREE_CREDITS_PER_5H = 50
const FREE_CREDITS_PER_WEEK = 500

/** Props for {@link FreeTierCard}. */
export interface FreeTierCardProps extends WithClassNames<undefined> {
    /** True when the user is currently on the free tier (no paid subscription). */
    isCurrent: boolean
}

/**
 * Static free-tier card (not purchasable).
 *
 * Presentational: composes {@link TierCardBase}, showing the "current plan"
 * chip when active, otherwise a disabled CTA. No business logic.
 * @param props - whether the free tier is the user's current plan
 */
export const FreeTierCard = ({
    isCurrent,
    className,
}: FreeTierCardProps) => {
    const t = useTranslations()
    return (
        <TierCardBase
            className={className}
            icon={(
                <TierLevelIcon
                    level={1}
                    className="size-6 shrink-0 text-accent"
                />
            )}
            title={t("aiSubscription.free.title")}
            description={t("aiSubscription.free.desc")}
            price={(
                <>
                    <Typography type="h3" weight="bold">
                        {t("aiSubscription.free.price")}
                    </Typography>
                    {/* spacer — matches paid tiers' USD hint block so CTAs align */}
                    <div
                        className="h-[3lh]"
                        aria-hidden
                    />
                </>
            )}
            features={[
                t("aiSubscription.creditsPer5h", { credits: FREE_CREDITS_PER_5H }),
                t("aiSubscription.creditsPerWeek", { credits: FREE_CREDITS_PER_WEEK }),
            ]}
            isCurrent={isCurrent}
            cta={(
                <Button
                    variant="secondary"
                    isDisabled
                    fullWidth
                >
                    {t("aiSubscription.free.cta")}
                </Button>
            )}
        />
    )
}
