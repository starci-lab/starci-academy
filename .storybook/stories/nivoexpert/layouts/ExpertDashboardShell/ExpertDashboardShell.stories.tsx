import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    BookOpenIcon,
    ChartBarIcon,
    ChartLineIcon,
    ChatCircleIcon,
    GaugeIcon,
    GearSixIcon,
    RobotIcon,
    TargetIcon,
    UsersIcon,
} from "@phosphor-icons/react"
import type { SkeletonProps } from "@sb-components/composites/_slot"
import {
    ExpertDashboardShell,
    type ExpertDashboardNavGroup,
} from "@sb-components/nivoexpert/layouts/ExpertDashboardShell/ExpertDashboardShell"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ExpertDashboardShell` — the layout every `apps/expert` dashboard route sits
 * in: a full-width top bar (search · account · notifications) above a
 * `RailShell` whose leading rail is the nine-destination nav (three clusters
 * — Operations / Business / Automation) and whose body is the routed page.
 */
const meta: Meta<typeof ExpertDashboardShell> = {
    title: "NivoExpert/Layouts/ExpertDashboardShell/ExpertDashboardShell",
    component: ExpertDashboardShell,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ExpertDashboardShell>

const NOOP = () => {}

/** The real app's nine destinations, in the three clusters the prototype specifies. */
const NAV_GROUPS: Array<ExpertDashboardNavGroup> = [
    {
        id: "operations",
        label: "Operations",
        items: [
            { id: "overview", label: "Overview", icon: GaugeIcon, href: "/dashboard", isActive: true, onPress: NOOP },
            { id: "members", label: "Members", icon: UsersIcon, href: "/members", onPress: NOOP },
            { id: "courses", label: "Courses / Studio", icon: BookOpenIcon, href: "/courses", onPress: NOOP },
            { id: "community", label: "Community", icon: ChatCircleIcon, href: "/community", onPress: NOOP },
        ],
    },
    {
        id: "business",
        label: "Business",
        items: [
            { id: "revenue", label: "Revenue", icon: ChartLineIcon, href: "/revenue", onPress: NOOP },
            { id: "leads", label: "Leads", icon: TargetIcon, href: "/leads", onPress: NOOP },
            { id: "analytics", label: "Analytics", icon: ChartBarIcon, href: "/analytics", onPress: NOOP },
        ],
    },
    {
        id: "automation",
        label: "Automation",
        items: [
            { id: "ai-agent", label: "AI Agent", icon: RobotIcon, href: "/ai-agent", onPress: NOOP },
            { id: "settings", label: "Settings / Branding", icon: GearSixIcon, href: "/settings", onPress: NOOP },
        ],
    },
]

/** Stand-in for a real dashboard route's own content — this shell never knows what it is. Mirrors its own loaded shape while `isSkeleton`. */
const MockRouteContent = ({ isSkeleton }: SkeletonProps) => (
    <div data-tier="fixture" className="flex flex-col gap-4">
        <div className={`h-8 w-1/3 rounded-lg ${isSkeleton ? "animate-pulse bg-default" : "bg-surface-secondary"}`} />
        <div className="grid gap-4 sm:grid-cols-4">
            {[0, 1, 2, 3].map((tile) => (
                <div key={tile} className={`h-24 rounded-2xl ${isSkeleton ? "animate-pulse bg-default" : "bg-surface shadow-surface"}`} />
            ))}
        </div>
        <div className={`h-64 rounded-2xl ${isSkeleton ? "animate-pulse bg-default" : "bg-surface shadow-surface"}`} />
    </div>
)

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    InputSearch: { tier: "atom", role: "the top bar's search field — students, courses, orders" },
    Badge: { tier: "atom", role: "the unread count anchored on the notification bell" },
    Avatar: { tier: "atom", role: "the top bar's account trigger, and the rail's identity summary" },
    RailShell: { tier: "frame", role: "the rail+body frame, here with `side=\"start\"` so the nine-destination nav leads the content", storyId: "frames-railshell-railshell--default" },
    Typography: { tier: "atom", role: "the brand mark, every nav row's label, and the identity summary" },
    Divider: { tier: "atom", role: "the rule between nav clusters (every group but the first)" },
}

/** LEAF — the shell has one shape; `isSkeleton` (loaded vs loading) is the only structural state. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ExpertDashboardShell"
                tier="screen"
                leaf="Dashboard shell"
                annotate={ANNOTATE}
                reason="A layout composes CONNECTED children and owns the shell, not the content. Here the shell is a full-width top bar (search, account, notifications) above a `RailShell side='start'`: the nine-destination nav on the LEFT, route content following in the centre. `content` is a buildable `ComponentTypeWithSkeleton` slot (not a `ReactNode`), so one `isSkeleton` flag shimmers the rail and the body from the same tree — the top bar stays live, since search/account/notifications are chrome the shell always knows."
                states={[
                    {
                        name: "content loaded, authenticated",
                        why: "The resolved shell: the top bar's search/account/notifications, the three-cluster nav pinned on the LEFT (the Overview row marked active), and the routed page in the centre.",
                        code: `<ExpertDashboardShell
    brand={brand}
    navGroups={navGroups}
    identity={identity}
    search={search}
    notifications={notifications}
    onAccountPress={openAccount}
    searchLabel="Search students, courses, orders"
    accountLabel="Account"
    notificationsLabel="Notifications"
    content={RouteContent}
/>`,
                        render: (
                            <ExpertDashboardShell
                                brand={{ name: "Your Academy", domainLabel: "expert.nivo.vn", onLogoPress: NOOP }}
                                navGroups={NAV_GROUPS}
                                identity={{ name: "Le Quang", roleLabel: "Academy owner", avatarUrl: null }}
                                search={{ value: "", onValueChange: NOOP, placeholder: "Search students, courses, orders" }}
                                notifications={{ unreadCount: 3, onOpen: NOOP }}
                                onAccountPress={NOOP}
                                searchLabel="Search students, courses, orders"
                                accountLabel="Account"
                                notificationsLabel="Notifications"
                                content={MockRouteContent}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The route data has not resolved. `RailShell` threads the shell's `isSkeleton` into BOTH slots at once: the nav labels and identity summary shimmer, and the centre content mirrors its own loaded shape — while the top bar stays live, since search/account/notifications never depend on the route.",
                        code: `<ExpertDashboardShell
    brand={brand}
    navGroups={navGroups}
    identity={identity}
    search={search}
    notifications={notifications}
    onAccountPress={openAccount}
    searchLabel="Search students, courses, orders"
    accountLabel="Account"
    notificationsLabel="Notifications"
    content={RouteContent}
    isSkeleton
/>`,
                        render: (
                            <ExpertDashboardShell
                                brand={{ name: "Your Academy", domainLabel: "expert.nivo.vn", onLogoPress: NOOP }}
                                navGroups={NAV_GROUPS}
                                identity={{ name: "Le Quang", roleLabel: "Academy owner", avatarUrl: null }}
                                search={{ value: "", onValueChange: NOOP, placeholder: "Search students, courses, orders" }}
                                notifications={{ unreadCount: 3, onOpen: NOOP }}
                                onAccountPress={NOOP}
                                searchLabel="Search students, courses, orders"
                                accountLabel="Account"
                                notificationsLabel="Notifications"
                                content={MockRouteContent}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
