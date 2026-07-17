"use client"

import React, { useCallback } from "react"
import { Button, cn, ScrollShadow, Typography } from "@heroui/react"
import { ArrowRightIcon, FlameIcon, LockIcon, MicrophoneStageIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { type QuizSessionReadinessData, type QuizSessionWeakTagData } from "@/modules/api/graphql/mutations/types/complete-flashcard-quiz-session"
import { Callout, STATUS_ACTION_CLASS } from "@/components/blocks/feedback/Callout"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { PaymentFlow } from "@/modules/types/payment"

/**
 * Shared "Hỏi nhanh" recap/result blocks — LIFTED out of `QuizSession` so BOTH the
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
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-default bg-default px-6 py-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-accent/15">
                <FlameIcon aria-hidden focusable="false" className="size-6 text-accent-soft-foreground" />
            </div>
            <div className="flex flex-col gap-1">
                <Typography type="h4" weight="semibold">
                    {t("flashcard.quiz.upsellTitle")}
                </Typography>
                <Typography type="body-sm" color="muted">
                    {t("flashcard.quiz.upsellDescription")}
                </Typography>
            </div>
            <Button
                variant="primary"
                size="lg"
                className="mt-1 w-full max-w-xs"
                onPress={onEnroll}
            >
                {t("flashcard.quiz.upsellCta")}
                <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
            </Button>
        </div>
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
}: {
    tag: QuizSessionWeakTagData
    href: string
}) => {
    const t = useTranslations()
    const router = useRouter()
    return (
        <button
            type="button"
            onClick={() => router.push(href)}
            className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-default bg-default px-4 py-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent"
        >
            <div className="flex min-w-0 flex-col gap-0">
                <Typography type="body-sm" weight="medium" className="truncate underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline">
                    {tag.tag}
                </Typography>
                <Typography type="body-xs" color="muted">
                    {t("flashcard.quiz.weakTagCoverage", { percent: Math.round(tag.coverage * 100) })}
                </Typography>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-accent-soft-foreground">
                {t("flashcard.quiz.reviewLesson")}
                <ArrowRightIcon
                    aria-hidden
                    focusable="false"
                    className="size-4 transition-transform group-hover:translate-x-1"
                />
            </span>
        </button>
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
            <LabeledCard label={t("flashcard.quiz.weakTagsTitle")} contentClassName="flex flex-col gap-3">
                <Typography type="body-sm" color="muted">
                    {t("flashcard.quiz.weakTagsEmpty")}
                </Typography>
                <Button
                    variant="primary"
                    className="self-start"
                    onPress={() => router.push(genericHref)}
                >
                    {t("flashcard.quiz.continueLearning")}
                    <ArrowRightIcon className="size-5" aria-hidden focusable="false" />
                </Button>
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
        <LabeledCard label={t("flashcard.quiz.weakTagsTitle")} contentClassName="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                {weakTags.map((tag) => (
                    <WeakTagRow key={tag.tag} tag={tag} href={resolveTagHref(tag) ?? genericHref} />
                ))}
            </div>
            {overflowWeakTags.length > 0 ? (
                <ScrollShadow hideScrollBar className="max-h-40 overflow-y-auto">
                    <div className="flex flex-col gap-2 pt-0">
                        {overflowWeakTags.map((tag) => (
                            <WeakTagRow key={tag.tag} tag={tag} href={resolveTagHref(tag) ?? genericHref} />
                        ))}
                    </div>
                </ScrollShadow>
            ) : null}
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
 * AI-graded, credit-costing differentiator), so a learner who finishes "Hỏi
 * nhanh" feeling good is pointed at it instead of never hearing it exists.
 * Locked state stays visible (transparent about the threshold) rather than hiding.
 */
export const RecapReadinessCallout = ({ readiness, mockInterviewHref }: RecapReadinessCalloutProps) => {
    const t = useTranslations()
    const router = useRouter()

    if (!readiness.unlocked) {
        return (
            <Callout
                status="default"
                icon={<LockIcon className="size-5" aria-hidden focusable="false" />}
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
            icon={<MicrophoneStageIcon className="size-5" aria-hidden focusable="false" />}
            title={t("flashcard.quiz.readinessUnlockedTitle")}
            description={t("flashcard.quiz.readinessUnlockedDescription")}
            action={(
                <Button
                    variant="secondary"
                    size="sm"
                    className={cn("shrink-0", STATUS_ACTION_CLASS.success)}
                    onPress={() => router.push(mockInterviewHref)}
                >
                    {t("flashcard.quiz.readinessUnlockedCta")}
                    <ArrowRightIcon className="size-4" aria-hidden focusable="false" />
                </Button>
            )}
        />
    )
}
