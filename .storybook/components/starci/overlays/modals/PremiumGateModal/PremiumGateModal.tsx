import React from "react"
import { CheckCircleIcon } from "@phosphor-icons/react"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import {
    PhaseScarcityNote,
    PricingPhase,
} from "@sb-components/starci/blocks/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { PriceTagProminent, type PriceBreakdown } from "@sb-components/starci/blocks/commerce/PriceTag/PriceTag"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { Cluster } from "@sb-components/frames/Cluster/Cluster"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `PremiumGateModal`: the value-first buy/register prompt shown when a
 * viewer taps a LOCKED premium tab (`ContentModeNav`, muted-but-clickable —
 * see its own file header) or the "Practice" rail button on a trial-read
 * lesson. What unlocks, the loyalty-aware price, one CTA — nothing else.
 *
 * ⭐ VERIFIED DIFFERENT FROM `ContentPaywall`/`PremiumPaywall` (2026-07-28,
 * per `.claude/fe/steps/11-overlays-layouts-brainstorm.md` §3): those are the
 * INLINE "buy to unlock" panel already built into `ContentPage` — always on
 * the page, no open/close state. This is a DISMISSABLE overlay opened from a
 * click, so it is its own component, not a duplicate.
 *
 * ⚠️ FILED UNDER `overlays/modals`, NOT `blocks/commerce` (a judgement call on
 * this run's own boilerplate, which suggested `blocks/<group>`). Rule 13 names
 * this an `overlay-modal` item, and `components/README.md`'s app-folder split
 * law is explicit: "`overlays/{modals,drawers}` = things that open OVER the
 * screen, mounted ONCE at the app root, callable from ANYWHERE via the store" — exactly this modal's
 * contract. `FoundationModal` was RELOCATED out of `blocks/learn` into
 * `overlays/modals` for this exact reason (see its own file header); building
 * a fresh overlay straight into `blocks/commerce` would repeat the mistake
 * that relocation fixed.
 *
 * RULE 13 CONTRACT — plain `isOpen`/`onOpenChange`, no store wiring. The real
 * app opens this from `useOverlayStore` (or equivalent) on a locked-tab click;
 * that store, and the SWR call resolving `price`, are APP WIRING, out of
 * scope here. `onUpgrade` only fires the callback — the CALLER decides
 * close-then-open-payment (same handoff shape as `TrialConversionStrip`'s
 * `onEnroll`).
 *
 * COMPOSED FROM (verbatim, no rebuilding): `ModalShell` (dialog scaffold) ·
 * `PriceTagProminent` + `PhaseScarcityNote` (the same pricing pair
 * `TrialConversionStrip` uses, same `breakdown` shape) · `Button` · `Typography`
 * · `StackV`/`Cluster` frames · `CheckCircleIcon` (bare Phosphor glyph, no
 * `anatPart` — matches `PhaseScarcityNote`'s own-glyph convention: a glyph
 * with no story to jump to must not emit a badge that dead-ends the tree).
 *
 * ⭐ THE BLOCK OWNS ITS WORDING (§14d.1). Both the header (named-course vs
 * generic) and the "what unlocks" checklist come from FIXED local vocabulary
 * tables (`GATE_HEADER`, `GATE_UNLOCKS`) — the same i18n-key pattern as
 * `ContentModeNav`'s `MODE_LABEL`. `courseTitle` is DATA interpolated into a
 * fixed template (`Unlock "${courseTitle}"`), never a caller-supplied string
 * standing in for the whole sentence.
 *
 * 📐 ONE LEAF (matches `FoundationModal` precedent — no structural kind
 * switch). Three STATES of that one leaf: price resolved (real
 * `PriceTagProminent` + `PhaseScarcityNote`) · `isSkeleton` (Typography-mirror
 * lines in the same box, the exact technique `TrialConversionStrip` uses for
 * its own price region) · price resolved with no saving (`PriceTagProminent`
 * alone; `PhaseScarcityNote` renders nothing on its own `seatsRemaining ===
 * null` contract — it is never told to hide, it decides that itself). Only
 * the price region ever rests; the header, the unlocks list, and the CTA are
 * static chrome and paint immediately, exactly like `TrialConversionStrip`'s
 * `isSkeleton` contract.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Minimal price-preview shape this modal needs (mirrors `TrialConversionStripPrice`). */
export interface PremiumGateModalPrice {
    /** The price the user actually pays. */
    discountedPriceVnd: number
    /** Pre-discount (list/MSRP) price; struck through when greater than {@link discountedPriceVnd}. */
    originalPriceVnd?: number | null
    /** Active-phase price BEFORE loyalty — feeds the breakdown popover's middle step. */
    phasePriceVnd: number
    /** Loyalty discount percent (0 = no loyalty row in the breakdown). */
    discountPercent: number
    /** The course's current pricing phase — shown by {@link PhaseScarcityNote}. */
    currentPhase: PricingPhase
    /** Seats left at this phase's price; `null` = unlimited → {@link PhaseScarcityNote} renders nothing. */
    seatsRemaining: number | null
    /** VND price after this phase sells out; `null` = no rise to mention. */
    nextPhasePriceVnd: number | null
}

/** Props for {@link PremiumGateModal}. */
export interface PremiumGateModalProps {
    /** Whether the modal is currently open. Forwarded to {@link ModalShell}. */
    isOpen: boolean
    /** Open-state change handler — backdrop click, Escape, close button. Forwarded to {@link ModalShell}. */
    onOpenChange: (open: boolean) => void
    /**
     * The specific course being gated, when known. Drives which row of
     * {@link GATE_HEADER} renders — `null`/omitted falls back to the generic
     * copy (e.g. opened from a rail button with no course in scope yet).
     */
    courseTitle?: string | null
    /**
     * Price preview for the course; `undefined`/`null` while not yet resolved
     * and {@link isSkeleton} is off renders neither the real price nor a
     * shimmer (nothing to show yet is the caller's state to reach, same as
     * `TrialConversionStrip`).
     */
    price?: PremiumGateModalPrice | null
    /**
     * `true` → ONLY the price region rests: the header, the unlocks list, and
     * the CTA button do not depend on the price, so they render immediately
     * and the shimmer stands exactly where `PriceTagProminent` +
     * `PhaseScarcityNote` will land — the exact `TrialConversionStrip`
     * `isSkeleton` contract, carried over unchanged.
     */
    isSkeleton?: boolean
    /**
     * Fired when the upgrade CTA is pressed. The CALLER decides what pressing
     * it means (close this modal, open the payment flow) — Rule 13, same
     * handoff shape as `TrialConversionStrip`'s `onEnroll`.
     */
    onUpgrade: () => void
    /** Extra classes on the root. */
    className?: string
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/** Whether the caller named a specific course, or this is a generic gate. */
type GateHeaderVariant = "named" | "generic"

/** One row of the {@link GATE_HEADER} table — a title template plus its description. */
interface GateHeaderCopy {
    /** Builds the header title; `courseTitle` is DATA plugged into the template, not caller wording. */
    title: (courseTitle?: string | null) => string
    /** Header description, shown under the title. */
    description: string
}

/**
 * variant → header copy. Fixed Vietnamese vocabulary this block owns
 * (§14d.1), same table shape as `ContentModeNav`'s `MODE_LABEL`.
 * `courseTitle` is DATA plugged into the `named` row's template — the
 * sentence itself never comes from the caller, mirroring
 * `PhaseScarcityNote`'s `${seatsRemaining} seats left…` pattern.
 */
const GATE_HEADER: Record<GateHeaderVariant, GateHeaderCopy> = {
    named: {
        title: (courseTitle) => `Unlock "${courseTitle}"`,
        description: "Watch every lecture, take unlimited challenges, and earn a certificate when you complete the course.",
    },
    generic: {
        title: () => "Unlock the full course",
        description: "Watch every lecture, take unlimited challenges, and earn a certificate when you complete the course.",
    },
}

/** One line of the "what unlocks" checklist. */
interface GateUnlockItem {
    /** Stable row key. */
    key: string
    /** The benefit line itself. */
    label: string
}

/**
 * What unlocking premium gives the viewer — fixed local vocabulary (§14d.1),
 * not caller data: a caller states IT WANTS a gate, never which benefits to
 * list, the same way `ContentModeNav`'s modes come from its own table.
 */
const GATE_UNLOCKS: ReadonlyArray<GateUnlockItem> = [
    { key: "content", label: "All of the course's lectures and resources" },
    { key: "practice", label: "Unlimited challenges, quizzes, and mock interviews" },
    { key: "certificate", label: "A certificate of completion when you finish the course" },
]

/**
 * Renders the value-first upgrade prompt inside the shared modal scaffold.
 * See the file header for the full contract.
 *
 * @param props - {@link PremiumGateModalProps}
 */
const PremiumGateModal = ({
    isOpen,
    onOpenChange,
    courseTitle,
    price,
    isSkeleton = false,
    onUpgrade,
    className,
    showAnatomy = false,
    anatPart,
}: PremiumGateModalProps) => {
    const headerVariant: GateHeaderVariant = courseTitle ? "named" : "generic"
    const header = GATE_HEADER[headerVariant]

    const breakdown: PriceBreakdown | undefined = price
        ? {
            phase: price.phasePriceVnd,
            loyaltyPercent: price.discountPercent,
        }
        : undefined

    const unlockItems = GATE_UNLOCKS.map((item) => (
        <Cluster
            key={item.key}
            gap={3}
            align="center"
            anatPart={showAnatomy ? "Cluster" : undefined}
            items={[
                {
                    key: "icon",
                    content: (
                        <CheckCircleIcon
                            aria-hidden
                            focusable="false"
                            weight="bold"
                            // No `data-anat-part`: a bare Phosphor glyph has no
                            // story to jump to (`PhaseScarcityNote`'s own
                            // convention) — badging it would dead-end the tree.
                            className="size-3.5 shrink-0 text-success-soft-foreground"
                        />
                    ),
                },
                {
                    key: "label",
                    content: (
                        <Typography
                            size="sm"
                            text={item.label}
                            showAnatomy={showAnatomy}
                        />
                    ),
                },
            ]}
        />
    ))

    const skeletonPrice = (
        <>
            <Typography size="h4" isSkeleton classNames={["w-1/3"]} showAnatomy={showAnatomy} />
            <Typography size="xs" isSkeleton classNames={["w-1/2"]} showAnatomy={showAnatomy} />
        </>
    )

    const gateBody = (
        <>
            {/* "What unlocks" — static chrome, never skeletonised: known before
                any price data lands, exactly like `ContentModeNav`'s own row. */}
            <StackV gap={3} body={unlockItems} />

            {/* Price + scarcity — the ONLY region `isSkeleton` reaches, same
                `isSkeleton && !price` / `price?.discountedPriceVnd != null` split
                `TrialConversionStrip` uses for its own price region. */}
            {isSkeleton && !price ? (
                <StackV gap={4} body={skeletonPrice} />
            ) : price?.discountedPriceVnd != null ? (
                <StackV
                    gap={4}
                    body={
                        <>
                            <PriceTagProminent
                                discounted={price.discountedPriceVnd}
                                original={price.originalPriceVnd}
                                breakdown={breakdown}
                                anatPart={showAnatomy ? "PriceTagProminent" : undefined}
                            />
                            <PhaseScarcityNote
                                anatPart={showAnatomy ? "PhaseScarcityNote" : undefined}
                                currentPhase={price.currentPhase}
                                seatsRemaining={price.seatsRemaining}
                                nextPhasePriceVnd={price.nextPhasePriceVnd}
                            />
                        </>
                    }
                />
            ) : null}
        </>
    )

    return (
        <div data-anat-part={anatPart} className={className}>
            <ModalShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title={header.title(courseTitle)}
                description={header.description}
                size="md"
                showAnatomy={showAnatomy}
                footer={
                    <Button
                        variant="primary"
                        size="lg"
                        classNames={["w-full"]}
                        label="Unlock now"
                        onPress={onUpgrade}
                        showAnatomy={showAnatomy}
                    />
                }
            >
                <StackV gap={6} anatPart={showAnatomy ? "StackV" : undefined} body={gateBody} />
            </ModalShell>
        </div>
    )
}

export { PremiumGateModal }
