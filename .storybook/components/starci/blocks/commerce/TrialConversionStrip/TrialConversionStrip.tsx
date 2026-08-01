import React from "react"
import { ArrowRightIcon, LockIcon } from "@phosphor-icons/react"
import { IconTile } from "@sb-components/atoms/display/IconTile/IconTile"
import { PriceBreakdown, PriceTagProminent } from "@sb-components/starci/blocks/commerce/PriceTag/PriceTag"
// The NON-legacy version (`designs/commerce/…`) — the `_legacy` version of the same
// name still exists but is a dead end; screens are forbidden from touching `_legacy`
// so every link in the chain has to move off it (instructor, 2026-07-26).
import { PhaseScarcityNote, PricingPhase } from "@sb-components/starci/blocks/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { TitledText } from "@sb-components/composites/text/TitledText/TitledText"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK ported faithfully from
 * `@/components/features/learn/CourseContents/TrialConversionStrip`, made
 * TIER-3 PRESENTATIONAL: `src` reads `useQueryCoursePricePreviewSwr` (SWR) +
 * `usePaymentOverlayState` (zustand) itself; this port takes the same data as
 * PLAIN PROPS (`price`, `isSkeleton`, `onEnroll`) so it renders standalone
 * with no store/SWR wiring. The `next-intl` strings are INLINED locally (vi).
 * Composed from lower-tier locals — {@link IconTile} (lock icon, accent tone,
 * sm) + {@link PriceTag} + {@link PhaseScarcityNote} + {@link Skeleton.Typography}
 * (price-loading mirror) + {@link Button} (enroll CTA). Synced to `src` later.
 */

/** Minimal price-preview shape this block needs (mirrors `coursePricePreview` fields actually read). */
export interface TrialConversionStripPrice {
    discountedPriceVnd: number
    originalPriceVnd?: number | null
    phasePriceVnd: number
    discountPercent: number
    currentPhase: PricingPhase
    seatsRemainingInCurrentPhase: number | null
    nextPhasePriceVnd: number | null
}

/** Props for the {@link TrialConversionStrip} block. */
export interface TrialConversionStripProps {
    /** FREE lessons the trial viewer hasn't read yet — powers the goal-gradient line. */
    freeLessonsRemaining: number
    /** Price preview for the course; `undefined`/`null` while absent (see `isSkeleton`). */
    price?: TrialConversionStripPrice | null
    /**
     * `true` → this block is at REST. Only the PRICE region rests: the header (icon,
     * title, description) and the CTA do not depend on the price, so they render
     * immediately and the shimmer stands exactly where PriceTag + PhaseScarcityNote will
     * land, which is what stops the layout jumping when the price arrives.
     *
     * Named `isSkeleton`, not `isPriceLoading` (§12g.0a: ONE vocabulary across all five
     * tiers). The old name was a second word for the same idea at this tier only, so a
     * reader crossing the block boundary had to translate it every time — and the screen
     * had to write `isPriceLoading={isSkeleton}` to bridge the two.
     */
    isSkeleton?: boolean
    /** Fired when the enroll CTA is pressed (caller owns opening the payment flow). */
    onEnroll?: () => void
    /** Layout utilities on the root, from the closed positioning union (SurfaceCard's `className` door was deleted, COMPOSITE-4). */
    classNames?: Array<AllowedClassName>
    /** When on, emit `data-anat-part` on each composed part so a BlockAnatomy panel can badge it on-render. */
    showAnatomy?: boolean
    /**
     * Anatomy tag for THIS block itself — so the caller can badge it as ONE node (§11a).
     * Without this prop, the screen has to wrap `<div data-anat-part>` around it,
     * meaning the screen adds a DOM node that doesn't belong to the real tree (§14b).
     */
    anatPart?: string
}

/**
 * Trial → enroll conversion strip on the content-home. Bundles three honest
 * levers on the surface they actually land on: (1) LOSS-AVERSION — "you've
 * read N/M free lessons, keep going"; (2) SCARCITY — the real pricing-phase
 * seats + next-tier price via {@link PhaseScarcityNote}; (3) the enroll CTA.
 * Every number is a prop from the caller — this block never fabricates one.
 *
 * @param props - {@link TrialConversionStripProps}
 */
const TrialConversionStripBase = ({
    freeLessonsRemaining,
    price,
    isSkeleton = false,
    onEnroll,
    classNames,
    showAnatomy = false,
    anatPart,
}: TrialConversionStripProps) => {
    const hasFreeLeft = freeLessonsRemaining > 0

    const breakdown: PriceBreakdown | undefined = price
        ? {
            phase: price.phasePriceVnd,
            loyaltyPercent: price.discountPercent,
        }
        : undefined

    const headerRow = (
        <StackH gap={4} align="center" anatPart={showAnatomy ? "StackH" : undefined} body={(
            <>
                <IconTile
                    icon={LockIcon}
                    tone="accent"
                    size="sm"
                    showAnatomy={showAnatomy}
                />
                {/* The "title + description" cluster is ONE SEMANTIC UNIT ⇒ goes through
                ONE frame, not two separate `Typography` (decided 2026-07-27).
                `TitledText size="row"` (default) already OWNS exactly this scale:
                title `sm` medium · subtitle `xs` muted. Hand-building two atoms means
                the block decides its own font sizes — one style per spot, with
                nothing keeping them in sync.
                NOTE: the old version had the title at `base` (16px) + description `sm` —
                one step larger than the row's standard scale. */}
                <TitledText
                    classNames={["flex-1"]}
                    anatPart={showAnatomy ? "TitledText" : undefined}
                    isSkeleton={isSkeleton && !price}
                    title="Free trial — unlock the full course"
                    subtitle={
                        hasFreeLeft
                            ? `${freeLessonsRemaining} free lessons left unread — keep reading or unlock the full course now.`
                            : "You've read every free lesson — unlock the full course to keep going."
                    }
                />
            </>
        )} />
    )

    // `grouped` (§10b). Read the seam by RELATIONSHIP, not by tier: the
    // scarcity line is a CAPTION OF THE PRICE, so price + scarcity are one
    // cluster and this is an INTRA-cluster seam. `section` (6) belongs to the
    // seams AROUND this cluster — to the lead cluster above and to the CTA
    // beside it.
    // Measured (2026-07-27) why this matters: applying "design ↔ design = 6"
    // mechanically here produced the rhythm 24/12/24/24, i.e. the caption ended
    // up as far from its own price as the CTA is from everything, and §10 bans a
    // uniform rhythm precisely because it stops reading as groups. With 3 the
    // card reads 24/12/12/24 — two groups, which is what it is. It was `tight`
    // (1) before either fix, a step §10b reserves for pairs inside an atom.
    const priceColumn = (
        <StackV gap={4} anatPart={showAnatomy ? "StackV" : undefined} body={
            isSkeleton && !price ? (
                // 2026-07-12: the CTA card renders instantly once the outline
                // resolves, but the price is a second fetch — mirror the price
                // line instead of showing an empty gap until it lands.
                <>
                    <Typography size="h4" isSkeleton classNames={["w-1/3"]} showAnatomy={showAnatomy} />
                    <Typography size="xs" isSkeleton classNames={["w-1/2"]} showAnatomy={showAnatomy} />
                </>
            ) : price?.discountedPriceVnd != null ? (
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
                        seatsRemaining={price.seatsRemainingInCurrentPhase}
                        nextPhasePriceVnd={price.nextPhasePriceVnd}
                    />
                </>
            ) : null
        } />
    )

    // ⚠️ TRIED `Split` (2026-07-27) and it was WRONG — caught immediately: the
    // −33% chip dropped to its own line. `Split`'s contract is "the `start`
    // side is ALLOWED TO SHRINK (`min-w-0`), the `end` side never shrinks" ⇒
    // when tight it SQUEEZES the left side. Measured: the left side was left
    // at 216px while the button took 248px, the price row grew to 61px tall
    // (two lines).
    // Price is a NUMBER — shrinking it means nothing, unlike a long title that
    // can truncate. The correct behaviour for this row is to WRAP when tight
    // (the original: `flex-wrap`), i.e. the button drops to the next line
    // instead of the price getting squeezed. That's `StackH` with `wrap` —
    // children are ARBITRARY so it fits §13b.
    // The seam between the lead cluster and the price block is a SEAM, not a
    // BOUNDARY: `gap-6` on the parent stack already separates the two regions;
    // adding a `border-t` on top says the same thing twice in two languages.
    const footerRow = (
        <StackH
            gap={6}
            align="end"
            justify="between"
            wrap
            anatPart={showAnatomy ? "StackH" : undefined}
            body={(
                <>
                    {priceColumn}
                    {/* ATOM `Button`, NOT the `_legacy` version (instructor, 2026-07-26):
                        going around the port is drift — fixing the atom in one place
                        won't propagate here.
                        `suffixIcon` takes a COMPONENT REF (§12b), the atom forces scale + weight
                        (§4/§5.0a). */}
                    <Button
                        variant="primary"
                        size="lg"
                        classNames={["shrink-0"]}
                        label="Unlock the full course"
                        suffixIcon={ArrowRightIcon}
                        iconSlide
                        onPress={onEnroll}
                        showAnatomy={showAnatomy}
                    />
                </>
            )}
        />
    )

    return (
        // ⭐ 2026-07-27 (instructor: "layout built with layout components"): this block
        // used to DRAW ITS OWN surface — `rounded-3xl bg-surface p-5 shadow-surface`
        // hand-typed — exactly what `SurfaceCard` exists to do. Precisely because
        // it drew its own frame, it also decided `p-5` on its own (OFF the §10c scale:
        // 0·1·2·3·6·8) and hand-drew a `border-t` between the two regions.
        // Going through the frame now, radius/shadow/padding come from ONE source:
        // `padding` defaults to `3` — the system's actual `p-3` card rule.
        <SurfaceCard
            // `anatPart` from the PARENT wins; running in ITS OWN story it names itself
            // so the Deps tree can see the surface FRAME (otherwise the root node is
            // missing and the tree reads as if the block still drew its own surface).
            anatPart={anatPart ?? (showAnatomy ? "SurfaceCard" : undefined)}
            classNames={classNames}
            body={() => (
                <StackV gap={6} anatPart={showAnatomy ? "StackV" : undefined} body={(
                    <>
                        {headerRow}
                        {footerRow}
                    </>
                )} />
            )}
        />
    )
}

/**
 * `TrialConversionStrip.*` — namespace (§12a).
 *
 * 2026-07-26 (instructor: "everything has a base and anatomy"): previously a BARE
 * export, so `CourseContents` had to write `<TrialConversionStrip>` next to
 * `<CourseTeamGate>`. The root stays CALLABLE so old call-sites don't break;
 * `.Base` is the standard path from now on.
 */
export { TrialConversionStripBase as TrialConversionStrip }
