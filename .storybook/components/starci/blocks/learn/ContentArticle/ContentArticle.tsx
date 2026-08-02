import React from "react"
import { cn } from "@heroui/react"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { ContentPaywall } from "@sb-components/starci/blocks/learn/ContentPaywall/ContentPaywall"
import type { PricingPhase } from "@sb-components/starci/blocks/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ContentArticle` — a BLOCK: the lesson itself, on the page it is read from.
 * Over the `MarkdownContent` viewer it knows the document is a LESSON — that it can
 * be locked, and that a first-time reader should be told they can ask AI about a
 * passage.
 *
 * When locked the body still renders and its tail fades into the surface (rather
 * than truncating), with the paywall flat underneath it — one surface that runs out,
 * which is why `ContentPaywall` draws no frame of its own. Text is unselectable
 * while locked, so a reader cannot select through the fade.
 *
 * The ask-AI hint shows once, only when the lesson is open (unlocked), leading the
 * body — it teaches a feature that needs a selection to be discovered at all.
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
    const lessonBody = (
        <>
            {hintText != null && !isLocked ? (
                <Callout
                    title={hintText}

                />
            ) : null}
            <div className="relative">
                <div className={cn(isLocked && "select-none")}>
                    <MarkdownContent
                        source={body}
                        measure="reading"

                    />
                </div>
                {isLocked ? (
                    // Pure opacity fade over the tail. The body stays mounted so the
                    // reader can see the lesson CONTINUES — truncating would tell them
                    // nothing about what they are being asked to buy.
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent via-surface/70 to-surface" />
                ) : null}
            </div>
            {isLocked && offer != null ? (
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
            ) : null}
        </>
    )

    return (
        <div>
            <SurfaceCard
                isSkeleton={isSkeleton}

                body={() => <StackV gap={6} items={[() => lessonBody]} />}
            />
        </div>
    )
}

export { ContentArticle }
