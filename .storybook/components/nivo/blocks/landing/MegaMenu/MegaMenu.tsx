import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Popover } from "@sb-components/atoms/overlay/Popover/Popover"
import {
    SurfaceCardPressableGroup,
    type SurfaceCardPressableGroupItem,
} from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `MegaMenu` — the navbar's intent-based product dropdown: real, buyable
 * products beside honestly roadmap-flagged layers. `items` is the leaf —
 * `defaultOpen` pins the panel open so the (portal-rendered) rows are visible
 * for review, the same convention `Popover`'s own story uses.
 */

/** One row of the mega menu. */
export interface MegaMenuItem {
    /** Stable React key. */
    key: string
    /** The entry's name (e.g. "AI Academy"). */
    title: string
    /** One-line description of what this entry is, already resolved. */
    description: string
    /** `true` → this entry names a roadmap layer, not a buyable product — rendered in the warning tone. */
    isRoadmap?: boolean
    /** Fired when this row is pressed — the caller routes to the real product or the audit. */
    onPress: () => void
}

/** Props for {@link MegaMenu}. */
export interface MegaMenuProps {
    /** The closed trigger's visible label (e.g. "Products"). */
    triggerLabel: string
    /** Accessible name for the row group inside the panel. */
    ariaLabel: string
    /** The menu's rows, in display order. */
    items: Array<MegaMenuItem>
    /** Controlled/uncontrolled initial-open state — lets a caller (or a story) pin the panel open. Defaults closed. */
    defaultOpen?: boolean
}

/** One row's body: the entry name over a description, toned by `isRoadmap`. */
const itemBody = (item: MegaMenuItem) => (
    <StackV
        gap={1}
        align="start"
        items={[
            () => <Typography size="sm" weight="semibold" text={item.title} />,
            () => <Typography size="xs" color={item.isRoadmap ? "warning" : "muted"} text={item.description} />,
        ]}
    />
)

/**
 * The intent-based product dropdown. See the file header for why this is a
 * thin frame over `Popover` + `SurfaceCardPressableGroup` rather than a
 * bespoke click-panel.
 *
 * @param props - {@link MegaMenuProps}
 */
const MegaMenu = ({ triggerLabel, ariaLabel, items, defaultOpen = false }: MegaMenuProps) => {
    const groupItems: Array<SurfaceCardPressableGroupItem> = items.map((item) => ({
        key: item.key,
        onPress: item.onPress,
        content: () => itemBody(item),
    }))

    return (
        <div data-tier="block" data-component="MegaMenu">
            <Popover
                triggerLabel={triggerLabel}
                triggerVariant="ghost"
                placement="bottom start"
                defaultOpen={defaultOpen}
                content={<SurfaceCardPressableGroup ariaLabel={ariaLabel} gap={2} items={groupItems} />}
            />
        </div>
    )
}

export { MegaMenu }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "MegaMenu" } as const
