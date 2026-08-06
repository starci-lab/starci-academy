/** @noSkeleton an option list shell — items are handed in. */
import type { ComponentProps, ReactNode } from "react"
import { ListBox as HeroListBox } from "@heroui/react"

/** Props for {@link ListBoxRoot}. */
export type ListBoxRootProps = ComponentProps<typeof HeroListBox.Root> & {
    /** Option rows. */
    children?: ReactNode
}

/** House listbox root over HeroUI `ListBox.Root`. */
export const ListBoxRoot = (props: ListBoxRootProps) => (
    <HeroListBox.Root data-tier="atom" data-component="ListBoxRoot" {...props} />
)

export const ListBoxItem = HeroListBox.Item

export const meta = { tier: "atom", name: "ListBoxRoot" } as const

/** Folder-matching compound namespace (export-matches-folder). Existing named exports stay public. */
export const ListBox = {
    Root: ListBoxRoot,
    Item: ListBoxItem,
} as const
