/** @noSkeleton table chrome — cells are handed in by the caller. */
import type { ComponentProps, ReactNode } from "react"
import { Table as HeroTable } from "@heroui/react"

/** Props for {@link TableRoot}. */
export type TableRootProps = Omit<ComponentProps<typeof HeroTable>, "className" | "classNames"> & {
    /** Table compound tree. */
    children?: ReactNode
}

/** House table root over HeroUI `Table`. */
export const TableRoot = ({ children, ...props }: TableRootProps) => (
    <HeroTable data-tier="atom" data-component="TableRoot" {...props}>{children}</HeroTable>
)

export const TableScrollContainer = HeroTable.ScrollContainer
export const TableContent = HeroTable.Content
export const TableHeader = HeroTable.Header
export const TableBody = HeroTable.Body
export const TableColumn = HeroTable.Column
export const TableRow = HeroTable.Row
export const TableCell = HeroTable.Cell

export const meta = { tier: "atom", name: "TableRoot" } as const
