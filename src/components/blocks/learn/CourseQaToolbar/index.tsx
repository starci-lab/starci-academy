import { InputSearch } from "@/components/atoms/forms"
import React from "react"
import { Toolbar } from "@/components/composites/navigation/Toolbar"

import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"

/**
 * `CourseQaToolbar` — the control strip above a course Q&A question list:
 * status/scope filter tabs, a search field, and a live match count. Two stacked
 * rows — the filter tabs go through `Toolbar` (leftTabs only), while the search
 * field + count are hand-composed in a `StackH` beside them. One leaf: active
 * filter, search text, and count loading are all data on the same two-row shape.
 */

/** Status/scope filter for the course-wide Q&A roll-up. Mirrors `src`'s `CourseQuestionFilter`. */
export type CourseQaFilter = "unanswered" | "answered" | "engagement" | "mine" | "all"

/** Filter tabs in display order — the block's own vocabulary (§14d.1). */
const FILTER_ORDER: ReadonlyArray<CourseQaFilter> = ["unanswered", "answered", "engagement", "mine", "all"]

/** Filter → tab label, ported verbatim from `vi.json`'s `courseQa.filter.*`. */
const FILTER_LABEL: Record<CourseQaFilter, string> = {
    unanswered: "Unanswered",
    answered: "Answered",
    engagement: "Most active",
    mine: "Mine",
    all: "All",
}

/** The board's own count wording — the caller hands over a bare number, never a formatted string. */
const resultCountLabel = (count: number): string => `${count} questions`

/** Props for {@link CourseQaToolbar}. */
export interface CourseQaToolbarProps {
    /** Which status/scope filter is active. */
    filter: CourseQaFilter
    /** Fired with the filter the reader picked. */
    onFilterChange: (filter: CourseQaFilter) => void
    /** Current text in the search field (controlled; the screen owns debouncing). */
    searchValue: string
    /** Fired with the new query on every keystroke. */
    onSearchChange: (value: string) => void
    /** How many questions the active filter + search matched. */
    resultCount: number
    /** Accessible name for the filter tab row, localized by the caller (blocks carry no i18n). */
    filterAriaLabel: string
    /**
     * Accessible name for the search field — `InputSearch`'s `ariaLabel` no
     * longer defaults to English, so the caller must resolve and pass a
     * translated string (blocks carry no i18n).
     */
    searchAriaLabel: string
    /**
     * `true` → the result count shimmers instead of printing a number. Scoped to
     * the count only — see the file header for why the tabs and search field
     * never skeletonise.
     */
    isSkeleton?: boolean
}

/**
 * The Q&A board's control strip. See the file header for why the two rows
 * cannot collapse into one `Toolbar` call and why only the count skeletonises.
 *
 * @param props - {@link CourseQaToolbarProps}
 */
const CourseQaToolbar = ({
    filter,
    onFilterChange,
    searchValue,
    onSearchChange,
    resultCount,
    filterAriaLabel,
    searchAriaLabel,
    isSkeleton = false,
}: CourseQaToolbarProps) => {
    const items = FILTER_ORDER.map((value) => ({
        key: value,
        label: FILTER_LABEL[value],
    }))

    return (
        <StackV
            identity={{ tier: "block", component: "CourseQaToolbar" }}
            gap={4}
            principle="content-row"
            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <Toolbar
                        leftTabs={{
                            items,
                            selectedKey: filter,
                            ariaLabel: filterAriaLabel,
                            onSelectionChange: (key) => onFilterChange(String(key) as CourseQaFilter),
                        }}

                    />
                ),
                () => (
                    <StackH
                        gap={3}
                        principle="flex-action"
                        explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                        justify="between"
                        at="sm"
                        isSkeleton={isSkeleton}
                        items={[
                            () => (
                                <StackV
                                    principle="flex-fill-base"
                                    explain="Fills the remaining row width — not flex-fill, because this is the base-width fill rather than a breakpoint-owned grow."
                                    items={[
                                        () => (
                                            <InputSearch
                                                value={searchValue}
                                                onValueChange={onSearchChange}
                                                placeholder="Search questions..."
                                                ariaLabel={searchAriaLabel}

                                            />
                                        ),
                                    ]}
                                />
                            ),
                            () => (
                                isSkeleton ? (
                                    <Typography
                                        size="sm"
                                        color="muted"
                                        isSkeleton


                                    />
                                ) : (
                                    <Typography
                                        size="sm"
                                        color="muted"
                                        tabularNums
                                        text={resultCountLabel(resultCount)}


                                    />
                                )
                            ),
                        ]}
                    />
                ),
            ]}
        />
    )
}

export { CourseQaToolbar }
