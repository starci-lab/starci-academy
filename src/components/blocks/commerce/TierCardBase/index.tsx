"use client"

import { SealCheckIcon } from "@phosphor-icons/react"
import React from "react"
import {
    cn,
    Card,
    Skeleton,
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import { type WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link TierCardBase} (shared shell for {@link TierCard} and {@link FreeTierCard}). */
export interface TierCardBaseProps extends WithClassNames<undefined> {
    /** Tier level icon — already sized/colored by the caller. */
    icon: React.ReactNode
    /** Tier display name. */
    title: React.ReactNode
    /** Optional adornment rendered after the title (e.g. the "popular" chip). */
    badge?: React.ReactNode
    /** Short tagline shown in a fixed `h-[2lh]` slot so cards align. */
    description?: React.ReactNode
    /** Price block content — rendered inside the shared `flex-col gap-2` wrapper. */
    price: React.ReactNode
    /** Feature rows shown in the footer, each rendered with a seal-check icon. */
    features: string[]
    /** Whether this tier is the user's current plan. */
    isCurrent: boolean
    /** Call-to-action rendered in place of the "current plan" badge. */
    cta: React.ReactNode
    /**
     * First load, nothing in hand → every content slot shimmers while the card keeps
     * its own boxes, so the grid does not jump on resolve. The resting shape lives
     * HERE, in the file that owns it: three hand-mirrored twins used to describe this
     * same card and could drift from it independently.
     */
    isSkeleton?: boolean
}

/** How many feature rows the resting card shows — the paid tiers all list two. */
const SKELETON_FEATURE_ROWS = 2

/**
 * Shared shell for an AI subscription tier card (paid or free).
 *
 * Presentational only: renders the icon+title row, fixed-height description,
 * price block, current-plan badge vs CTA, and the feature list footer.
 * Callers ({@link TierCard}, {@link FreeTierCard}) supply tier-specific
 * content (icon, price layout, CTA) and keep their own business logic.
 * @param props - shell content for one tier card
 */
export const TierCardBase = ({
    icon,
    title,
    badge,
    description,
    price,
    features,
    isCurrent,
    cta,
    className,
    isSkeleton = false,
}: TierCardBaseProps) => {
    const t = useTranslations()
    // resting rows stand in for whatever the caller would have listed
    const featureRows = isSkeleton
        ? Array.from({ length: SKELETON_FEATURE_ROWS }, (_row, index) => index)
        : features.map((_feature, index) => index)

    return (
        <Card className={cn("flex h-full flex-col", className)}>
            <Card.Content className="flex flex-1 flex-col gap-3">
                {/* icon + tier name (+ optional badge) — tight pair */}
                <div className="flex items-center gap-2">
                    {isSkeleton
                        ? <Skeleton className="size-6 shrink-0 rounded-full" />
                        : icon}
                    <Typography type="h5" weight="semibold">
                        {isSkeleton ? <Skeleton className="h-5 w-16 rounded" /> : title}
                    </Typography>
                    {isSkeleton ? null : badge}
                </div>
                {/* short tagline — fixed slot so cards align */}
                <div className="h-[2lh]">
                    <Typography type="body-sm" color="muted" className="line-clamp-3">
                        {isSkeleton ? <Skeleton className="h-4 w-3/4 rounded" /> : (description ?? "")}
                    </Typography>
                </div>
                <div className="flex flex-col gap-2">
                    {isSkeleton ? <Skeleton className="h-9 w-24 rounded" /> : price}
                </div>
                {isSkeleton ? (
                    <Skeleton className="h-10 w-full rounded-3xl" />
                ) : isCurrent ? (
                    <div className="flex w-full items-center justify-center rounded-3xl bg-success-soft px-3 py-2">
                        <Typography type="body-sm" weight="medium" className="text-success-soft-foreground">
                            {t("aiSubscription.currentPlan")}
                        </Typography>
                    </div>
                ) : cta}
            </Card.Content>
            <Card.Footer>
                {/* feature list — seal-check icon + muted text */}
                <div className="flex flex-col gap-2">
                    {featureRows.map((index) => (
                        <div key={index} className="flex items-center gap-2">
                            {isSkeleton
                                ? <Skeleton className="size-5 shrink-0 rounded" />
                                : (
                                    <SealCheckIcon
                                        aria-hidden
                                        className="size-5 shrink-0 text-muted"
                                    />
                                )}
                            <Typography type="body-sm" color="muted">
                                {isSkeleton
                                    ? <Skeleton className="h-4 w-40 max-w-full rounded" />
                                    : features[index]}
                            </Typography>
                        </div>
                    ))}
                </div>
            </Card.Footer>
        </Card>
    )
}
