import React from "react"
import type { ReactNode } from "react"
import { Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { ArrowRightIcon, LockIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/buttons/Button"
import { IconTile } from "@/components/atoms/display/IconTile"
import { Typography } from "@/components/atoms/text/Typography"
import { AsyncContent } from "@/components/composites/async/AsyncContent"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { StackH, StackV } from "@/components/frames/Stack"
import { PhaseScarcityNote, type PricingPhase } from "@/components/starci/blocks/commerce/PhaseScarcityNote"
import { PriceTagProminent, type PriceBreakdown } from "@/components/starci/blocks/commerce/PriceTag"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/**
 * `EnrollGate` — the conversion card shown in place of an enrollment-required
 * learn surface (currently personal-project) for a trial viewer. Kept separate
 * from `ContentPaywall` despite composing the same two commerce blocks. Four
 * leaves: `Standalone` (no `preview`, centered), `WithPreview` (floats over a
 * faded teaser), `NoScarcity` (no `price.currentPhase`, drops
 * `PhaseScarcityNote`), and `Loading` (`isSkeleton`, price region shimmers).
 */

/**
 * Named price shape for {@link EnrollGateProps.price} — see the file header's
 * "THE `price` PROP IS A NEW NAME" note for why this isn't just `PriceBreakdown`.
 */
export interface EnrollGatePrice {
    /** Price the learner actually pays, in VND. */
    discountedVnd: number
    /** Pre-discount VND price; `PriceTagProminent` strikes it through when greater. */
    originalVnd?: number | null
    /** Phase-tier + loyalty steps for `PriceTagProminent`'s breakdown popover. */
    breakdown?: PriceBreakdown
    /** Current pricing phase — drives the scarcity line. Omit → no scarcity line. */
    currentPhase?: PricingPhase
    /** Seats left in the current phase. `null`/omitted → unlimited, scarcity line stays silent. */
    seatsRemaining?: number | null
    /** What the next phase will cost — the honest "waiting is not free" fact. */
    nextPhasePriceVnd?: number | null
}

/** Props for {@link EnrollGate}. */
export interface EnrollGateProps {
    /** Headline, localized by the caller — e.g. "Unlock Personal Project". */
    title: string
    /** One-line reason the surface needs enrollment. */
    description: string
    /**
     * Optional MOCK teaser of the gated surface (e.g. `PersonalProjectGatePreview`)
     * — non-interactive, rendered `aria-hidden` behind a bottom fade with the
     * enroll card floating over it. Omit → just the centered enroll card.
     */
    preview?: ReactNode
    /**
     * Resolved price + scarcity data. `undefined` → the price region shows the
     * `AsyncContent` shimmer (not yet resolved); the lock/headline/description/CTA
     * stay real regardless.
     */
    price?: EnrollGatePrice
    /** Fired when the learner takes the enroll CTA. */
    onEnroll: () => void
    /**
     * `true` → force the price region into its shimmer state even if `price` is
     * already known (used by this block's own "Loading" story state). The lock,
     * headline, description and CTA never shimmer — see the file header.
     */
    isSkeleton?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * The conversion card in front of a gated learn surface. See the file header
 * for the full contract.
 *
 * @param props - {@link EnrollGateProps}
 */
const EnrollGateBase = ({
    title,
    description,
    preview,
    price,
    onEnroll,
    isSkeleton = false,
    classNames,
}: EnrollGateProps) => {
    // no price to show yet (unresolved) OR the caller forces the loading state —
    // either way the price region falls to the AsyncContent shimmer branch.
    const priceLoading = isSkeleton || price == null

    // The price group only exists once `price` has resolved — kept as its own
    // named const because it depends on `price` and is only used inside the
    // `AsyncContent` content branch below.
    const priceGroup = price != null ? (
        <>
            <PriceTagProminent
                discounted={price.discountedVnd}
                original={price.originalVnd}
                breakdown={price.breakdown}
                classNames={["self-center"]}
            />
            {price.currentPhase != null ? (
                <PhaseScarcityNote
                    currentPhase={price.currentPhase}
                    seatsRemaining={price.seatsRemaining ?? null}
                    nextPhasePriceVnd={price.nextPhasePriceVnd ?? null}
                    classNames={["self-center"]}
                />
            ) : null}
        </>
    ) : null

    // lock identity + outcome copy + price + scarcity + one CTA — everything
    // the conversion card's own `StackV` arranges.
    const offerBody = (
        <>
            <IconTile
                icon={LockIcon}
                tone="accent"
                size="sm"

            />
            {/* the real src (`EnrollGate/index.tsx:67`): `type="h4" weight="bold"` — a real
                HEADING (20px), not body `lg` (18px). */}
            <Typography
                size="h4"
                weight="bold"
                align="center"
                text={title}

            />
            <Typography
                size="sm"
                color="muted"
                align="center"
                text={description}

            />
            <AsyncContent
                isLoading={priceLoading}
                skeleton={() => <HeroSkeleton className="h-7 w-32 rounded-xl" />}
                content={() => <StackV gap={4} align="center" isSkeleton={isSkeleton} items={[() => priceGroup]} />}
            />
            <Button
                label="Enroll now"
                variant="primary"
                size="lg"
                suffixIcon={ArrowRightIcon}
                iconSlide
                onPress={onEnroll}
                classNames={["w-full"]}

            />
        </>
    )

    // the conversion card itself: lock identity + outcome copy + price + scarcity
    // + one CTA. A real SurfaceCard so it "floats up" whether it sits alone on
    // the canvas or over the faded teaser.
    const card = (
        // `SurfaceCard.className` door was deleted (COMPOSITE-4) and `max-w-[480px]` is an
        // arbitrary value outside the closed `AllowedClassName` union anyway — the
        // mx-auto/max-w placement now lives on a plain wrapping `div` instead.
        <div className="mx-auto w-full max-w-[480px]">
            <SurfaceCard
                padding={6}

                body={() => <StackV gap={4} align="center" isSkeleton={isSkeleton} items={[() => offerBody]} />}
            />
        </div>
    )

    // no teaser → just the centered enroll card. `StackH` with a single child and
    // `gap={1}` (no seam to enforce with one item) is how the §10 scale still
    // governs the wrapper's padding instead of a hand-typed `p-*` value.
    if (preview == null) {
        return (
            <StackH gap={1} justify="center" padding={6} isSkeleton={isSkeleton} classNames={classNames} items={[() => card]} />
        )
    }

    // teaser → the FULL preview (no height cap — mirrors `ContentArticle`, which
    // renders the whole real body and only fades its tail, never truncates
    // early), with the enroll card floating over the faded tail.
    return (
        <div className={cn("relative", classNames)}>
            <div aria-hidden className="pointer-events-none relative">
                {preview}
                {/* Same fade band as `ContentArticle`'s locked-body tail — fades into
                    the preview's OWN card token (`bg-surface`), not the page canvas,
                    since the teaser content is itself `bg-surface` cards. */}
                <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent via-surface/70 to-surface" />
            </div>
            {/* `padding={6}` (the frame's own §10c scale) replaces the hand-typed
                `px-4 pb-6` the real component used — the ONE deviation from a byte-for-byte
                port, since the scale is symmetric and has no asymmetric step. `-mt-32` stays
                hand-written: it is the float-over-the-fade OVERLAP effect itself, not a seam
                between siblings, the same idiom as `SurfaceCard.Pressable`'s highlight layer. */}
            <div className="relative z-10 -mt-32">
                <StackH gap={1} justify="center" padding={6} isSkeleton={isSkeleton} items={[() => card]} />
            </div>
        </div>
    )
}

/** `EnrollGate.*` — single-component namespace ⇒ only `.Base`. */
export { EnrollGateBase as EnrollGate }
