import React from "react"
import { ArrowRightIcon, CheckCircleIcon } from "@phosphor-icons/react"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `PlaygroundEnterBanner` — the playground page's single primary decision: a
 * labeled `SurfaceCard` holding a status line and the one button that enters the
 * lab. The block builds the status sentence from `allReady`/`pendingCount`
 * rather than a caller-supplied string. One leaf, two data states (ready vs
 * pending); the CTA disables via the button's own `isDisabled` while steps
 * remain.
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
