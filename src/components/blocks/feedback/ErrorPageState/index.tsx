import React from "react"
import type { ReactNode } from "react"
import { Typography } from "@heroui/react"
/** Props for the {@link ErrorPageState} block. */
export interface ErrorPageStateProps {
    /** Large status numeral (e.g. `"404"`, `"500"`) shown at the top. */
    code: ReactNode
    /** Headline (e.g. "Page not found"). */
    title: ReactNode
    /** Optional supporting line under the title. */
    description?: ReactNode
    /** Optional actions (typically Buttons: retry / home), centered under the copy. */
    actions?: ReactNode
}

/**
 * Full-page error/empty STATE for whole-route failures — the 404 (route not
 * found) and 500 (error boundary) pages, and the profile's own not-found. A
 * centered column: a large muted status numeral, a title + optional description,
 * and optional actions. Presentational (props-only) so it renders in both the
 * server `not-found` and the client `error` boundary; the caller supplies the
 * localized copy + wired action buttons.
 *
 * @param props - {@link ErrorPageStateProps}
 * @see Story: .storybook/stories/blocks/feedback/ErrorPageState/ErrorPageState.stories
 */
export const ErrorPageState = ({
    code,
    title,
    description,
    actions}: ErrorPageStateProps) => {
    return (
        <div
            className={"mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-6 px-6 py-16 text-center"}
        >
            <Typography type="h1" weight="bold" color="muted">{code}</Typography>
            <div className="flex flex-col gap-2">
                <Typography type="h4" weight="semibold">{title}</Typography>
                {description ? (
                    <Typography type="body-sm" color="muted">{description}</Typography>
                ) : null}
            </div>
            {actions ? (
                <div className="flex flex-wrap items-center justify-center gap-3">{actions}</div>
            ) : null}
        </div>
    )
}
