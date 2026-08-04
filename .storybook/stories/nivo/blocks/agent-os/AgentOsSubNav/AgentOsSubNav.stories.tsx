import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    BookOpenIcon,
    CpuIcon,
    FlowArrowIcon,
    HouseIcon,
    PlayCircleIcon,
    PulseIcon,
    RobotIcon,
    TrayIcon,
    WrenchIcon,
} from "@phosphor-icons/react"
import {
    AgentOsSubNav,
    type AgentOsSubNavSection,
} from "@sb-components/nivo/blocks/agent-os/AgentOsSubNav/AgentOsSubNav"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `AgentOsSubNav` — the Agent OS console's secondary nav over its nine sections.
 * ONE data shape, TWO RENDERINGS behind a single `variant` prop: `"mini-rail"`
 * (default — a persistent thin rail reading as "an OS inside the app") and
 * `"segmented"` (the narrow-width fallback, built on the existing `Tabs` atom).
 * Both read the exact same `sections`/`activeKey`, so the taxonomy can never
 * drift between the two renderings. `isDisabled` marks a STUB section —
 * Knowledge/Models/Tools/Playground/Events have no screen commissioned yet.
 */
const meta: Meta<typeof AgentOsSubNav> = {
    title: "Nivo/Blocks/AgentOs/AgentOsSubNav/AgentOsSubNav",
    component: AgentOsSubNav,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AgentOsSubNav>

/** The nine real sections — four live, five stubbed (no screen commissioned yet). */
const SECTIONS: Array<AgentOsSubNavSection> = [
    { key: "overview", label: "Overview", icon: HouseIcon },
    { key: "agents", label: "Agents", icon: RobotIcon },
    { key: "channels", label: "Channels", icon: TrayIcon },
    { key: "workflows", label: "Workflows", icon: FlowArrowIcon },
    { key: "knowledge", label: "Knowledge", icon: BookOpenIcon, isDisabled: true },
    { key: "models", label: "Models", icon: CpuIcon, isDisabled: true },
    { key: "tools", label: "Tools", icon: WrenchIcon, isDisabled: true },
    { key: "playground", label: "Playground", icon: PlayCircleIcon, isDisabled: true },
    { key: "events", label: "Events", icon: PulseIcon, isDisabled: true },
]

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Typography: { tier: "atom", role: "the mini-rail's row labels; the active row switches to the accent tone" },
    Tabs: { tier: "atom", role: "the segmented rendering — HeroUI's own segmented pill, isDisabled per stub section", storyId: "atoms-navigation-tabs-tabs--default" },
}

/** LEAF — one shape; `variant` is a rendering choice and `isSkeleton` is DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AgentOsSubNav"
                tier="block"
                leaf="Section nav"
                annotate={ANNOTATE}
                reason="Blocks take no `className`: the sub-nav owns the section taxonomy, so `mini-rail`/`segmented` read the exact same `sections`/`activeKey` behind one `variant` prop rather than forking into two blocks that could drift apart. Stub sections (Knowledge/Models/Tools/Playground/Events) render disabled instead of being dropped from the list — the console honestly shows nine sections exist, four of which are not yet built, rather than silently promising four."
                states={[
                    {
                        name: "variant = \"mini-rail\" (default)",
                        why: "The recommended rendering: a persistent thin rail inside the console body. Nine sections overflow a segmented bar at any reasonable width, and a persistent rail reads as \"an OS inside the app\" — the console's own operating-system identity.",
                        code: `<AgentOsSubNav
  sections={sections}
  activeKey="overview"
  onSelect={selectSection}
/>`,
                        render: (
                            <AgentOsSubNav sections={SECTIONS} activeKey="overview" onSelect={NOOP} />
                        ),
                    },
                    {
                        name: "variant = \"segmented\"",
                        why: "The narrow-width fallback: a horizontal pill strip built on the existing `Tabs` atom, so the block adds no bespoke tab-strip visual of its own — only the section data changes between the two rendering.",
                        code: `<AgentOsSubNav
  sections={sections}
  activeKey="agents"
  onSelect={selectSection}
  variant="segmented"
/>`,
                        render: (
                            <AgentOsSubNav sections={SECTIONS} activeKey="agents" onSelect={NOOP} variant="segmented" />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The console's own first fetch hasn't resolved yet. The mini-rail shows nine placeholder rows — an icon-sized square plus a label bar each — mirroring the loaded shape so nothing shifts once the real sections mount.",
                        code: `<AgentOsSubNav
  sections={sections}
  activeKey="overview"
  onSelect={selectSection}
  isSkeleton
/>`,
                        render: (
                            <AgentOsSubNav sections={SECTIONS} activeKey="overview" onSelect={NOOP} isSkeleton />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
