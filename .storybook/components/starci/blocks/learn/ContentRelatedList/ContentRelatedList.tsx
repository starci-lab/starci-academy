import React from "react"
import { LockSimpleIcon } from "@phosphor-icons/react"
import { SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

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
 *
 * ⚠️ NO SNIPPET, ROW = breadcrumb → title → lock line (teacher 2026-07-28:
 * "over-engineered it" — a prior pass invented a `snippet` field this real row never
 * shows). Real `src`'s `RelatedContentList` calls `EntityResultRow` with
 * `showSnippet` left at its default `false` — the backend even strips the
 * snippet for locked rows, so there is nothing to read there anyway. What the
 * real row DOES show above the title is the item's course breadcrumb, and
 * below it, when the viewer must enrol first, a quiet lock line — both
 * missing from the earlier port. `content` (the composite's free-form row
 * slot) replaces the fixed title/subtitle pair because this shape (an
 * optional line ABOVE the title, an optional line BELOW it) does not fit
 * that pair's title/subtitle order.
 * ─────────────────────────────────────────────────────────────────────────────
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
        content: (
            <StackV gap={2} body={relatedItemBody(item, enrollToOpenLabel)} />
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
