import React from "react"
import { ArrowRightIcon, CheckCircleIcon } from "@phosphor-icons/react"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"

/**
 * `PlaygroundEnterBanner` — the playground page's single primary decision card.
 * Reuses `FlashcardDueHero`'s card shape (`SurfaceCard` ⊃ `StackV` ⊃ status line +
 * primary `Button`). The block builds its own readiness sentence from `allReady` +
 * `pendingCount`. One shape: ready vs pending are data states — the swap only
 * changes the status text/color and the CTA's `isDisabled`.
 */

/** Props for {@link PlaygroundEnterBanner}. */
export interface PlaygroundEnterBannerProps {
    /** `true` → every prerequisite step is done and the room can be entered. */
    allReady: boolean
    /** How many prerequisite steps are still outstanding. Ignored when `allReady`. */
    pendingCount: number
    /** Fired when the learner presses the primary CTA. Only reachable when `allReady`. */
    onEnter: () => void
    /**
     * `true` → the status line and the button switch to their own shimmer. The
     * flag flows straight into the composed `Typography`/`Button` atoms rather
     * than a parallel skeleton tree (§12c).
     */
    isSkeleton?: boolean
}

/** The section label above the card — also doubles as the CTA's own wording (the decision this whole card is). */
const SECTION_LABEL = "Continue"

/**
 * Builds the readiness sentence from raw data (§14d.1) — never handed a
 * pre-formatted string by the caller.
 */
const buildReadinessText = (allReady: boolean, pendingCount: number): string =>
    allReady
        ? "All prep steps are done — ready to enter the lab."
        : `${pendingCount} steps left before you can enter.`

/**
 * The playground page's single primary decision card. See the file header
 * for the full contract, especially the "gated, not swallowed" note.
 *
 * @param props - {@link PlaygroundEnterBannerProps}
 */
const PlaygroundEnterBanner = ({
    allReady,
    pendingCount,
    onEnter,
    isSkeleton = false,
}: PlaygroundEnterBannerProps) => {
    const readiness = buildReadinessText(allReady, pendingCount)
    return (
        <SurfaceCard
            label={SECTION_LABEL}

            isSkeleton={isSkeleton}

            body={() => (
                <StackV
                    gap={4}
                    isSkeleton={isSkeleton}
                    items={[
                        () => (
                            <Typography
                                size="sm"
                                color={allReady ? "success" : "muted"}
                                weight={allReady ? "medium" : undefined}
                                prefixIcon={allReady ? CheckCircleIcon : undefined}
                                isSkeleton={isSkeleton}

                                text={readiness}
                            />
                        ),
                        () => (
                            <Button
                                variant="primary"
                                label={SECTION_LABEL}
                                suffixIcon={ArrowRightIcon}
                                iconSlide
                                onPress={onEnter}
                                isDisabled={!allReady}
                                isSkeleton={isSkeleton}

                                classNames={["w-fit"]}
                            />
                        ),
                    ]}
                />
            )}
        />
    )
}

export { PlaygroundEnterBanner }
