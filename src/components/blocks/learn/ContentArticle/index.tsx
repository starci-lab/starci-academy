import React from "react"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { Callout } from "@/components/composites/feedback/Callout"
import { LockedContentMask } from "@/components/composites/layout/LockedContentMask"
import { MarkdownContent } from "@/components/composites/viewers/MarkdownContent"
import { ContentPaywall } from "@/components/blocks/learn/ContentPaywall"
import type { PricingPhase } from "@/modules/types/enums/pricing-phase"
import { StackV } from "@/components/frames/Stack"

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
            identity={{ tier: "block", component: "ContentArticle" }}
            isSkeleton={isSkeleton}

            body={() => (
                <StackV
                    gap={6}
                    principle="block-boundary"
                    explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
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
