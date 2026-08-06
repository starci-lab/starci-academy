import React from "react"
import { CheckCircleIcon, ArrowRightIcon } from "@phosphor-icons/react"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { Typography } from "@/components/atoms/text/Typography"
import { Button } from "@/components/atoms/buttons/Button"
import { StackV } from "@/components/frames/Stack"

/**
 * BLOCK — `MilestoneUpNextCard`: the passed-attempt handoff to the NEXT
 * unlocked milestone task on a capstone track. Distinct from the challenge
 * flow (no such fixed handoff exists there) — see the component file header.
 *
 * 📐 TWO LEAVES (§14d.2). `showCheck` and `isSkeleton` only toggle a glyph or
 * mirror the existing shape — neither changes what is composed, so both are
 * STATES of `Default`. `isHighlight` is different: it adds/removes the
 * highlight streak, a real DOM node, so its two values are the `Default`
 * (highlighted, the milestone screen's original shape) and `Plain` (reused by
 * `ContentPage`'s mobile/tablet nudge — see that component's file header for
 * why the default doesn't fit there) leaves.
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
                principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
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
