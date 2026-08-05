import React from "react"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"
import type {
    GlobalSearchModalLabels,
    GlobalSearchModalPopularCourse,
    GlobalSearchModalSection,
    GlobalSearchResultRow,
} from "../component"
import { GlobalSearchContentBlock } from "./Block"
import { GlobalSearchEmpty } from "./Empty"

/** Props for {@link GlobalSearchContent}. */
export interface GlobalSearchContentProps {
    /** Non-empty result buckets, in display order. */
    sections: Array<GlobalSearchModalSection>
    /** `true` once a non-blank query has been committed. */
    hasQuery: boolean
    /** Popular-course fallback rows. */
    popularCourses: Array<GlobalSearchModalPopularCourse>
    /** Every translated string this modal renders. */
    labels: GlobalSearchModalLabels
    /** Fired when a result row is pressed. */
    onSelectResult: (row: GlobalSearchResultRow) => void
    /** Fired when a popular-course fallback row is pressed. */
    onSelectPopularCourse: (course: GlobalSearchModalPopularCourse) => void
}

/**
 * The results region: one section per non-empty bucket (a `Label (count)`
 * heading + its rows), or the popular/no-match fallback when every bucket is
 * empty. Presentational — every field arrives already resolved.
 *
 * @param props - {@link GlobalSearchContentProps}
 */
export const GlobalSearchContent = ({
    sections,
    hasQuery,
    popularCourses,
    labels,
    onSelectResult,
    onSelectPopularCourse,
}: GlobalSearchContentProps) => {
    if (sections.length === 0) {
        return (
            <GlobalSearchEmpty
                hasQuery={hasQuery}
                popularCourses={popularCourses}
                labels={labels}
                onSelectCourse={onSelectPopularCourse}
            />
        )
    }

    return (
        <StackV
            gap={5}
            items={sections.map((section) => () => (
                <StackV
                    gap={3}
                    items={[
                        () => (
                            <Typography
                                size="xs"
                                weight="medium"
                                color="muted"
                                text={`${section.label} (${section.items.length})`}
                            />
                        ),
                        () => (
                            <GlobalSearchContentBlock
                                items={section.items}
                                labels={labels}
                                onSelect={onSelectResult}
                            />
                        ),
                    ]}
                />
            ))}
        />
    )
}
