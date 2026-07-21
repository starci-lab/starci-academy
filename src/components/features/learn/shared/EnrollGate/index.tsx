"use client"

import React, { useCallback } from "react"
import { Button, Typography, cn } from "@heroui/react"
import { ArrowRightIcon, LockIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { PaymentFlow } from "@/modules/types/payment"
import { useAppSelector } from "@/redux/hooks"
import { useQueryCoursePricePreviewSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursePricePreviewSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { PriceTag } from "@/components/blocks/commerce/PriceTag"
import { PhaseScarcityNote } from "@/components/blocks/commerce/PhaseScarcityNote"
import { IconTile } from "@/components/blocks/identity/IconTile"

/** Props for {@link EnrollGate}. */
export interface EnrollGateProps extends WithClassNames<undefined> {
    /** Title — e.g. "Mở khoá Dự án cá nhân" (the surface name folded in by the caller). */
    title: string
    /** One-line reason the surface needs enrollment. */
    description: string
    /**
     * Optional MOCK teaser of the gated surface (representative, non-interactive
     * content — NOT real gated data). When provided, the gate reads Medium-style:
     * the preview is rendered `aria-hidden` behind a bottom fade, with the enroll
     * card floating over the faded tail — so the learner SEES what's inside before
     * the CTA. Omit → just the centered enroll card (no teaser).
     */
    preview?: React.ReactNode
}

/**
 * Course-surface enroll gate: shown in place of an enrollment-required learn surface
 * (personal-project, mock-interview, flashcards, module) when the viewer is in trial
 * mode (not enrolled). Instead of a dead grey card, it renders a conversion CARD —
 * lock identity + outcome copy + the loyalty-aware {@link PriceTag} + scarcity + a
 * single enroll CTA (mirrors {@link import("../../LessonReader/PremiumPaywall").PremiumPaywall},
 * SAME price source/render as the payment modal). With a {@link EnrollGateProps.preview}
 * it upgrades to a Medium-style teaser: a faded mock of the surface behind the card.
 * The single action enrolls via the shared {@link PaymentFlow.CourseEnroll} modal.
 *
 * @param props - {@link EnrollGateProps}
 */
export const EnrollGate = ({ title, description, preview, className }: EnrollGateProps) => {
    const t = useTranslations()
    const { open } = usePaymentOverlayState()
    const courseId = useAppSelector((state) => state.course.entity?.id)

    // loyalty-aware price preview — SAME query/render as PaymentModal + PremiumPaywall
    const priceSwr = useQueryCoursePricePreviewSwr(courseId ?? null)
    const price = priceSwr.data
    const priceLoading = Boolean(courseId) && !priceSwr.data && !priceSwr.error

    /** Open the shared payment modal in the course-enroll flow. */
    const onEnroll = useCallback(
        () => open({ flow: PaymentFlow.CourseEnroll }),
        [open],
    )

    // the conversion card — the lock identity + outcome copy + price + CTA. A real
    // surface card (rounded-3xl bg-surface shadow-surface) so it "floats up" whether
    // it sits alone on the canvas or over the faded teaser.
    const enrollCard = (
        <div className="flex w-full max-w-[480px] flex-col items-center gap-3 rounded-3xl bg-surface px-7 py-8 text-center shadow-surface">
            <IconTile icon={<LockIcon aria-hidden focusable="false" />} tone="accent" size="sm" />
            <Typography type="h4" weight="bold">{title}</Typography>
            <Typography type="body-sm" color="muted" className="max-w-[400px]">{description}</Typography>
            <AsyncContent
                isLoading={priceLoading}
                skeleton={<div className="h-7 w-32 animate-pulse rounded-xl bg-default" />}
                error={priceSwr.error}
                errorContent={{ title: t("payment.priceError") }}
            >
                {price?.discountedPriceVnd != null ? (
                    <PriceTag
                        discounted={price.discountedPriceVnd}
                        original={price.originalPriceVnd}
                        size="md"
                        className="justify-center"
                        breakdown={{
                            phase: price.phasePriceVnd,
                            loyaltyPercent: price.discountPercent,
                        }}
                    />
                ) : null}
            </AsyncContent>
            {price ? (
                <PhaseScarcityNote
                    currentPhase={price.currentPhase}
                    seatsRemaining={price.seatsRemainingInCurrentPhase}
                    nextPhasePriceVnd={price.nextPhasePriceVnd}
                    className="justify-center"
                />
            ) : null}
            <Button
                variant="primary"
                size="lg"
                className="mt-2 w-full max-w-[300px]"
                onPress={onEnroll}
            >
                {t("enrollGate.cta")}
                <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
            </Button>
        </div>
    )

    // no teaser → just the centered enroll card.
    if (!preview) {
        return (
            <div className={cn("flex justify-center px-4 py-10", className)}>
                {enrollCard}
            </div>
        )
    }

    // teaser → the FULL real preview (no height cap — mirrors LessonReader, which
    // renders the whole real body and only fades its tail, never truncates early),
    // with the enroll card floating over the faded tail.
    return (
        <div className={cn("relative", className)}>
            <div className="pointer-events-none relative" aria-hidden>
                {preview}
                {/* fade into the preview's OWN card token (bg-surface), not the page
                    canvas — the teaser content is bg-surface cards, so fading to
                    `background` cut them off mid-card. Same band height as
                    LessonReader's locked-body fade (`h-72`, `via-surface/70 to-surface`)
                    — canonical value, not re-tuned here. */}
                <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent via-surface/70 to-surface" />
            </div>
            <div className="relative z-10 -mt-32 flex justify-center px-4 pb-6">
                {enrollCard}
            </div>
        </div>
    )
}
