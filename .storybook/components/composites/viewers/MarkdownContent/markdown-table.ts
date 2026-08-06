import React from "react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — faithful port of
 * `@/components/blocks/rendering/MarkdownContent/utils/markdown-table`. Authored
 * in Storybook (not `src`); synced back to `src` later.
 */

interface ElementWithChildren {
    children?: React.ReactNode
}

/** One `th`/`td` cell inside the HAST `tr` node backing a markdown table row. */
export interface MarkdownTableCellElement {
    /** HAST node type — always `"element"` for a real cell. */
    type?: string
    /** Cell tag name — `"th"` in a header row, `"td"` in a body row. */
    tagName?: string
}

/** The HAST `tr` element node react-markdown threads onto the `tr` renderer via `node`. */
export interface MarkdownTableRowElement {
    /** HAST node type — always `"element"` for a real row. */
    type?: string
    /** The row's cell nodes. */
    children?: Array<MarkdownTableCellElement>
}

/**
 * Flattens thead row output (e.g. a fragment wrapping columns) so the columns can be
 * passed directly as children of HeroUI `Table.Header`.
 * @param children - Rendered children of the markdown `thead` element.
 * @returns A flat array of column or cell nodes.
 */
export const flattenMarkdownTableHeaderChildren = (children: React.ReactNode): Array<React.ReactNode> => {
    const flattened: Array<React.ReactNode> = []

    const pushRowCells = (rowChildren: React.ReactNode): void => {
        React.Children.forEach(rowChildren, (column) => {
            flattened.push(column)
        })
    }

    React.Children.forEach(children, (row) => {
        if (!React.isValidElement<ElementWithChildren>(row)) {
            return
        }
        if (row.type === React.Fragment) {
            React.Children.forEach(row.props.children, (nestedRow) => {
                if (!React.isValidElement<ElementWithChildren>(nestedRow)) {
                    return
                }
                pushRowCells(nestedRow.props.children)
            })
            return
        }
        pushRowCells(row.props.children)
    })
    return flattened
}

/**
 * Detects header rows from the original HAST `tr` node (GFM uses `th` cells in thead).
 * @param node - The HAST node backing the markdown `tr` element.
 * @returns True when every child cell is a `th` element (i.e. a header row).
 */
export const isMarkdownHeaderTableRowNode = (node: unknown): boolean => {
    if (!node || typeof node !== "object") {
        return false
    }
    const element = node as MarkdownTableRowElement
    if (element.type !== "element") {
        return false
    }
    if (!Array.isArray(element.children) || element.children.length === 0) {
        return false
    }
    return element.children.every(
        (child) =>
            child.type === "element" &&
            typeof child.tagName === "string" &&
            child.tagName.toLowerCase() === "th",
    )
}
