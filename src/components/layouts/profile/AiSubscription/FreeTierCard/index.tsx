"use client"

import React from "react"
import {
    cn,
    Button,
    Card,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    TierLevelIcon,
} from "@/components/svg"
import type {
    WithClassNames,
} from "@/modules/types"

/** Props for {@link FreeTierCard}. */
export interface FreeTierCardProps extends WithClassNames<undefined> {
    /** True when the user is currently on the free tier (no paid subscription). */
    isCurrent: boolean
}

/**
 * Static free-tier card (not purchasable).
 *
 * Presentational: shows the "current plan" chip when active, otherwise a
 * disabled CTA. No business logic.
 * @param props - whether the free tier is the user's current plan
 */
export const FreeTierCard = ({
    isCurrent,
    className,
}: FreeTierCardProps) => {
    const t = useTranslations()
    return (
        <Card className={cn("flex h-full flex-col", className)}>
            <Card.Content className="flex flex-1 flex-col gap-3">
                {/* icon + tier name — tight pair */}
                <div className="flex items-center gap-1.5">
                    <TierLevelIcon
                        level={1}
                        className="size-6 shrink-0 text-accent"
                    />
                    <div className="text-lg font-semibold text-foreground">{t("aiSubscription.free.title")}</div>
                </div>
                <div className="h-[2lh] text-sm leading-normal text-muted line-clamp-3 overflow-hidden whitespace-normal break-words">
                    {t("aiSubscription.free.desc")}
                </div>
                <div className="flex flex-col gap-1.5">
                    <div className="text-3xl font-bold text-foreground">{t("aiSubscription.free.price")}</div>
                    {/* spacer — matches paid tiers' USD hint block so CTAs align */}
                    <div
                        className="h-[3lh] text-sm leading-normal"
                        aria-hidden
                    />
                </div>
                {isCurrent ? (
                    <div className="text-sm text-success text-center bg-success/10 rounded-full h-9 grid place-items-center">
                        {t("aiSubscription.currentPlan")}
                    </div>
                ) : (
                    <Button
                        variant="secondary"
                        isDisabled
                        fullWidth
                    >
                        {t("aiSubscription.free.cta")}
                    </Button>
                )}
            </Card.Content>
            <Card.Footer>
                {/* invisible rows — same footer height as paid tier credit list */}
                <div
                    className="flex flex-col gap-1.5 text-sm invisible"
                    aria-hidden
                >
                    <div className="flex min-h-5 items-center gap-1.5">—</div>
                    <div className="flex min-h-5 items-center gap-1.5">—</div>
                </div>
            </Card.Footer>
        </Card>
    )
}
