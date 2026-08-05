import { TabsBase } from "./TabsBase"
import { TabsExtended } from "./TabsExtended"

/**
 * ATOM — `Tabs` wraps HeroUI `Tabs` directly. The `data-anat-part`s it emits
 * (`Tabs.Tab`/`Tabs.Indicator`/`Badge.Anchor`/`Badge`/`Skeleton`) are sub-parts of a real
 * HeroUI compound — each declares `tier: "heroui"` in `ANNOTATE` with its name matching the
 * import identifier exactly (no `storyId`). The `Icon` span wrapping the caller-supplied
 * Phosphor glyph is not tagged — it isn't a real component.
 *
 * The `Skeleton` leaf carries the prop's name (`isSkeleton`) and renders every step with a
 * known visible shape; `variant` ("primary"/"secondary") is that axis, known ahead of time
 * at call. `secondary` produces a label+underline shimmer instead of a solid pill.
 */
export { TabsBase as Tabs, TabsExtended }
export {
    TabsListContainer,
    TabsList,
    TabsTab,
    TabsIndicator,
    TabsPanel,
} from "./TabsParts"

export type { IconComponent, TabItem, TabsBaseProps } from "./TabsBase"
export type { TabsExtendedProps } from "./TabsExtended"

/** Combined tier meta for the `Tabs.*` family — each member also exports its own. */
export const meta = [
    { tier: "atom", name: "Tabs" },
    { tier: "atom", name: "TabsExtended" },
] as const
