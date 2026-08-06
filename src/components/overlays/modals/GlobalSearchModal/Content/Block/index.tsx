import React from "react"
import { CaretRightIcon, LockIcon } from "@phosphor-icons/react"
import { Typography } from "@/components/atoms/text/Typography"
import { Chip } from "@/components/atoms/chips/Chip"
import { StackH, StackV } from "@/components/frames/Stack"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { GLOBAL_SEARCH_KIND_ICON, type GlobalSearchModalLabels, type GlobalSearchResultRow } from "../../component"

/** Props for {@link GlobalSearchContentBlock}. */
export interface GlobalSearchContentBlockProps {
    /** Rows of ONE bucket, in display order. */
    items: Array<GlobalSearchResultRow>
    /** The chip/hint labels this block renders. */
    labels: Pick<GlobalSearchModalLabels, "enrolled" | "free" | "viewCourse" | "premiumLock">
    /** Fired when a row is pressed. */
    onSelect: (row: GlobalSearchResultRow) => void
}

/**
 * Splits `<em>match</em>` out of a snippet line into an emphasized span,
 * trimming a fixed window of context around it. Plain text passes through
 * unchanged.
 */
const renderEmText = (text: string) => {
    const match = text.match(/<em>(.*?)<\/em>/)
    if (!match || match.index === undefined) {
        return text
    }

    const before = 10
    const after = 40
    const start = Math.max(0, match.index - before)
    const end = Math.min(text.length, match.index + match[0].length + after)
    const sliced = text.slice(start, end)
    const parts = sliced.split(/(<em>.*?<\/em>)/g)

    return (
        <>
            {start > 0 ? "…" : null}
            {parts.map((part, index) => {
                if (part.startsWith("<em>") && part.endsWith("</em>")) {
                    const content = part.replace(/<\/?em>/g, "")
                    return <Typography key={index} size="xs" color="accent-soft" weight="semibold" isInline text={content} />
                }
                return <span key={index}>{part}</span>
            })}
            {end < text.length ? "…" : null}
        </>
    )
}

/** One row's free-form body: kind icon + title + state badges, then any matched snippet lines. */
const resultRowContent = (row: GlobalSearchResultRow, labels: GlobalSearchContentBlockProps["labels"]) => {
    const Icon = GLOBAL_SEARCH_KIND_ICON[row.kind]
    const titleRow = [
        () => (
            <Typography
                size="sm"
                prefixIcon={Icon}
                truncate
                classNames={["flex-1", "min-w-0"]}
                text={row.title}
            />
        ),
        ...(row.showEnrolledChip ? [() => <Chip tone="success" text={labels.enrolled} />] : []),
        ...(row.showFreeChip ? [() => <Chip tone="success" text={labels.free} />] : []),
        ...(row.showPremiumLock ? [() => (
            <LockIcon aria-label={labels.premiumLock} focusable="false" className="size-4 shrink-0 text-muted" />
        )] : []),
        ...(row.showViewCourseHint ? [() => (
            <Typography
                size="xs"
                color="accent-soft"
                suffixIcon={CaretRightIcon}
                text={labels.viewCourse}
            />
        )] : []),
    ]
    const rowItems = [
        () => (
            <StackH
                gap={3}
                principle="sibling-stack"
                align="center"
                items={titleRow}
            />
        ),
        ...(row.textLines.length > 0 ? row.textLines.map((line) => () => (
            <Typography size="xs" color="muted" text={renderEmText(line)} />
        )) : []),
    ]
    return <StackV gap={2} items={rowItems} />
}

/**
 * The row list of one global-search group. Each row is a FREE-FORM
 * `SurfaceCardList` item — kind icon, title, state badges (enrolled / free /
 * premium-lock / "view course"), then any matched snippet lines. The whole
 * row is one press target, navigating via the connected half's
 * {@link GlobalSearchContentBlockProps.onSelect}.
 *
 * @param props - {@link GlobalSearchContentBlockProps}
 */
export const GlobalSearchContentBlock = ({ items, labels, onSelect }: GlobalSearchContentBlockProps) => {
    if (items.length === 0) {
        return null
    }

    const listItems: Array<SurfaceCardListItem> = items.map((row) => ({
        key: row.id,
        content: () => resultRowContent(row, labels),
        onPress: () => onSelect(row),
    }))

    return <SurfaceCardList items={listItems} />
}
