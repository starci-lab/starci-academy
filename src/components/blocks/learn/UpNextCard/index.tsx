"use client"

import type { ReactNode } from "react"
import { ArrowRightIcon, CheckCircleIcon } from "@phosphor-icons/react"
import { SectionCard } from "@/components/blocks/cards/SectionCard"
import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import { Cluster } from "@/components/frames/Cluster"
import { StackH, StackV } from "@/components/frames/Stack"

/**
 * Props for the {@link UpNextCard} block.
 *
 * A presentational, props-only "you just finished — here's the next rung" card
 * fired at the COMPLETION moment of a learn surface (end of a lesson, end of a
 * flashcard session, a scorecard…) to hand the learner off to the next step in
 * the course loop while momentum is high. It performs no data fetching and reads
 * no store — the caller computes the next rung and wires navigation via
 * {@link onPress} (and {@link secondaryOnPress}).
 */
export interface UpNextCardProps {
    /**
     * Small quiet eyebrow above the title (e.g. "Next"). Rendered muted.
     * Pair with {@link showCheck} for the "you just finished ✓" micro-feedback.
     */
    eyebrow?: ReactNode
    /**
     * When true, a success check precedes the eyebrow — the completion
     * micro-feedback that makes the next CTA read as riding the momentum.
     */
    showCheck?: boolean
    /** The next rung, phrased as the concrete thing to do next (the CTA's promise). */
    title: ReactNode
    /**
     * Optional one-line "why / toward what outcome" under the title — frame it
     * toward the outcome (e.g. moving the job-readiness band), not generically.
     */
    description?: ReactNode
    /** Primary CTA label — descriptive + contextual ("Do 2 challenges from this lesson"). */
    ctaLabel: ReactNode
    /** Primary CTA press handler (caller wires router navigation). */
    onPress: () => void
    /** Optional secondary, quieter action label (e.g. "Do the chapter capstone"). */
    secondaryLabel?: ReactNode
    /** Optional secondary press handler. */
    secondaryOnPress?: () => void
}

/**
 * UpNextCard renders the single, prominent completion-handoff card for the course
 * learning loop. It stacks: an optional check + eyebrow ("Done · Next"),
 * the next rung as a title, an optional outcome-framed description, then ONE
 * primary CTA (accent, `size="lg"`, trailing arrow — the one obvious next action)
 * and an optional quiet secondary link. Static card + button affordance (the card
 * itself is not pressable — the CTA is the single, clear target). Composes
 * {@link SectionCard} for the card face — its own content stack already runs
 * `flex flex-col gap-3`, so this block hands it three rows directly rather than
 * adding a layout wrapper of its own.
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
}: UpNextCardProps) => {
    const hasEyebrowRow = Boolean(eyebrow || showCheck)

    return (
        <SectionCard identity={{ tier: "block", component: "UpNextCard" }}>
            {/* completion micro-feedback + "next" eyebrow */}
            {hasEyebrowRow ? (
                <StackH
                    gap={2}
                    items={[
                        ...(showCheck ? [() => (
                            <CheckCircleIcon
                                aria-hidden
                                focusable="false"
                                className="size-5 shrink-0 text-success-soft-foreground"
                            />
                        )] : []),
                        ...(eyebrow ? [() => (
                            <Typography size="xs" color="muted" text={eyebrow} />
                        )] : []),
                    ]}
                />
            ) : null}

            {/* the next rung */}
            <StackV
                gap={2}
                items={[
                    () => <Typography size="base" weight="semibold" text={title} />,
                    ...(description ? [() => (
                        <Typography size="sm" color="muted" text={description} />
                    )] : []),
                ]}
            />

            {/* one primary CTA (+ optional quiet secondary) */}
            <Cluster
                gap={3}
                items={[
                    () => (
                        <Button
                            variant="primary"
                            size="lg"
                            label={ctaLabel}
                            suffixIcon={ArrowRightIcon}
                            onPress={onPress}
                        />
                    ),
                    ...(secondaryLabel && secondaryOnPress ? [() => (
                        <Button variant="tertiary" label={secondaryLabel} onPress={secondaryOnPress} />
                    )] : []),
                ]}
            />
        </SectionCard>
    )
}
