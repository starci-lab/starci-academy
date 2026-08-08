"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"
import { TierLevelIcon } from "@/components/svg/TierLevelIcon"
import { TierCardBase } from "@/components/blocks/commerce/TierCardBase"

/**
 * Free-tier base credit allowance — mirrors the backend free auto quota default
 * (`systemConfig.ai.auto`, base 50 / 5h · 500 / week). Shown so the free card
 * states its credits like the paid tiers.
 */
const FREE_CREDITS_PER_5H = 50
const FREE_CREDITS_PER_WEEK = 500

/** Props for {@link FreeTierCard}. */
export interface FreeTierCardProps {
    /** True when the user is currently on the free tier (no paid subscription). */
    isCurrent: boolean
    /** First load → the shell rests; the twin that used to mirror this card is gone. */
    isSkeleton?: boolean
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
    isSkeleton = false}: FreeTierCardProps) => {
    const t = useTranslations()
    return (
        <TierCardBase
            identity={{ tier: "block", component: "FreeTierCard" }}
            isSkeleton={isSkeleton}
            icon={() => (
                <TierLevelIcon
                    level={1}
                    className="size-6 shrink-0 text-accent-soft-foreground"
                />
            )}
            title={t("aiSubscription.free.title")}
            description={t("aiSubscription.free.desc")}
            price={() => (
                <>
                    <Typography size="h3" weight="bold" text={t("aiSubscription.free.price")} />
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
            cta={() => (
                <StackV
                    principle="center-measure"
                    explain="Stretches the disabled free-tier CTA across the card foot so it aligns with paid-tier buy buttons."
                    items={[
                        () => (
                            <Button
                                variant="secondary"
                                isDisabled
                                label={t("aiSubscription.free.cta")}
                            />
                        ),
                    ]}
                />
            )}
        />
    )
}
