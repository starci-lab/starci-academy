import React from "react"
import { cn } from "@heroui/react"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { FeedbackCallout } from "@sb-components/composites/feedback/Feedback/Feedback"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { ContentPaywall } from "@sb-components/blocks/learn/ContentPaywall/ContentPaywall"
import type { PricingPhase } from "@sb-components/blocks/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ContentArticle`: the lesson itself, on the page it is read from.
 *
 * WHY A BLOCK OVER THE VIEWER: `MarkdownContent` repeats a document; this block
 * knows the document is a LESSON — that it can be locked, that a first-time
 * reader should be told they can ask AI about a passage, and that the offer
 * belongs under the text rather than in place of it.
 *
 * ⭐ LOCKED FADES, IT DOES NOT CUT. The body still renders and its tail fades
 * into the surface, with the offer under it. Truncating instead would tell the
 * reader nothing about what they are buying; the fade shows the lesson continues
 * and stops the reader at the same time.
 *
 * ⭐ THE PAYWALL IS INSIDE THE SAME CARD. It is flat, under the faded tail — one
 * surface that runs out, not a second card interrupting the first. That is why
 * `ContentPaywall` draws no frame of its own.
 *
 * TEXT IS UNSELECTABLE WHILE LOCKED. Not decoration: the fade only hides the
 * tail visually, and a reader could otherwise select straight through it.
 *
 * THE HINT SHOWS ONCE AND ONLY WHEN OPEN. It teaches a feature that needs a
 * selection to be discovered at all, so it leads the body — and it never shows
 * on a locked lesson, where selecting is off anyway.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    showAnatomy = false,
    anatPart,
}: ContentArticleProps) => (
    <div data-anat-part={anatPart}>
        <SurfaceCard isSkeleton={isSkeleton} anatPart={showAnatomy ? "SurfaceCard" : undefined}>
            <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
                {hintText != null && !isLocked ? (
                    <FeedbackCallout
                        title={hintText}
                        anatPart={showAnatomy ? "FeedbackCallout" : undefined}
                    />
                ) : null}
                <div className="relative">
                    <div className={cn(isLocked && "select-none")}>
                        <MarkdownContent
                            source={body}
                            measure="reading"
                            anatPart={showAnatomy ? "MarkdownContent" : undefined}
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
                        anatPart={showAnatomy ? "ContentPaywall" : undefined}
                        showAnatomy={showAnatomy}
                    />
                ) : null}
            </StackV>
        </SurfaceCard>
    </div>
)

export { ContentArticle }
