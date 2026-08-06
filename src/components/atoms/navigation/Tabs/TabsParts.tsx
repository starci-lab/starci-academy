/** @noSkeleton tab compound parts — the strip root is `TabsExtended`; these are the pieces it hosts. */
import { Tabs as HeroTabs } from "@heroui/react"

/** House list container over HeroUI `Tabs.ListContainer`. */
export const TabsListContainer = HeroTabs.ListContainer
/** House list over HeroUI `Tabs.List`. */
export const TabsList = HeroTabs.List
/** House tab over HeroUI `Tabs.Tab`. */
export const TabsTab = HeroTabs.Tab
/** House indicator over HeroUI `Tabs.Indicator`. */
export const TabsIndicator = HeroTabs.Indicator
/** House panel over HeroUI `Tabs.Panel`. */
export const TabsPanel = HeroTabs.Panel

/** Tier metadata for `TabsList`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "TabsList" } as const
