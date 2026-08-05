/** @noSkeleton tab compound parts — the strip root is `TabsExtended`; these are the pieces it hosts. */
import { Tabs as HeroTabs } from "@heroui/react"

export const TabsListContainer = HeroTabs.ListContainer
export const TabsList = HeroTabs.List
export const TabsTab = HeroTabs.Tab
export const TabsIndicator = HeroTabs.Indicator
export const TabsPanel = HeroTabs.Panel

export const meta = { tier: "atom", name: "TabsList" } as const
