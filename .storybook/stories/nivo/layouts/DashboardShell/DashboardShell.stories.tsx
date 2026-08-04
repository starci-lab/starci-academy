import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    GaugeIcon,
    GlobeIcon,
    IdentificationCardIcon,
    LifebuoyIcon,
    ReceiptIcon,
    RobotIcon,
    StorefrontIcon,
    UserIcon,
    WalletIcon,
} from "@phosphor-icons/react"
import type { SkeletonProps } from "@sb-components/composites/_slot"
import { DashboardShell } from "@sb-components/nivo/layouts/DashboardShell/DashboardShell"
import type { NivoSidebarGroup } from "@sb-components/nivo/blocks/navigation/NivoSidebar/NivoSidebar"
import type { NivoTopBarProps } from "@sb-components/nivo/blocks/navigation/NivoTopBar/NivoTopBar"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `DashboardShell` — the layout every nivo dashboard route sits in. One
 * composition: `NivoTopBar` on top, then a `RailShell` with `NivoSidebar` as the
 * rail on the LEFT (`side="start"`) and the route content in the CENTER. `content`
 * is the one slot a route's shape enters; the shell itself never changes across
 * routes, so `isSkeleton` (loaded vs loading) is the only structural state.
 *
 * The rail renders correctly here — `NivoSidebar` a real 288px column instead of
 * the full-width stacked list the shell shipped with — because `RailShell` opens
 * its OWN `@container` context rather than trusting this shell's bare `<div>`
 * wrapper below to have opened one; see `RailShell`'s file header for the fix.
 * This layout does not need to open a container context itself.
 */
const meta: Meta<typeof DashboardShell> = {
    title: "Nivo/Layouts/DashboardShell/DashboardShell",
    component: DashboardShell,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof DashboardShell>

/** The real app's nine destinations, grouped into the four clusters the proposal specifies. */
const SIDEBAR_GROUPS: Array<NivoSidebarGroup> = [
    {
        id: "overview",
        items: [
            { id: "dashboard", label: "Overview", icon: GaugeIcon, href: "/dashboard", isActive: true, onPress: () => {} },
        ],
    },
    {
        id: "business",
        label: "Business",
        items: [
            { id: "expert-site", label: "Expert site", icon: IdentificationCardIcon, href: "/expert-site", onPress: () => {} },
            { id: "ai-agent", label: "AI Agent", icon: RobotIcon, href: "/ai-agent", onPress: () => {} },
            { id: "catalog", label: "Catalog", icon: StorefrontIcon, href: "/catalog", onPress: () => {} },
        ],
    },
    {
        id: "billing",
        label: "Billing",
        items: [
            { id: "invoices", label: "Invoices", icon: ReceiptIcon, href: "/invoices", onPress: () => {} },
            { id: "wallet", label: "Wallet", icon: WalletIcon, href: "/wallet", onPress: () => {} },
        ],
    },
    {
        id: "settings",
        items: [
            { id: "domains", label: "Domains", icon: GlobeIcon, href: "/domains", onPress: () => {} },
            { id: "support", label: "Support", icon: LifebuoyIcon, href: "/support", onPress: () => {} },
            { id: "account", label: "Account", icon: UserIcon, href: "/account", onPress: () => {} },
        ],
    },
]

/** The top bar the shell forwards to `NivoTopBar` — a breadcrumb + theme/bell, no account trigger (that lives in the sidebar now). */
const TOP_BAR: NivoTopBarProps = {
    breadcrumb: { rootLabel: "nivo", onRootPress: () => {}, currentLabel: "Overview" },
    theme: { isDark: false, onThemeToggle: () => {} },
    notifications: { unreadCount: 3, onOpen: () => {} },
    themeToggleLabel: "Switch to dark theme",
    notificationsLabel: "Notifications",
}

const SIDEBAR = {
    brand: { name: "Nivo", onLogoPress: () => {} },
    groups: SIDEBAR_GROUPS,
    account: { name: "Ada Lovelace", email: "ada@nivo.dev", avatarUrl: null, planLabel: "Pro", onPress: () => {} },
    onToggleCollapse: () => {},
    collapseLabel: "Collapse sidebar",
    expandLabel: "Expand sidebar",
}

/**
 * Stand-in for a real dashboard route's own content — this layout never knows what
 * it is. Mirrors its own loaded shape while `isSkeleton`, so the centre column does
 * not jump when the route resolves.
 */
const MockRouteContent = ({ isSkeleton }: SkeletonProps) => (
    <div data-tier="fixture" className="flex flex-col gap-4">
        <div className={`h-8 w-1/3 rounded-lg ${isSkeleton ? "animate-pulse bg-default" : "bg-surface-secondary"}`} />
        <div className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((tile) => (
                <div key={tile} className={`h-28 rounded-2xl ${isSkeleton ? "animate-pulse bg-default" : "bg-surface shadow-surface"}`} />
            ))}
        </div>
        <div className={`h-64 rounded-2xl ${isSkeleton ? "animate-pulse bg-default" : "bg-surface shadow-surface"}`} />
    </div>
)

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "NivoTopBar": { tier: "block", role: "the top bar — theme toggle, notification bell, account menu — pinned above the rail+content row", storyId: "nivo-blocks-navigation-nivotopbar-nivotopbar--default" },
    "RailShell": { tier: "frame", role: "the rail+body frame, here with `side=\"start\"` so the nav rail leads the content", storyId: "frames-railshell-railshell--default" },
    "NivoSidebar": { tier: "block", role: "the left-rail navigation, mounted as `RailShell`'s leading rail", storyId: "nivo-blocks-navigation-nivosidebar-nivosidebar--default" },
}

/** LEAF — the shell has one shape; `isSkeleton` (loaded vs loading) is the only structural state. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DashboardShell"
                tier="screen"
                leaf="Dashboard shell"
                annotate={ANNOTATE}
                reason="A layout composes CONNECTED children and owns the shell, not the content. Here the shell is `NivoTopBar` over a `RailShell side='start'`: nav on the LEFT, route content following in the centre. `content` is a buildable `ComponentTypeWithSkeleton` slot (not a `ReactNode`), so one `isSkeleton` flag shimmers the rail and the body from the same tree."
                states={[
                    {
                        name: "content loaded, authenticated",
                        why: "The resolved dashboard: the signed-in top bar, the route content following in the centre, and `NivoSidebar` pinned on the LEFT. Shown inside a wide `@container` so `RailShell` resolves to its two-column form — the rail leads the body here, matching the real app's left-hand navigation.",
                        code: `<DashboardShell
    topBar={topBar}
    sidebar={sidebar}
    content={RouteContent}
/>`,
                        render: (
                            <div data-tier="fixture" className="@container" style={{ width: "72rem", maxWidth: "100%" }}>
                                <DashboardShell topBar={TOP_BAR} sidebar={SIDEBAR} content={MockRouteContent} />
                            </div>
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The route data has not resolved. `RailShell` threads the shell's `isSkeleton` into BOTH slots at once: `NivoSidebar` becomes its shimmer rail and the centre content mirrors its own loaded shape — while the top bar stays live, since theme and auth are always known.",
                        code: `<DashboardShell
    topBar={topBar}
    sidebar={sidebar}
    content={RouteContent}
    isSkeleton
/>`,
                        render: (
                            <div data-tier="fixture" className="@container" style={{ width: "72rem", maxWidth: "100%" }}>
                                <DashboardShell topBar={TOP_BAR} sidebar={SIDEBAR} content={MockRouteContent} isSkeleton />
                            </div>
                        ),
                    },
                    {
                        name: "narrow — below @app-md",
                        why: "The exact real mount: `RailShell` sits inside `DashboardShell`'s bare `<div className=\"mx-auto w-full max-w-7xl px-6 py-8\">` — no `Container`, no ancestor `@container` — proving `RailShell`'s self-contained container-query fix holds through the full composed shell, not just the frame in isolation. Below the threshold the rail drops ABOVE the route content (honest DOM order for a leading `side=\"start\"` rail) as a full-width column, never the collapsed full-width LIST the shell shipped with before the fix.",
                        code: `<DashboardShell topBar={topBar} sidebar={sidebar} content={RouteContent} />`,
                        render: (
                            <div data-tier="fixture" style={{ width: "22rem", maxWidth: "100%" }}>
                                <DashboardShell topBar={TOP_BAR} sidebar={SIDEBAR} content={MockRouteContent} />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
