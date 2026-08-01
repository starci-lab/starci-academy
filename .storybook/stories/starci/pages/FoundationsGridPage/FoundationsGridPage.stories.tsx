import type { Meta, StoryObj } from "@storybook/nextjs"
import { FoundationsGridPage } from "@sb-components/starci/pages/FoundationsGridPage/FoundationsGridPage"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * SCREEN — `FoundationsGridPage`: browse the Foundations content library and
 * drill into a category.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else. It calls blocks, places
 * them in frames, and hands each one typed data — every `div` here would be a
 * shape it had no right to decide.
 *
 * SIX FUNCTIONS, in the order the reader meets them: orient · get nudged to
 * unlock while on trial · see a live match count · search by name · browse and
 * open a category · page through when there's more than one page.
 *
 * ⭐ ONLY `isSkeleton` FORKS INTO ITS OWN LEAF. The trial banner's visibility,
 * an empty search result, and whether a pager is supplied are all DATA the
 * screen hands straight through to a block without branching its OWN render on
 * them — none of them removes a block from the screen's own JSX the way
 * `isLocked` does on `ContentPage`. So they stay STATES of the one `Default`
 * leaf (§14d.2), matching the same "optional slot presence is a state, not a
 * leaf" precedent `FoundationCategoryHeader`'s own story already sets for its
 * breadcrumb slot.
 */
const meta: Meta<typeof FoundationsGridPage> = {
    title: "StarCi/Pages/FoundationsGridPage/FoundationsGridPage",
    component: FoundationsGridPage,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FoundationsGridPage>

const BREADCRUMBS = [
    { key: "foundations", label: "Foundations", onPress: () => {} },
]

const CATEGORIES = [
    {
        id: "docker",
        title: "Docker",
        description: "Package and run applications consistently across every environment.",
    },
    {
        id: "kubernetes",
        title: "Kubernetes",
        description: "Orchestrate containers at cluster scale.",
    },
    {
        id: "terraform",
        title: "Terraform",
        description: "Infrastructure as code, declarative and reproducible.",
    },
    {
        id: "observability",
        title: "Observability",
        description: "Logs, metrics, and traces from a system running in production.",
    },
]

const BASE = {
    breadcrumbItems: BREADCRUMBS,
    title: "Foundations",
    description: "Technical fundamentals before you dive into a framework — pick a topic to get started.",
    searchQuery: "",
    onSearchQueryChange: () => {},
    suggestions: [],
    onSelectSuggestion: () => {},
    onSelectCategory: () => {},
    onEnrollTrial: () => {},
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame owning every seam on this screen — between identity, the trial nudge, and the browse cluster, and the inner seam between the search row and the list", storyId: "frames-stack-stackv--default" },
    "FoundationCategoryHeader": { tier: "block", role: "orient: the breadcrumb trail above the hub title and description", storyId: "starci-blocks-learn-foundationcategoryheader-foundationcategoryheader--default" },
    "TrialEnrollBanner": { tier: "block", role: "get nudged to unlock the course while still on trial; self-hides once the caller resolves the learner as enrolled", storyId: "starci-blocks-learn-trialenrollbanner-trialenrollbanner--banner" },
    "FoundationCategorySearchBar": { tier: "block", role: "see the live match count and search by name with autocomplete suggestions", storyId: "starci-blocks-learn-foundationcategorysearchbar-foundationcategorysearchbar--default" },
    "FoundationCategoryList": { tier: "block", role: "browse the category rows, open one, and page through when there's more than one page", storyId: "starci-blocks-learn-foundationcategorylist-foundationcategorylist--default" },
}

/** LEAF — the screen's one shape: header, trial nudge, search row, list. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FoundationsGridPage"
                tier="screen"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "trial banner visible, categories populated, pagination supplied",
                        why: "The everyday shape: a trial learner sees the unlock nudge above a live match count, an empty search field, and a full page of categories with a pager underneath. Every function of the screen is present, in the order the reader meets them.",
                        code: `<FoundationsGridPage
    title="Foundations"
    isTrialBannerVisible
    categories={categories}
    pagination={{ currentPage: 1, totalPages: 3, onPageChange: setPage }}
    …
/>`,
                        render: (
                            <FoundationsGridPage
                                {...BASE}
                               
                                isTrialBannerVisible
                                categoryCount={24}
                                categories={CATEGORIES}
                                pagination={{ currentPage: 1, totalPages: 3, onPageChange: () => {} }}
                            />
                        ),
                    },
                    {
                        name: "trial banner hidden (enrolled learner), no pager",
                        why: "An enrolled learner never sees the trial nudge — the block hides itself, and the two remaining regions close the gap the seam left behind. One page of categories is not enough to page through, so the caller also leaves off `pagination` and the list draws no pager.",
                        code: `<FoundationsGridPage
    title="Foundations"
    isTrialBannerVisible={false}
    categories={categories}
    …
/>`,
                        render: (
                            <FoundationsGridPage
                                {...BASE}
                                isTrialBannerVisible={false}
                                categoryCount={4}
                                categories={CATEGORIES}
                            />
                        ),
                    },
                    {
                        name: "search matched nothing",
                        why: "The reader typed a query that matched no category — the count reads a real zero, autocomplete has no suggestion to offer, and the list swaps its rows for its own empty-with-search-hint message. Nothing about the surrounding screen has to react to this; it is entirely `FoundationCategoryList`'s own state.",
                        code: `<FoundationsGridPage
    title="Foundations"
    isTrialBannerVisible={false}
    searchQuery="cobol"
    categories={[]}
    categoryCount={0}
    …
/>`,
                        render: (
                            <FoundationsGridPage
                                {...BASE}
                                isTrialBannerVisible={false}
                                searchQuery="cobol"
                                categoryCount={0}
                                categories={[]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; every block that can mirror itself does. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FoundationsGridPage"
                tier="screen"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every block mirrors itself while the hub's first fetch is in flight, including the trial banner — its `isSkeleton` reserves the banner's footprint without yet knowing whether the learner is a trial learner (see that block's own file header for why this wins over `isTrialBannerVisible`).",
                        code: "<FoundationsGridPage {...props} isSkeleton />",
                        render: (
                            <FoundationsGridPage
                                {...BASE}
                               
                                isSkeleton
                                isTrialBannerVisible={false}
                                categories={[]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
