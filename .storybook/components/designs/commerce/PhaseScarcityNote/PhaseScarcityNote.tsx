import React from "react"
import { cn } from "@heroui/react"
import { WarningCircleIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Cluster } from "@sb-components/frames/Cluster/Cluster"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * DESIGN — `PhaseScarcityNote.Base`: a phase's REAL scarcity line.
 *
 * Carries WHY (§14d): "N seats left at the {phase} price · price rises to {X}
 * after that" — pushes purchase with REAL facts from the backend, not a made-up
 * countdown.
 *
 * Single-component namespace ⇒ `.Base` (teacher's call 2026-07-25).
 *
 * ⚠️ The `_legacy` version's own note says it "does NOT compose any primitive"
 * — it hand-rolled `<span className="text-sm">` for both text parts. This port
 * FIXES that: text goes through the `Typography` atom (§9 — size/weight is the
 * atom's job, not classes scattered here).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** The course's pricing phases (inlined from `@/modules/types/enums/pricing-phase`). */
export enum PricingPhase {
    Pioneer = "pioneer",
    EarlyBird = "early_bird",
    Regular = "regular",
}

/** Localised phase display name (inlined from `courseLanding.phase.*`, vi). */
const PHASE_LABEL: Record<PricingPhase, string> = {
    [PricingPhase.Pioneer]: "Tiên phong",
    [PricingPhase.EarlyBird]: "Sớm",
    [PricingPhase.Regular]: "Tiêu chuẩn",
}

/** Props for {@link PhaseScarcityNote.Base}. */
export interface PhaseScarcityNoteBaseProps {
    /** The course's current pricing phase (shows its label). */
    currentPhase: PricingPhase
    /** Seats left at this phase's price; `null` = unlimited → renders NOTHING. */
    seatsRemaining: number | null
    /** VND price after this phase sells out; `null` = no rise to mention. */
    nextPhasePriceVnd: number | null
    /** Extra classes on the root. */
    className?: string
    /**
     * Anatomy tag for THIS line itself — lets the caller badge it as ONE node (§11a).
     *
     * ⭐ 2026-07-27: without this prop the root doesn't emit `data-anat-part`, so
     * when the caller (`TrialConversionStrip`) declares it as a dep, the node
     * CAN'T enter the tree — the gold-colored line vanishes from the panel even
     * though it still renders on screen. Worse: the four internal spans
     * (`WarningCircleIcon`/`SeatCountLine`/`Separator`/`PriceRiseClause`) leak
     * out as LOOSE siblings, reading like four sibling deps of the block.
     */
    anatPart?: string
    /** Storybook-only: emit `data-anat-part` on each anatomy part. */
    showAnatomy?: boolean
}

/**
 * Honest scarcity line for a paywall. Sits as a DIRECT SIBLING below `PriceTag`
 * (PriceTag handles discounting; scarcity is a different, orthogonal push axis).
 *
 * Only renders when the current phase has a **real seat cap**
 * (`seatsRemaining != null`) — an unlimited phase has no honest "rises when"
 * milestone to state, so it stays silent. EVERY number comes from the
 * backend's `coursePricePreview` — this file NEVER makes up a countdown or
 * seat count (fake scarcity is a banned dark pattern).
 *
 * @param props - {@link PhaseScarcityNoteBaseProps}
 */
const PhaseScarcityNoteBase = ({
    currentPhase,
    seatsRemaining,
    nextPhasePriceVnd,
    className,
    anatPart,
    showAnatomy,
}: PhaseScarcityNoteBaseProps) => {
    // no seat cap at this phase → no honest scarcity reason → stay silent
    if (seatsRemaining == null) {
        return null
    }

    return (
        // Color is set ON THE FRAME; text inside does NOT declare `color`, so it
        // inherits `currentColor` — keeping the original's exact
        // `warning-soft-foreground` tone.
        //
        // ⭐ 2026-07-27 (teacher: "build layout out of layouts components"):
        // this used to be a hand-written `<div className="flex flex-wrap
        // items-center gap-2">`. This row is ONE TRACK of N elements that wrap
        // ⇒ exactly the definition of `Cluster`, and §13b requires repeated
        // lists to go through `items` DATA (children are forbidden).
        //
        // What's gained isn't "fewer classes" but that `gap` is now PINNED to
        // the §10 scale BY TYPE: hand-written it's `gap-2` today, `gap-1.5`
        // tomorrow, nothing stops that.
        <Cluster.Base
            gap={2}
            align="center"
            // The PARENT's `anatPart` wins (the parent names this node); when
            // running in ITS OWN story it self-identifies as "Cluster" so the
            // Deps tree can see the frame it uses.
            anatPart={anatPart ?? (showAnatomy ? "Cluster" : undefined)}
            className={cn("text-warning-soft-foreground", className)}
            items={[
                {
                    key: "icon",
                    content: (
                        // §5a: icon matches the FONT-SIZE of the text beside it — `sm`
                        // (14px) ⇒ `size-3.5`. §5.0a: below `size-5` ⇒ force
                        // `weight="bold"` to compensate for the thin strokes.
                        <WarningCircleIcon
                            aria-hidden
                            focusable="false"
                            weight="bold"
                            // Does NOT emit `data-anat-part`: this is a Phosphor glyph, not
                            // a component of the system, so it has no story to jump to.
                            // Emitting a part with no destination = a node permanently
                            // stuck outside the tree (teacher's call 2026-07-27: "nothing
                            // is allowed to stand outside the tree"). Can't badge it, so
                            // don't badge it.
                            className="size-3.5 shrink-0"
                        />
                    ),
                },
                {
                    key: "seats",
                    content: (
                        <Typography.Base
                            size="sm"
                            weight="medium"
                            text={`Còn ${seatsRemaining} suất giá ${PHASE_LABEL[currentPhase]}`}
                            anatPart={showAnatomy ? "SeatCountLine" : undefined}
                        />
                    ),
                },
                // The next two pieces go TOGETHER (no rise means nothing to separate
                // it from) — but they're still TWO SEPARATE cluster items, since the
                // `·` mark must be allowed to wrap onto the line with the piece after
                // it when the row runs tight.
                ...(nextPhasePriceVnd != null
                    ? [
                        {
                            key: "sep",
                            content: (
                                <Typography.Base
                                    size="sm"
                                    text="·"
                                    anatPart={showAnatomy ? "Separator" : undefined}
                                />
                            ),
                        },
                        {
                            key: "rise",
                            content: (
                                <Typography.Base
                                    size="sm"
                                    text={`giá tăng lên ${nextPhasePriceVnd.toLocaleString("vi-VN")}₫ sau đó`}
                                    anatPart={showAnatomy ? "PriceRiseClause" : undefined}
                                />
                            ),
                        },
                    ]
                    : []),
            ]}
        />
    )
}

/** `PhaseScarcityNote.*` — single-component namespace ⇒ only `.Base`. */
export const PhaseScarcityNote = Object.assign(PhaseScarcityNoteBase, {
    Base: PhaseScarcityNoteBase,
})
