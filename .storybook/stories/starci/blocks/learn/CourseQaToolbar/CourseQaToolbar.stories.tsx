import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseQaToolbar, type CourseQaFilter } from "@sb-components/starci/blocks/learn/CourseQaToolbar/CourseQaToolbar"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `CourseQaToolbar` — the control strip above a course Q&A question list:
 * status/scope filter tabs, a search field, and a live match count. Two stacked
 * rows — the filter tabs go through `Toolbar` (leftTabs only), while the search
 * field + count are hand-composed in a `StackH` beside them. One leaf: active
 * filter, search text, and count loading are all data on the same two-row shape.
 */
const meta: Meta<typeof CourseQaToolbar> = {
    title: "StarCi/Blocks/Learn/CourseQaToolbar/CourseQaToolbar",
    component: CourseQaToolbar,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CourseQaToolbar>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame separating the filter-tab row from the search+count row, owning the seam between the two regions", storyId: "frames-stack-stackv--default" },
    "Toolbar": { tier: "composite", role: "the filter tab row — leftTabs only, since this board has no second tab group", storyId: "composites-navigation-toolbar-toolbar--single-group" },
    "StackH": { tier: "frame", role: "the horizontal frame holding the search field and the count on one baseline, pinned to opposite edges", storyId: "frames-stack-stackh--justify" },
    "InputSearch": { tier: "atom", role: "the controlled search field the screen debounces before folding into its query", storyId: "atoms-forms-input-inputsearch--default" },
    "Typography": { tier: "atom", role: "the live match-count line, or its own skeleton mirror while the count is still unknown", storyId: "atoms-text-typography-typography--overview" },
}

/** Props for the local {@link Controlled} story wrapper. */
interface ControlledProps {
    initialFilter: CourseQaFilter
    initialSearch: string
    resultCount: number
    isSkeleton?: boolean
}

/** Small wrapper: keeps `filter`/`searchValue` controlled locally so the tabs and field actually respond in the canvas. */
const Controlled = (props: ControlledProps) => {
    const [filter, setFilter] = useState<CourseQaFilter>(props.initialFilter)
    const [searchValue, setSearchValue] = useState(props.initialSearch)
    return (
        <CourseQaToolbar

           
            filter={filter}
            onFilterChange={setFilter}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            resultCount={props.resultCount}
            filterAriaLabel="Filter questions"
            isSkeleton={props.isSkeleton}
        />
    )
}

/** LEAF — filter tabs + search + count, in their loaded/loading/queried states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CourseQaToolbar"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "filter = unanswered, resultCount = 4",
                        why: "The board opens on the founder/peer answer queue by default, and the count reads the real match total for that filter. This is what a learner sees the moment the board first resolves.",
                        code: `<CourseQaToolbar
    filter="unanswered"
    onFilterChange={setFilter}
    searchValue=""
    onSearchChange={setSearch}
    resultCount={4}
    filterAriaLabel="Filter questions"
/>`,
                        render: <Controlled initialFilter="unanswered" initialSearch="" resultCount={4} />,
                    },
                    {
                        name: "filter = all, searchValue = \"docker\"",
                        why: "Switching to \"All\" and typing a query narrows the same list — the tab row and the field are independent controls the screen folds into one request, so both can hold a value at once.",
                        code: `<CourseQaToolbar
    filter="all"
    onFilterChange={setFilter}
    searchValue="docker"
    onSearchChange={setSearch}
    resultCount={12}
    filterAriaLabel="Filter questions"
/>`,
                        render: <Controlled initialFilter="all" initialSearch="docker" resultCount={12} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The tabs and the search field stay fully painted and interactive — they are static chrome and a plain controlled box, neither waits on data — while only the count shimmers, because it is the one fact here that genuinely depends on the first fetch resolving.",
                        code: `<CourseQaToolbar
    filter="unanswered"
    onFilterChange={setFilter}
    searchValue=""
    onSearchChange={setSearch}
    resultCount={0}
    filterAriaLabel="Filter questions"
    isSkeleton
/>`,
                        render: <Controlled initialFilter="unanswered" initialSearch="" resultCount={0} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
