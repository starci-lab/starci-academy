import { ChatsCircleIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { MetricCard } from "@sb-components/composites/stats/MetricCard/MetricCard"
import { Toolbar, type ToolbarTabGroup } from "@sb-components/composites/navigation/Toolbar/Toolbar"
import type { ComponentTypeWithSkeleton, SkeletonProps } from "@sb-components/frames/_slot"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackV } from "@sb-components/frames/Stack/Stack"
import {
    ExpertDashboardOverview,
    type DashboardMetrics,
    type ExpertDashboardOverviewLabels,
    type FunnelCourseView,
    type MetricView,
} from "@sb-components/nivoexpert/blocks/dashboard/ExpertDashboardOverview/ExpertDashboardOverview"
import {
    MembersManager,
    type MemberRowView,
    type MembersManagerLabels,
} from "@sb-components/nivoexpert/blocks/members/MembersManager/MembersManager"
import {
    CourseView,
    type CourseHeaderView,
    type CourseLessonView,
    type CourseViewLabels,
} from "@sb-components/nivoexpert/blocks/classroom/CourseView/CourseView"
import {
    PostCard,
    type PostCardLabels,
    type PostView,
} from "@sb-components/nivoexpert/blocks/community/PostCard/PostCard"

/**
 * `AcademyManagementDashboard` -- the console PAGE an expert runs their academy
 * from: a persistent KPI strip above an Overview / Members / Courses / Community
 * tab switch, each panel an existing block. A page's story is one complete STATE
 * per story -- one per active tab, plus the one empty branch this page owns
 * directly (Community with no posts) and the whole-page loading skeleton -- not a
 * leaf-per-prop map. Grounded in the real `dashboardStats`, `completionFunnel`,
 * `MemberEntity`, `CourseEntity` / `LessonEntity` / `LessonProgressEntity`, and
 * `PostEntity` / `ReactionEntity`.
 */

/** Which panel is showing right now. */
export type AcademyTab = "overview" | "members" | "courses" | "community"

/** The persistent KPI strip -- members / paid orders / revenue / completion, always visible regardless of the active tab. */
export interface AcademyKpis {
    /** Total + active members (`dashboardStats.totalMembers` / `activeMembers`). */
    members: MetricView
    /** Paid orders (`dashboardStats.paidOrders`). */
    paidOrders: MetricView
    /** Revenue, formatted in VND (`dashboardStats.revenueVnd`). */
    revenue: MetricView
    /** Academy-wide completion rate -- every course's `completionFunnel` aggregated (total `completed` / total `learners`), NOT a single course's funnel. */
    completion: MetricView
}

/** One community feed entry for the Community panel -- a subset mirroring `CommunityFeed`'s own `FeedPostView`, kept local so this page imports the `PostCard` BLOCK rather than the `CommunityFeed` PAGE. */
export interface AcademyPostView {
    /** The post. */
    post: PostView
    /** `true` when the viewing member has a reaction row for this post (derived from `ReactionEntity`). */
    hasLiked: boolean
}

/** Props for {@link AcademyManagementDashboard}. */
export interface AcademyManagementDashboardProps {
    /** Which panel is showing. */
    activeTab: AcademyTab
    /** Fired with the tab the reader picked. */
    onTabChange: (tab: AcademyTab) => void
    /** The persistent KPI strip. */
    kpis: AcademyKpis
    /** Forwarded to the Overview panel's {@link ExpertDashboardOverview}. */
    overviewMetrics: DashboardMetrics
    /** Forwarded to the Overview panel's {@link ExpertDashboardOverview}. Empty is that block's own empty branch. */
    overviewFunnel: Array<FunnelCourseView>
    /** Already-localized copy forwarded to {@link ExpertDashboardOverview}. */
    overviewLabels: ExpertDashboardOverviewLabels
    /** Forwarded to the Members panel's {@link MembersManager}. Empty is that block's own empty branch. */
    members: Array<MemberRowView>
    /** Forwarded to {@link MembersManager} -- the connected layer runs `createMember`. */
    onAddMember: () => void
    /** Forwarded to {@link MembersManager} -- a row press; the connected layer opens `MemberDetailDrawer` for this member id (role changes and bans live behind that drawer, not this page). */
    onViewMember: (id: string) => void
    /** Forwarded to {@link MembersManager} -- the connected layer runs `grantCourseAccess`. */
    onGrantMemberAccess: (id: string) => void
    /** Forwarded to {@link MembersManager} -- id of the member whose controls are in flight. */
    membersBusyId?: string | null
    /** Already-localized copy forwarded to {@link MembersManager}. */
    membersLabels: MembersManagerLabels
    /** Forwarded to the Courses panel's {@link CourseView}. */
    course: CourseHeaderView
    /** Forwarded to {@link CourseView}. Empty is that block's own no-lessons branch. */
    lessons: Array<CourseLessonView>
    /** Already-localized copy forwarded to {@link CourseView}. */
    courseLabels: CourseViewLabels
    /** The Community panel's feed, pinned-first. Empty is THIS page's own empty branch (see file header). */
    posts: Array<AcademyPostView>
    /** Toggle a post's like -- the connected layer runs `reactPost(postId)`. */
    onToggleLikePost: (postId: string) => void
    /** Already-localized copy forwarded to each {@link PostCard}. */
    postLabels: PostCardLabels
    /** `true` -> the page's own first fetch is in flight: the KPI tiles shimmer and the active panel's block draws its own skeleton mirror. The tab row itself never shimmers -- its labels are static configuration, not data. */
    isSkeleton?: boolean
    /** Already-localized copy for the page's own chrome. */
    labels: AcademyManagementDashboardLabels
}

/** The already-resolved copy the page renders directly (not forwarded to a composed block). */
export interface AcademyManagementDashboardLabels {
    /** Page title (e.g. "Academy management"). */
    title: string
    /** Page subtitle under the title. */
    subtitle: string
    /** Accessible name for the tab row. */
    tabsAriaLabel: string
    /** The four tab labels, keyed by tab. */
    tabLabels: Record<AcademyTab, string>
    /** Empty-state title when the Community panel has no posts yet. */
    communityEmptyTitle: string
    /** Empty-state supporting line for the Community panel. */
    communityEmptyDescription: string
}

/** Tabs, in display + reading order. */
const TAB_ORDER: ReadonlyArray<AcademyTab> = ["overview", "members", "courses", "community"]

/** How many placeholder post cards the Community panel's skeleton draws -- mirrors `CommunityFeed`'s own count. */
const SKELETON_POST_COUNT = 3

/** A placeholder post sized like a real one, so the skeleton card mirrors the loaded shape. */
const SKELETON_POST: PostView = {
    id: "skeleton-post",
    authorName: "Member name",
    title: "A community post title goes here",
    body: "A couple of lines of the post body stand in for the real content while the feed loads.",
    pinned: false,
    reactionCount: 0,
    commentCount: 0,
    comments: [],
}

/**
 * The academy management console. See the file header for why the Community
 * panel composes `PostCard` rather than `CommunityFeed`, and why `Toolbar`
 * (not the bare `Tabs` atom) drives the panel switch.
 *
 * @param props - {@link AcademyManagementDashboardProps}
 */
const AcademyManagementDashboard = ({
    activeTab,
    onTabChange,
    kpis,
    overviewMetrics,
    overviewFunnel,
    overviewLabels,
    members,
    onAddMember,
    onViewMember,
    onGrantMemberAccess,
    membersBusyId,
    membersLabels,
    course,
    lessons,
    courseLabels,
    posts,
    onToggleLikePost,
    postLabels,
    isSkeleton = false,
    labels,
}: AcademyManagementDashboardProps) => {
    /** The four headline tiles, in a reflowing grid -- the one part of the header that IS data. */
    const KpiGrid = () => (
        <Grid
            columns={{ base: 1, sm: 2, lg: 4 }}
            gap={4}
            items={[
                {
                    key: "members",
                    content: () =>
                        isSkeleton ? (
                            <MetricCard isSkeleton />
                        ) : (
                            <MetricCard value={kpis.members.value} label={kpis.members.label} hint={kpis.members.hint} />
                        ),
                },
                {
                    key: "paidOrders",
                    content: () =>
                        isSkeleton ? (
                            <MetricCard isSkeleton />
                        ) : (
                            <MetricCard value={kpis.paidOrders.value} label={kpis.paidOrders.label} hint={kpis.paidOrders.hint} />
                        ),
                },
                {
                    key: "revenue",
                    content: () =>
                        isSkeleton ? (
                            <MetricCard isSkeleton />
                        ) : (
                            <MetricCard value={kpis.revenue.value} label={kpis.revenue.label} hint={kpis.revenue.hint} />
                        ),
                },
                {
                    key: "completion",
                    content: () =>
                        isSkeleton ? (
                            <MetricCard isSkeleton />
                        ) : (
                            <MetricCard value={kpis.completion.value} label={kpis.completion.label} hint={kpis.completion.hint} />
                        ),
                },
            ]}
        />
    )

    /** The Overview panel -- the existing `ExpertDashboardOverview` block, verbatim. */
    const OverviewPanel = ({ isSkeleton: skeleton }: SkeletonProps) => (
        <ExpertDashboardOverview metrics={overviewMetrics} funnel={overviewFunnel} isSkeleton={skeleton} labels={overviewLabels} />
    )

    /** The Members panel -- the existing `MembersManager` block, verbatim. */
    const MembersPanel = ({ isSkeleton: skeleton }: SkeletonProps) => (
        <MembersManager
            members={members}
            onAddMember={onAddMember}
            onViewMember={onViewMember}
            onGrantAccess={onGrantMemberAccess}
            busyId={membersBusyId}
            isSkeleton={skeleton}
            labels={membersLabels}
        />
    )

    /** The Courses panel -- the existing `CourseView` block, verbatim. */
    const CoursesPanel = ({ isSkeleton: skeleton }: SkeletonProps) => (
        <CourseView course={course} lessons={lessons} isSkeleton={skeleton} labels={courseLabels} />
    )

    /**
     * The Community panel -- composes the `PostCard` BLOCK directly (see file
     * header for why `CommunityFeed` the page is not imported here). No card
     * wrapper of its own, same as `CommunityFeed`'s own bare `StackV` of posts.
     */
    const CommunityPanel = ({ isSkeleton: skeleton }: SkeletonProps) => {
        if (skeleton) {
            return (
                <StackV
                    gap={4}
                    isSkeleton
                    items={Array.from({ length: SKELETON_POST_COUNT }, () => () => (
                        <PostCard post={SKELETON_POST} hasLiked={false} onToggleLike={() => {}} isSkeleton labels={postLabels} />
                    ))}
                />
            )
        }
        if (posts.length === 0) {
            return <EmptyState icon={ChatsCircleIcon} title={labels.communityEmptyTitle} description={labels.communityEmptyDescription} />
        }
        return (
            <StackV
                gap={4}
                items={posts.map((entry) => () => (
                    <PostCard
                        post={entry.post}
                        hasLiked={entry.hasLiked}
                        onToggleLike={() => onToggleLikePost(entry.post.id)}
                        labels={postLabels}
                    />
                ))}
            />
        )
    }

    const PANEL: Record<AcademyTab, ComponentTypeWithSkeleton> = {
        overview: OverviewPanel,
        members: MembersPanel,
        courses: CoursesPanel,
        community: CommunityPanel,
    }
    const ActivePanel = PANEL[activeTab]

    // Tab labels are static configuration, not data, so this row never shimmers --
    // the same distinction `ExpertDashboardOverview` draws for its funnel title.
    const tabs: ToolbarTabGroup = {
        items: TAB_ORDER.map((tab) => ({ key: tab, label: labels.tabLabels[tab] })),
        selectedKey: activeTab,
        ariaLabel: labels.tabsAriaLabel,
        onSelectionChange: (key) => onTabChange(String(key) as AcademyTab),
    }

    return (
        <div data-tier="page" data-component="AcademyManagementDashboard" className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
            <StackV
                gap={1}
                items={[
                    () => <Typography size="h3" weight="semibold" text={labels.title} />,
                    () => <Typography size="sm" color="muted" text={labels.subtitle} />,
                ]}
            />
            <KpiGrid />
            <Toolbar leftTabs={tabs} variant="primary" />
            <ActivePanel isSkeleton={isSkeleton} />
        </div>
    )
}

export { AcademyManagementDashboard }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "page", name: "AcademyManagementDashboard" } as const
