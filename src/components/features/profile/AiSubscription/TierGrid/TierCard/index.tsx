"use client"

import React, {
    useCallback,
} from "react"
import {
    cn,
    Button,
    Chip,
    Spinner,
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    formatVnd,
    formatUsd,
} from "../../utils"
import type { AiSubscriptionTier } from "@/modules/api/graphql/queries/types/ai-subscription-tiers"
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { PaymentFlow } from "@/modules/types/payment"
import { type WithClassNames } from "@/modules/types/base/class-name"
import { TierLevelIcon } from "@/components/svg/TierLevelIcon"
import { TierCardBase } from "../../TierCardBase"

/** Props for {@link TierCard} (list item — per-item tier data only). */
export interface TierCardProps extends WithClassNames<undefined> {
    /** Tier this card represents. */
    tier: AiSubscriptionTier
    /** Whether this tier is the user's current plan. */
    isCurrent: boolean
}

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
    className,
}: TierCardProps) => {
    const t = useTranslations()
    const { open: openPaymentModal } = usePaymentOverlayState()

    const onPress = useCallback(
        () => {
            openPaymentModal({
                flow: PaymentFlow.AiSubscription,
                tier: tier.tier,
            })
        },
        [
            tier.tier,
            openPaymentModal,
        ],
    )
    // ascending tier level — Plus=2, Pro=3, Max=4 (highlighted bars)
    const tierLevel = tier.tier === "max"
        ? 4
        : tier.tier === "pro"
            ? 3
            : 2
    return (
        <TierCardBase
            className={cn(
                tier.popular ? "border-accent ring-2 ring-accent/30" : "",
                className,
            )}
            icon={(
                <TierLevelIcon
                    level={tierLevel}
                    className="size-6 shrink-0 text-accent"
                />
            )}
            title={tier.displayName}
            badge={tier.popular ? (
                <Chip
                    size="sm"
                    color="accent"
                    variant="soft"
                >
                    <Chip.Label>{t("aiSubscription.popular")}</Chip.Label>
                </Chip>
            ) : null}
            description={tier.description ?? ""}
            price={(
                <>
                    {/* VND number prominent + "/tháng" */}
                    <div className="flex flex-wrap items-baseline gap-x-2">
                        <Typography type="h3" weight="bold">
                            {formatVnd(tier.priceVnd)}
                        </Typography>
                        <Typography type="body-sm" color="muted">
                            {t("aiSubscription.perMonth")}
                        </Typography>
                    </div>
                    {/* secondary USD line — what international gateways charge */}
                    <div className="h-[3lh]">
                        <Typography type="body-sm" color="muted">
                            {t("aiSubscription.priceUsdHint", { amount: formatUsd(tier.priceUsd) })}
                        </Typography>
                    </div>
                </>
            )}
            features={[
                t("aiSubscription.creditsPer5h", { credits: tier.creditsPer5h }),
                t("aiSubscription.creditsPerWeek", { credits: tier.creditsPerWeek }),
            ]}
            isCurrent={isCurrent}
            cta={(
                <Button
                    variant="primary"
                    fullWidth
                    onPress={onPress}
                >
                    {({ isPending }) => (
                        <>
                            {isPending ? (
                                <Spinner
                                    color="current"
                                    size="sm"
                                />
                            ) : null}
                            {t("aiSubscription.buy")}
                        </>
                    )}
                </Button>
            )}
        />
    )
}
