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
    CourseCtaButtons,
} from "../CourseCtaButtons"
import {
    usePricingRows,
} from "@/hooks/usePricingRows"
import {
    PHASE_LABEL_KEY,
} from "@/modules/utils/course-detail"
import {
    PhaseRow,
} from "./PhaseRow"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { CoverImage } from "@/components/blocks/media/CoverImage"
import { PriceTagProminent } from "@/components/blocks/commerce/PriceTag"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { useAppSelector } from "@/redux/hooks"
import { useQueryCoursePricePreviewSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursePricePreviewSwr"
import { StackH, StackV } from "@/components/frames/Stack"

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
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const title = useAppSelector((state) => state.course.entity?.title)
    const coverImageUrl = useAppSelector((state) => state.course.entity?.coverImageUrl)
    const enrollmentCount = useAppSelector((state) => state.course.entity?.enrollmentCount) ?? 0

    // viewer's loyalty price (same source as the catalog / payment) — overrides the
    // phase headline so the price stays identical everywhere. Guests → no preview → phase.
    const { data: preview, isLoading: previewLoading } = useQueryCoursePricePreviewSwr(courseId ?? null)
    const hasLoyalty = preview != null && preview.discountPercent > 0
    // 2026-07-12: authenticated viewers briefly see the STATIC phase price before
    // the loyalty preview resolves, then it silently swaps — a jump on the buy box's
    // headline price. Skeleton the price line instead of flashing the wrong number.
    const previewPending = previewLoading && !preview

    return (
        <div className={cn("@app-md:sticky @app-md:top-[88px] @app-md:self-start", className)}>
            <Card>
                <CardContent>
                    <StackV gap={5} principle="group-boundary"
                        explain="Section group spacing — not sibling-stack, because these blocks are distinct groups rather than same-kind peers."
                        items={[
                            () => <CoverImage src={coverImageUrl} alt={title ?? ""} />,

                            // headline: price + ONE discount + ONE scarcity line.
                            // When the viewer has a loyalty discount, the headline is THEIR price
                            // (struck phase price + loyalty chip); otherwise the active phase price.
                            () => (
                                <StackV gap={3} principle="sibling-stack"
                                    explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                    items={[
                                        () => (
                                            <StackH gap={3} principle="value-row"
                                                explain="Holds a label and its numeric value on one baseline so the count stays readable against the label."
                                                align="center" at="sm" items={[
                                                    // single-source PriceTag — loyalty price when the viewer has one,
                                                    // else the active phase price (struck vs list). USD line stays beside it.
                                                    () => (previewPending ? (
                                                        <Skeleton.Typography type="h3" width="1/3" />
                                                    ) : hasLoyalty && preview ? (
                                                        <PriceTagProminent
                                                            discounted={preview.discountedPriceVnd}
                                                            original={preview.originalPriceVnd}

                                                            breakdown={{
                                                                phase: preview.phasePriceVnd,
                                                                loyaltyPercent: preview.discountPercent,
                                                            }}
                                                        />
                                                    ) : active ? (
                                                        <PriceTagProminent
                                                            discounted={active.priceVnd}
                                                            original={active.listPriceVnd}

                                                            breakdown={{
                                                                phase: active.priceVnd,
                                                                loyaltyPercent: 0,
                                                            }}
                                                        />
                                                    ) : null),
                                                    () => (active?.formattedPriceUsd ? (
                                                        <Typography type="body-sm" color="muted">
                                                            {active.formattedPriceUsd}
                                                        </Typography>
                                                    ) : null),
                                                ]} />
                                        ),
                                        () => (active?.slotAvailable != null ? (
                                            <Typography type="body-sm" className="text-warning-soft-foreground">
                                                {t("courseLanding.slotsLeftPhase", {
                                                    count: active.slotAvailable,
                                                    phase: t(PHASE_LABEL_KEY[active.phase]),
                                                })}
                                            </Typography>
                                        ) : null),
                                    ]} />
                            ),

                            // price ladder — minimal, current highlighted, future prices = urgency
                            () => (rows.length > 0 ? (
                                <>
                                    <Separator />
                                    <StackV gap={4} principle="content-row"
                                        explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                        items={rows.map((row) => () => <PhaseRow key={row.id} row={row} />)}  />
                                    <Separator />
                                </>
                            ) : null),

                            () => <CourseCtaButtons />,
                            () => (
                                <Typography type="body-xs" color="muted" align="center">
                                    {t("course.usersEnrolled", { count: enrollmentCount })}
                                </Typography>
                            ),
                        ]} />
                </CardContent>
            </Card>
        </div>
    )
}
