import React from "react"
import { type SkeletonProps } from "@/components/frames/_slot"
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"
import { GlyphMark } from "@/components/atoms/display/GlyphMark"
import { Typography } from "@/components/atoms/text/Typography"
import { SurfaceCardPressableGroup, type SurfaceCardPressableGroupItem } from "@/components/composites/cards/SurfaceCard"
import { StackH, StackV } from "@/components/frames/Stack"

/**
 * `ContentPager` — step to the neighbouring lesson at the foot of the reading
 * screen. It owns the "previous lesson" / "next lesson" labels and the lesson
 * title + link on each card. The right card mirrors the left so the pair reads
 * as a direction, pinning to a second column only where the grid has two (a
 * container query). Losing either card, and `isSkeleton`, are each their own
 * leaf; having no neighbour renders nothing.
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
        const previousCard = (
            <StackH
                gap={4}
                principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                align="center"
                isSkeleton={isSkeleton}
                items={[
                    // DIV position: this card is a control with its own FIXED padding
                    // (`SurfaceCardPressableGroup` tile, `cozy` inset) — not hug-content —
                    // so size tracks line-height, not font-size. Title is `text-sm` ⇒ `size-5`,
                    // matching GlyphMark's intrinsic box (and the sibling `ITEM_ICON_CLS`
                    // convention this same file's parent already forces for icons in this tile).
                    () => <GlyphMark icon={CaretLeftIcon} tone="muted" />,
                    ({ isSkeleton }: SkeletonProps) => (
                        <StackV
                            gap={1}
                            principle="name-handle"
                            explain="Display name with handle — not title-subtitle, because the second line is an identity handle rather than a subtitle."
                            isSkeleton={isSkeleton}
                            items={[
                                () => <Typography size="xs" color="muted" text="Previous content" />,
                                () => (
                                    <Typography
                                        size="sm"
                                        weight="medium"
                                        lineClamp={2}
                                        underlineOnGroupHover
                                        text={previous.title}
                                    />
                                ),
                            ]}
                        />
                    ),
                ]}
            />
        )
        items.push({
            key: "previous",
            href: previous.href,
            content: () => previousCard,
        })
    }
    if (next) {
        const nextCard = (
            <StackH
                gap={4}
                principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                align="center"
                justify="end"
                isSkeleton={isSkeleton}
                items={[
                    ({ isSkeleton }: SkeletonProps) => (
                        <StackV
                            gap={1}
                            principle="name-handle"
                            explain="Display name with handle — not title-subtitle, because the second line is an identity handle rather than a subtitle."
                            align="end"
                            isSkeleton={isSkeleton}
                            items={[
                                () => (
                                    <Typography size="xs" color="muted" align="end" text="Next content" />
                                ),
                                () => (
                                    <Typography
                                        size="sm"
                                        weight="medium"
                                        align="end"
                                        lineClamp={2}
                                        underlineOnGroupHover
                                        text={next.title}
                                    />
                                ),
                            ]}
                        />
                    ),
                    // Same DIV position/size reasoning as the mirrored left caret above.
                    () => <GlyphMark icon={CaretRightIcon} tone="muted" />,
                ]}
            />
        )
        items.push({
            key: "next",
            href: next.href,
            // Full-width lone pager card: Grid's only placement lever is `span`
            // (`GridItem.span`, capped at 2). Column-start escapes are intentionally
            // unavailable — same contract as `PagerFullWidth` in SurfaceCardPressableGroup stories.
            span: 2,
            content: () => nextCard,
        })
    }

    return (
        <SurfaceCardPressableGroup
            identity={{ tier: "block", component: "ContentPager" }}
            ariaLabel={ariaLabel}
            columns={{ base: 1, sm: 2 }}
            items={items}
            isSkeleton={isSkeleton}
            principle="content-row"
            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
        />
    )
}

export { ContentPager }
