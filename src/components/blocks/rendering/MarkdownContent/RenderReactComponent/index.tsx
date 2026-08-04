"use client"

import React from "react"
import useSWR from "swr"
import { evaluate } from "@mdx-js/mdx"
import * as runtime from "react/jsx-runtime"
import remarkGfm from "remark-gfm"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { _RenderReactComponent, type MdxContentComponent } from "./component"

/** Props the connected {@link RenderReactComponent} takes from its caller. */
export interface RenderReactComponentConnectedProps extends WithClassNames<undefined> {
    /** JSX/MDX source (a self-contained renderable expression, no imports/logic). */
    code: string
}

/**
 * Renders a ` ```mdx ` snippet as a REAL React tree — the CONNECTED half:
 * compiles the snippet with `@mdx-js/mdx` `evaluate()` (browser-only, cached
 * per-source via SWR). Used standalone (a live preview) and as the
 * `:::preview` pane of a `:::tab` block. See
 * `design/storybook/architecture/split.md`.
 * @param props - {@link RenderReactComponentConnectedProps}
 */
export const RenderReactComponent = ({ code, className }: RenderReactComponentConnectedProps) => {
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

    return (
        <_RenderReactComponent
            code={code}
            Content={Content ?? null}
            hasError={Boolean(error)}
            className={className}
        />
    )
}
