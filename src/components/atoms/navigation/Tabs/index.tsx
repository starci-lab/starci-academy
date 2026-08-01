import { TabsBase } from "./TabsBase"
import { TabsExtended } from "./TabsExtended"

/**
 * `Tabs.*` — namespace of the tab-strip family. This file only gathers the
 * members together; no logic of its own.
 *
 *   • `Tabs`         → ./TabsBase     — data-driven, `items`.
 *   • `TabsExtended` → ./TabsExtended — takes `children` directly.
 *
 * External call sites keep importing `Tabs` from `.../Tabs/Tabs`.
 */
export { TabsBase as Tabs, TabsExtended }

export type { IconComponent, TabItem, TabsBaseProps } from "./TabsBase"
export type { TabsExtendedProps } from "./TabsExtended"

/** Combined tier meta for the `Tabs.*` family — each member also exports its own. */
export const meta = [
    { tier: "atom", name: "Tabs" },
    { tier: "atom", name: "TabsExtended" },
] as const
