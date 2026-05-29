"use client"

import React, {
    useCallback,
} from "react"
import {
    Button,
    Card,
    Chip,
    Spinner,
} from "@heroui/react"
import {
    SealCheckIcon,
} from "@phosphor-icons/react"
import {
    useTranslations,
} from "next-intl"
import type {
    AiSubscriptionTier,
} from "@/modules/api"
import {
    TierLevelIcon,
} from "@/components/svg"
import {
    formatVnd,
    formatUsd,
} from "../../utils"

/** Props for {@link TierCard}. */
export interface TierCardProps {
    /** Tier this card represents. */
    tier: AiSubscriptionTier
    /** Whether this tier is the user's current plan. */
    isCurrent: boolean
    /** Whether a checkout for this tier is currently being created. */
    isBuying: boolean
    /** Fired with the tier slug when the user presses the buy button. */
    onBuy: (tier: string) => void
}

/**
 * One purchasable AI subscription tier card.
 *
 * Presentational: render + a thin buy callback, no business logic. Uses the
 * HeroUI `Card` (surface color, no shadow per global, `rounded-3xl`); the
 * popular tier gets an accent border + ring. Shows the "current plan" chip when
 * active, otherwise the buy button with a pending spinner.
 * @param props - tier, current/buying state, buy callback
 */
export const TierCard = ({
    tier,
    isCurrent,
    isBuying,
    onBuy,
}: TierCardProps) => {
    const t = useTranslations()
    const onPress = useCallback(
        () => onBuy(tier.tier),
        [
            tier.tier,
            onBuy,
        ],
    )
    // ascending tier level — Plus=2, Pro=3, Max=4 (highlighted bars)
    const tierLevel = tier.tier === "max"
        ? 4
        : tier.tier === "pro"
            ? 3
            : 2
    return (
        <Card
            className={[
                "flex h-full flex-col",
                tier.popular
                    ? "border-accent ring-2 ring-accent/30"
                    : "",
            ].join(" ")}
        >
            <Card.Content className="flex flex-1 flex-col gap-3">
                {/* icon + tier name (+ popular chip) — tight pair */}
                <div className="flex items-center gap-2">
                    <TierLevelIcon
                        level={tierLevel}
                        className="size-6 shrink-0 text-accent"
                    />
                    <span className="text-lg font-semibold text-foreground">{tier.displayName}</span>
                    {tier.popular ? (
                        <Chip
                            size="sm"
                            color="accent"
                            variant="soft"
                            className="rounded-full"
                        >
                            {t("aiSubscription.popular")}
                        </Chip>
                    ) : null}
                </div>
                {/* short tagline — fixed three-line slot so cards align with free tier */}
                <div className="h-[2lh] text-sm leading-normal text-muted line-clamp-3 overflow-hidden whitespace-normal break-words">
                    {tier.description ?? ""}
                </div>
                {/* price block — VND number prominent + "/tháng" + USD hint */}
                <div className="flex flex-col gap-2">
                    <div className="text-3xl font-bold text-foreground">
                        {formatVnd(tier.priceVnd)}
                        <span className="text-sm font-normal text-muted">
                            {" "}{t("aiSubscription.perMonth")}
                        </span>
                    </div>
                    {/* secondary USD line — what international gateways charge */}
                    <div className="text-sm text-muted h-[3lh]">
                        {t("aiSubscription.priceUsdHint", { amount: formatUsd(tier.priceUsd) })}
                    </div>
                </div>
                {isCurrent ? (
                    <div
                        className="text-sm text-success text-center bg-success/10 rounded-full h-9 grid place-items-center"
                    >
                        {t("aiSubscription.currentPlan")}
                    </div>
                ) : (
                    <Button
                        variant="primary"
                        fullWidth
                        isPending={isBuying}
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
            </Card.Content>
            <Card.Footer>
                {/* feature list — accent check icon + muted text */}
                <div className="flex flex-col gap-2 text-sm text-muted">
                    <div className="flex items-center gap-1">
                        <SealCheckIcon
                            className="size-5 shrink-0 text-muted"
                        />
                        {t("aiSubscription.creditsPer5h", { credits: tier.creditsPer5h })}
                    </div>
                    <div className="flex items-center gap-1">
                        <SealCheckIcon
                            className="size-5 shrink-0 text-muted"
                        />
                        {t("aiSubscription.creditsPerWeek", { credits: tier.creditsPerWeek })}
                    </div>
                </div>
            </Card.Footer>
        </Card>
    )
}
