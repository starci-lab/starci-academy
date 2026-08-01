import React from "react"
import { ArrowRightIcon, CheckCircleIcon } from "@phosphor-icons/react"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `PlaygroundEnterBanner`: the playground page's SINGLE primary
 * decision. Everything else on that page (the checklist of prerequisite
 * steps, the resource meta) is context; this is the one card that tells the
 * learner "here is where you stand, and here is the one button that matters".
 *
 * REUSE, NOT REBUILD (the run this task exists to correct against). The shape
 * is exactly `FlashcardDueHero`'s leaf 1: `SurfaceCard` (`label`) ⊃ `StackV`
 * holding a status line + a primary `Button`. No new card chrome, no hand-rolled
 * `flex gap-*` — `SurfaceCard`/`StackV`/`Button`/`Typography` already draw
 * every pixel this needs.
 *
 * ⭐ §14d.1 — THE BLOCK OWNS THE SENTENCE, not the caller. `allReady` and
 * `pendingCount` are two raw booleans/numbers; nowhere does the caller hand a
 * pre-formatted "2 steps left…" string. The status line is built HERE from that
 * data, same discipline `FlashcardDueHero.buildBreakdown` applies to its own
 * due-count line.
 *
 * ONE LEAF (`Default`), TWO DATA STATES (§11f) — ready and pending share the
 * exact same card/stack/button structure; only the status text/color and the
 * button's `isDisabled` flip. Neither swap removes or adds a composed node,
 * so this stays one leaf per the LEAF=structure / STATE=content rule.
 *
 * ⭐ GATED, NOT SWALLOWED (rule #7, read carefully — this is the narrow
 * exception, not a contradiction). Rule #7 forbids a block hard-coding what a
 * LOCKED action means (a paywalled tab must still fire `onModeChange` so the
 * caller can decide to open a paywall). Here there is no such caller decision
 * to make: `allReady=false` means the checklist genuinely has nothing to
 * enter yet — there is no destination behind the button until the steps are
 * done. So the CTA disables via the atom's own `isDisabled` (a visible,
 * standard affordance), and `onEnter` is never called from a disabled button
 * in the first place — nothing is silently swallowed, the control simply
 * isn't actionable yet.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
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

                    body={
                        <>
                            <Typography
                                size="sm"
                                color={allReady ? "success" : "muted"}
                                weight={allReady ? "medium" : undefined}
                                prefixIcon={allReady ? CheckCircleIcon : undefined}
                                isSkeleton={isSkeleton}

                                text={readiness}
                            />
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
                        </>
                    }
                />
            )}
        />
    )
}

export { PlaygroundEnterBanner }
