"use client"

import React from "react"
import { CodePreviewTabs } from "../CodePreviewTabs"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — faithful port of the src `TabsBlock`
 * sub-renderer. Synced to `src` later.
 *
 * One pane inside a `:::tab` block: the source code (`:::code` → ` ```tsx ` Shiki) or the live
 * demo (`:::preview` → ` ```mdx ` render). It only renders its children; {@link TabsBlock}
 * identifies which pane is which by the original directive tag name (`tabcode`/`tabpreview`).
 */
export const TabPane = (
    { children }: { kind: "code" | "preview", children?: React.ReactNode },
) => <>{children}</>

/** The hast node react-markdown threads onto every element renderer via the `node` prop. */
interface NodeProp {
    node?: { tagName?: string }
}

/**
 * Renders a `:::tab` block as **[ Preview | Code ]** tabs via the shared {@link CodePreviewTabs}.
 *
 * Panes are matched by the original directive tag name carried on each child's `node` prop
 * (`tabcode` / `tabpreview`) — order-independent.
 * @param props.children - The `:::code` / `:::preview` pane elements.
 */
export const TabsBlock = ({ children }: { children?: React.ReactNode }) => {
    let previewNode: React.ReactNode = null
    let codeNode: React.ReactNode = null
    React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child)) {
            return
        }
        const tagName = (child.props as NodeProp).node?.tagName
        if (tagName === "tabpreview") {
            previewNode = child
        } else if (tagName === "tabcode") {
            codeNode = child
        }
    })

    if (previewNode == null && codeNode == null) {
        return <>{children}</>
    }
    return <CodePreviewTabs preview={previewNode} code={codeNode} />
}
