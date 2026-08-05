import React from "react"
import { cn, Table } from "@heroui/react"
import {
    flattenMarkdownTableHeaderChildren,
    isMarkdownHeaderTableRowNode,
} from "@sb-components/composites/viewers/MarkdownContent/markdown-table"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * `MarkdownTableParts` — renders a markdown GFM table for `MarkdownContent` via
 * the HeroUI `Table` compound.
 *
 * Not the `composites/data/Table` composite: that one is config-driven (`columns`
 * + `items` data, children forbidden), whereas a GFM table arrives as an
 * already-rendered `thead`/`tbody` children tree from `react-markdown` that cannot
 * be reduced back into that shape without re-parsing. As a viewer, `MarkdownContent`
 * never knows its own shape ahead of render, so it goes straight to the HeroUI
 * `Table` compound.
 */

/**
 * Builds a HeroUI header column from a rendered `th`/`Table.Column` or body `Table.Cell`.
 * @param column - Rendered header cell from markdown.
 * @param index - Zero-based column index in the header row.
 * @returns A `Table.Column` with `isRowHeader` on the first column (HeroUI requirement).
 */
const toMarkdownHeaderColumn = (column: React.ReactNode, index: number): React.ReactNode => {
    if (!React.isValidElement<ElementWithChildren>(column)) {
        return column
    }
    return (
        <Table.Column key={`md-th-${index}`} isRowHeader={index === 0}>
            {column.props.children}
        </Table.Column>
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
    /** Where this sits inside its parent, from the closed positioning union. */
    classNames?: Array<AllowedClassName>
}

/**
 * Header row: columns must be direct children of `Table.Header` (fragment, not `Table.Row`).
 * Body row: wrapped in HeroUI `Table.Row`.
 */
export const MarkdownTableRow = ({ children, node, classNames }: MarkdownTablePartProps) => {
    if (isMarkdownHeaderTableRowNode(node)) {
        return <>{children}</>
    }

    return <Table.Row className={cn(classNames)}>{children}</Table.Row>
}

/**
 * Maps markdown `thead` to HeroUI `Table.Header`.
 * Rebuilds columns with `isRowHeader` on the first column (required by HeroUI / React Aria).
 * Renders a screen-reader-only column when the header row is empty so the table still mounts.
 */
export const MarkdownTableHead = ({ children, classNames }: MarkdownTablePartProps) => {
    const columns = flattenMarkdownTableHeaderChildren(children)

    return (
        <Table.Header className={cn(classNames)}>
            {columns.length === 0 ? (
                <Table.Column isRowHeader className="sr-only">
                    {" "}
                </Table.Column>
            ) : (
                columns.map((column, index) => toMarkdownHeaderColumn(column, index))
            )}
        </Table.Header>
    )
}

/** Props for {@link MarkdownTable}. */
export interface MarkdownTableProps {
    /** Rendered `thead` / `tbody` from react-markdown. */
    children?: React.ReactNode
    /** Accessible name for `Table.Content`. */
    ariaLabel: string
    /**
     * Where this sits inside its parent, from the closed positioning union.
     * `map.tsx` owns the block-rhythm margin between fences by wrapping this
     * component's output in a plain `<div>` — margins have no slot in
     * `AllowedClassName` (see `principles/margin.md`).
     */
    classNames?: Array<AllowedClassName>
}

/**
 * Wraps GFM tables in HeroUI `Table` and ensures a header row exists with `isRowHeader`.
 * Some markdown tables only emit `tbody`; the first body row is promoted to `thead` in that case.
 * @param props - {@link MarkdownTableProps}
 */
export const MarkdownTable = ({ children, ariaLabel, classNames }: MarkdownTableProps) => {
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

    // The HeroUI table-root is a CSS grid; its inner scroll-container's min-width doesn't
    // propagate, so a wide table forces the whole reading column past the viewport (page stops
    // shrinking). Wrap in a PLAIN BLOCK x-scroll box — a block scroll container has min-content
    // 0, so the column shrinks and the table scrolls inside instead of blocking the layout.
    return (
        <div className="max-w-full overflow-x-auto">
            <Table variant="primary" className={cn(classNames)}>
                <Table.ScrollContainer>
                    <Table.Content aria-label={ariaLabel}>
                        {content}
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
        </div>
    )
}

/** Maps markdown `tbody` to HeroUI `Table.Body`. */
export const MarkdownTableBody = ({ children, classNames }: MarkdownTablePartProps) => (
    <Table.Body className={cn(classNames)}>{children}</Table.Body>
)

/** Maps markdown `th` to HeroUI `Table.Column`. */
export const MarkdownTableColumn = ({ children, classNames }: MarkdownTablePartProps) => (
    <Table.Column className={cn(classNames)}>{children}</Table.Column>
)
