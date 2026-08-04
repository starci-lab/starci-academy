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
import { NivoSidebar, type NivoSidebarGroup } from "@sb-components/nivo/blocks/navigation/NivoSidebar/NivoSidebar"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `NivoSidebar` — the left-rail navigation block for the nivo dashboard shell.
 * THREE regions: a header (brand + collapse toggle), a scrollable column of
 * GROUPED nav rows, and an account row pinned OUTSIDE the scroll at the very
 * bottom. `isCollapsed` is the viewer's OWN choice — the connected layer
 * persists it, mirroring starci-academy's `CollapsibleSidebar`. Grounded in
 * the real `AppSidebar`; the shell mounts it on the LEFT (`RailShell
 * side="start"`).
 */
const meta: Meta<typeof NivoSidebar> = {
    title: "Nivo/Blocks/Navigation/NivoSidebar/NivoSidebar",
    component: NivoSidebar,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof NivoSidebar>

/** The real app's nine destinations, grouped into the four clusters the proposal specifies. */
const DEMO_GROUPS: Array<NivoSidebarGroup> = [
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
            {
                id: "invoices",
                label: "Invoices",
                icon: ReceiptIcon,
                href: "/invoices",
                onPress: () => {},
                endContent: <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">1</span>,
            },
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

const BRAND = { name: "Nivo", onLogoPress: () => {} }

const ACCOUNT = {
    name: "Ada Lovelace",
    email: "ada@nivo.dev",
    avatarUrl: null,
    planLabel: "Pro",
    onPress: () => {},
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Typography": { tier: "atom", role: "the brand mark (pressable, accent), the pinned account row's name/email, and the breadcrumb-less header", storyId: "atoms-text-typography-typography--truncate" },
    "Button": { tier: "atom", role: "the collapse toggle, sitting in the header beside the brand mark", storyId: "atoms-buttons-button-button--is-icon-only" },
    "SidebarNavGroup": { tier: "block", role: "each of the four clusters — Overview alone, Business, Billing, and an unlabelled settings cluster", storyId: "nivo-blocks-navigation-sidebarnavgroup-sidebarnavgroup--default" },
    "SidebarNavItem": { tier: "block", role: "one destination row inside a group", storyId: "nivo-blocks-navigation-sidebarnavitem-sidebarnavitem--default" },
    "Avatar": { tier: "atom", role: "the pinned account row's identity — initials/generated fallback when there is no uploaded image", storyId: "atoms-display-avatar-avatar--default" },
    "Chip": { tier: "atom", role: "the account row's plan chip (Pro/Free), the trailing slot beside the avatar", storyId: "atoms-chips-chip-chip--default" },
}

/** LEAF — the rail has one shape; `groups` data, `isSkeleton`, and `isCollapsed` are STATES. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="NivoSidebar"
                tier="block"
                leaf="Nav rail"
                annotate={ANNOTATE}
                renderClassName="h-[560px] w-72 overflow-hidden rounded-2xl border border-default"
                reason="Blocks take no `className`: the rail owns its entity (the grouped nav taxonomy + the pinned account block), so a screen that wants it elsewhere moves the WHOLE rail through the layout (`RailShell side='start'`) rather than restyling it here. Three regions in one column — header, scrollable grouped nav, pinned account row outside the scroll — mirror starci-academy's `CollapsibleSidebar` exactly, just with the pinned slot moved to the bottom."
                states={[
                    {
                        name: "four groups populated, Overview active",
                        why: "The default loaded rail: brand + toggle on top, the four clusters (Overview alone, Business, Billing, an unlabelled settings cluster) each separated by a divider, and the account row pinned at the very bottom. Exactly one row carries the tonal active treatment.",
                        code: `<NivoSidebar
    brand={{ name: "Nivo", onLogoPress }}
    groups={groups /* Overview isActive */}
    account={{ name: "Ada Lovelace", email: "ada@nivo.dev", planLabel: "Pro", onPress }}
    onToggleCollapse={onToggleCollapse}
    collapseLabel="Collapse sidebar"
    expandLabel="Expand sidebar"
/>`,
                        render: (
                            <NivoSidebar
                                brand={BRAND}
                                groups={DEMO_GROUPS}
                                account={ACCOUNT}
                                onToggleCollapse={() => {}}
                                collapseLabel="Collapse sidebar"
                                expandLabel="Expand sidebar"
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The nav + account data has not resolved yet. The brand mark, every row, and the account block become a shimmer that MIRRORS the loaded shape — the same four-group, nine-row footprint — so nothing shifts when the real data arrives.",
                        code: `<NivoSidebar
    brand={{ name: "Nivo", onLogoPress }}
    groups={groups}
    account={account}
    onToggleCollapse={onToggleCollapse}
    collapseLabel="Collapse sidebar"
    expandLabel="Expand sidebar"
    isSkeleton
/>`,
                        render: (
                            <NivoSidebar
                                brand={BRAND}
                                groups={DEMO_GROUPS}
                                account={ACCOUNT}
                                onToggleCollapse={() => {}}
                                collapseLabel="Collapse sidebar"
                                expandLabel="Expand sidebar"
                                isSkeleton
                            />
                        ),
                    },
                    {
                        name: "isCollapsed = true",
                        why: "A reader pins the rail to an icon-only strip to keep more width for the route content. The brand mark and every group caption disappear, rows centre on their icon alone, and the account row drops to avatar-only — a `Tooltip` still carries each destination's name on hover or keyboard focus.",
                        code: `<NivoSidebar
    brand={{ name: "Nivo", onLogoPress }}
    groups={groups}
    account={account}
    isCollapsed
    onToggleCollapse={onToggleCollapse}
    collapseLabel="Collapse sidebar"
    expandLabel="Expand sidebar"
/>`,
                        render: (
                            <NivoSidebar
                                brand={BRAND}
                                groups={DEMO_GROUPS}
                                account={ACCOUNT}
                                isCollapsed
                                onToggleCollapse={() => {}}
                                collapseLabel="Collapse sidebar"
                                expandLabel="Expand sidebar"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
