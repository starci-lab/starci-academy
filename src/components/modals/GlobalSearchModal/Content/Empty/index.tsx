import React from "react"
import { FlameIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty } from "@/components/composites/async/AsyncContent"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { PriceTagInline } from "@/components/starci/blocks/commerce/PriceTag"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"
import type { GlobalSearchModalLabels, GlobalSearchModalPopularCourse } from "../../component"

/** Props for {@link GlobalSearchEmpty}. */
export interface GlobalSearchEmptyProps {
    /** `true` when a non-blank query is active but matched nothing. */
    hasQuery: boolean
    /** Popular-course fallback rows — already the viewer's recommendations, priced. */
    popularCourses: Array<GlobalSearchModalPopularCourse>
    /** Every translated string this modal renders. */
    labels: Pick<GlobalSearchModalLabels, "noResults" | "idleHint" | "popular">
    /** Fired when a popular-course row is pressed. */
    onSelectCourse: (course: GlobalSearchModalPopularCourse) => void
}

/**
 * Empty state for the global search palette.
 *
 * - Query typed, no hits → a "no matches" message.
 * - Idle (blank query) → popular courses as quick links, so the palette is
 *   never a dead blank.
 *
 * @param props - {@link GlobalSearchEmptyProps}
 */
export const GlobalSearchEmpty = ({ hasQuery, popularCourses, labels, onSelectCourse }: GlobalSearchEmptyProps) => {
    // No popular courses to fall back on → just the appropriate hint line (never a blank).
    if (popularCourses.length === 0) {
        return <AsyncContentEmpty title={hasQuery ? labels.noResults : labels.idleHint} />
    }

    const items: Array<SurfaceCardListItem> = popularCourses.map((course) => ({
        key: course.id,
        leadingIcon: FlameIcon,
        title: course.title,
        meta: () => <PriceTagInline discounted={course.discountedPriceVnd} />,
        onPress: () => onSelectCourse(course),
    }))

    // A query WAS typed but matched nothing → keep the "not found" line, then fall
    // through to the popular list below it, so the palette is never a dead end.
    return (
        <StackV
            gap={3}
            items={[
                ...(hasQuery ? [() => <Typography size="sm" color="muted" text={labels.noResults} />] : []),
                () => <SurfaceCardList label={labels.popular} subtleLabel items={items} />,
            ]}
        />
    )
}
