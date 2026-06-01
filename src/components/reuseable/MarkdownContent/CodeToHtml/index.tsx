"use client"

import React from "react"
import { codeToHtml } from "shiki"
import useSWR from "swr"
import { SnippetIcon } from "../../SnippetIcon"

/** Props for {@link CodeToHtml}. */
export interface CodeToHtmlProps {
    /** Source code to highlight. */
    code: string
    /** Shiki language id (e.g. `bash`, `ts`). */
    language: string
    /** Shiki theme id resolved from the app theme. */
    theme: string
}

/**
 * Converts a code block to highlighted HTML using Shiki.
 *
 * Presentational: uses only SWR's local cache to memoize the highlight result for a given
 * code string; no business logic. Marked `"use client"` for the browser-side highlighter.
 * @param props - {@link CodeToHtmlProps}
 */
export const CodeToHtml = ({ code, language, theme }: CodeToHtmlProps) => {
    const { data } = useSWR(
        code,
        () => codeToHtml(code, { lang: language, theme }),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    )
    return (
        <div className="relative w-full max-w-full overflow-hidden rounded-xl bg-default">
            <div className="absolute right-3 top-3 z-10">
                <SnippetIcon copyString={code} />
            </div>
            <div
                className="p-3 pr-10 text-sm [&_code]:!whitespace-pre-wrap [&_pre]:!whitespace-pre-wrap [&_pre]:!break-words [&_pre]:!bg-transparent [&_pre]:!p-0"
                dangerouslySetInnerHTML={{ __html: data || "" }}
            />
        </div>
    )
}
