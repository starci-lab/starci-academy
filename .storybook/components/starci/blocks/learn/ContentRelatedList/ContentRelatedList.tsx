import React from "react"
import { SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ContentRelatedList`: what else in this course is worth reading after
 * this lesson. A quiet list, never a call to action.
 *
 * WHY A BLOCK: it knows a LESSON has neighbours in meaning, not just in order —
 * these come from searching the course on this lesson's own subject, so the rows
 * are lessons, and their wording is domain.
 *
 * SELF-HIDES, AND THAT IS THE WHOLE POINT. With nothing related the block draws
 * NOTHING — no card, no label, no empty state. This is the opposite of
 * `ContentDiscussion`, which MUST draw its empty state because silence there is
 * an invitation to write. Here silence means the course has nothing else on this
 * subject, and saying so out loud would be noise about an absence nobody asked
 * about.
 *
 * QUIET ON PURPOSE. It sits below the reading card among the other footer
 * blocks, in the nested surface, with no accent and no button. The reader
 * already has one forward step (`ContentPager`); a second loud one would split
 * their attention between two exits.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One related lesson — plain data, the block builds the row. */
export interface ContentRelatedItem {
    /** Stable React key. */
    key: string
    /** Lesson title. */
    title: string
    /** One line of context, usually the passage the match was found in. */
    snippet?: string
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
     * "Có thể bạn muốn đọc".
     */
    label: string
    /**
     * `true` → the list draws its own row mirror. Kept even though the block
     * self-hides when empty: during the fetch we do not yet KNOW it is empty, and
     * hiding first then appearing would push the page down under the reader.
     */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Related-reading list under a lesson. See the file header for the full contract.
 *
 * @param props - {@link ContentRelatedListProps}
 */
const ContentRelatedList = ({
    items,
    label,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: ContentRelatedListProps) => {
    // Nothing related ⇒ draw nothing. Deliberately BEFORE the skeleton check is
    // false: while loading we do not know yet, so the mirror still shows.
    if (!isSkeleton && items.length === 0) {
        return null
    }

    const rows: Array<SurfaceCardListItem> = items.map((item) => ({
        key: item.key,
        title: item.title,
        subtitle: item.snippet,
        href: item.href,
    }))

    return (
        <div data-anat-part={anatPart}>
            <SurfaceCardList
                label={label}
                variant="nested"
                items={rows}
                isSkeleton={isSkeleton}
                anatPart={showAnatomy ? "SurfaceCardList" : undefined}
            />
        </div>
    )
}

export { ContentRelatedList }
