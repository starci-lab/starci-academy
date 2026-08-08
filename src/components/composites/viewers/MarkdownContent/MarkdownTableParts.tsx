import React from "react"
import {
    TableBody,
    TableCell,
    TableColumn,
    TableContent,
    TableHeader,
    TableRoot,
    TableRow,
    TableScrollContainer,
} from "@/components/atoms/data/Table"
import {
    flattenMarkdownTableHeaderChildren,
    isMarkdownHeaderTableRowNode,
} from "@/components/composites/viewers/MarkdownContent/markdown-table"

/**
 * `MarkdownTableParts` — renders a markdown GFM table for `MarkdownContent` via
 * the house `TableRoot` compound.
 *
 * Not the `composites/data/Table` composite: that one is config-driven (`columns`
 * + `items` data, children forbidden), whereas a GFM table arrives as an
 * already-rendered `thead`/`tbody` children tree from `react-markdown` that cannot
 * be reduced back into that shape without re-parsing. As a viewer, `MarkdownContent`
 * never knows its own shape ahead of render, so it goes straight to the house
 * table compound.
 */

/**
 * Builds a house header column from a rendered `th`/`TableColumn` or body `TableCell`.
 * @param column - Rendered header cell from markdown.
 * @param index - Zero-based column index in the header row.
 * @returns A `TableColumn` with `isRowHeader` on the first column (HeroUI requirement).
 */
const toMarkdownHeaderColumn = (column: React.ReactNode, index: number): React.ReactNode => {
    if (!React.isValidElement<ElementWithChildren>(column)) {
        return column
    }
    return (
        <TableColumn key={`md-th-${index}`} isRowHeader={index === 0}>
            {column.props.children}
        </TableColumn>
    )
}

interface ElementWithChildren {
    children?: React.ReactNode
}

/** Props for markdown table row/cell parts. */
export interface MarkdownTablePartProps {
    /** Rendered cell content. */
    children?: React.ReactNode
    /** HAST element for the markdown row (react-markdown always threads this through). */
    node?: unknown
}

/**
 * Header row: columns must be direct children of `TableHeader` (fragment, not `TableRow`).
 * Body row: wrapped in house `TableRow`.
 */
export const MarkdownTableRow = ({ children, node }: MarkdownTablePartProps) => {
    if (isMarkdownHeaderTableRowNode(node)) {
        return <>{children}</>
    }

    return <TableRow>{children}</TableRow>
}

/**
 * Maps markdown `thead` to house `TableHeader`.
 * Rebuilds columns with `isRowHeader` on the first column (required by HeroUI / React Aria).
 * Renders a screen-reader-only column when the header row is empty so the table still mounts.
 */
export const MarkdownTableHead = ({ children }: MarkdownTablePartProps) => {
    const columns = flattenMarkdownTableHeaderChildren(children)

    return (
        <TableHeader>
            {columns.length === 0 ? (
                <TableColumn isRowHeader className="sr-only">
                    {" "}
                </TableColumn>
            ) : (
                columns.map((column, index) => toMarkdownHeaderColumn(column, index))
            )}
        </TableHeader>
    )
}

/** Props for {@link MarkdownTable}. */
export interface MarkdownTableProps {
    /** Rendered `thead` / `tbody` from react-markdown. */
    children?: React.ReactNode
    /** Accessible name for `TableContent`. */
    ariaLabel: string
}

/**
 * Wraps GFM tables in house `TableRoot` and ensures a header row exists with `isRowHeader`.
 * Some markdown tables only emit `tbody`; the first body row is promoted to `thead` in that case.
 * @param props - {@link MarkdownTableProps}
 */
export const MarkdownTable = ({ children, ariaLabel }: MarkdownTableProps) => {
    const parts = React.Children.toArray(children)
    const hasThead = parts.some(
        (child) => React.isValidElement(child) && child.type === MarkdownTableHead,
    )
    const tbodyIndex = parts.findIndex(
        (child) => React.isValidElement(child) && child.type === MarkdownTableBody,
    )

    let content: React.ReactNode
    if (hasThead) {
        content = children
    } else if (tbodyIndex < 0) {
        content = (
            <>
                <MarkdownTableHead />
                {children}
            </>
        )
    } else {
        const tbody = parts[tbodyIndex] as React.ReactElement<ElementWithChildren>
        const bodyRows = React.Children.toArray(tbody.props.children)
        const [firstRow, ...restRows] = bodyRows
        content = (
            <>
                {parts.slice(0, tbodyIndex)}
                <MarkdownTableHead>{firstRow}</MarkdownTableHead>
                <MarkdownTableBody>{restRows}</MarkdownTableBody>
                {parts.slice(tbodyIndex + 1)}
            </>
        )
    }

    // The house table-root is a CSS grid; its inner scroll-container's min-width doesn't
    // propagate, so a wide table forces the whole reading column past the viewport (page stops
    // shrinking). Wrap in a PLAIN BLOCK x-scroll box — a block scroll container has min-content
    // 0, so the column shrinks and the table scrolls inside instead of blocking the layout.
    return (
        <div className="max-w-full overflow-x-auto">
            <TableRoot variant="primary">
                <TableScrollContainer>
                    <TableContent aria-label={ariaLabel}>
                        {content}
                    </TableContent>
                </TableScrollContainer>
            </TableRoot>
        </div>
    )
}

/** Maps markdown `tbody` to house `TableBody`. */
export const MarkdownTableBody = ({ children }: MarkdownTablePartProps) => (
    <TableBody>{children}</TableBody>
)

/** Maps markdown `th` to house `TableColumn`. */
export const MarkdownTableColumn = ({ children }: MarkdownTablePartProps) => (
    <TableColumn>{children}</TableColumn>
)

/** Maps markdown `td` to house `TableCell` — exported for `map.tsx`. */
export const MarkdownTableCell = ({ children }: MarkdownTablePartProps) => (
    <TableCell>{children}</TableCell>
)
