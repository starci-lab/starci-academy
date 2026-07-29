import type { Meta, StoryObj } from "@storybook/nextjs"
import { FoundationsCategoryPage } from "@sb-components/starci/pages/FoundationsCategoryPage/FoundationsCategoryPage"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * SCREEN — `FoundationsCategoryPage`: browse ONE foundations category's
 * resources, reached from the Foundations hub grid.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else. It calls blocks, places
 * them in frames, and hands each one typed data — every `div` here would be a
 * shape it had no right to decide.
 *
 * FIVE FUNCTIONS, in the order the reader meets them: orient · get nudged to
 * unlock while on trial · see a live match count · search resources by name ·
 * browse the resource list, open one, and page through it.
 *
 * ⭐ ONLY `isSkeleton` FORKS INTO ITS OWN LEAF. The trial nudge's visibility, an
 * empty search result, and whether a pager makes sense are all DATA the
 * screen hands straight through to a block without branching its OWN render
 * on them — none of them removes a block from the screen's own JSX. So they
 * stay STATES of the one `Default` leaf (§14d.2), same precedent
 * `FoundationsGridPage`'s own story already sets one level up the nav.
 */
const meta: Meta<typeof FoundationsCategoryPage> = {
    title: "StarCi/Pages/FoundationsCategoryPage/FoundationsCategoryPage",
    component: FoundationsCategoryPage,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FoundationsCategoryPage>

const BREADCRUMBS = [
    { key: "courses", label: "Khoá học", onPress: () => {} },
    { key: "course", label: "DevOps Mastery", onPress: () => {} },
    { key: "foundations", label: "Foundations", onPress: () => {} },
    { key: "category", label: "Docker" },
]

const RESOURCES = [
    {
        id: "docker-cheatsheet",
        title: "Docker command cheatsheet",
        description: "Mọi lệnh Docker hay dùng nhất, gom lại một trang để tra nhanh.",
        thumbnailUrl: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=200",
        kind: "reference" as const,
        isRecommended: true,
        onPress: () => {},
    },
    {
        id: "multistage-video",
        title: "Multi-stage build trong 8 phút",
        description: "Video ngắn giải thích vì sao stage build giữ compiler còn stage cuối thì không.",
        kind: "video" as const,
        onPress: () => {},
    },
    {
        id: "cache-article",
        title: "Image layer và cache hoạt động ra sao",
        description: "Mỗi lệnh trong Dockerfile đẻ một layer, thứ tự lệnh quyết định cache còn dùng được không.",
        thumbnailUrl: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=200",
        kind: "article" as const,
        onPress: () => {},
    },
    {
        id: "registry-exercise",
        title: "Đẩy image lên registry và ghim tag",
        kind: "exercise" as const,
        isRecommended: true,
        onPress: () => {},
    },
]

const BASE = {
    breadcrumbItems: BREADCRUMBS,
    title: "Docker",
    description: "Đóng gói và chạy ứng dụng nhất quán trên mọi môi trường.",
    trialNudgeTitle: "Học thử — mở khoá toàn bộ khoá học",
    trialNudgeDescription: "Bạn đang học thử. Mở khoá để xem hết bài giảng và làm mọi thử thách.",
    trialNudgeCtaLabel: "Mở khoá ngay",
    onEnrollTrial: () => {},
    searchQuery: "",
    onSearchQueryChange: () => {},
    suggestions: [],
    onSelectSuggestion: () => {},
    onPageChange: () => {},
    resourceListAriaLabel: "Tài nguyên Docker",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame owning every seam on this screen — between identity, the trial nudge, and the browse cluster, and the inner seam between the search row and the list", storyId: "frames-stack-stackv--default" },
    "FoundationsHeader": { tier: "block", role: "orient: the breadcrumb trail above the category title and description", storyId: "starci-blocks-learn-foundationsheader-foundationsheader--full" },
    "TrialEnrollNudge": { tier: "block", role: "get nudged to unlock the course while still on trial; self-hides once the caller resolves the learner as enrolled (or during skeleton, before that status is known)", storyId: "starci-blocks-commerce-trialenrollnudge-trialenrollnudge--visible" },
    "FoundationSearchBar": { tier: "block", role: "see the live match count and search resources by name with autocomplete suggestions", storyId: "starci-blocks-learn-foundationsearchbar-foundationsearchbar--default" },
    "FoundationResourceList": { tier: "block", role: "browse the resource rows, open one, and page through when there's more than one page", storyId: "starci-blocks-learn-foundationresourcelist-foundationresourcelist--default" },
}

/** LEAF — the screen's one shape: header, trial nudge, search row, resource list. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="FoundationsCategoryPage"
                tier="screen"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "trial nudge visible, resources populated, more than one page",
                        why: "The everyday shape: a trial learner sees the unlock nudge above a live match count, an empty search field, and a full page of resources with a pager underneath. Every function of the screen is present, in the order the reader meets them.",
                        code: `<FoundationsCategoryPage
    title="Docker"
    isTrialNudgeVisible
    resources={resources}
    currentPage={1}
    totalPages={3}
    …
/>`,
                        render: (
                            <FoundationsCategoryPage
                                {...BASE}
                                showAnatomy
                                isTrialNudgeVisible
                                resultCount={24}
                                resources={RESOURCES}
                                isResourcesLoading={false}
                                currentPage={1}
                                totalPages={3}
                            />
                        ),
                    },
                    {
                        name: "trial nudge hidden (enrolled learner), one page only",
                        why: "An enrolled learner never sees the trial nudge — the block hides itself, and the two remaining regions close the gap the seam left behind. One page of resources is not enough to page through, so the pager does not draw.",
                        code: `<FoundationsCategoryPage
    title="Docker"
    isTrialNudgeVisible={false}
    resources={resources}
    currentPage={1}
    totalPages={1}
    …
/>`,
                        render: (
                            <FoundationsCategoryPage
                                {...BASE}
                                isTrialNudgeVisible={false}
                                resultCount={4}
                                resources={RESOURCES}
                                isResourcesLoading={false}
                                currentPage={1}
                                totalPages={1}
                            />
                        ),
                    },
                    {
                        name: "search matched nothing",
                        why: "The reader typed a query that matched no resource — the count reads a real zero, autocomplete has no suggestion to offer, and the list swaps its rows for its own empty-with-search-hint message naming the query back. Nothing about the surrounding screen has to react to this; it is entirely `FoundationResourceList`'s own state.",
                        code: `<FoundationsCategoryPage
    title="Docker"
    isTrialNudgeVisible={false}
    searchQuery="cobol"
    resources={[]}
    resultCount={0}
    …
/>`,
                        render: (
                            <FoundationsCategoryPage
                                {...BASE}
                                isTrialNudgeVisible={false}
                                searchQuery="cobol"
                                resultCount={0}
                                resources={[]}
                                isResourcesLoading={false}
                                currentPage={1}
                                totalPages={1}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; every block that can mirror itself does, and the trial nudge is forced hidden until its status is known. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="FoundationsCategoryPage"
                tier="screen"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every block that can mirror itself does while the category's first fetch is in flight. The trial nudge has no loading shape of its own (see the screen's file header), so the screen forces it hidden rather than risk a flash of a nudge whose enrolled/trial status is not resolved yet.",
                        code: "<FoundationsCategoryPage {...props} isSkeleton />",
                        render: (
                            <FoundationsCategoryPage
                                {...BASE}
                                showAnatomy
                                isSkeleton
                                isTrialNudgeVisible={false}
                                resources={[]}
                                isResourcesLoading={false}
                                currentPage={1}
                                totalPages={1}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
