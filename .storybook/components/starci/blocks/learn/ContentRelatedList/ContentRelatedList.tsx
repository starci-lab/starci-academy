import React from "react"
import { LockSimpleIcon } from "@phosphor-icons/react"
import { SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ContentRelatedList` — what else in this course is worth reading after this
 * lesson: a quiet list, never a call to action. Self-hides with nothing related
 * — no card, no label, no empty state (the opposite of `ContentDiscussion`).
 * `breadcrumb` shows a course trail above the title; `isLocked` adds a quiet
 * lock line below. Row count is a state of `Full`; hidden, `isSkeleton`, and a
 * locked row are each their own leaf.
 */

/** One related lesson — plain data, the block builds the row. */
export interface ContentRelatedItem {
    /** Stable React key. */
    key: string
    /** Lesson title. */
    title: string
    /** Course trail this result belongs to, e.g. "Containerization · Docker". Omitted → no line above the title. */
    breadcrumb?: string
    /** `true` → the viewer must enrol to open this result; a quiet lock line replaces any snippet. */
    isLocked?: boolean
    /** Where the row navigates. */
    href: string
}

/** Props for {@link ContentRelatedList}. */
export interface ContentRelatedListProps {
    /**
     * The related lessons. EMPTY → the block renders nothing at all, which is the
     * ordinary case for a course with one lesson on a subject.
     */
    items: Array<ContentRelatedItem>
    /**
     * Section label, localized by the caller (blocks carry no i18n) — e.g.
     * "You might also want to read".
     */
    label: string
    /** Accessible text for the lock line, e.g. "Enroll to unlock". */
    enrollToOpenLabel?: string
    /**
     * `true` → the list draws its own row mirror. Kept even though the block
     * self-hides when empty: during the fetch we do not yet KNOW it is empty, and
     * hiding first then appearing would push the page down under the reader.
     */
    isSkeleton?: boolean
}

/**
 * One related-lesson row's content — extracted because it depends on the loop
 * variable (`item`) and so cannot be hoisted to a module-level const.
 */
const relatedItemBody = (item: ContentRelatedItem, enrollToOpenLabel: string) => (
    <>
        {item.breadcrumb ? (
            <Typography size="xs" color="muted" truncate text={item.breadcrumb} />
        ) : null}
        <Typography
            size="sm"
            weight="medium"
            truncate
            text={item.title}
            underlineOnGroupHover

        />
        {item.isLocked ? (
            <Typography size="xs" color="warning" prefixIcon={LockSimpleIcon} text={enrollToOpenLabel} />
        ) : null}
    </>
)

/**
 * Related-reading list under a lesson. See the file header for the full contract.
 *
 * @param props - {@link ContentRelatedListProps}
 */
const ContentRelatedList = ({
    items,
    label,
    enrollToOpenLabel = "Enroll to unlock",
    isSkeleton = false,
}: ContentRelatedListProps) => {
    // Nothing related ⇒ draw nothing. Deliberately BEFORE the skeleton check is
    // false: while loading we do not know yet, so the mirror still shows.
    if (!isSkeleton && items.length === 0) {
        return null
    }

    const rows: Array<SurfaceCardListItem> = items.map((item) => ({
        key: item.key,
        href: item.href,
        // Row-as-link: hover underlines the title itself, never a full-row fill —
        // matches the real row's own affordance (no accent, no arrow).
        hover: "underline",
        content: () => (
            <StackV gap={2} isSkeleton={isSkeleton} items={[() => relatedItemBody(item, enrollToOpenLabel)]} />
        ),
    }))

    return (
        <div>
            <SurfaceCardList
                label={label}
                items={rows}
                isSkeleton={isSkeleton}

            />
        </div>
    )
}

export { ContentRelatedList }
