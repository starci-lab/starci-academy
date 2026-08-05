import type { Meta, StoryObj } from "@storybook/nextjs"
import { FoundationCategoryList, type FoundationCategoryListItem } from "@sb-components/starci/blocks/learn/FoundationCategoryList/FoundationCategoryList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `FoundationCategoryList` — the Foundations content library's browse-and-drill-in
 * list: joined rows with a thumbnail, title, one-line description and a trailing
 * caret, plus a pager once there is more than one page. Loading swaps row content
 * to shimmer; the `Empty` state replaces the rows with an `EmptyState` (worded by
 * whether a search query drove the empty result), both bounded inside the same
 * `SurfaceCardList` surface.
 */
const meta: Meta<typeof FoundationCategoryList> = {
    title: "StarCi/Blocks/Learn/FoundationCategoryList/FoundationCategoryList",
    component: FoundationCategoryList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FoundationCategoryList>

// Tiny inline PNG so the thumbnail actually loads inside Storybook without a
// network fetch — same approach `Image`'s own story uses.
const THUMBNAIL_SRC =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
const LOGO_SRC =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

const CATEGORIES: Array<FoundationCategoryListItem> = [
    {
        id: "docker",
        title: "Docker",
        description: "Package and run applications consistently across every environment.",
        thumbnailUrl: THUMBNAIL_SRC,
        logoSrc: LOGO_SRC,
    },
    {
        id: "kubernetes",
        title: "Kubernetes",
        description: "Orchestrate containers at cluster scale.",
        logoSrc: LOGO_SRC,
    },
    {
        id: "terraform",
        title: "Terraform",
        description: "Infrastructure as code, declarative and reproducible.",
        thumbnailUrl: THUMBNAIL_SRC,
    },
    {
        id: "observability",
        title: "Observability",
        // No thumbnail, no logo — falls all the way to Image's own built-in glyph.
    },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": {
        tier: "frame",
        role: "the vertical track holding the row list and the pager underneath, one seam owning both",
        storyId: "frames-stack-stackv--default",
    },
    "SurfaceCardList": {
        tier: "composite",
        role: "the bounded surface + row rhythm this block hands its category rows (and its empty message) to",
        storyId: "composites-cards-surfacecard-surfacecardlist--default",
    },
    "Image": {
        tier: "atom",
        role: "each row's thumbnail — resolved through the block's own priority chain (thumbnailUrl → logoSrc → the atom's built-in glyph)",
        storyId: "atoms-media-image-image--with-image",
    },
    "Pagination": {
        tier: "atom",
        role: "the page nav under the list, shown only once there is a real page of rows to page through",
        storyId: "atoms-navigation-pagination-pagination--default",
    },
    "EmptyState": {
        tier: "composite",
        role: "the empty message riding inside SurfaceCardList's own bounded emptyState slot; wording forks on whether a search query drove the empty result",
        storyId: "composites-feedback-emptystate--overview",
    },
}

/**
 * LEAF — `Default`: the populated row list, and (a state of the same tree) its
 * own loading mirror.
 */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FoundationCategoryList"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "categories populated, pagination supplied",
                        why: "The everyday browse shape — four categories exercising every rung of the thumbnail chain at once (thumbnail+logo, logo only, thumbnail only, neither → the Image atom's own glyph), each row a full press target with its trailing caret, and a pager underneath because the caller says there's more than one page.",
                        code: `<FoundationCategoryList
    categories={categories}
    onSelectCategory={(id) => router.push(\`/foundations/\${id}\`)}
    pagination={{ currentPage: 1, totalPages: 4, onPageChange: setPage }}
/>`,
                        render: (
                            <FoundationCategoryList


                                categories={CATEGORIES}
                                onSelectCategory={() => {}}
                                pagination={{ currentPage: 1, totalPages: 4, onPageChange: () => {} }}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true, categories = []",
                        why: "The first fetch hasn't resolved yet — the same bounded SurfaceCardList mirrors itself with three placeholder rows (this composite's SSOT row count), none of them a press target, while the row thumbnail's own Image skeleton shimmers in place of a real fetch.",
                        code: "<FoundationCategoryList isSkeleton categories={[]} onSelectCategory={selectCategory} />",
                        render: (
                            <FoundationCategoryList
                                isSkeleton
                                categories={[]}
                                onSelectCategory={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * LEAF — `Empty`: the rows are replaced by `EmptyState`, forking on whether
 * a search query drove the empty result (see file header, judgement 2).
 */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FoundationCategoryList"
                tier="block"
                leaf="Empty"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "searchQuery = \"cobol\", categories = []",
                        why: "A search was involved and it matched nothing — the message names the exact query, carries a magnifying-glass icon, and hints at trying another word, all bounded inside the same SurfaceCardList surface rather than an unbounded floating message.",
                        code: "<FoundationCategoryList categories={[]} searchQuery=\"cobol\" onSelectCategory={selectCategory} />",
                        render: (
                            <FoundationCategoryList


                                categories={[]}
                                searchQuery="cobol"
                                onSelectCategory={() => {}}
                            />
                        ),
                    },
                    {
                        name: "searchQuery blank, categories = []",
                        why: "No search was involved — the library genuinely has nothing yet, so the wording drops the query-specific phrasing and the \"try another word\" hint, which would make no sense here.",
                        code: "<FoundationCategoryList categories={[]} onSelectCategory={selectCategory} />",
                        render: (
                            <FoundationCategoryList
                                categories={[]}
                                onSelectCategory={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
