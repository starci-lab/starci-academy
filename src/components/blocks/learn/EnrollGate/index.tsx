"use client"

import React, { useCallback } from "react"
import { ArrowRightIcon, LockIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { PaymentFlow } from "@/modules/types/payment"
import { useAppSelector } from "@/redux/hooks"
import { useQueryCoursePricePreviewSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursePricePreviewSwr"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"
import { PriceTagInline } from "@/components/blocks/commerce/PriceTag"
import { PhaseScarcityNote } from "@/components/blocks/commerce/PhaseScarcityNote"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import { Box } from "@/components/frames/Box"
import { StackV } from "@/components/frames/Stack"

/** The conversion card's own surface: a bounded, floating sheet no frame names. */
const CARD_SURFACE = "flex w-full max-w-[480px] flex-col items-center gap-3 rounded-3xl bg-surface px-7 py-8 text-center shadow-surface"

/**
 * Fade band over the teaser's tail. It fades into the preview's OWN card token
 * (`bg-surface`), not the page canvas — the teaser content is bg-surface cards, so
 * fading to `background` cut them off mid-card. Same band height as LessonReader's
 * locked-body fade — canonical value, not re-tuned here.
 */
const TEASER_FADE = "absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent via-surface/70 to-surface"

interface EnrollCardProps {
    title: string
    description: string
    priceRegion: () => React.ReactNode
    scarcity?: () => React.ReactNode
    ctaLabel: string
    onEnroll: () => void
}

const EnrollCard = ({ title, description, priceRegion, scarcity, ctaLabel, onEnroll }: EnrollCardProps) => (
    <Box className={CARD_SURFACE}>
        <StackV
            gap={4}
            align="center"
            items={[
                () => <IconTile icon={<LockIcon aria-hidden focusable="false" />} tone="accent" size="sm" />,
                () => <Typography size="h4" weight="bold" text={title} />,
                () => (
                    <Box className="max-w-[400px]">
                        <Typography size="sm" color="muted" text={description} />
                    </Box>
                ),
                priceRegion,
                ...(scarcity ? [scarcity] : []),
                () => (
                    <Box className="w-full max-w-[300px]">
                        <Button
                            label={ctaLabel}
                            variant="primary"
                            size="lg"
                            suffixIcon={ArrowRightIcon}
                            onPress={onEnroll}
                            classNames={["w-full"]}
                        />
                    </Box>
                ),
            ]}
        />
    </Box>
)

/** Props for {@link EnrollGate}. */
export interface EnrollGateProps {
    /** Title — e.g. "Unlock Personal project" (the surface name folded in by the caller). */
    title: string
    /** One-line reason the surface needs enrollment. */
    description: string
    /**
     * Optional MOCK teaser of the gated surface (representative, non-interactive
     * content — NOT real gated data). When provided, the gate reads Medium-style:
     * the preview is rendered `aria-hidden` behind a bottom fade, with the enroll
     * card floating over the faded tail — so the learner SEES what's inside before
     * the CTA. Omit → just the centred enroll card (no teaser).
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
 * Only the PRICE waits on a fetch — the lock, copy and CTA render straight away.
 *
 * @param props - {@link EnrollGateProps}
 */
export const EnrollGate = ({ title, description, preview }: EnrollGateProps) => {
    const t = useTranslations()
    const { open } = usePaymentOverlayState()
    const courseId = useAppSelector((state) => state.course.entity?.id)

    // loyalty-aware price preview — SAME query/render as PaymentModal + PremiumPaywall
    const priceSwr = useQueryCoursePricePreviewSwr(courseId ?? null)
    const price = priceSwr.data
    const isPriceSkeleton = Boolean(courseId) && !priceSwr.data && !priceSwr.error

    /** Open the shared payment modal in the course-enroll flow. */
    const onEnroll = useCallback(
        () => open({ flow: PaymentFlow.CourseEnroll }),
        [open],
    )

    // error beats a stale loading flag (BLOCK-8 order)
    const priceRegion = () => {
        if (priceSwr.error) {
            return <AsyncContentError title={t("payment.priceError")} />
        }
        if (isPriceSkeleton) {
            return <Skeleton className="h-7 w-32 rounded-xl" />
        }
        return price?.discountedPriceVnd != null ? (
            <PriceTagInline
                discounted={price.discountedPriceVnd}
                original={price.originalPriceVnd}
               
                breakdown={{
                    phase: price.phasePriceVnd,
                    loyaltyPercent: price.discountPercent,
                }}
            />
        ) : null
    }

    const scarcity = price
        ? () => (
            <PhaseScarcityNote
                currentPhase={price.currentPhase}
                seatsRemaining={price.seatsRemainingInCurrentPhase}
                nextPhasePriceVnd={price.nextPhasePriceVnd}
            />
        )
        : undefined

    // no teaser → just the centred enroll card.
    if (!preview) {
        return (
            <StackV
                identity={{ tier: "block", component: "EnrollGate" }}
                gap={1}
                align="center"
                padding={{ x: 5, y: 6 }}
                body={() => (
                    <EnrollCard
                        title={title}
                        description={description}
                        priceRegion={priceRegion}
                        scarcity={scarcity}
                        ctaLabel={t("enrollGate.cta")}
                        onEnroll={onEnroll}
                    />
                )}
            />
        )
    }

    // teaser → the FULL real preview (no height cap — mirrors LessonReader, which renders
    // the whole real body and only fades its tail, never truncates early), with the enroll
    // card floating over the faded tail. The stack, the fade and the overlap are positional
    // values no frame names, so they stay literals on Box.
    return (
        <Box identity={{ tier: "block", component: "EnrollGate" }} className="relative">
            <Box className="pointer-events-none relative" aria-hidden>
                {preview}
                <Box className={TEASER_FADE} />
            </Box>
            <Box className="relative z-10 -mt-32 flex justify-center px-4 pb-6">
                <EnrollCard
                    title={title}
                    description={description}
                    priceRegion={priceRegion}
                    scarcity={scarcity}
                    ctaLabel={t("enrollGate.cta")}
                    onEnroll={onEnroll}
                />
            </Box>
        </Box>
    )
}
