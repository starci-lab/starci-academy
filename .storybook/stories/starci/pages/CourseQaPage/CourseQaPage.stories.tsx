import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseQaPage } from "@sb-components/starci/pages/CourseQaPage/CourseQaPage"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * SCREEN — `CourseQaPage`: the course-wide Q&A roll-up. A screen owns a LIST
 * OF FUNCTIONS and nothing else — it calls blocks, places them in frames, and
 * hands each one typed data.
 *
 * SIX FUNCTIONS, in the order the reader meets them: what this board is · the
 * "you're not learning alone" honest readout · ask a new question ·
 * filter/search the board · the questions themselves, paged.
 *
 * ⭐ THE SCREEN OWNS EXACTLY ONE BRANCH, THE SAME WAY `ContentPage` OWNS ITS
 * `!isLocked` BRANCH: `isInvitationEmpty`, ported verbatim from `src`'s own
 * boolean. A default `unanswered`-filtered zero does NOT mean "nobody has ever
 * asked anything" — only `all`/`engagement` with no search proves that TRUE
 * zero. The `Invitation` leaf below is what that looks like; every other empty
 * result is `CourseQaQuestionList`'s own narrower `Empty` leaf one layer down.
 */
const meta: Meta<typeof CourseQaPage> = {
    title: "StarCi/Pages/CourseQaPage/CourseQaPage",
    component: CourseQaPage,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CourseQaPage>

const BASE = {
    breadcrumbItems: [
        { key: "courses", label: "Courses" },
        { key: "course", label: "DevOps Mastery" },
        { key: "qa", label: "Q&A" },
    ],
    title: "Q&A",
    description: "Ask a question for the whole course, or answer someone else's.",
    enrollmentCount: 842,
    totalQuestions: 37,
    answeredQuestions: 24,
    filter: "unanswered" as const,
    onFilterChange: () => {},
    searchValue: "",
    onSearchChange: () => {},
    currentUser: { displayName: "Minh Anh", avatarUrl: undefined },
    currentUserId: "u-minh-anh",
    page: 1,
    totalPages: 2,
    onPageChange: () => {},
    onAskQuestion: () => {},
    onAnswered: () => {},
    onGoToContent: () => {},
}

const QUESTIONS = [
    {
        id: "q1",
        author: { id: "u-minh-anh", displayName: "Minh Anh" },
        createdTimeAgo: "2 hours ago",
        isPinned: true,
        preview: "I followed the multi-stage steps and the image is still 800MB — turns out I forgot COPY --from. Is there a way to catch this kind of mistake earlier?",
        scope: { kind: "lesson" as const, lessonTitle: "Writing an optimized Dockerfile" },
        replyCount: 0,
    },
    {
        id: "q2",
        author: { id: "u-hai", displayName: "Hai Dang" },
        createdTimeAgo: "1 day ago",
        isFounderAuthor: false,
        preview: "Does the course cover rootless containers, or does it stop at the regular Docker daemon?",
        scope: { kind: "general" as const },
        replyCount: 3,
        answeredByFounder: true,
    },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame that owns every seam on this screen — between the identity, the honest readout, the composer, the toolbar and the list", storyId: "frames-stack-stackv--default" },
    "CourseQaHeader": { tier: "block", role: "what this board is: trail, title, description", storyId: "starci-blocks-learn-courseqaheader-courseqaheader--header" },
    "CourseQaInvite": { tier: "block", role: "the whole-page invitation when the board has never had a single question", storyId: "starci-blocks-learn-courseqainvite-courseqainvite--default" },
    "CourseQaEngagementStrip": { tier: "block", role: "the honest readout — enrolled learners, and how many questions already have an answer", storyId: "starci-blocks-learn-courseqaengagementstrip-courseqaengagementstrip--default" },
    "CourseQaComposer": { tier: "block", role: "ask a new course-general question — a collapsible avatar pill that opens into a form", storyId: "starci-blocks-learn-courseqacomposer-courseqacomposer--collapsed-prompt" },
    "CourseQaToolbar": { tier: "block", role: "status/scope filter tabs, search, and a live match count", storyId: "starci-blocks-learn-courseqatoolbar-courseqatoolbar--default" },
    "CourseQaQuestionList": { tier: "block", role: "the questions themselves — async lifecycle, flush list, pager", storyId: "starci-blocks-learn-courseqaquestionlist-courseqaquestionlist--content" },
}

/** LEAF — `Populated`: the board already has questions; every function is on screen. */
export const Populated: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CourseQaPage"
                tier="screen"
                leaf="Populated"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "questions.length > 0",
                        why: "Every function of the screen is present, in the order the reader meets them: identity, the honest readout, the composer, the toolbar, then the paged list. The screen itself draws no shape at all — six blocks stacked by one frame.",
                        code: `<CourseQaPage
    title="Q&A"
    totalQuestions={37}
    answeredQuestions={24}
    filter="unanswered"
    questions={questions}
    …
/>`,
                        render: <CourseQaPage {...BASE} questions={QUESTIONS} />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — `Invitation`: the board has never had a single question ⇒ **loses every other function**, not just an empty list row. */
export const Invitation: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CourseQaPage"
                tier="screen"
                leaf="Invitation"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "filter = \"all\", questions = []",
                        why: "A true zero — no filter, no search, and still nothing — reads as an invitation, not a dead end. The honest readout, composer, toolbar and list all disappear in favour of one card with one way forward: go read the content. A filtered zero (the default `unanswered` view finding nothing) does NOT trigger this leaf — see the file header's ported `isInvitationEmpty` boolean.",
                        code: `<CourseQaPage
    {...props}
    filter="all"
    questions={[]}
/>`,
                        render: <CourseQaPage {...BASE} filter="all" questions={[]} />,
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the caller flips `isSkeleton`; every block mirrors itself and the invitation branch is skipped in favour of the populated shape. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CourseQaPage"
                tier="screen"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every composed block mirrors itself, and `isInvitationEmpty` is short-circuited to `false` (see file header) so a loading screen always shows the POPULATED shape — never the invitation card, which would be a false claim about a board nobody has measured yet.",
                        code: "<CourseQaPage {...props} isSkeleton questions={[]} />",
                        render: <CourseQaPage {...BASE} isSkeleton questions={[]} />,
                    },
                ]}
            />
        </div>
    ),
}
