import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    AcademyManagementDashboard,
    type AcademyKpis,
    type AcademyManagementDashboardLabels,
    type AcademyPostView,
} from "@sb-components/nivoexpert/pages/AcademyManagementDashboard/AcademyManagementDashboard"
import type { DashboardMetrics, ExpertDashboardOverviewLabels, FunnelCourseView } from "@sb-components/nivoexpert/blocks/dashboard/ExpertDashboardOverview/ExpertDashboardOverview"
import type { MemberRowView, MembersManagerLabels } from "@sb-components/nivoexpert/blocks/members/MembersManager/MembersManager"
import type { CourseHeaderView, CourseLessonView, CourseViewLabels } from "@sb-components/nivoexpert/blocks/classroom/CourseView/CourseView"
import type { PostCardLabels } from "@sb-components/nivoexpert/blocks/community/PostCard/PostCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `AcademyManagementDashboard` — the console PAGE an expert runs their academy
 * from: a persistent KPI strip above an Overview / Members / Courses / Community
 * tab switch, each panel an existing block. A page's story is one complete STATE
 * per story — one per active tab, plus the one empty branch this page owns
 * directly (Community with no posts) and the whole-page loading skeleton — not a
 * leaf-per-prop map. Grounded in the real `dashboardStats`, `completionFunnel`,
 * `MemberEntity`, `CourseEntity` / `LessonEntity` / `LessonProgressEntity`, and
 * `PostEntity` / `ReactionEntity`.
 */
const meta: Meta<typeof AcademyManagementDashboard> = {
    title: "NivoExpert/Pages/AcademyManagementDashboard/AcademyManagementDashboard",
    component: AcademyManagementDashboard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AcademyManagementDashboard>

const NOOP = () => {}

const LABELS: AcademyManagementDashboardLabels = {
    title: "Academy management",
    subtitle: "Members, courses, and community in one place.",
    tabsAriaLabel: "Academy sections",
    tabLabels: { overview: "Overview", members: "Members", courses: "Courses", community: "Community" },
    communityEmptyTitle: "No posts yet",
    communityEmptyDescription: "Be the first to post — share a win, ask a question, or start a discussion.",
}

const KPIS: AcademyKpis = {
    members: { value: "1,204", label: "Members", hint: "38 active this week" },
    paidOrders: { value: "312", label: "Paid orders", hint: "9 this week" },
    revenue: { value: "468,000,000 VND", label: "Revenue", hint: "312 paid orders" },
    completion: { value: "42%", label: "Completion", hint: "Across every course" },
}

const OVERVIEW_LABELS: ExpertDashboardOverviewLabels = {
    funnelTitle: "Completion funnel",
    learnersSuffix: "learners",
    stageLabels: { learners: "Learners", started: "Started", completed: "Completed" },
    emptyTitle: "No courses to funnel yet",
    emptyDescription: "Publish a course and enrol your first learners — the funnel fills in as they progress.",
}

const OVERVIEW_METRICS: DashboardMetrics = {
    members: { value: "1,204", label: "Members", hint: "38 active this week" },
    paidOrders: { value: "312", label: "Paid orders", hint: "9 this week" },
    revenue: { value: "468,000,000 VND", label: "Revenue", hint: "312 paid orders" },
}

const OVERVIEW_FUNNEL: Array<FunnelCourseView> = [
    { slug: "ship-your-first-ai-agent", title: "Ship Your First AI Agent", learners: 420, started: 318, completed: 176 },
    { slug: "rag-in-a-weekend", title: "RAG in a Weekend", learners: 260, started: 141, completed: 54 },
]

const MEMBERS_LABELS: MembersManagerLabels = {
    title: "Members",
    addLabel: "Add member",
    memberColumn: "Member",
    progressColumn: "Progress",
    statusColumn: "Status",
    roleColumn: "Role",
    actionsColumn: "Actions",
    roleLabels: { member: "Member", moderator: "Moderator", admin: "Admin" },
    statusLabels: { active: "Active", banned: "Banned" },
    notEnrolledLabel: "Not enrolled",
    grantLabel: "Grant access",
    tableAriaLabel: "Community members",
    tabsAriaLabel: "Filter members",
    tabAllLabel: "All",
    tabLearningLabel: "Learning",
    tabCompletedLabel: "Completed",
    tabBannedLabel: "Banned",
    emptyTitle: "No members yet",
    emptyDescription: "Members appear here when people join your community or you add them by email.",
}

const MEMBERS: Array<MemberRowView> = [
    { id: "m-1", name: "Mai Trang", email: "mai@nivo.vn", role: "admin", status: "active", courseProgress: { courseName: "Advanced React", percent: 100 } },
    { id: "m-2", name: "Hoang Nam", email: "nam@nivo.vn", role: "moderator", status: "active", courseProgress: { courseName: "System Design", percent: 62 } },
    { id: "m-3", name: "Le Vy", email: "vy@nivo.vn", role: "member", status: "banned", courseProgress: { courseName: "DevOps Foundations", percent: 28 } },
]

const COURSE_LABELS: CourseViewLabels = {
    progressLabel: "Course progress",
    lessonsCompleteSuffix: "lessons complete",
    lessonPrefix: "Lesson",
    videoLabel: "Video",
    statusLabels: { completed: "Completed", "in-progress": "In progress", "not-started": "Not started" },
    emptyTitle: "No lessons yet",
    emptyDescription: "This course has no lessons — add the first one from the dashboard.",
}

const COURSE: CourseHeaderView = {
    title: "Ship Your First AI Agent",
    summary: "Build, deploy, and monetise a working agent in four evenings.",
    priceText: "1,500,000 VND",
}

const LESSONS: Array<CourseLessonView> = [
    { id: "lesson-1", title: "What an agent actually is", hasVideo: true, status: "completed" },
    { id: "lesson-2", title: "Wiring the tool loop", hasVideo: true, status: "in-progress" },
    { id: "lesson-3", title: "Giving it memory", hasVideo: false, status: "not-started" },
    { id: "lesson-4", title: "Shipping to production", hasVideo: true, status: "not-started" },
]

const POST_LABELS: PostCardLabels = {
    pinnedLabel: "Pinned",
    likeAriaLabel: "Like this post",
    commentsSuffix: "comments",
    moreCommentsSuffix: "more",
}

const POSTS: Array<AcademyPostView> = [
    {
        hasLiked: true,
        post: {
            id: "post-1",
            authorName: "Mai Trang",
            title: "How I priced my first cohort",
            body: "I anchored the cohort near my monthly 1:1 rate and opened an early-bird tier for the first run.",
            pinned: true,
            reactionCount: 13,
            commentCount: 5,
            comments: [
                { id: "c-1", authorName: "Hoang Nam", body: "This is gold — did you cap the early-bird count?" },
                { id: "c-2", authorName: "Le Vy", body: "Following. My cohort launches next month." },
            ],
        },
    },
    {
        hasLiked: false,
        post: {
            id: "post-2",
            authorName: "Hoang Nam",
            title: "Weekly build log — the tool loop finally clicked",
            body: "Spent the week wiring the agent's tool loop. Sharing the exact webhook wiring that made it work.",
            pinned: false,
            reactionCount: 4,
            commentCount: 0,
            comments: [],
        },
    },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    MetricCard: { tier: "composite", role: "the persistent KPI strip — members, paid orders, revenue, completion" },
    Toolbar: { tier: "composite", role: "the Overview/Members/Courses/Community panel switch" },
    ExpertDashboardOverview: {
        tier: "block",
        role: "the Overview panel",
        storyId: "nivoexpert-blocks-dashboard-expertdashboardoverview-expertdashboardoverview--default",
    },
    MembersManager: {
        tier: "block",
        role: "the Members panel",
        storyId: "nivoexpert-blocks-members-membersmanager-membersmanager--default",
    },
    CourseView: {
        tier: "block",
        role: "the Courses panel",
        storyId: "nivoexpert-blocks-classroom-courseview-courseview--default",
    },
    PostCard: {
        tier: "block",
        role: "one post per Community panel entry, pinned first",
        storyId: "nivoexpert-blocks-community-postcard-postcard--default",
    },
    EmptyState: { tier: "composite", role: "shown when the Community panel has no posts" },
}

const REASON =
    "A page composes blocks/composites/frames, never another page (`page.md` PAGE-3) — the Community panel therefore composes the `PostCard` block directly, the same way `CommunityFeed` itself does one tier down, rather than importing that page. The KPI strip is the one part of the header that IS data, so it shimmers under `isSkeleton`; the tab row's labels are static configuration, so the row never shimmers."

/** STATE — the Overview panel active: the KPI strip above the `ExpertDashboardOverview` block. */
export const Overview: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AcademyManagementDashboard"
                tier="screen"
                leaf="Overview"
                annotate={ANNOTATE}
                reason={REASON}
                states={[
                    {
                        name: "activeTab = overview",
                        why: "The default landing panel: the academy's headline metrics and per-course completion funnel, composed verbatim from the `ExpertDashboardOverview` block.",
                        code: "<AcademyManagementDashboard activeTab=\"overview\" kpis={kpis} … />",
                        render: (
                            <AcademyManagementDashboard
                                activeTab="overview"
                                onTabChange={NOOP}
                                kpis={KPIS}
                                overviewMetrics={OVERVIEW_METRICS}
                                overviewFunnel={OVERVIEW_FUNNEL}
                                overviewLabels={OVERVIEW_LABELS}
                                members={MEMBERS}
                                onAddMember={NOOP}
                                onViewMember={NOOP}
                                onGrantMemberAccess={NOOP}
                                membersLabels={MEMBERS_LABELS}
                                course={COURSE}
                                lessons={LESSONS}
                                courseLabels={COURSE_LABELS}
                                posts={POSTS}
                                onToggleLikePost={NOOP}
                                postLabels={POST_LABELS}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the Members panel active: the roster table from `MembersManager`. */
export const Members: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AcademyManagementDashboard"
                tier="screen"
                leaf="Members"
                annotate={ANNOTATE}
                reason={REASON}
                states={[
                    {
                        name: "activeTab = members",
                        why: "The expert reviewing and managing the community roster — role, status, grant-access — composed verbatim from the `MembersManager` block, with the KPI strip still pinned above it.",
                        code: "<AcademyManagementDashboard activeTab=\"members\" … />",
                        render: (
                            <AcademyManagementDashboard
                                activeTab="members"
                                onTabChange={NOOP}
                                kpis={KPIS}
                                overviewMetrics={OVERVIEW_METRICS}
                                overviewFunnel={OVERVIEW_FUNNEL}
                                overviewLabels={OVERVIEW_LABELS}
                                members={MEMBERS}
                                onAddMember={NOOP}
                                onViewMember={NOOP}
                                onGrantMemberAccess={NOOP}
                                membersLabels={MEMBERS_LABELS}
                                course={COURSE}
                                lessons={LESSONS}
                                courseLabels={COURSE_LABELS}
                                posts={POSTS}
                                onToggleLikePost={NOOP}
                                postLabels={POST_LABELS}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the Courses panel active: one course opened in `CourseView`. */
export const Courses: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AcademyManagementDashboard"
                tier="screen"
                leaf="Courses"
                annotate={ANNOTATE}
                reason={REASON}
                states={[
                    {
                        name: "activeTab = courses",
                        why: "The expert checking a course's lesson-by-lesson progress, composed verbatim from the `CourseView` block.",
                        code: "<AcademyManagementDashboard activeTab=\"courses\" … />",
                        render: (
                            <AcademyManagementDashboard
                                activeTab="courses"
                                onTabChange={NOOP}
                                kpis={KPIS}
                                overviewMetrics={OVERVIEW_METRICS}
                                overviewFunnel={OVERVIEW_FUNNEL}
                                overviewLabels={OVERVIEW_LABELS}
                                members={MEMBERS}
                                onAddMember={NOOP}
                                onViewMember={NOOP}
                                onGrantMemberAccess={NOOP}
                                membersLabels={MEMBERS_LABELS}
                                course={COURSE}
                                lessons={LESSONS}
                                courseLabels={COURSE_LABELS}
                                posts={POSTS}
                                onToggleLikePost={NOOP}
                                postLabels={POST_LABELS}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the Community panel active, with posts: the page composes `PostCard` directly. */
export const Community: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AcademyManagementDashboard"
                tier="screen"
                leaf="Community"
                annotate={ANNOTATE}
                reason={REASON}
                states={[
                    {
                        name: "activeTab = community, posts present",
                        why: "The pinned post first, then the newest — each rendered as the `PostCard` block, one liked and one not. This is the one panel this page draws itself (a heading-less post list), rather than delegating whole to another block.",
                        code: "<AcademyManagementDashboard activeTab=\"community\" posts={posts} … />",
                        render: (
                            <AcademyManagementDashboard
                                activeTab="community"
                                onTabChange={NOOP}
                                kpis={KPIS}
                                overviewMetrics={OVERVIEW_METRICS}
                                overviewFunnel={OVERVIEW_FUNNEL}
                                overviewLabels={OVERVIEW_LABELS}
                                members={MEMBERS}
                                onAddMember={NOOP}
                                onViewMember={NOOP}
                                onGrantMemberAccess={NOOP}
                                membersLabels={MEMBERS_LABELS}
                                course={COURSE}
                                lessons={LESSONS}
                                courseLabels={COURSE_LABELS}
                                posts={POSTS}
                                onToggleLikePost={NOOP}
                                postLabels={POST_LABELS}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the Community panel active, with no posts: the ONE empty branch this page owns directly. */
export const CommunityEmpty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AcademyManagementDashboard"
                tier="screen"
                leaf="Community — empty"
                annotate={ANNOTATE}
                reason="Unlike the Members/Courses panels — where an empty roster or an empty lesson list is handled INSIDE the composed block — the Community panel's post list is built directly in this page (see file header), so its empty branch is this page's own, not a child block's."
                states={[
                    {
                        name: "activeTab = community, posts = []",
                        why: "A brand-new academy with no posts yet: the panel renders this page's own empty state instead of reaching for `PostCard` at all.",
                        code: "<AcademyManagementDashboard activeTab=\"community\" posts={[]} … />",
                        render: (
                            <AcademyManagementDashboard
                                activeTab="community"
                                onTabChange={NOOP}
                                kpis={KPIS}
                                overviewMetrics={OVERVIEW_METRICS}
                                overviewFunnel={OVERVIEW_FUNNEL}
                                overviewLabels={OVERVIEW_LABELS}
                                members={MEMBERS}
                                onAddMember={NOOP}
                                onViewMember={NOOP}
                                onGrantMemberAccess={NOOP}
                                membersLabels={MEMBERS_LABELS}
                                course={COURSE}
                                lessons={LESSONS}
                                courseLabels={COURSE_LABELS}
                                posts={[]}
                                onToggleLikePost={NOOP}
                                postLabels={POST_LABELS}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the page's own first fetch is in flight: the KPI strip shimmers above the active (Overview) panel's own skeleton mirror. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AcademyManagementDashboard"
                tier="screen"
                leaf="Loading"
                annotate={ANNOTATE}
                reason="The KPI tiles ARE data (`dashboardStats` + the academy-wide completion rate), so they shimmer under `isSkeleton`. The tab row's labels are static configuration, not data, so it stays fully interactive — the same distinction `ExpertDashboardOverview` already draws between its (static) funnel title and its (data) funnel bars. The active panel's own block draws its own skeleton mirror, unchanged."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "First load: every KPI tile shimmers and the Overview panel's `ExpertDashboardOverview` draws its own skeleton mirror, so nothing jumps once the data resolves.",
                        code: "<AcademyManagementDashboard isSkeleton … />",
                        render: (
                            <AcademyManagementDashboard
                                activeTab="overview"
                                onTabChange={NOOP}
                                kpis={KPIS}
                                overviewMetrics={OVERVIEW_METRICS}
                                overviewFunnel={OVERVIEW_FUNNEL}
                                overviewLabels={OVERVIEW_LABELS}
                                members={MEMBERS}
                                onAddMember={NOOP}
                                onViewMember={NOOP}
                                onGrantMemberAccess={NOOP}
                                membersLabels={MEMBERS_LABELS}
                                course={COURSE}
                                lessons={LESSONS}
                                courseLabels={COURSE_LABELS}
                                posts={POSTS}
                                onToggleLikePost={NOOP}
                                postLabels={POST_LABELS}
                                isSkeleton
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
