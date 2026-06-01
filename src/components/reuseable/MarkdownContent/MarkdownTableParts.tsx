import React from "react"
import { Table } from "@heroui/react"
import {
    flattenMarkdownTableHeaderChildren,
    isMarkdownHeaderTableRowNode,
} from "./utils"

/** Props for markdown table row/cell parts (optional HAST `node` when `passNode` is on). */
interface MarkdownTablePartProps {
    /** Rendered cell content. */
    children?: React.ReactNode
    /** HAST element for the markdown row (requires `passNode` on `ReactMarkdown`). */
    node?: unknown
}

/**
 * Header row: columns must be direct children of `Table.Header` (fragment, not `Table.Row`).
 * Body row: wrapped in HeroUI `Table.Row`.
 */
export const MarkdownTableRow = ({ children, node }: MarkdownTablePartProps) => {
    if (isMarkdownHeaderTableRowNode(node)) {
        return <>{children}</>
    }

    return <Table.Row>{children}</Table.Row>
}

/**
 * Maps markdown `thead` to HeroUI `Table.Header`.
 * First column is cloned with `isRowHeader` (required by React Aria Table).
 */
export const MarkdownTableHead = ({ children }: MarkdownTablePartProps) => (
    <Table.Header>
        {flattenMarkdownTableHeaderChildren(children).map(
            (column, index) =>
                React.isValidElement<{ isRowHeader?: boolean }>(column)
                    ? React.cloneElement(column, {
                        isRowHeader: index === 0,
                    })
                    : column,
        )}
    </Table.Header>
)

/** Maps markdown `tbody` to HeroUI `Table.Body`. */
export const MarkdownTableBody = ({ children }: MarkdownTablePartProps) => (
    <Table.Body>{children}</Table.Body>
)

/** Maps markdown `th` to HeroUI `Table.Column`. */
export const MarkdownTableColumn = ({ children }: MarkdownTablePartProps) => (
    <Table.Column>{children}</Table.Column>
)
