import type { ComponentType, SVGProps } from "react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import {
    SurfaceCardPressableGroup,
    type SurfaceCardPressableGroupItem,
} from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ProductQuickSelector` (dashboard) — the "where do you want to start?"
 * onward path for a brand-new account: three cards, each routing to a real,
 * buyable destination. Narrower than the landing page's own
 * `ProductQuickSelector` — every card here maps to something the account can
 * act on today, so there is no roadmap flag to model.
 */

/** An icon component (e.g. a phosphor `*Icon`), not JSX — the atom scales it itself. */
export type ProductQuickSelectorIcon = ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>

/** One onward-path card. */
export interface ProductQuickSelectorItem {
    /** Stable React key. */
    key: string
    /** Leading glyph. */
    icon: ProductQuickSelectorIcon
    /** The destination, phrased as an action (e.g. "Build an expert site"). */
    label: string
    /** Visible CTA line (e.g. "Create your site for free"). */
    ctaLabel: string
    /** Fired when the whole card is pressed — the caller routes to the real destination. */
    onPress: () => void
}

/** Props for {@link ProductQuickSelector}. */
export interface ProductQuickSelectorProps {
    /** The onward-path cards, in reading order. */
    items: Array<ProductQuickSelectorItem>
}

/** One card's body: the destination, then the CTA line — the whole card is the press target. */
const cardBody = (item: ProductQuickSelectorItem) => (
    <StackV
        gap={2}
        principle="title-subtitle"
        align="start"
        items={[
            () => <Typography size="sm" weight="semibold" text={item.label} />,
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
 * The onward-path grid. See the file header for how this differs from the
 * landing page's own `ProductQuickSelector`.
 *
 * @param props - {@link ProductQuickSelectorProps}
 */
const ProductQuickSelector = ({ items }: ProductQuickSelectorProps) => {
    const groupItems: Array<SurfaceCardPressableGroupItem> = items.map((item) => ({
        key: item.key,
        icon: item.icon,
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
