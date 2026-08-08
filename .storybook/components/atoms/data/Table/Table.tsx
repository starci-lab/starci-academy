/** @noSkeleton table chrome — cells are handed in by the caller. */
import type { ReactNode } from "react"
import { Table as HeroTable } from "@heroui/react"

/** Props for {@link TableRoot}. */
export interface TableRootProps {
    /** Table compound tree. */
    children?: ReactNode
    /** House table chrome selected by proven consumers. */
    variant?: "primary"
    /** Accessible table label. */
    ariaLabel?: string
}

/** House table root over HeroUI `Table`. */
export const TableRoot = ({ children, variant, ariaLabel }: TableRootProps) => (
    <HeroTable data-tier="atom" data-component="TableRoot" variant={variant} aria-label={ariaLabel}>{children}</HeroTable>
)

/** House scroll container over HeroUI `Table.ScrollContainer`. */
export const TableScrollContainer = HeroTable.ScrollContainer
/** House content over HeroUI `Table.Content`. */
export const TableContent = HeroTable.Content
/** House header over HeroUI `Table.Header`. */
export const TableHeader = HeroTable.Header
/** House body over HeroUI `Table.Body`. */
export const TableBody = HeroTable.Body
/** House column over HeroUI `Table.Column`. */
export const TableColumn = HeroTable.Column
/** House row over HeroUI `Table.Row`. */
export const TableRow = HeroTable.Row
/** House cell over HeroUI `Table.Cell`. */
export const TableCell = HeroTable.Cell

/** Tier metadata for `TableRoot`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "TableRoot" } as const
