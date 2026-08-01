import React from "react"
import { Toolbar } from "@sb-components/composites/navigation/Toolbar/Toolbar"
import { InputSearch } from "@sb-components/atoms/forms/Input/Input"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `CourseQaToolbar`: the control strip above a course Q&A board's
 * question list — status/scope filter tabs, a search field, and a live match
 * count. Ports `src`'s `CourseQa/index.tsx` "C · toolbar" region verbatim: a
 * `TabsCard` (filter tabs, no right group) stacked over a
 * `justify-between` row of `SearchInput` + a count `Typography`.
 *
 * WHY TWO STACKED ROWS, NOT ONE `Toolbar` CALL: `Toolbar`'s KHUNG API (§13b)
 * only has TWO content channels — `leftTabs`/`rightTabs` as controlled TAB
 * GROUPS, plus `leftEnd` as a free-node slot that renders right AFTER the left
 * tab group (not pinned to the row's trailing edge). A search field is not a
 * tab group, and `leftEnd` is the wrong position for it (it would crowd right
 * next to the filter tabs instead of sitting on its own, `justify-between`
 * with the count). So the filter row uses `Toolbar` (leftTabs only — this
 * board has no second tab group) and the search+count row is hand-composed
 * from `InputSearch` + `Typography` in a `StackH`, the exact move
 * `LeaderboardToolbar`'s header already documents for "the composite covers
 * one piece of this strip, not all of it."
 *
 * OWNS THE FILTER → LABEL TABLE (§14d.1), same precedent as `ContentModeNav`'s
 * `MODE_LABEL`: the caller says which {@link CourseQaFilter} is active, it
 * never hands over a pre-built tab list — this block is the one place that
 * knows a course Q&A filter is called "Unanswered" / "Answered" / etc.
 * Order and wording are ported verbatim from `vi.json`'s `courseQa.filter.*`.
 *
 * OWNS THE COUNT'S WORDING too, same `${count} questions` template as `src`'s
 * `courseQa.count` — the caller hands over a bare `resultCount` number, never
 * a formatted string.
 *
 * ⭐ JUDGEMENT CALL — `isSkeleton` reaches ONLY the result count, not the
 * filter tabs or the search field. The five filters are a fixed enum known
 * before any question ever loads (same "never skeletonised, static known-
 * upfront chrome" call `ContentModeNav` documents), and the search field is a
 * plain controlled text box that is already interactive with nothing to wait
 * on (the same call `FlashcardDeckList`'s header makes for its own query
 * field, "never skeletonised, same reasoning as `ContentModeNav`"). The
 * result count is the one fact here that is genuinely unknown until the
 * board's first fetch resolves, so it is the only part that shimmers.
 *
 * ONE LEAF (`Default`). Whether the count is still loading and which filter
 * is selected are DATA conditions on the exact same two-row structure — no
 * node appears or disappears — so they stay STATES, not separate leaves.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    showAnatomy = false,
    anatPart,
}: CourseQaToolbarProps) => {
    const items = FILTER_ORDER.map((value) => ({
        key: value,
        label: FILTER_LABEL[value],
    }))

    const searchAndCount = (
        <>
            <div className="min-w-0 flex-1 @app-sm:max-w-sm" data-anat-part={showAnatomy ? "InputSearch" : undefined}>
                <InputSearch
                    value={searchValue}
                    onValueChange={onSearchChange}
                    placeholder="Search questions..."
                    ariaLabel="Search questions"
                    showAnatomy={showAnatomy}
                />
            </div>
            {isSkeleton ? (
                <Typography
                    size="sm"
                    color="muted"
                    isSkeleton
                    classNames={["shrink-0"]}
                    showAnatomy={showAnatomy}
                />
            ) : (
                <Typography
                    size="sm"
                    color="muted"
                    tabularNums
                    text={resultCountLabel(resultCount)}
                    classNames={["shrink-0"]}
                    showAnatomy={showAnatomy}
                />
            )}
        </>
    )

    const strip = (
        <>
            <div data-anat-part={showAnatomy ? "Toolbar" : undefined}>
                <Toolbar
                    leftTabs={{
                        items,
                        selectedKey: filter,
                        ariaLabel: filterAriaLabel,
                        onSelectionChange: (key) => onFilterChange(String(key) as CourseQaFilter),
                    }}
                    showAnatomy={showAnatomy}
                />
            </div>
            <StackH gap={3} justify="between" wrap showAnatomy={showAnatomy} anatPart={showAnatomy ? "StackH" : undefined} body={searchAndCount} />
        </>
    )

    return (
        <div data-anat-part={anatPart}>
            <StackV gap={4} showAnatomy={showAnatomy} anatPart={showAnatomy ? "StackV" : undefined} body={strip} />
        </div>
    )
}

export { CourseQaToolbar }
