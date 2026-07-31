import React from "react"
import type { ReactNode } from "react"
import { Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { ArrowRightIcon, LockIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { IconTile } from "@sb-components/atoms/display/IconTile/IconTile"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { AsyncContent } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { PhaseScarcityNote, type PricingPhase } from "@sb-components/starci/blocks/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { PriceTagProminent, type PriceBreakdown } from "@sb-components/starci/blocks/commerce/PriceTag/PriceTag"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `EnrollGate`: shown IN PLACE OF an enrollment-required learn surface
 * (currently only personal-project — see the real
 * `src/app/[locale]/courses/[courseId]/learn/layout.tsx` → `LearnShell`, which
 * mounts this alongside `GithubLinkGate` and `PersonalProjectGatePreview`) when
 * the viewer is on a trial (not enrolled). Ported faithfully from
 * `src/components/features/learn/shared/EnrollGate/index.tsx`.
 *
 * ⭐ SAME CONVERSION VOCABULARY AS `ContentPaywall`, deliberately kept separate.
 * Both draw a lock identity + price + scarcity + one CTA, and both compose the
 * SAME two commerce blocks (`PriceTagProminent`, `PhaseScarcityNote`) so the two
 * places selling a course never drift apart. They stay two files because the
 * FRAME differs (`ContentPaywall` is flat, glued under a locked article's faded
 * tail, no card of its own; `EnrollGate` is a real surface card that either
 * stands alone or floats OVER a faded teaser) and because their neighbour in
 * the real tree differs (`ContentPaywall` sits beside `QuizEnrollGate`, which
 * asks for enrolment with no price at all — see that file's own header).
 *
 * ⭐ THE `price` PROP IS A NEW NAME, NOT A REUSE OF `PriceBreakdown` (judgement
 * call). `PriceBreakdown` (from `PriceTag`) only carries the breakdown-popover
 * STEPS (phase/loyalty) — it has no `discounted`/`original` amount, so it can't
 * describe "the price of this gate" on its own. `EnrollGatePrice` below bundles
 * exactly the flat fields `ContentPaywall` already takes as separate props
 * (`discountedPriceVnd`/`originalPriceVnd`/`currentPhase`/`seatsRemaining`/
 * `nextPhasePriceVnd`) PLUS the breakdown, into the one named shape the caller
 * passes as `price` — satisfying §5 ("every data shape has a name") while
 * matching the single-prop surface this run's spec asked for.
 *
 * ⭐ WHY `AsyncContent` (a real LEAF here, not decoration): `price` is OPTIONAL —
 * `undefined` means "not resolved yet" (the real component's SWR price-preview
 * query hasn't returned). `PriceTagProminent.discounted` is a REQUIRED number,
 * so there is no value to hand it while `price` is unresolved; only
 * `AsyncContent`'s generic shimmer slot can stand in for that gap. `isSkeleton`
 * (the caller-level force-loading flag, e.g. this block's own Storybook
 * "Loading" state) folds into the SAME condition — both mean "no price to
 * render yet". The lock identity, headline, description and CTA are already
 * known before any price request, so — same call as `ContentPaywall` — they
 * stay REAL under `isSkeleton` and only the price region shimmers.
 *
 * ⭐ `preview?: ReactNode` IS A DELIBERATE, NAMED SLOT (not a content string) —
 * mirrors the real prop 1:1. It takes a whole non-interactive teaser BLOCK
 * (e.g. `PersonalProjectGatePreview`), rendered `aria-hidden` behind a bottom
 * fade with the enroll card floating over the faded tail (Medium-style) — same
 * fade band (`h-72`, `via-surface/70 to-surface`) as `ContentArticle`'s locked
 * body, and the SAME judgement call: fade, never truncate, so the reader sees
 * the surface continues. Omit `preview` → the card renders centered alone.
 *
 * The `-mt-32` overlap and the `relative`/`absolute` fade layer are
 * hand-written (not a `StackV`/`Cluster` gap) on purpose: this is a one-off
 * VISUAL COMPOSITING effect (two layers overlapping), not a seam between
 * siblings — the same idiom as `SurfaceCard.Pressable`'s highlight sweep
 * layer and `ContentArticle`'s own locked-tail fade. The surrounding inset
 * (`px-4 pb-6` in the real component) goes through `StackH`'s own `padding`
 * prop instead (§10c scale, `"roomy"` = `p-6`) — the one deviation from a
 * byte-for-byte port, since the scale has no asymmetric step.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** Headline, localized by the caller — e.g. "Mở khoá Dự án cá nhân". */
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
    /** Extra classes on the root. */
    className?: string
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
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
    className,
    anatPart,
    showAnatomy = false,
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
                className="justify-center"
                anatPart={showAnatomy ? "PriceTagProminent" : undefined}
            />
            {price.currentPhase != null ? (
                <PhaseScarcityNote
                    currentPhase={price.currentPhase}
                    seatsRemaining={price.seatsRemaining ?? null}
                    nextPhasePriceVnd={price.nextPhasePriceVnd ?? null}
                    className="justify-center"
                    anatPart={showAnatomy ? "PhaseScarcityNote" : undefined}
                    showAnatomy={showAnatomy}
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
                showAnatomy={showAnatomy}
                anatPart={showAnatomy ? "IconTile" : undefined}
            />
            {/* src thật (`EnrollGate/index.tsx:67`): `type="h4" weight="bold"` — HEADING
                thật (20px), không phải body `lg` (18px). */}
            <Typography
                size="h4"
                weight="bold"
                align="center"
                text={title}
                anatPart={showAnatomy ? "Typography" : undefined}
            />
            <Typography
                size="sm"
                color="muted"
                align="center"
                className="max-w-[400px]"
                text={description}
                anatPart={showAnatomy ? "Typography" : undefined}
            />
            <AsyncContent
                isLoading={priceLoading}
                // Plain HeroUI skeleton, NOT badged: it's a raw library primitive with
                // no owning story to jump to (same call as `PhaseScarcityNote`'s
                // decorative glyph — "can't badge it, so don't badge it"). `AsyncContent`
                // itself also can't be badged as a tree NODE (its `.Base` member takes no
                // `anatPart` — only `.Empty`/`.Error` do); it self-labels its active
                // branch via its own dev overlay when `showAnatomy` is on.
                skeleton={<HeroSkeleton className="h-7 w-32 rounded-xl" />}
                showAnatomy={showAnatomy}
            >
                <StackV gap="grouped" align="center" anatPart={showAnatomy ? "StackV" : undefined} body={priceGroup} />
            </AsyncContent>
            <Button
                label="Ghi danh ngay"
                variant="primary"
                size="lg"
                suffixIcon={ArrowRightIcon}
                iconSlide
                onPress={onEnroll}
                className="max-w-[300px]"
                classNames={["w-full"]}
                anatPart={showAnatomy ? "Button" : undefined}
            />
        </>
    )

    // the conversion card itself: lock identity + outcome copy + price + scarcity
    // + one CTA. A real SurfaceCard so it "floats up" whether it sits alone on
    // the canvas or over the faded teaser.
    const card = (
        <SurfaceCard
            padding="airy"
            className="mx-auto w-full max-w-[480px]"
            anatPart={showAnatomy ? "SurfaceCard" : undefined}
        >
            <StackV gap="grouped" align="center" anatPart={showAnatomy ? "StackV" : undefined} body={offerBody} />
        </SurfaceCard>
    )

    // no teaser → just the centered enroll card. `StackH` with a single child and
    // `gap="flush"` (no seam to enforce with one item) is how the §10 scale still
    // governs the wrapper's padding instead of a hand-typed `p-*` value.
    if (preview == null) {
        return (
            <StackH gap="flush" justify="center" padding="airy" className={className} anatPart={anatPart} body={card} />
        )
    }

    // teaser → the FULL preview (no height cap — mirrors `ContentArticle`, which
    // renders the whole real body and only fades its tail, never truncates
    // early), with the enroll card floating over the faded tail.
    return (
        <div data-anat-part={anatPart} className={cn("relative", className)}>
            <div aria-hidden className="pointer-events-none relative">
                {preview}
                {/* Same fade band as `ContentArticle`'s locked-body tail — fades into
                    the preview's OWN card token (`bg-surface`), not the page canvas,
                    since the teaser content is itself `bg-surface` cards. */}
                <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent via-surface/70 to-surface" />
            </div>
            {/* `padding="roomy"` (the frame's own §10c scale) replaces the hand-typed
                `px-4 pb-6` the real component used — the ONE deviation from a byte-for-byte
                port, since the scale is symmetric and has no asymmetric step. `-mt-32` stays
                hand-written: it is the float-over-the-fade OVERLAP effect itself, not a seam
                between siblings, the same idiom as `SurfaceCard.Pressable`'s highlight layer. */}
            <StackH gap="flush" justify="center" padding="roomy" className="relative z-10 -mt-32" body={card} />
        </div>
    )
}

/** `EnrollGate.*` — single-component namespace ⇒ only `.Base`. */
export { EnrollGateBase as EnrollGate }
