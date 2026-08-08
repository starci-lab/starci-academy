import React from "react"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import { LockedContentMask } from "@sb-components/composites/layout/LockedContentMask/LockedContentMask"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { ContentPaywall } from "@sb-components/starci/blocks/learn/ContentPaywall/ContentPaywall"
import type { PricingPhase } from "@sb-components/starci/blocks/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ContentArticle` — the lesson body on the page it is read from. Over the bare
 * `MarkdownContent` viewer, it knows the document is a lesson: it can be locked,
 * and it offers a first-time reader the hint that they can ask AI about a
 * passage, placed under the text. When locked, the body stays mounted and its
 * tail fades into the surface (selection disabled) with `ContentPaywall` flat
 * beneath it in the same card. Locking and `isSkeleton` are each their own leaf;
 * the open-lesson hint is a state.
 */

/** Everything the offer under a locked lesson needs, as typed data. */
export interface ContentArticleOffer {
    /** Headline, localized by the caller. */
    title: string
    /** One sentence on what buying unlocks. */
    description?: string
    /** Price after discount, in VND. */
    discountedPriceVnd: number
    /** Price before discount, for the struck-through original. */
    originalPriceVnd?: number | null
    /** Pricing phase — drives the scarcity line. Omitted → no scarcity. */
    currentPhase?: PricingPhase
    /** Seats left in the current phase. */
    seatsRemaining?: number | null
    /** What the next phase will cost. */
    nextPhasePriceVnd?: number | null
    /** Label of the single call to action. */
    ctaLabel: string
    /** Fired when the reader takes the offer. */
    onPurchase: () => void
}

/** Props for {@link ContentArticle}. */
export interface ContentArticleProps {
    /** The lesson, as authored markdown. The viewer decides the shape from it. */
    body: string
    /**
     * `true` → the reader has not bought the course: the tail fades, selection is
     * off, and the offer renders under the text inside the same card.
     */
    isLocked?: boolean
    /** The offer. Required in practice whenever `isLocked` is set. */
    offer?: ContentArticleOffer
    /**
     * One-time tip about selecting a passage to ask AI. Omitted → not shown.
     * Never shown on a locked lesson, where selecting is off anyway.
     */
    hintText?: string
    /** `true` → the card draws a body mirror instead of the document. */
    isSkeleton?: boolean
}

/**
 * The lesson body and, when it is locked, the offer under it. See the file
 * header for the full contract.
 *
 * @param props - {@link ContentArticleProps}
 */
const ContentArticle = ({
    body,
    isLocked = false,
    offer,
    hintText,
    isSkeleton = false,
}: ContentArticleProps) => {
    return (
        <SurfaceCard
            isSkeleton={isSkeleton}

            body={() => (
                <StackV
                    gap={6}
                    isSkeleton={isSkeleton}
                    items={[
                        ...(hintText != null && !isLocked ? [() => (
                            <Callout
                                title={hintText}

                            />
                        )] : []),
                        // Lock fade + select-none owned by LockedContentMask (same owner as ContentPage).
                        () => (
                            <LockedContentMask
                                isLocked={isLocked}
                                isSkeleton={isSkeleton}
                                body={() => (
                                    <MarkdownContent
                                        source={body}
                                        measure="reading"
                                        isSkeleton={isSkeleton}
                                    />
                                )}
                            />
                        ),
                        ...(isLocked && offer != null ? [() => (
                            <ContentPaywall
                                title={offer.title}
                                description={offer.description}
                                discountedPriceVnd={offer.discountedPriceVnd}
                                originalPriceVnd={offer.originalPriceVnd}
                                currentPhase={offer.currentPhase}
                                seatsRemaining={offer.seatsRemaining}
                                nextPhasePriceVnd={offer.nextPhasePriceVnd}
                                ctaLabel={offer.ctaLabel}
                                onPurchase={offer.onPurchase}


                            />
                        )] : []),
                    ]}
                />
            )}
        />
    )
}

export { ContentArticle }
