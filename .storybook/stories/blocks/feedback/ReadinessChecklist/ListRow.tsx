import React from "react"
import { cn, Typography } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — faithful local copy of
 * `@/components/blocks/lists/ListRow`, inlined here because ReadinessChecklist
 * depends on it and no local port exists elsewhere yet.
 * TODO: swap for the ListRow local when it is ported under `.storybook/stories`.
 */

/** Props for {@link ListRow}. */
export interface ListRowProps {
    /** Optional leading node rendered before the text column, kept at intrinsic size. */
    leading?: React.ReactNode
    /** Primary line — medium-weight foreground text, single-line truncate. */
    title: React.ReactNode
    /** Optional secondary line — muted, smaller, single-line truncate. */
    subtitle?: React.ReactNode
    /** Optional right-aligned metadata (chips / counts / timestamps) before the trailing node. */
    meta?: React.ReactNode
    /** Optional far-right node (chevron / inline action) after the meta content. */
    trailing?: React.ReactNode
    /** When true, adds a bottom border so consecutive rows read as a separated list. */
    divider?: boolean
    /** Optional press handler → interactive row with hover surface + keyboard access. */
    onPress?: () => void
    /** Optional link target → the whole row navigates on click. */
    href?: string
    /** Extra classes on the row. */
    className?: string
}

/**
 * Generic GitHub-style list row: an optional leading icon/avatar, a title +
 * optional subtitle text column, and a right-aligned meta + trailing cluster.
 * Purely presentational.
 *
 * @param props - {@link ListRowProps}
 */
export const ListRow = ({
    leading,
    title,
    subtitle,
    meta,
    trailing,
    divider = false,
    onPress,
    href,
    className,
}: ListRowProps) => {
    const isPressable = Boolean(onPress || href)

    const content = (
        <>
            {leading ? <div className="shrink-0">{leading}</div> : null}
            <div className="flex min-w-0 flex-col gap-0">
                <Typography type="body-sm" weight="medium" truncate>
                    {title}
                </Typography>
                {subtitle ? (
                    <Typography type="body-xs" color="muted" truncate>
                        {subtitle}
                    </Typography>
                ) : null}
            </div>
            {meta || trailing ? (
                <div className="ml-auto flex shrink-0 items-center gap-2">
                    {meta}
                    {trailing}
                </div>
            ) : null}
        </>
    )

    const baseClassName = cn(
        "flex min-w-0 items-center gap-3 py-2",
        divider && "border-b border-separator",
        isPressable &&
            "rounded-2xl transition-colors hover:bg-surface-secondary focus-visible:bg-surface-secondary focus-visible:outline-none",
        className,
    )

    if (href) {
        return (
            <a href={href} onClick={onPress} className={baseClassName}>
                {content}
            </a>
        )
    }

    if (onPress) {
        return (
            <div
                role="button"
                tabIndex={0}
                onClick={onPress}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        onPress()
                    }
                }}
                className={cn(baseClassName, "cursor-pointer")}
            >
                {content}
            </div>
        )
    }

    return <div className={baseClassName}>{content}</div>
}
