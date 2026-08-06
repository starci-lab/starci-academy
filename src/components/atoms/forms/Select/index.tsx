/** @noSkeleton a closed picker shell — options are handed in. */
import type { ComponentProps, ReactNode } from "react"
import { Select as HeroSelect } from "@heroui/react"

/** Props for {@link SelectRoot}. */
export type SelectRootProps = ComponentProps<typeof HeroSelect.Root> & {
    /** Trigger + popover tree. */
    children?: ReactNode
}

/** House select root over HeroUI `Select.Root`. */
export const SelectRoot = (props: SelectRootProps) => (
    <HeroSelect.Root data-tier="atom" data-component="SelectRoot" {...props} />
)

/** House trigger over HeroUI `Select.Trigger`. */
export const SelectTrigger = HeroSelect.Trigger
/** House value over HeroUI `Select.Value`. */
export const SelectValue = HeroSelect.Value
/** House indicator over HeroUI `Select.Indicator`. */
export const SelectIndicator = HeroSelect.Indicator
/** House popover over HeroUI `Select.Popover`. */
export const SelectPopover = HeroSelect.Popover

/** Tier metadata for `SelectRoot`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "SelectRoot" } as const
