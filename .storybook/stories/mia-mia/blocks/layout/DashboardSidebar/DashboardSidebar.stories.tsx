import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    HouseIcon,
    ExamIcon,
    BookOpenIcon,
    TextAaIcon,
    GameControllerIcon,
    TrophyIcon,
    UserIcon,
} from "@phosphor-icons/react"
import { Chip } from "@heroui/react"
import { DashboardSidebar } from "@sb-components/mia-mia/blocks/layout/DashboardSidebar"
import type { DashboardNavGroup } from "@sb-components/mia-mia/blocks/layout/DashboardSidebar"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `DashboardSidebar`: the dashboard's left navigation shell — a
 * `CollapsibleSidebar` filled with grouped `SidebarNavItem` rows.
 *
 * One prop = one leaf: each visual prop gets its own leaf rendering that
 * prop's full value set — `groups` · `activeHref` · `topSlot`. `title`,
 * `onNavigate`, `collapseLabel` / `expandLabel`, and `storageKey` are
 * required-but-arbitrary (text with no enumerable value set, a callback
 * with no visual effect of its own, or an internal persistence key), so
 * they carry no leaf of their own.
 */
const meta: Meta<typeof DashboardSidebar> = {
    title: "MiaMia/DashboardSidebar",
    component: DashboardSidebar,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof DashboardSidebar>

/** The mia-mia learner nav, modelled the way the connected layout feeds it. */
const GROUPS: Array<DashboardNavGroup> = [
    {
        key: "learn",
        label: "Learn",
        items: [
            { key: "home", href: "/vi/dashboard", label: "Home", icon: <HouseIcon className="size-5" /> },
            { key: "exam", href: "/vi/exam", label: "Exams", icon: <ExamIcon className="size-5" /> },
            { key: "vocab", href: "/vi/learn", label: "Vocabulary", icon: <BookOpenIcon className="size-5" /> },
            { key: "grammar", href: "/vi/learn/grammar", label: "Topics and grammar", icon: <TextAaIcon className="size-5" /> },
        ],
    },
    {
        key: "compete",
        label: "Compete",
        items: [
            {
                key: "play",
                href: "/vi/play",
                label: "Play together",
                icon: <GameControllerIcon className="size-5" />,
                endContent: <Chip size="sm" variant="soft" color="accent">4</Chip>,
            },
            { key: "ranks", href: "/vi/play/leaderboard", label: "Leaderboard", icon: <TrophyIcon className="size-5" /> },
        ],
    },
    {
        key: "you",
        items: [
            { key: "profile", href: "/vi/profile", label: "Profile", icon: <UserIcon className="size-5" /> },
        ],
    },
]

/** A single, unlabelled cluster — the smallest legal `groups` shape (no caption, no leading divider). */
const SINGLE_GROUP: Array<DashboardNavGroup> = [
    {
        key: "you",
        items: [
            { key: "profile", href: "/vi/profile", label: "Profile", icon: <UserIcon className="size-5" /> },
            { key: "settings", href: "/vi/settings", label: "Settings", icon: <UserIcon className="size-5" /> },
        ],
    },
]

/**
 * `SidebarNavGroup`/`SidebarNavItem` are real blocks with their own stories,
 * so they carry a `storyId` to jump to. `Typography`/`Button` are the local
 * atoms `CollapsibleSidebar` composes for its title and its collapse
 * toggle — also real, also linked.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SidebarNavGroup": { tier: "block", role: "one labelled or unlabelled cluster of nav rows, divided from the group above it", storyId: "nivo-blocks-navigation-sidebarnavgroup-sidebarnavgroup--default" },
    "SidebarNavItem": { tier: "block", role: "one destination row — active gets the tonal accent fill, everything else stays muted", storyId: "nivo-blocks-navigation-sidebarnavitem-sidebarnavitem--default" },
    "Typography": { tier: "atom", role: "the panel's title in the header row, and each row's own label", storyId: "atoms-text-typography-typography--default" },
    "Button": { tier: "atom", role: "the collapse/expand toggle in the panel header", storyId: "atoms-buttons-button-button--default" },
}

/** Bare leaf — no optional prop turned on: the full learner nav, home active, nothing pinned above it. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DashboardSidebar"
                tier="block"
                annotate={ANNOTATE}
                renderClassName="h-[34rem] max-w-xs"
                leaf="No prop turned on"
                reason="The dashboard's left navigation shell: a `CollapsibleSidebar` filled with grouped `SidebarNavItem` rows. Purely presentational — it owns no routing and no data: the caller feeds the grouped nav model, marks the active route with `activeHref`, and navigates in `onNavigate`. This leaf is the baseline every prop-leaf below differs from by exactly one prop."
                states={[
                    {
                        name: "no prop turned on (home active, no topSlot)",
                        why: "The learner's dashboard navigation — exams, vocabulary, play together — grouped under Learn/Compete/You, with the dashboard home row carrying the accent fill and nothing pinned above the nav.",
                        code: `<DashboardSidebar
    title="Mia Mia"
    groups={GROUPS}
    activeHref="/vi/dashboard"
    onNavigate={() => {}}
    collapseLabel="Collapse sidebar"
    expandLabel="Expand sidebar"
    storageKey="storybook-dashboard-sidebar-default"
/>`,
                        render: (
                            <DashboardSidebar
                                title="Mia Mia"
                                groups={GROUPS}
                                activeHref="/vi/dashboard"
                                onNavigate={() => {}}
                                collapseLabel="Collapse sidebar"
                                expandLabel="Expand sidebar"
                                storageKey="storybook-dashboard-sidebar-default"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `groups` — array order drives dividers; `label` per group is itself optional. */
export const Groups: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DashboardSidebar"
                tier="block"
                annotate={ANNOTATE}
                renderClassName="h-[34rem] max-w-xs"
                leaf="Prop `groups`"
                reason="Groups render in array order, each dividing from the one before it, except the first — a group's `label` is itself optional, so a cluster can sit uncaptioned when a divider alone is enough to separate it."
                states={[
                    {
                        name: "3 groups — mixed labelled/unlabelled, one row with a badge",
                        why: "Learn and Compete carry uppercase captions; the trailing You cluster has none, only the divider above it — and Play together carries a trailing count chip via `endContent`.",
                        code: `<DashboardSidebar
    title="Mia Mia"
    groups={GROUPS}
    activeHref="/vi/dashboard"
    onNavigate={() => {}}
    collapseLabel="Collapse sidebar"
    expandLabel="Expand sidebar"
    storageKey="storybook-dashboard-sidebar-groups-full"
/>`,
                        render: (
                            <DashboardSidebar
                                title="Mia Mia"
                                groups={GROUPS}
                                activeHref="/vi/dashboard"
                                onNavigate={() => {}}
                                collapseLabel="Collapse sidebar"
                                expandLabel="Expand sidebar"
                                storageKey="storybook-dashboard-sidebar-groups-full"
                            />
                        ),
                    },
                    {
                        name: "1 group, unlabelled (no caption, no divider)",
                        why: "A single cluster with no `label` renders with no caption and no leading divider — a sidebar this small doesn't need a section header at all.",
                        code: `<DashboardSidebar
    title="Mia Mia"
    groups={SINGLE_GROUP}
    activeHref="/vi/profile"
    onNavigate={() => {}}
    collapseLabel="Collapse sidebar"
    expandLabel="Expand sidebar"
    storageKey="storybook-dashboard-sidebar-groups-single"
/>`,
                        render: (
                            <DashboardSidebar
                                title="Mia Mia"
                                groups={SINGLE_GROUP}
                                activeHref="/vi/profile"
                                onNavigate={() => {}}
                                collapseLabel="Collapse sidebar"
                                expandLabel="Expand sidebar"
                                storageKey="storybook-dashboard-sidebar-groups-single"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `activeHref` — the ONE row whose `href` matches gets the tonal fill, computed fresh from the whole model. */
export const ActiveHref: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DashboardSidebar"
                tier="block"
                annotate={ANNOTATE}
                renderClassName="h-[34rem] max-w-xs"
                leaf="Prop `activeHref`"
                reason="Exactly one row gets the tonal accent fill — the row whose `href` equals `activeHref` — computed fresh from the whole grouped model, so the highlight can land on a top-level Learn row just as easily as on a deeper Compete row."
                states={[
                    {
                        name: "activeHref = \"/vi/dashboard\" (top-level, first group)",
                        why: "The dashboard home row in the Learn group carries the fill — the common case right after sign-in.",
                        code: `<DashboardSidebar
    title="Mia Mia"
    groups={GROUPS}
    activeHref="/vi/dashboard"
    onNavigate={() => {}}
    collapseLabel="Collapse sidebar"
    expandLabel="Expand sidebar"
    storageKey="storybook-dashboard-sidebar-active-home"
/>`,
                        render: (
                            <DashboardSidebar
                                title="Mia Mia"
                                groups={GROUPS}
                                activeHref="/vi/dashboard"
                                onNavigate={() => {}}
                                collapseLabel="Collapse sidebar"
                                expandLabel="Expand sidebar"
                                storageKey="storybook-dashboard-sidebar-active-home"
                            />
                        ),
                    },
                    {
                        name: "activeHref = \"/vi/exam\" (deeper row, same group)",
                        why: "The highlight moves off the dashboard row entirely and onto Exams in the same Learn group — proving the match is by `href`, not by row position.",
                        code: `<DashboardSidebar
    title="Mia Mia"
    groups={GROUPS}
    activeHref="/vi/exam"
    onNavigate={() => {}}
    collapseLabel="Collapse sidebar"
    expandLabel="Expand sidebar"
    storageKey="storybook-dashboard-sidebar-active-exam"
/>`,
                        render: (
                            <DashboardSidebar
                                title="Mia Mia"
                                groups={GROUPS}
                                activeHref="/vi/exam"
                                onNavigate={() => {}}
                                collapseLabel="Collapse sidebar"
                                expandLabel="Expand sidebar"
                                storageKey="storybook-dashboard-sidebar-active-exam"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `topSlot` — pinned ABOVE the scroll area, always visible, unset by default. */
export const TopSlot: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DashboardSidebar"
                tier="block"
                annotate={ANNOTATE}
                renderClassName="h-[34rem] max-w-xs"
                leaf="Prop `topSlot`"
                reason="`topSlot` pins a node between the header and the scrollable nav, always visible — for a resume pill or similar chrome the caller wants above every route group rather than inside the scroll area."
                states={[
                    {
                        name: "topSlot set (a pinned chip)",
                        why: "A pinned chip stays above the scroll area even as the nav rows below it scroll, since it is rendered outside the sidebar's scroll region.",
                        code: `<DashboardSidebar
    title="Mia Mia"
    groups={GROUPS}
    activeHref="/vi/dashboard"
    onNavigate={() => {}}
    collapseLabel="Collapse sidebar"
    expandLabel="Expand sidebar"
    storageKey="storybook-dashboard-sidebar-topslot-set"
    topSlot={<Chip size="sm" variant="soft" color="accent">Resume: Unit 4</Chip>}
/>`,
                        render: (
                            <DashboardSidebar
                                title="Mia Mia"
                                groups={GROUPS}
                                activeHref="/vi/dashboard"
                                onNavigate={() => {}}
                                collapseLabel="Collapse sidebar"
                                expandLabel="Expand sidebar"
                                storageKey="storybook-dashboard-sidebar-topslot-set"
                                topSlot={<Chip size="sm" variant="soft" color="accent">Resume: Unit 4</Chip>}
                            />
                        ),
                    },
                    {
                        name: "topSlot = undefined (default)",
                        why: "Most dashboards pin nothing above the nav, so the slot is simply absent and the nav starts right under the header.",
                        code: `<DashboardSidebar
    title="Mia Mia"
    groups={GROUPS}
    activeHref="/vi/dashboard"
    onNavigate={() => {}}
    collapseLabel="Collapse sidebar"
    expandLabel="Expand sidebar"
    storageKey="storybook-dashboard-sidebar-topslot-unset"
/>`,
                        render: (
                            <DashboardSidebar
                                title="Mia Mia"
                                groups={GROUPS}
                                activeHref="/vi/dashboard"
                                onNavigate={() => {}}
                                collapseLabel="Collapse sidebar"
                                expandLabel="Expand sidebar"
                                storageKey="storybook-dashboard-sidebar-topslot-unset"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
