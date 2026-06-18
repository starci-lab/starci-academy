"use client"

import React from "react"
import {
    Card,
    CardContent,
    Separator,
    Typography,
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    CoverImage,
    StatusChip,
} from "@/components/blocks"
import {
    useAppSelector,
} from "@/redux"
import {
    CourseCtaButtons,
} from "../CourseCtaButtons"
import {
    usePricingRows,
} from "../hooks/usePricingRows"
import {
    PHASE_LABEL_KEY,
} from "../constants"
import {
    PhaseRow,
} from "./PhaseRow"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link CoursePricingRail}. */
export type CoursePricingRailProps = WithClassNames<undefined>

/**
 * The single sticky purchase card (right column): cover thumbnail → headline price
 * + one discount + one scarcity line → a compact phase ladder (state per row, no
 * chip soup) → the CTA cluster → enrolled-count social proof. This is the ONLY buy
 * box on the page (the hero carries no price/CTA). Self-contained (pricing hook +
 * redux).
 *
 * @param props - optional className (placement only).
 */
export const CoursePricingRail = ({ className }: CoursePricingRailProps) => {
    const t = useTranslations()
    const { rows, active } = usePricingRows()
    const title = useAppSelector((state) => state.course.entity?.title)
    const coverImageUrl = useAppSelector((state) => state.course.entity?.coverImageUrl)
    const enrollmentCount = useAppSelector((state) => state.course.entity?.enrollmentCount) ?? 0

    return (
        <div className={cn("md:sticky md:top-20", className)}>
            <Card>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <CoverImage src={coverImageUrl} alt={title ?? ""} />

                        {/* headline: price + ONE discount + ONE scarcity line */}
                        <div className="flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <Typography type="h3" weight="bold">
                                    {active?.formattedPrice}
                                </Typography>
                                {active?.savePercent ? (
                                    <StatusChip tone="success">{`-${active.savePercent}%`}</StatusChip>
                                ) : null}
                                {active?.formattedPriceUsd ? (
                                    <Typography type="body-sm" color="muted">
                                        {active.formattedPriceUsd}
                                    </Typography>
                                ) : null}
                            </div>
                            {active?.slotAvailable != null ? (
                                <Typography type="body-sm" className="text-warning">
                                    {t("courseLanding.slotsLeftPhase", {
                                        count: active.slotAvailable,
                                        phase: t(PHASE_LABEL_KEY[active.phase]),
                                    })}
                                </Typography>
                            ) : null}
                        </div>

                        {/* price ladder — minimal, current highlighted, future prices = urgency */}
                        {rows.length > 0 ? (
                            <>
                                <Separator />
                                <div className="flex flex-col gap-3">
                                    {rows.map((row) => (
                                        <PhaseRow key={row.id} row={row} />
                                    ))}
                                </div>
                                <Separator />
                            </>
                        ) : null}

                        <CourseCtaButtons />
                        <Typography type="body-xs" color="muted" align="center">
                            {t("course.usersEnrolled", { count: enrollmentCount })}
                        </Typography>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
