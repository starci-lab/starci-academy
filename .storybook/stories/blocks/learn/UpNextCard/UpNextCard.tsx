import React from "react"
import { Typography, cn } from "@heroui/react"
import { ArrowRightIcon, CheckCircleIcon } from "@phosphor-icons/react"
import { SectionCard } from "../../cards/SectionCard/SectionCard"
import { Button } from "../../buttons/Button/Button"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK (composite) ported from
 * `@/components/blocks/learn/UpNextCard`. Composes the local primitive
 * `SectionCard` (frame) + HeroUI Button/Typography. Authored in Storybook (not
 * `src`); synced to `src` later.
 */

/**
 * Props for the {@link UpNextCard} block.
 *
 * A presentational, props-only "you just finished — here's the next rung" card
 * fired at the COMPLETION moment of a learn surface (end of a lesson, end of a
 * flashcard session, a scorecard…) to hand the learner off to the next step in
 * the course loop while momentum is high. It performs no data fetching and reads
 * no store — the caller computes the next rung and wires navigation via
 * {@link UpNextCardProps.onPress} (and {@link UpNextCardProps.secondaryOnPress}).
 */
export interface UpNextCardProps {
    /**
     * Small quiet eyebrow above the title (e.g. "Tiếp theo"). Rendered muted.
     * Pair with {@link UpNextCardProps.showCheck} for the "you just finished ✓" micro-feedback.
     */
    eyebrow?: React.ReactNode
    /**
     * When true, a success check precedes the eyebrow — the completion
     * micro-feedback that makes the next CTA read as riding the momentum.
     */
    showCheck?: boolean
    /** The next rung, phrased as the concrete thing to do next (the CTA's promise). */
    title: React.ReactNode
    /**
     * Optional one-line "why / toward what outcome" under the title — frame it
     * toward the outcome (e.g. moving the job-readiness band), not generically.
     */
    description?: React.ReactNode
    /** Primary CTA label — descriptive + contextual ("Làm 2 thử thách của bài này"). */
    ctaLabel: React.ReactNode
    /** Primary CTA press handler (caller wires router navigation). */
    onPress: () => void
    /** Optional secondary, quieter action label (e.g. "Làm capstone chương"). */
    secondaryLabel?: React.ReactNode
    /** Optional secondary press handler. */
    secondaryOnPress?: () => void
    /** Extra classes on the card root. */
    className?: string
}

/**
 * UpNextCard renders the single, prominent completion-handoff card for the course
 * learning loop. It stacks: an optional check + eyebrow ("Đã xong · Tiếp theo"),
 * the next rung as a title, an optional outcome-framed description, then ONE
 * primary CTA (accent, `size="lg"`, trailing arrow — the one obvious next action)
 * and an optional quiet secondary link. Static card + button affordance (the card
 * itself is not pressable — the CTA is the single, clear target).
 *
 * @param props - {@link UpNextCardProps}
 */
export const UpNextCard = ({
    eyebrow,
    showCheck,
    title,
    description,
    ctaLabel,
    onPress,
    secondaryLabel,
    secondaryOnPress,
    className,
}: UpNextCardProps) => {
    return (
        <SectionCard
            className={cn("flex flex-col", className)}
            contentClassName="flex flex-col gap-3"
        >
            {/* completion micro-feedback + "next" eyebrow */}
            {eyebrow || showCheck ? (
                <div className="flex items-center gap-2">
                    {showCheck ? (
                        <CheckCircleIcon
                            aria-hidden
                            focusable="false"
                            className="size-5 shrink-0 text-success-soft-foreground"
                        />
                    ) : null}
                    {eyebrow ? (
                        <Typography type="body-xs" color="muted">
                            {eyebrow}
                        </Typography>
                    ) : null}
                </div>
            ) : null}

            {/* the next rung */}
            <div className="flex flex-col gap-2">
                <Typography weight="semibold">{title}</Typography>
                {description ? (
                    <Typography type="body-sm" color="muted">
                        {description}
                    </Typography>
                ) : null}
            </div>

            {/* one primary CTA (+ optional quiet secondary) */}
            <div className="flex flex-wrap items-center gap-3">
                <Button
                    variant="primary"
                    size="lg"
                    onPress={onPress}
                    icon={<ArrowRightIcon aria-hidden focusable="false" />}
                >
                    {ctaLabel}
                </Button>
                {secondaryLabel && secondaryOnPress ? (
                    <Button variant="tertiary" onPress={secondaryOnPress}>
                        {secondaryLabel}
                    </Button>
                ) : null}
            </div>
        </SectionCard>
    )
}
