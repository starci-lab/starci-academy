import React from "react"
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCardPressableGroup, type SurfaceCardPressableGroupItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ContentPager`: the STEP-TO-THE-NEXT-LESSON block at the foot of the
 * reading screen. Two pressable cards, "previous lesson" on the left and "next
 * lesson" on the right.
 *
 * WHY A BLOCK AND NOT A FRAME: it knows what a LESSON is. The neighbour cards
 * carry a lesson title and a lesson link, and the block words the labels itself.
 * A frame would only know it has two cells.
 *
 * SELF-HIDES. With neither neighbour there is nothing to step to, so the block
 * renders NOTHING rather than an empty rail — the first and last lesson of a
 * course are the ordinary cases, not an error to report.
 *
 * ASYMMETRY IS THE POINT. "Previous" reads left-to-right behind a back caret;
 * "next" is mirrored, right-aligned behind a forward caret, so the pair reads as
 * a direction rather than as two identical cards. The right card pins itself to
 * the second column ONLY where the grid actually has two — a CONTAINER query, not
 * a viewport one, because the split is decided by the slot this block sits in.
 *
 * CONTRACT: the caller hands over the two neighbours as DATA (`title` + `href`).
 * The words "Previous content" / "Next content" belong to the block (§14d.1) — a
 * caller that passed them would own the wording, and two callers would drift.
 * Matches real `src`'s own `t("content.pager.prevLesson"/"nextLesson")` exactly
 * (verified 2026-07-28 against a prior pass that had invented "Previous/Next lesson").
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One neighbouring lesson — plain data, the block builds the card from it. */
export interface ContentPagerNeighbour {
    /** Lesson title, shown under the direction label and clamped to two lines. */
    title: string
    /** Where the card navigates. */
    href: string
}

/** Props for {@link ContentPager}. */
export interface ContentPagerProps {
    /** The lesson before this one. Omitted → the left card is not drawn. */
    previous?: ContentPagerNeighbour
    /** The lesson after this one. Omitted → the right card is not drawn. */
    next?: ContentPagerNeighbour
    /**
     * Accessible name for the pair, localized by the caller (blocks carry no
     * i18n). Without it a screen reader hears two loose links with nothing tying
     * them together.
     */
    ariaLabel: string
    /**
     * `true` → the group draws its own mirror. The flag FLOWS DOWN into
     * `SurfaceCardPressableGroup`, which owns the card box and the grid, so the
     * shimmer keeps the exact shape the real cards will take (§12c).
     */
    isSkeleton?: boolean
}

/**
 * Previous/next lesson pager. See the file header for the full contract.
 *
 * @param props - {@link ContentPagerProps}
 */
const ContentPager = ({
    previous,
    next,
    ariaLabel,
    isSkeleton = false,
}: ContentPagerProps) => {
    // Nothing to step to in either direction ⇒ draw nothing at all. Reached on the
    // first and last lesson of a course, which are ordinary, not exceptional.
    if (!isSkeleton && !previous && !next) {
        return null
    }

    const items: Array<SurfaceCardPressableGroupItem> = []
    if (previous) {
        const previousLabel = (
            <>
                <Typography size="xs" color="muted" text="Previous content" />
                <Typography size="sm" weight="medium" lineClamp={2} underlineOnGroupHover text={previous.title} />
            </>
        )
        const previousCard = (
            <StackH
                gap={4}
                align="center"

                body={
                    <>
                        {/* DIV position (icon §1c/§4.2): this card is a control with its own FIXED
                            padding (`SurfaceCardPressableGroup` tile, `cozy` inset) — not hug-content
                            — so size tracks line-height, not font-size. Title is `text-sm` ⇒ `size-5`,
                            matching the sibling `ITEM_ICON_CLS` convention this same file's parent
                            (`SurfaceCard.tsx`) already forces for icons in this exact tile shape
                            (was flat `size-4`, teacher confirmed 2026-07-29). Weight omitted → Phosphor
                            default `regular`, correct at `size-5` (§3.2, was `bold`). */}
                        <CaretLeftIcon aria-hidden focusable="false" className="size-5 shrink-0 text-muted" />
                        <StackV gap={1} body={previousLabel} />
                    </>
                }
            />
        )
        items.push({
            key: "previous",
            href: previous.href,
            content: previousCard,
        })
    }
    if (next) {
        const nextLabel = (
            <>
                <Typography size="xs" color="muted" align="end" text="Next content" />
                <Typography size="sm" weight="medium" align="end" lineClamp={2} underlineOnGroupHover text={next.title} />
            </>
        )
        const nextCard = (
            <StackH
                gap={4}
                align="center"
                justify="end"

                body={
                    <>
                        <StackV gap={1} align="end" body={nextLabel} />
                        {/* Same DIV position/size reasoning as the mirrored left caret above. */}
                        <CaretRightIcon aria-hidden focusable="false" className="size-5 shrink-0 text-muted" />
                    </>
                }
            />
        )
        items.push({
            key: "next",
            href: next.href,
            // `SurfaceCardPressableGroupItem.className` was removed entirely
            // (COMPOSITE-4) and the closed `AllowedClassName` union has no
            // container-conditional column-start member to reproduce "pin the lone
            // pager card to the right column" with. Until that union grows one (or
            // `Grid` grows a start-position prop), `col-span-2` (full-width lone
            // card) is the nearest supported fallback — same as the `PagerFullWidth`
            // leaf in `SurfaceCardPressableGroup.stories.tsx`.
            classNames: ["col-span-2"],
            content: nextCard,
        })
    }

    return (
        <div>
            {/* The group owns the card box and the grid but takes no `anatPart` of its
                own, so the block names it from the outside — otherwise the one node that
                decides this block's whole shape would be missing from the tree. */}
            <div>
                <SurfaceCardPressableGroup
                    ariaLabel={ariaLabel}
                    columns={{ base: 1, sm: 2 }}
                    gap={4}
                    items={items}
                    isSkeleton={isSkeleton}
                />
            </div>
        </div>
    )
}

export { ContentPager }
