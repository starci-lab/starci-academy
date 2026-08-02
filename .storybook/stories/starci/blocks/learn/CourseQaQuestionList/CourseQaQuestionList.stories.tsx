import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    CourseQaQuestionList,
    type CourseQaQuestionItem,
} from "@sb-components/starci/blocks/learn/CourseQaQuestionList/CourseQaQuestionList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `CourseQaQuestionList` — the course-wide Q&A roll-up region: the async
 * lifecycle (loading → error → search-empty → content) around a flush divide-y
 * question list plus a pager. The Content leaf renders `QuestionPreviewRow`, a
 * marked collapsed-look stand-in with real data, until the real per-question
 * thread block lands. Four leaves: `Loading`, `Error`, `Empty` (filter matched
 * nothing; true zero-ever is `CourseQaInvite` a layer up), `Content`.
 */
const meta: Meta<typeof CourseQaQuestionList> = {
    title: "StarCi/Blocks/Learn/CourseQaQuestionList/CourseQaQuestionList",
    component: CourseQaQuestionList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CourseQaQuestionList>

const QUESTIONS: Array<CourseQaQuestionItem> = [
    {
        id: "q1",
        author: { id: "u1", displayName: "Minh Anh", avatarUrl: "https://i.pravatar.cc/64?img=5" },
        createdTimeAgo: "2 hours ago",
        isPinned: true,
        preview: "I can't get the healthcheck configured right for my Postgres container, could someone take a look at my compose file? The container keeps getting marked unhealthy even though the logs show no errors.",
        scope: { kind: "lesson", lessonTitle: "Advanced Docker Compose" },
        replyCount: 3,
        answeredByFounder: true,
    },
    {
        id: "q2",
        author: { id: "u2", displayName: "Quoc Bao" },
        createdTimeAgo: "5 hours ago",
        isFounderAuthor: false,
        preview: "Does the course cover multi-stage builds for shrinking image size? I haven't found it in the table of contents yet.",
        scope: { kind: "general" },
        replyCount: 0,
    },
    {
        id: "q3",
        author: { id: "self", displayName: "You", avatarUrl: "https://i.pravatar.cc/64?img=12" },
        createdTimeAgo: "1 day ago",
        preview: "After pushing an image to my own registry, pulling it back gives a permission denied error. I've already logged in to docker but it still happens.",
        scope: { kind: "lesson", lessonTitle: "Pushing an Image to the Registry" },
        replyCount: 1,
        answeredByFounder: false,
    },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCardList": { tier: "composite", role: "the bounded flush divide-y card — this block hands it BOTH the skeleton rows and the real rows via the free-form `content` slot, never its own `isSkeleton` mirror", storyId: "composites-cards-surfacecard-surfacecardlist--free-form" },
    "Avatar": { tier: "atom", role: "the asker's avatar, or its own shimmer while loading", storyId: "atoms-display-avatar-avatar--default" },
    "Chip": { tier: "atom", role: "the scope/status pills, or their own shimmer while loading", storyId: "atoms-chips-chip-chip--tones" },
    "Typography": { tier: "atom", role: "the asker/time line and the preview text, or their own shimmer while loading", storyId: "atoms-text-typography-typography--plain" },
    "StackH": { tier: "frame", role: "the row's own horizontal layout (avatar · text column · status dot)", storyId: "frames-stack-stackh--default" },
    "StackV": { tier: "frame", role: "the row's own text column, and the content branch's list-above-pager stack", storyId: "frames-stack-stackv--default" },
    "Cluster": { tier: "frame", role: "the row's chip-pill peers", storyId: "frames-cluster-cluster--default" },
    "Pagination": { tier: "atom", role: "the page nav — only reachable once the content branch is showing", storyId: "atoms-navigation-pagination-pagination--default" },
    "AsyncContentEmpty": { tier: "composite", role: "the search-empty message", storyId: "composites-async-asynccontent-asynccontentempty--with-description" },
    "AsyncContentError": { tier: "composite", role: "the failed-fetch message, with retry", storyId: "composites-async-asynccontent-asynccontenterror--with-retry" },
}

/** LEAF — the list's own fetch is in flight; the region swaps for a fixed-count row mirror. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CourseQaQuestionList"
                tier="block"
                leaf="Prop `isLoading`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isLoading = true",
                        why: "Four placeholder rows — avatar, asker+time line, a two-line preview, a chip-pill row, and a status dot — ported verbatim from the real `CourseQaSkeleton.tsx` shape. There is no pager: the content branch that carries it is not the one rendering.",
                        code: `<CourseQaQuestionList
    questions={[]}
    isLoading
    page={1}
    totalPages={1}
    onPageChange={setPage}
    currentUserId={null}
    currentUser={null}
    pagerAriaLabel="Question page navigation"
/>`,
                        render: (
                            <CourseQaQuestionList

                               
                                questions={[]}
                                isLoading
                                page={1}
                                totalPages={1}
                                onPageChange={() => {}}
                                currentUserId={null}
                                currentUser={null}
                                pagerAriaLabel="Question page navigation"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the fetch failed; outranks even a stale loading flag. */
export const ErrorLeaf: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CourseQaQuestionList"
                tier="block"
                leaf="Prop `error`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "error set, onRetry provided",
                        why: "The block owns its own error wording and retry label (§14d.1) — the caller only hands over the raw error and the retry behaviour.",
                        code: `<CourseQaQuestionList
    questions={[]}
    isLoading={false}
    error={fetchError}
    onRetry={refetch}
    page={1}
    totalPages={1}
    onPageChange={setPage}
    currentUserId={null}
    currentUser={null}
    pagerAriaLabel="Question page navigation"
/>`,
                        render: (
                            <CourseQaQuestionList

                               
                                questions={[]}
                                isLoading={false}
                                error={new globalThis.Error("network")}
                                onRetry={() => {}}
                                page={1}
                                totalPages={1}
                                onPageChange={() => {}}
                                currentUserId={null}
                                currentUser={null}
                                pagerAriaLabel="Question page navigation"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — loading finished, no error, but the current filter/search matched nothing. */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CourseQaQuestionList"
                tier="block"
                leaf="Empty"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                reason="This is a FILTER/SEARCH state the caller decided to apply, not the board's true zero-questions-ever state — that invitation lives one layer up in the existing `CourseQaInvite` block."
                states={[
                    {
                        name: "questions = []",
                        why: "The current filter/search returned nothing — the message says so and suggests trying a different one, never a hollow blank list.",
                        code: `<CourseQaQuestionList
    questions={[]}
    isLoading={false}
    page={1}
    totalPages={1}
    onPageChange={setPage}
    currentUserId={null}
    currentUser={null}
    pagerAriaLabel="Question page navigation"
/>`,
                        render: (
                            <CourseQaQuestionList

                               
                                questions={[]}
                                isLoading={false}
                                page={1}
                                totalPages={1}
                                onPageChange={() => {}}
                                currentUserId={null}
                                currentUser={null}
                                pagerAriaLabel="Question page navigation"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a populated, paged page of questions. */
export const Content: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CourseQaQuestionList"
                tier="block"
                leaf="Content"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "questions.length = 3, totalPages = 1 (pager hidden)",
                        why: "A single page of results hides the pager entirely — it only earns its place once there is more than one page to move between.",
                        code: `<CourseQaQuestionList
    questions={questions}
    isLoading={false}
    page={1}
    totalPages={1}
    onPageChange={setPage}
    currentUserId="self"
    currentUser={{ username: "you" }}
    pagerAriaLabel="Question page navigation"
/>`,
                        render: (
                            <CourseQaQuestionList

                               
                                questions={QUESTIONS}
                                isLoading={false}
                                page={1}
                                totalPages={1}
                                onPageChange={() => {}}
                                currentUserId="self"
                                currentUser={{ username: "you" }}
                                pagerAriaLabel="Question page navigation"
                            />
                        ),
                    },
                    {
                        name: "totalPages = 4 (pager shown)",
                        why: "More than one page of results, so the pager rides below the list — the third question is the viewer's OWN, and reads \"You\" instead of their real name.",
                        code: `<CourseQaQuestionList
    questions={questions}
    isLoading={false}
    page={2}
    totalPages={4}
    onPageChange={setPage}
    currentUserId="self"
    currentUser={{ username: "you" }}
    pagerAriaLabel="Question page navigation"
/>`,
                        render: (
                            <CourseQaQuestionList
                                questions={QUESTIONS}
                                isLoading={false}
                                page={2}
                                totalPages={4}
                                onPageChange={() => {}}
                                currentUserId="self"
                                currentUser={{ username: "you" }}
                                pagerAriaLabel="Question page navigation"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
