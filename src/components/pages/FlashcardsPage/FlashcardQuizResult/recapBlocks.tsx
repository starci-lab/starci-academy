"use client"

import React, { useCallback } from "react"
import { Button, ScrollShadow, Typography } from "@heroui/react"
import { ArrowRightIcon, FlameIcon, LockIcon, MicrophoneStageIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { type QuizSessionReadinessData, type QuizSessionWeakTagData } from "@/modules/api/graphql/mutations/types/complete-flashcard-quiz-session"
import { Callout } from "@/components/composites/feedback/Callout"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { PaymentFlow } from "@/modules/types/payment"

/**
 * Shared "Quick quiz" recap/result blocks — LIFTED out of `QuizSession` so BOTH the
 * live end-of-run recap and the URL-addressable {@link import("./index").FlashcardQuizResult}
 * surface render the exact same components instead of duplicating them. Each block
 * is a self-contained conversion node (enroll upsell, weak-tags demand bridge, AI
 * Mock Interview readiness cross-link).
 */

/**
 * Recap Zone E — the enroll upsell shown ONLY to trial viewers, as the result's
 * PRIMARY action. Reads as an earned reward for the streak/XP the learner just
 * built — not a blocking paywall. Opens the shared course-enroll payment overlay.
 */
export const RecapEnrollUpsell = () => {
    const t = useTranslations()
    const { open } = usePaymentOverlayState()

    const onEnroll = useCallback(
        () => open({ flow: PaymentFlow.CourseEnroll }),
        [open],
    )

    return (
        <Box principle="page-pad" className="rounded-2xl border border-default bg-default px-6 py-8 text-center"
            explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface.">
            <StackV gap={4} align="center" items={[
                () => <IconTile icon={<FlameIcon aria-hidden focusable="false" />} tone="accent" size="sm" />,
                () => (
                    <StackV gap={2} principle="title-subtitle"
                        explain="Title over supporting line — not label-field, because neither line is a form control label."
                        items={[
                            () => (
                                <Typography type="h4" weight="semibold">
                                    {t("flashcard.quiz.upsellTitle")}
                                </Typography>
                            ),
                            () => (
                                <Typography type="body-sm" color="muted">
                                    {t("flashcard.quiz.upsellDescription")}
                                </Typography>
                            ),
                        ]} />
                ),
                () => (
                    <Button
                        variant="primary"
                        size="lg"
                        className="mt-1 w-full max-w-xs"
                        onPress={onEnroll}
                    >
                        {t("flashcard.quiz.upsellCta")}
                        <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
                    </Button>
                ),
            ]} />
        </Box>
    )
}

/** Props for {@link RecapWeakTagsCard}. */
export interface RecapWeakTagsCardProps {
    /** Top-3 weakest tags to always show (empty when nothing qualifies — state "empty"). */
    weakTags: Array<QuizSessionWeakTagData>
    /** Any tags beyond the top-3 — scrolled INSIDE this same card, never truncated silently
     *  and never a separate drawer (state "overflow"). */
    overflowWeakTags: Array<QuizSessionWeakTagData>
    /** Resolves a weak tag to its lesson route, or `null` when the deck→lesson mapping was
     *  ambiguous (falls back to `genericHref` for that row). */
    resolveTagHref: (tag: QuizSessionWeakTagData) => string | null
    /** Generic "continue learning" destination — the empty-state CTA AND the fallback for
     *  any weak tag whose lesson mapping was ambiguous. */
    genericHref: string
    /** Whether this card is the result's PRIMARY demand-bridge (enrolled viewers) or a
     *  smaller secondary link (trial viewers, where Zone E takes the primary slot instead). */
    primary: boolean
}

/** One weak-tag row: tag label + coverage + a "review this lesson" link. */
const WeakTagRow = ({
    tag,
    href,
}: WeakTagRowProps) => {
    const t = useTranslations()
    const router = useRouter()
    return (
        <SurfaceListCardRow
            title={tag.tag}
            subtitle={t("flashcard.quiz.weakTagCoverage", { percent: Math.round(tag.coverage * 100) })}
            trailing={() => (
                <StackH gap={2} principle="icon-text"
                    explain="Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity."
                    align="center" classNames={["shrink-0"]} items={[
                        () => <span className="text-sm font-medium text-accent-soft-foreground">{t("flashcard.quiz.reviewLesson")}</span>,
                        () => (
                            <ArrowRightIcon
                                aria-hidden
                                focusable="false"
                                className="size-4 transition-transform group-hover:translate-x-1"
                            />
                        ),
                    ]} />
            )}
            hover="underline"
            onPress={() => router.push(href)}
        />
    )
}

/**
 * Recap Zone C — the demand-bridge from "just played" to "go learn". Ranks the
 * session's weakest tags and links each straight back to the lesson that covers
 * it; falls back to a generic "keep learning" CTA when there's no weak-tag data
 * yet (first session, or the mapping was ambiguous). Overflow past the top-3
 * scrolls inside the same card via `ScrollShadow` — never a drawer.
 */
export const RecapWeakTagsCard = ({
    weakTags,
    overflowWeakTags,
    resolveTagHref,
    genericHref,
    primary,
}: RecapWeakTagsCardProps) => {
    const t = useTranslations()
    const router = useRouter()

    // no weak-tag data at all → the one, simple, generic bridge (state "empty"). When
    // this card IS the result's primary action (enrolled, no upsell competing), the CTA
    // is a full primary button; when it's demoted (trial), it's a standalone tertiary link.
    if (weakTags.length === 0) {
        return primary ? (
            <LabeledCard label={t("flashcard.quiz.weakTagsTitle")}>
                <StackV gap={4} items={[
                    () => (
                        <Typography type="body-sm" color="muted">
                            {t("flashcard.quiz.weakTagsEmpty")}
                        </Typography>
                    ),
                    () => (
                        <Button
                            variant="primary"
                            className="self-start"
                            onPress={() => router.push(genericHref)}
                        >
                            {t("flashcard.quiz.continueLearning")}
                            <ArrowRightIcon className="size-5" aria-hidden focusable="false" />
                        </Button>
                    ),
                ]} />
            </LabeledCard>
        ) : (
            <Button
                variant="tertiary"
                size="sm"
                className="self-start"
                onPress={() => router.push(genericHref)}
            >
                {t("flashcard.quiz.continueLearning")}
                <ArrowRightIcon className="size-4" aria-hidden focusable="false" />
            </Button>
        )
    }

    // secondary (trial) rendering: a smaller link-style row, not the full card — Zone E
    // (enroll upsell) is the primary action instead (state "mixed (trial)"). Standalone,
    // no primary beside it → tertiary.
    if (!primary) {
        const first = weakTags[0]
        const firstHref = resolveTagHref(first) ?? genericHref
        return (
            <Button
                variant="tertiary"
                size="sm"
                className="self-start"
                onPress={() => router.push(firstHref)}
            >
                {t("flashcard.quiz.weakTagSecondaryLink", { tag: first.tag })}
                <ArrowRightIcon className="size-4" aria-hidden focusable="false" />
            </Button>
        )
    }

    return (
        <LabeledCard label={t("flashcard.quiz.weakTagsTitle")}>
            <StackV gap={4} items={[
                () => (
                    <StackV gap={3} principle="sibling-stack"
                        explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                        items={weakTags.map((tag) => () => (
                            <WeakTagRow key={tag.tag} tag={tag} href={resolveTagHref(tag) ?? genericHref} />
                        ))} />
                ),
                ...(overflowWeakTags.length > 0 ? [() => (
                    <ScrollShadow hideScrollBar className="max-h-40 overflow-y-auto">
                        <StackV gap={3} principle="sibling-stack"
                            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                            items={overflowWeakTags.map((tag) => () => (
                                <WeakTagRow key={tag.tag} tag={tag} href={resolveTagHref(tag) ?? genericHref} />
                            ))} />
                    </ScrollShadow>
                )] : []),
            ]} />
        </LabeledCard>
    )
}

/** Props for {@link RecapReadinessCallout}. */
export interface RecapReadinessCalloutProps {
    /** The readiness signal returned by `completeFlashcardQuizSession`. */
    readiness: QuizSessionReadinessData
    /** Route to the AI Mock Interview surface (only navigated to once unlocked). */
    mockInterviewHref: string
}

/**
 * Recap Zone D — the cross-link toward the AI Mock Interview (StarCi's actual
 * AI-graded, credit-costing differentiator), so a learner who finishes "Quick
 * quiz" feeling good is pointed at it instead of never hearing it exists.
 * Locked state stays visible (transparent about the threshold) rather than hiding.
 */
export const RecapReadinessCallout = ({ readiness, mockInterviewHref }: RecapReadinessCalloutProps) => {
    const t = useTranslations()
    const router = useRouter()

    if (!readiness.unlocked) {
        return (
            <Callout
                status="default"
                icon={LockIcon}
                title={t("flashcard.quiz.readinessLockedTitle")}
                description={t("flashcard.quiz.readinessLockedDescription", {
                    currentAvg: readiness.currentAvg,
                    threshold: readiness.threshold,
                })}
            />
        )
    }

    return (
        <Callout
            status="success"
            icon={MicrophoneStageIcon}
            title={t("flashcard.quiz.readinessUnlockedTitle")}
            description={t("flashcard.quiz.readinessUnlockedDescription")}
            actionLabel={t("flashcard.quiz.readinessUnlockedCta")}
            onAction={() => router.push(mockInterviewHref)}
        />
    )
}

type WeakTagRowProps = {
    tag: QuizSessionWeakTagData
    href: string
}
