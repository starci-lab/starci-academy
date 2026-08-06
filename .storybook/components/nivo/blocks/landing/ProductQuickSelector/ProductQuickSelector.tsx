import { ArrowRightIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import {
    SurfaceCardPressableGroup,
    type SurfaceCardPressableGroupItem,
} from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ProductQuickSelector` — the "where do you want to start?" intent grid.
 * Each card routes to a real product or, honestly, to the Lead-Leakage Audit
 * when the need names a roadmap layer. Feeding a shorter list proves the grid
 * reflows on real data, not a fixed six-card layout.
 */

/** One need card. */
export interface ProductQuickSelectorItem {
    /** Stable React key. */
    key: string
    /** The need, phrased from the visitor's side (e.g. "I need to build a website or academy"). */
    need: string
    /** Where this need maps to, already resolved (e.g. "→ AI Academy" or "→ CRM · Workflow (roadmap)"). */
    mapsToLabel: string
    /** `true` → `mapsToLabel` renders in the warning tone — this need maps to a roadmap layer, not a buyable product. */
    isRoadmap?: boolean
    /** Visible CTA line (e.g. "See Academy plans"). */
    ctaLabel: string
    /** Fired when the whole card is pressed — the caller routes to the real product or the audit. */
    onPress: () => void
}

/** Props for {@link ProductQuickSelector}. */
export interface ProductQuickSelectorProps {
    /** The need cards, in reading order. */
    items: Array<ProductQuickSelectorItem>
}

/** One card's body: the need, where it maps to, and the CTA line — the whole card is the press target. */
const cardBody = (item: ProductQuickSelectorItem) => (
    <StackV
        gap={2}
        align="start"
        items={[
            () => <Typography size="sm" weight="semibold" text={item.need} />,
            () => (
                <Typography
                    size="xs"
                    color={item.isRoadmap ? "warning" : "muted"}
                    text={item.mapsToLabel}
                />
            ),
            () => (
                <Typography
                    size="xs"
                    weight="semibold"
                    color="accent"
                    suffixIcon={ArrowRightIcon}
                    iconSlide
                    text={item.ctaLabel}
                />
            ),
        ]}
    />
)

/**
 * The intent grid. See the file header for why a roadmap need routes to the
 * audit rather than a product that doesn't exist yet.
 *
 * @param props - {@link ProductQuickSelectorProps}
 */
const ProductQuickSelector = ({ items }: ProductQuickSelectorProps) => {
    const groupItems: Array<SurfaceCardPressableGroupItem> = items.map((item) => ({
        key: item.key,
        onPress: item.onPress,
        content: () => cardBody(item),
    }))

    return (
        <div data-tier="block" data-component="ProductQuickSelector">
            <SurfaceCardPressableGroup ariaLabel="Choose where to start" columns={{ base: 1, md: 3 }} items={groupItems} principle="content-row" />
        </div>
    )
}

export { ProductQuickSelector }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "ProductQuickSelector" } as const
