"use client"

import React from "react"
import useSWR from "swr"
import { evaluate } from "@mdx-js/mdx"
import * as runtime from "react/jsx-runtime"
import remarkGfm from "remark-gfm"
import { Spinner } from "@heroui/react"
import { heroUiMdxComponents } from "../mdxComponents"

/** Props for {@link MdxWidget}. */
export interface MdxWidgetProps {
    /** MDX/JSX snippet from a ` ```mdx ` fence; may reference any HeroUI component. */
    code: string
}

/** Compiled MDX module exposes its content as the default export. */
type MdxContentComponent = React.ComponentType<{
    components?: Record<string, React.ElementType>
}>

/**
 * Renders a ` ```mdx ` fenced snippet as a REAL React tree.
 *
 * Only the isolated snippet is compiled with `@mdx-js/mdx` `evaluate()` (client-side,
 * cached per-source via SWR) and rendered with the full HeroUI component map. The rest
 * of the lesson stays plain markdown, so prose containing `<` / `{` never breaks — the
 * custom fence is the separator that "cuts out" the component block.
 *
 * On a compile error the raw snippet is shown verbatim (safe fallback) instead of
 * crashing the page. `"use client"` for the browser-side `evaluate()`.
 * @param props - {@link MdxWidgetProps}
 */
export const MdxWidget = ({ code }: MdxWidgetProps) => {
    const { data: Content, error } = useSWR(
        `mdx:${code}`,
        async () => {
            const compiled = await evaluate(code, {
                ...runtime,
                remarkPlugins: [remarkGfm],
            })
            return compiled.default as MdxContentComponent
        },
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    )

    if (error) {
        // Compile failed → show the snippet verbatim so the author can spot + fix it.
        return (
            <pre className="not-prose overflow-auto rounded-xl border border-danger/40 bg-default/40 p-3 font-mono text-xs text-muted">
                {code}
            </pre>
        )
    }
    if (!Content) {
        return <Spinner size="sm" />
    }
    return (
        <div className="not-prose rounded-xl border border-default bg-surface p-4">
            <Content components={heroUiMdxComponents} />
        </div>
    )
}
