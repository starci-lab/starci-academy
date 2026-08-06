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

export const SelectTrigger = HeroSelect.Trigger
export const SelectValue = HeroSelect.Value
export const SelectIndicator = HeroSelect.Indicator
export const SelectPopover = HeroSelect.Popover

export const meta = { tier: "atom", name: "SelectRoot" } as const

/** Folder-matching compound namespace (export-matches-folder / ATOM-11 sync). */
export const Select = {
    Root: SelectRoot,
    Trigger: SelectTrigger,
    Value: SelectValue,
    Indicator: SelectIndicator,
    Popover: SelectPopover,
} as const
