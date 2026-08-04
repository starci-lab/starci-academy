import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    ArrowsClockwiseIcon,
    ChartBarIcon,
    CurrencyDollarIcon,
    DatabaseIcon,
    GlobeIcon,
    PencilSimpleIcon,
    ReceiptIcon,
    RobotIcon,
    RocketLaunchIcon,
    SparkleIcon,
    StorefrontIcon,
    TargetIcon,
    WalletIcon,
} from "@phosphor-icons/react"
import {
    ControlPlaneOverview,
    type ControlPlaneOverviewLabels,
    type ControlPlaneOverviewProps,
} from "@sb-components/nivo/pages/ControlPlaneOverview/ControlPlaneOverview"
import type { KpiRowItem } from "@sb-components/nivo/blocks/dashboard/KpiRow/KpiRow"
import type { OperatingLoopRailNode } from "@sb-components/nivo/blocks/dashboard/OperatingLoopRail/OperatingLoopRail"
import type { RecentActivityItem } from "@sb-components/nivo/blocks/dashboard/RecentActivityCard/RecentActivityCard"
import type { QuickActionItem } from "@sb-components/nivo/blocks/dashboard/QuickActionsCard/QuickActionsCard"
import type { ProductQuickSelectorItem } from "@sb-components/nivo/blocks/dashboard/ProductQuickSelector/ProductQuickSelector"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ControlPlaneOverview` — the "Overview" home: the KPI row, the
 * operating-loop rail, then EITHER the onward path (a brand-new account) OR
 * the activity feed beside the quick actions (an account with something
 * running). A page's story is one complete STATE per story — `loading`,
 * `populated`, `new-account` — not a leaf-per-prop map. Grounded in the real
 * account summary and the two-product catalog.
 */
const meta: Meta<typeof ControlPlaneOverview> = {
    title: "Nivo/Pages/ControlPlaneOverview/ControlPlaneOverview",
    component: ControlPlaneOverview,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ControlPlaneOverview>

const NOOP = () => {}

const HEADING = {
    title: "Overview",
    subtitle: "Your account health in one screen — revenue, orders, running sites, wallet balance.",
}

const LOOP_NODES: Array<OperatingLoopRailNode> = [
    { id: "website", label: "Website", icon: GlobeIcon },
    { id: "lead", label: "Lead", icon: TargetIcon },
    { id: "crm", label: "CRM", icon: DatabaseIcon },
    { id: "workflow", label: "Workflow", icon: ArrowsClockwiseIcon },
    { id: "ai-agent", label: "AI Agent", icon: SparkleIcon },
    { id: "dashboard", label: "Dashboard", icon: ChartBarIcon },
]

const LABELS: ControlPlaneOverviewLabels = {
    operatingLoopTitle: "Your operating loop",
    onwardSectionTitle: "Where do you want to start?",
    activityLabels: {
        title: "Recent activity",
        emptyTitle: "Nothing yet",
        emptyDescription: "Invoices, leads, domain renewals, and support replies will show up here.",
    },
    quickActionsLabels: { title: "Quick actions" },
}

const POPULATED_KPIS: Array<Omit<KpiRowItem, "isSkeleton">> = [
    { key: "revenue", icon: CurrencyDollarIcon, label: "Monthly revenue", value: 12450000, format: "vnd", footer: { kind: "note", text: "Up 18% from last month", tone: "positive" } },
    { key: "orders", icon: ReceiptIcon, label: "Orders", value: 8, format: "count", footer: { kind: "note", text: "1 invoice unpaid" } },
    { key: "sites", icon: GlobeIcon, label: "Live sites", value: 2, format: "count", footer: { kind: "note", text: "Expert site · AI Agent" } },
    { key: "wallet", icon: WalletIcon, label: "Wallet balance", value: 3200000, format: "vnd", footer: { kind: "cta", label: "Add funds", onPress: NOOP } },
]

const NEW_ACCOUNT_KPIS: Array<Omit<KpiRowItem, "isSkeleton">> = [
    { key: "revenue", icon: CurrencyDollarIcon, label: "Monthly revenue", value: 0, format: "vnd", footer: { kind: "note", text: "No revenue yet" } },
    { key: "orders", icon: ReceiptIcon, label: "Orders", value: 0, format: "count", footer: { kind: "note", text: "No orders yet" } },
    { key: "sites", icon: GlobeIcon, label: "Live sites", value: 0, format: "count", footer: { kind: "cta", label: "See the catalog", onPress: NOOP } },
    { key: "wallet", icon: WalletIcon, label: "Wallet balance", value: 0, format: "vnd", footer: { kind: "cta", label: "Add funds for the first time", onPress: NOOP } },
]

const ACTIVITY: Array<RecentActivityItem> = [
    { id: "act-1", kind: "invoice", message: "Invoice #INV-1042 has been paid — nivo AI Agent · Pro", timeLabel: "2 hours ago" },
    { id: "act-2", kind: "lead", message: "New lead Minh Tran left their details on the expert site", timeLabel: "5 hours ago" },
    { id: "act-3", kind: "domain", message: "Domain anhducstudio.vn expires in 12 days", timeLabel: "1 day ago" },
    { id: "act-4", kind: "support", message: "Support request #TCK-88 has been answered", timeLabel: "2 days ago" },
]

const QUICK_ACTIONS: Array<QuickActionItem> = [
    { id: "manage-agent", label: "Manage AI Agent", icon: RobotIcon, onPress: NOOP },
    { id: "edit-site", label: "Edit expert site", icon: PencilSimpleIcon, onPress: NOOP },
    { id: "top-up", label: "Top up wallet", icon: WalletIcon, onPress: NOOP },
    { id: "register-domain", label: "Register a domain", icon: GlobeIcon, onPress: NOOP },
]

const ONWARD_PATH: Array<ProductQuickSelectorItem> = [
    { key: "expert-site", icon: RocketLaunchIcon, label: "Build an expert site", ctaLabel: "Create your site for free", onPress: NOOP },
    { key: "ai-agent", icon: SparkleIcon, label: "Hire an AI Agent for customer chat", ctaLabel: "See the 3 plans", onPress: NOOP },
    { key: "catalog", icon: StorefrontIcon, label: "Browse the full catalog", ctaLabel: "Open the catalog", onPress: NOOP },
]

const POPULATED_PROPS: ControlPlaneOverviewProps = {
    heading: HEADING,
    kpis: POPULATED_KPIS,
    loop: { nodes: LOOP_NODES, activeNodeIds: ["website", "lead", "ai-agent"] },
    section: { kind: "populated", activity: ACTIVITY, quickActions: QUICK_ACTIONS },
    labels: LABELS,
}

const NEW_ACCOUNT_PROPS: ControlPlaneOverviewProps = {
    heading: HEADING,
    kpis: NEW_ACCOUNT_KPIS,
    loop: { nodes: LOOP_NODES, activeNodeIds: [] },
    section: { kind: "new-account", onwardPath: ONWARD_PATH },
    labels: LABELS,
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    StackV: { tier: "frame", role: "the page's vertical rhythm" },
    KpiRow: {
        tier: "block",
        role: "the four-figure account-health row",
        storyId: "nivo-blocks-dashboard-kpirow-kpirow--default",
    },
    OperatingLoopRail: {
        tier: "block",
        role: "which operating-loop stages the account has wired up",
        storyId: "nivo-blocks-dashboard-operatinglooprail-operatinglooprail--default",
    },
    Grid: { tier: "frame", role: "the two-column split between activity and quick actions" },
    RecentActivityCard: {
        tier: "block",
        role: "the cross-domain activity feed",
        storyId: "nivo-blocks-dashboard-recentactivitycard-recentactivitycard--default",
    },
    QuickActionsCard: {
        tier: "block",
        role: "the shortcut list",
        storyId: "nivo-blocks-dashboard-quickactionscard-quickactionscard--default",
    },
    ProductQuickSelector: {
        tier: "block",
        role: "the onward path for a brand-new account",
        storyId: "nivo-blocks-dashboard-productquickselector-productquickselector--default",
    },
}

/** STATE — the page is still loading; every composed block renders its own skeleton mirror. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ControlPlaneOverview"
                tier="screen"
                leaf="Loading"
                annotate={ANNOTATE}
                reason="A page's story is one complete state per render, not a leaf-per-prop map — a page has states to show, not props to enumerate. `isSkeleton` threads straight down to every composed block, so each shimmers in its OWN loaded shape rather than the page drawing a separate loading tree."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The overview is still fetching. The KPI row, the operating-loop rail, and the populated section all keep the loaded (populated) shape, shimmering in place.",
                        code: "<ControlPlaneOverview {...populatedProps} isSkeleton />",
                        render: <ControlPlaneOverview {...POPULATED_PROPS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — an account with a live expert site and an active AI Agent. */
export const Populated: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ControlPlaneOverview"
                tier="screen"
                leaf="Populated"
                annotate={ANNOTATE}
                reason="The resolved overview: real figures on the KPI row, three operating-loop stages lit, and the activity feed beside the quick actions instead of the onward path — an account with something running has nowhere left to be pointed at, so the page shows what happened instead."
                states={[
                    {
                        name: "section.kind = \"populated\"",
                        why: "The full running-account overview: revenue trending up, two live products, three loop stages lit, and the last four events across every activity source.",
                        code: `<ControlPlaneOverview
    heading={heading}
    kpis={populatedKpis}
    loop={{ nodes, activeNodeIds: ["website", "lead", "ai-agent"] }}
    section={{ kind: "populated", activity, quickActions }}
    labels={labels}
/>`,
                        render: <ControlPlaneOverview {...POPULATED_PROPS} />,
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — a signed-in account that has provisioned nothing yet. */
export const NewAccount: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ControlPlaneOverview"
                tier="screen"
                leaf="NewAccount"
                annotate={ANNOTATE}
                reason="Every KPI reads zero, no operating-loop stage is lit, and the section below the rail is the onward path instead of an empty activity feed — the critical case for a brand-new account always has a way onward, never a screen that only says 'nothing here'."
                states={[
                    {
                        name: "section.kind = \"new-account\"",
                        why: "A freshly-signed-up account: zero everywhere, an unlit loop, and three real destinations to start from — build the expert site, hire the AI Agent, or browse the catalog.",
                        code: `<ControlPlaneOverview
    heading={heading}
    kpis={newAccountKpis}
    loop={{ nodes, activeNodeIds: [] }}
    section={{ kind: "new-account", onwardPath }}
    labels={labels}
/>`,
                        render: <ControlPlaneOverview {...NEW_ACCOUNT_PROPS} />,
                    },
                ]}
            />
        </div>
    ),
}
