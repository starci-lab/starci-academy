import React from "react"
import { Toolbar } from "@sb-components/composites/navigation/Toolbar/Toolbar"
import { InputSearch } from "@sb-components/atoms/forms/Input/Input"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `CourseQaToolbar` — the control strip above a course Q&A question list: status/scope
 * filter tabs (via `Toolbar`), a search field, and a live match count, in two stacked
 * rows. Owns the filter → label table and the count wording (`${count} questions`);
 * callers pass a {@link CourseQaFilter} key and a bare `resultCount`, never pre-built
 * tabs or strings. `isSkeleton` reaches only the count (filters and search field are
 * known/interactive upfront). One leaf.
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
    isSkeleton = false,
}: CourseQaToolbarProps) => {
    const items = FILTER_ORDER.map((value) => ({
        key: value,
        label: FILTER_LABEL[value],
    }))

    const searchAndCount = (
        <>
            <div className="min-w-0 flex-1 @app-sm:max-w-sm">
                <InputSearch
                    value={searchValue}
                    onValueChange={onSearchChange}
                    placeholder="Search questions..."
                    ariaLabel="Search questions"

                />
            </div>
            {isSkeleton ? (
                <Typography
                    size="sm"
                    color="muted"
                    isSkeleton
                    classNames={["shrink-0"]}

                />
            ) : (
                <Typography
                    size="sm"
                    color="muted"
                    tabularNums
                    text={resultCountLabel(resultCount)}
                    classNames={["shrink-0"]}

                />
            )}
        </>
    )

    const strip = (
        <>
            <div>
                <Toolbar
                    leftTabs={{
                        items,
                        selectedKey: filter,
                        ariaLabel: filterAriaLabel,
                        onSelectionChange: (key) => onFilterChange(String(key) as CourseQaFilter),
                    }}

                />
            </div>
            <StackH gap={3} justify="between" wrap body={searchAndCount} />
        </>
    )

    return (
        <div>
            <StackV gap={4} body={strip} />
        </div>
    )
}

export { CourseQaToolbar }
