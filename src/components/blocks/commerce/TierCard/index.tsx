"use client"

import React, {
    useCallback,
} from "react"
import {
    useTranslations,
} from "next-intl"
import { formatVnd } from "@/modules/utils/format-vnd"
import { formatUsd } from "@/modules/utils/format-usd"
import type { AiSubscriptionTier } from "@/modules/api/graphql/queries/types/ai-subscription-tiers"
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { PaymentFlow } from "@/modules/types/payment"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"
import { TierLevelIcon } from "@/components/svg/TierLevelIcon"
import { TierCardBase } from "@/components/blocks/commerce/TierCardBase"

/** Props for {@link TierCard} (list item — per-item tier data only). */
export interface TierCardProps {
    /** Tier this card represents. */
    /** The tier this card sells. Absent only while {@link TierCardProps.isSkeleton}. */
    tier?: AiSubscriptionTier
    /** Whether this tier is the user's current plan. */
    isCurrent: boolean
    /** First load → the shell rests; the twin that used to mirror this card is gone. */
    isSkeleton?: boolean
}

/** Placeholder for the resting card's slots — the shell shimmers over every one of them. */
const EmptySlot = () => null

/**
 * One purchasable AI subscription tier card.
 *
 * List item: receives its own tier data + current flag; self-opens the shared
 * payment overlay for the buy action via {@link usePaymentOverlayState}.
 * Composes {@link TierCardBase} for the shared shell (surface color, no
 * shadow per global, `rounded-3xl`); the popular tier gets an accent border + ring.
 * @param props - tier, current state
 */
export const TierCard = ({
    tier,
    isCurrent,
    isSkeleton = false}: TierCardProps) => {
    const t = useTranslations()
    const { open: openPaymentModal } = usePaymentOverlayState()

    const onPress = useCallback(
        () => {
            if (!tier) {
                return
            }
            openPaymentModal({
                flow: PaymentFlow.AiSubscription,
                tier: tier.tier,
            })
        },
        [
            tier,
            openPaymentModal,
        ],
    )
    // Resting: the SHELL draws every box, so nothing here needs a tier yet. Returning
    // early is what lets the loaded branch below read `tier` without a guard on each line.
    if (isSkeleton || !tier) {
        return (
            <TierCardBase
                identity={{ tier: "block", component: "TierCard" }}
                isSkeleton
                icon={EmptySlot}
                title=""
                price={EmptySlot}
                features={[]}
                isCurrent={false}
                cta={EmptySlot}
            />
        )
    }

    // ascending tier level — Plus=2, Pro=3, Max=4 (highlighted bars)
    const tierLevel = tier.tier === "max"
        ? 4
        : tier.tier === "pro"
            ? 3
            : 2
    return (
        <TierCardBase
            identity={{ tier: "block", component: "TierCard" }}
            className={tier.popular ? "border-accent ring-2 ring-accent/30" : undefined}
            icon={() => (
                <TierLevelIcon
                    level={tierLevel}
                    className="size-6 shrink-0 text-accent-soft-foreground"
                />
            )}
            title={tier.displayName}
            badge={tier.popular
                ? () => (
                    <Chip
                        tone="accent"
                        text={t("aiSubscription.popular")}
                    />
                )
                : undefined}
            description={tier.description ?? ""}
            price={() => (
                <StackV
                    principle="card-caption"
                    explain="Keeps the USD hint as a caption under the VND amount so price + period read as one cluster."
                    items={[
                        () => (
                            <StackH
                                principle="value-row"
                                explain="Holds the VND amount and /month period on one baseline so the period stays readable against the price."
                                items={[
                                    () => (
                                        <Typography size="h3" weight="bold" text={formatVnd(tier.priceVnd)} />
                                    ),
                                    () => (
                                        <Typography size="sm" color="muted" text={t("aiSubscription.perMonth")} />
                                    ),
                                ]}
                            />
                        ),
                        // Fixed 3lh slot so free/paid CTAs stay aligned across the grid.
                        () => (
                            <div className="h-[3lh]">
                                <Typography
                                    size="sm"
                                    color="muted"
                                    text={t("aiSubscription.priceUsdHint", { amount: formatUsd(tier.priceUsd) })}
                                />
                            </div>
                        ),
                    ]}
                />
            )}
            features={[
                t("aiSubscription.creditsPer5h", { credits: tier.creditsPer5h }),
                t("aiSubscription.creditsPerWeek", { credits: tier.creditsPerWeek }),
            ]}
            isCurrent={isCurrent}
            cta={() => (
                <StackV
                    principle="center-measure"
                    explain="Stretches the buy CTA across the card foot so it aligns with the free-tier disabled button."
                    items={[
                        () => (
                            <Button
                                variant="primary"
                                onPress={onPress}
                                label={t("aiSubscription.buy")}
                            />
                        ),
                    ]}
                />
            )}
        />
    )
}
