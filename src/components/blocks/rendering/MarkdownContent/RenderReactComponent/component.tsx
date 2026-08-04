import React from "react"
import { cn, Spinner } from "@heroui/react"
import { heroUiMdxComponents } from "../mdxComponents"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Compiled MDX module exposes its content as the default export. */
export type MdxContentComponent = React.ComponentType<{
    components?: Record<string, React.ElementType>
    className?: string
}>

/** Props for {@link _RenderReactComponent} — presentational; the compiled MDX component already resolved. */
export interface RenderReactComponentProps extends WithClassNames<undefined> {
    /** JSX/MDX source (shown verbatim on a compile error). */
    code: string
    /** The compiled MDX component, or `null` while compiling. */
    Content: MdxContentComponent | null
    /** `true` → the compile failed; falls back to showing `code` verbatim. */
    hasError: boolean
}

/**
 * Renders a ` ```mdx ` snippet as a REAL React tree — render ONLY, no tabs.
 *
 * Presentational: the connected half owns the (browser-only) `evaluate()`
 * compile, cached per-source via SWR; this component only picks the
 * error / loading / compiled branch. On a compile error the raw snippet is
 * shown verbatim (safe fallback) instead of crashing.
 * @param props - {@link RenderReactComponentProps}
 */
export const _RenderReactComponent = ({ code, Content, hasError, className }: RenderReactComponentProps) => {
    if (hasError) {
        return (
            <pre className={cn("not-prose overflow-auto rounded-xl border border-danger/40 bg-default/40 p-3 font-mono text-xs text-muted", className)}>
                {code}
            </pre>
        )
    }
    if (!Content) {
        return <Spinner size="sm" aria-label="Rendering" className={cn(className)} />
    }
    return <Content components={heroUiMdxComponents} className={className} />
}
