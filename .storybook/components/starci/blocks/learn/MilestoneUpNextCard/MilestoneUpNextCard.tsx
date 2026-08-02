import React from "react"
import { CheckCircleIcon, ArrowRightIcon } from "@phosphor-icons/react"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `MilestoneUpNextCard` — the passed-attempt handoff to the next unlocked milestone task
 * on a linear capstone track: one focal action, `isHighlight` default `true`. Reused for
 * `ContentPage`'s mobile/tablet practice nudge, where the caller sets `isHighlight` off
 * for a plain inline aside.
 *
 * `showCheck` places a check glyph beside the eyebrow (a state, not a leaf). `eyebrow`/
 * `title`/`description`/`ctaLabel` are caller strings; the block owns layout, the check
 * placement, the highlight treatment, and the CTA arrow.
 */

/** Props for {@link MilestoneUpNextCard}. */
export interface MilestoneUpNextCardProps {
    /** Small label above the title, e.g. "Next task". */
    eyebrow: string
    /** `true` → a check glyph sits beside the eyebrow, marking the attempt just passed. */
    showCheck?: boolean
    /** Name of the next unlocked milestone task. */
    title: string
    /** One line describing what the next task asks for. */
    description: string
    /** CTA label, e.g. "Start task 3". */
    ctaLabel: string
    /** Press the CTA. */
    onPress?: () => void
    /** `true` → the card face carries the highlight streak (the ONE focal action on its screen). @default true */
    isHighlight?: boolean
    /** `true` → every composed atom mirrors as shimmer. */
    isSkeleton?: boolean
    /** Anatomy tag for THIS block itself (§11a.1) — lets the caller badge it as ONE node. */
    /** Placement class only (§14d.1), forwarded to the card face. */
    className?: string
}

/**
 * The single "what's next" highlight card shown right after a passed
 * milestone attempt, handing off to the next unlocked task on the track.
 *
 * @param props - {@link MilestoneUpNextCardProps}
 */
const MilestoneUpNextCard = ({
    eyebrow,
    showCheck = false,
    title,
    description,
    ctaLabel,
    onPress,
    isHighlight = true,
    isSkeleton = false,
    className,
}: MilestoneUpNextCardProps) => (
    <SurfaceCard
        isHighlight={isHighlight}
        isSkeleton={isSkeleton}

        contentClassName={className}
        body={() => (
            <StackV
                gap={4}

                items={[
                    // Back INSIDE the card face (not `SurfaceCard.label`,
                    // which sits OUTSIDE/above it) — a plain atom call, not raw CSS, so no
                    // shape-tier violation either way; this is a visual placement call.
                    () => (
                        <Typography
                            size="xs"
                            color="muted"
                            prefixIcon={showCheck ? CheckCircleIcon : undefined}
                            isSkeleton={isSkeleton}
                            text={eyebrow}

                        />
                    ),
                    // Real `UpNextCard` leaves `type` unset on its title
                    // Typography, which defaults to HeroUI's `type="body"` = `text-base`
                    // (verify `typography.css` `.typography--body`). `weight="semibold"`
                    // folds to `"medium"` at body
                    // scale, not `"bold"`.
                    () => (
                        <Typography
                            size="base"
                            weight="medium"
                            isSkeleton={isSkeleton}
                            text={title}

                        />
                    ),
                    () => (
                        <Typography
                            size="sm"
                            color="muted"
                            isSkeleton={isSkeleton}
                            text={description}

                        />
                    ),
                    () => (
                        <Button
                            isSkeleton={isSkeleton}
                            variant="primary"
                            size="sm"
                            label={ctaLabel}
                            suffixIcon={ArrowRightIcon}
                            iconSlide
                            onPress={onPress}
                            classNames={["w-fit", "shrink-0"]}

                        />
                    ),
                ]}
            />
        )}
    />
)

export { MilestoneUpNextCard }
