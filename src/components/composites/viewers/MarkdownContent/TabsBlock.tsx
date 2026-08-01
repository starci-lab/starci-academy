"use client"

import React from "react"
import { CodePreviewTabs } from "@/components/composites/viewers/MarkdownContent/CodePreviewTabs"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — faithful port of
 * `@/components/blocks/rendering/MarkdownContent/TabsBlock`. Authored in
 * Storybook (not `src`); synced back to `src` later.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link TabPane} — a `:::code` / `:::preview` pane inside a `:::tab` block. */
export interface TabPaneProps {
    /** Which pane this is — read by {@link TabsBlock}, not by this component itself. */
    kind: "code" | "preview"
    /** The fence rendered by the normal `pre` handler. */
    children?: React.ReactNode
}

/**
 * One pane inside a `:::tab` block: the source code (`:::code` → ` ```tsx ` Shiki) or the live
 * demo (`:::preview` → ` ```mdx ` render). It only renders its children (the fence rendered by the
 * normal `pre` handler); {@link TabsBlock} identifies which pane is which by the original directive
 * tag name (`tabcode`/`tabpreview`), not by this prop.
 * @param props - {@link TabPaneProps}
 */
export const TabPane = ({ children }: TabPaneProps) => <>{children}</>

/** The hast element carried on every markdown node's `node` prop. */
export interface TabPaneHastElement {
    /** The custom tag name a remark directive rewrote this node to (`tabcode`/`tabpreview`). */
    tagName?: string
}

/** What a rendered `:::code`/`:::preview` pane element looks like from the outside. */
export interface TabPaneElementProps {
    /** The hast node react-markdown threads onto every element renderer. */
    node?: TabPaneHastElement
}

/** Props for {@link TabsBlock}. */
export interface TabsBlockProps {
    /** The `:::code` / `:::preview` pane elements. */
    children?: React.ReactNode
}

/**
 * Renders a `:::tab` block as **[ Preview | Code ]** tabs via the shared `CodePreviewTabs`.
 *
 * Use this (not a single ` ```mdx `) when the real code has logic/imports that can't be evaluated:
 * the `:::code` pane shows the FULL code (Shiki, not rendered) and the `:::preview` pane shows a
 * separate renderable demo.
 *
 * Panes are matched by the original directive tag name carried on each child's `node` prop
 * (`tabcode` / `tabpreview`) — order-independent. NOTE: the children `TabsBlock` receives are the
 * `tabcode`/`tabpreview` element renderers themselves, whose own props are only `{ node, children }`;
 * the `kind` lives on the `TabPane` they *return*, so it is NOT visible here — match on `node.tagName`.
 * @param props - {@link TabsBlockProps}
 */
export const TabsBlock = ({ children }: TabsBlockProps) => {
    let previewNode: React.ReactNode = null
    let codeNode: React.ReactNode = null
    React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child)) {
            return
        }
        const tagName = (child.props as TabPaneElementProps).node?.tagName
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
