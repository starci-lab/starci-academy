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
 * The words "Nội dung trước" / "Nội dung tiếp" belong to the block (§14d.1) — a
 * caller that passed them would own the wording, and two callers would drift.
 * Matches real `src`'s own `t("content.pager.prevLesson"/"nextLesson")` exactly
 * (verified 2026-07-28 against a prior pass that had invented "Bài trước/sau").
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    showAnatomy = false,
    anatPart,
}: ContentPagerProps) => {
    // Nothing to step to in either direction ⇒ draw nothing at all. Reached on the
    // first and last lesson of a course, which are ordinary, not exceptional.
    if (!isSkeleton && !previous && !next) {
        return null
    }

    const items: Array<SurfaceCardPressableGroupItem> = []
    if (previous) {
        items.push({
            key: "previous",
            href: previous.href,
            content: (
                <StackH gap="grouped" align="center" anatPart={showAnatomy ? "StackH" : undefined}>
                    <CaretLeftIcon aria-hidden focusable="false" weight="bold" className="size-4 shrink-0 text-muted" />
                    <StackV gap="flush" anatPart={showAnatomy ? "StackV" : undefined}>
                        <Typography size="xs" color="muted" text="Nội dung trước" anatPart={showAnatomy ? "Typography" : undefined} />
                        <Typography size="sm" weight="medium" lineClamp={2} underlineOnGroupHover text={previous.title} anatPart={showAnatomy ? "Typography" : undefined} />
                    </StackV>
                </StackH>
            ),
        })
    }
    if (next) {
        items.push({
            key: "next",
            href: next.href,
            // Pin right only where the grid REALLY has two columns. Scoped on the
            // container (`@sm`), not the viewport: an unqualified `col-start-2` would
            // also apply at the one-column step and force an implicit second column
            // that content-sizes down to a sliver, dragging this card up beside the
            // other one.
            className: "@sm:col-start-2",
            content: (
                <StackH gap="grouped" align="center" justify="end" anatPart={showAnatomy ? "StackH" : undefined}>
                    <StackV gap="flush" align="end" anatPart={showAnatomy ? "StackV" : undefined}>
                        <Typography size="xs" color="muted" align="end" text="Nội dung tiếp" anatPart={showAnatomy ? "Typography" : undefined} />
                        <Typography size="sm" weight="medium" align="end" lineClamp={2} underlineOnGroupHover text={next.title} anatPart={showAnatomy ? "Typography" : undefined} />
                    </StackV>
                    <CaretRightIcon aria-hidden focusable="false" weight="bold" className="size-4 shrink-0 text-muted" />
                </StackH>
            ),
        })
    }

    return (
        <div data-anat-part={anatPart}>
            {/* The group owns the card box and the grid but takes no `anatPart` of its
                own, so the block names it from the outside — otherwise the one node that
                decides this block's whole shape would be missing from the tree. */}
            <div data-anat-part={showAnatomy ? "SurfaceCardPressableGroup" : undefined}>
                <SurfaceCardPressableGroup
                    ariaLabel={ariaLabel}
                    columns={{ base: 1, sm: 2 }}
                    gap="grouped"
                    items={items}
                    isSkeleton={isSkeleton}
                />
            </div>
        </div>
    )
}

export { ContentPager }
