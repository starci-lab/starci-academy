import type { ReactNode } from "react"
import {
    ActivityIcon,
    BookOpenIcon,
    ChatsCircleIcon,
    CpuIcon,
    FlowArrowIcon,
    HouseIcon,
    PlayCircleIcon,
    PuzzlePieceIcon,
    RobotIcon,
} from "@phosphor-icons/react"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StatGridCard, type StatGridCardItem } from "@sb-components/composites/stats/StatGridCard/StatGridCard"
import { StatPair } from "@sb-components/composites/stats/StatPair/StatPair"
import type { ComponentTypeWithSkeleton, SkeletonProps } from "@sb-components/composites/_slot"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import {
    AgentOsHeader,
    type AgentOsHeaderLabels,
} from "@sb-components/nivo/blocks/agent-os/AgentOsHeader/AgentOsHeader"
import {
    AgentOsSubNav,
    type AgentOsSubNavIcon,
    type AgentOsSubNavSection,
} from "@sb-components/nivo/blocks/agent-os/AgentOsSubNav/AgentOsSubNav"
import {
    HealthCard,
    type HealthCardLabels,
} from "@sb-components/nivo/blocks/agent-os/HealthCard/HealthCard"
import {
    OpsEventTable,
    type OpsEventFeedRow,
    type OpsEventTableLabels,
} from "@sb-components/nivo/blocks/agent-os/OpsEventTable/OpsEventTable"
import {
    AgentCard,
    type AgentCardLabels,
    type AgentCardStatusKey,
    type AgentOsChannelKind,
} from "@sb-components/nivo/blocks/agent-os/AgentCard/AgentCard"
import {
    ChannelList,
    type ChannelListItem,
    type ChannelListLabels,
} from "@sb-components/nivo/blocks/agent-os/ChannelList/ChannelList"
import {
    ChannelInbox,
    type ChannelInboxLabels,
    type ChannelInboxThread,
} from "@sb-components/nivo/blocks/agent-os/ChannelInbox/ChannelInbox"
import {
    N8nWorkflowTable,
    type AgentOsWorkflowRow,
    type N8nWorkflowTableLabels,
} from "@sb-components/nivo/blocks/agent-os/N8nWorkflowTable/N8nWorkflowTable"
import {
    KnowledgeSection,
    type KnowledgeSectionLabels,
    type KnowledgeSourceRow,
} from "@sb-components/nivo/blocks/agent-os/KnowledgeSection/KnowledgeSection"
import {
    ModelsSection,
    type AgentOsModelRow,
    type ModelsSectionLabels,
} from "@sb-components/nivo/blocks/agent-os/ModelsSection/ModelsSection"
import {
    ToolsSection,
    type AgentOsToolRow,
    type ToolsSectionLabels,
} from "@sb-components/nivo/blocks/agent-os/ToolsSection/ToolsSection"
import {
    PlaygroundPanel,
    type PlaygroundPanelLabels,
    type PlaygroundTurn,
} from "@sb-components/nivo/blocks/agent-os/PlaygroundPanel/PlaygroundPanel"

/**
 * `AgentOsConsole` — the PAGE at `/agent-os` once a pod exists: a list of
 * functions, not a shape of its own. It NAMES `AgentOsHeader` (pod name +
 * status + the one primary action) above `AgentOsSubNav` (the nine-section
 * secondary nav) beside a SECTION BODY that switches by `activeSection` —
 * `overview` (`StatGridCard` of four `StatPair` KPIs + `HealthCard` +
 * `OpsEventTable`), `agents` (an `AgentCard` grid), `channels` (`ChannelList`
 * + `ChannelInbox`), `workflows` (`N8nWorkflowTable`), and the four BASIC
 * stub sections `knowledge`/`models`/`tools`/`playground` (`KnowledgeSection`
 * / `ModelsSection` / `ToolsSection` / `PlaygroundPanel`) — and hands each its
 * typed data, nothing drawn inline beyond the layout frames (`StackV`,
 * `StackH`, `Grid`) and, for the KPI cells and the suspended/failed banner,
 * the `StatGridCard`/`StatPair`/`Callout`/`EmptyState` composites. This is the
 * content this route mounts into `DashboardShell`'s `content` slot; the shell
 * itself sits ABOVE this page (a page may import blocks/composites/frames,
 * never a layout), so this file renders standalone, never wrapping
 * `DashboardShell` around itself.
 *
 * A NINTH section — `events` — sits in the sub-nav as a permanent STUB (no
 * screen commissioned yet, per the proposal's own prototype note): it always
 * renders `isDisabled` and is never a member of `AgentOsConsoleSectionKey`,
 * so `section` can never discriminate to it.
 *
 * `status` is the SAME 3-way vocabulary `AgentOsHeader` owns minus
 * `"provisioning"` (that status belongs to `AgentOsProvision`, never this
 * page — a pod that exists is already past it): `active` reaches every
 * section, while `suspended`/`failed` LOCK every section but `overview` (the
 * sub-nav renders the rest `isDisabled` and `section` can only ever be the
 * `overview` shape in those two statuses) — mirroring the prototype's own S8/
 * S9, where the read-only impression comes from the DATA each state's
 * `overview` carries (zeroed counts, a status-appropriate note), never from a
 * page-drawn dimming treatment. A page's story is one complete STATE per
 * render, not a leaf-per-prop map: `active`, `loading` (`isSkeleton`, mirrors
 * `overview`'s shape regardless of which section was last open — first load
 * has nothing else to show), `suspended`, `failed`, `empty-in-section`
 * (`agents` with zero rows). Grounded in `AgentWorkspaceEntity`
 * (`status: "provisioning" | "active" | "suspended" | "failed"`,
 * `externalWorkspaceRef`) — health/uptime is illustrative-labelled by
 * `HealthCard` itself, never a fabricated metric this page invents.
 */

/** The console's own 3-way status vocabulary — `AgentOsHeader`'s minus `"provisioning"` (see the file header). */
export type AgentOsConsoleStatus = "active" | "suspended" | "failed"

/** The eight sections `section` can discriminate to — `events` is a permanent stub, never a member (see the file header). */
export type AgentOsConsoleSectionKey =
    | "overview"
    | "agents"
    | "channels"
    | "workflows"
    | "knowledge"
    | "models"
    | "tools"
    | "playground"

/** Pod identity, forwarded into the masthead. */
export interface AgentOsConsolePod {
    /** Already-composed masthead title (e.g. `"Agent OS · Pod Pro"`). */
    podName: string
    /** `AgentWorkspaceEntity.externalWorkspaceRef` — always assigned once a pod reaches this page. */
    externalWorkspaceRef: string
}

/** One KPI cell of the overview's `StatGridCard` row. */
export interface AgentOsConsoleKpi {
    /** The caption describing what the value measures (e.g. "Agents"). */
    label: string
    /** The headline statistic, already formatted (e.g. "4", "27"). */
    value: string
}

/** One row of the `agents` section's grid — an `AgentCard`'s own fields plus its id. */
export interface AgentOsConsoleAgentRow {
    /** Agent id — also the {@link AgentOsConsoleSection}'s `onOpenAgent` argument. */
    id: string
    /** Persona name (e.g. "Sales — Mai"). */
    name: string
    /** The model driving this agent. */
    model: string
    /** Channels this agent answers on. */
    channels: ReadonlyArray<AgentOsChannelKind>
    /** Whether the agent is currently answering messages. */
    status: AgentCardStatusKey
}

/** Already-localized copy for the `agents` section — `AgentCard`'s own labels plus its own empty state. */
export interface AgentOsConsoleAgentsLabels extends AgentCardLabels {
    /** Empty-state title, shown when the pod has zero agents. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/** Already-localized copy for the `channels` section — `ChannelList`'s and `ChannelInbox`'s own label sets. */
export interface AgentOsConsoleChannelsLabels {
    /** Forwarded to `ChannelList`. */
    list: ChannelListLabels
    /** Forwarded to `ChannelInbox`. */
    inbox: ChannelInboxLabels
}

/** A short banner's copy — the suspended/failed callout above the sub-nav. */
export interface AgentOsConsoleBannerLabels {
    /** Banner title (e.g. "Pod is suspended"). */
    title: string
    /** Banner supporting line. */
    description: string
    /** The banner's own action button — fires the SAME handler as the masthead's primary action. */
    actionLabel: string
}

/** Already-localized copy for the `overview` section's two blocks beyond the KPI row (which carries its own labels through `AgentOsConsoleKpi`). */
export interface AgentOsConsoleOverviewLabels {
    /** Forwarded to `HealthCard`. */
    health: HealthCardLabels
    /** Forwarded to `OpsEventTable`. */
    events: OpsEventTableLabels
}

/** Already-localized copy for every region this page arranges. */
export interface AgentOsConsoleLabels {
    /** Forwarded to `AgentOsHeader`. */
    header: AgentOsHeaderLabels
    /** Sub-nav section labels, keyed by section — including the permanent `events` stub. */
    sections: Record<AgentOsConsoleSectionKey | "events", string>
    /** Forwarded to the `overview` section. */
    overview: AgentOsConsoleOverviewLabels
    /** Forwarded to the `agents` section. */
    agents: AgentOsConsoleAgentsLabels
    /** Forwarded to the `channels` section. */
    channels: AgentOsConsoleChannelsLabels
    /** Forwarded to `N8nWorkflowTable`. */
    workflows: N8nWorkflowTableLabels
    /** Forwarded to `KnowledgeSection`. */
    knowledge: KnowledgeSectionLabels
    /** Forwarded to `ModelsSection`. */
    models: ModelsSectionLabels
    /** Forwarded to `ToolsSection`. */
    tools: ToolsSectionLabels
    /** Forwarded to `PlaygroundPanel`. */
    playground: PlaygroundPanelLabels
    /** Shown above the sub-nav while `status = "suspended"`. */
    suspendedBanner: AgentOsConsoleBannerLabels
    /** Shown above the sub-nav while `status = "failed"`. */
    failedBanner: AgentOsConsoleBannerLabels
}

/**
 * The section body's own data — a discriminated union on `key`, the SAME key
 * `activeSection` holds. `suspended`/`failed` can only ever supply the
 * `overview` member (see the file header).
 */
export type AgentOsConsoleSection =
    | {
        key: "overview"
        /** Four KPI cells, in display order — agents / channels / workflows on / events today. */
        kpis: readonly [AgentOsConsoleKpi, AgentOsConsoleKpi, AgentOsConsoleKpi, AgentOsConsoleKpi]
        /** The illustrative pod-health percentage — forwarded to `HealthCard`. */
        healthPercent: number
        /** Recent ops events, newest first — forwarded to `OpsEventTable`. */
        events: Array<OpsEventFeedRow>
    }
    | {
        key: "agents"
        /** The pod's agents. Empty renders the section's own `EmptyState`. */
        agents: Array<AgentOsConsoleAgentRow>
        /** Opens one agent's `AgentDetailDrawer` (an overlay this page never mounts itself). */
        onOpenAgent: (agentId: string) => void
    }
    | {
        key: "channels"
        /** Connected platforms — forwarded to `ChannelList`. */
        channels: ReadonlyArray<ChannelListItem>
        /** Re-authenticate a channel — forwarded to `ChannelList`. */
        onReconnectChannel: (channelId: string) => void
        /** Open the `ConnectChannelModal` flow (an overlay this page never mounts itself). */
        onConnectNew: () => void
        /** The CURRENT PAGE of threads — forwarded to `ChannelInbox`. */
        threads: ReadonlyArray<ChannelInboxThread>
        /** 1-based current page — forwarded to `ChannelInbox`. */
        currentPage: number
        /** Total number of pages — forwarded to `ChannelInbox`. */
        totalPages: number
        /** Fires with a 1-based page number — forwarded to `ChannelInbox`. */
        onPageChange: (pageNumber: number) => void
        /** Opens one thread into `ThreadDrawer` (an overlay this page never mounts itself). */
        onOpenThread: (threadId: string) => void
        /** Opens a healthy channel's inbox view — forwarded to `ChannelList`. */
        onViewChannel: (channelId: string) => void
    }
    | {
        key: "workflows"
        /** The pod's n8n workflows — forwarded to `N8nWorkflowTable`. */
        workflows: Array<AgentOsWorkflowRow>
        /** Turn a workflow on/off — forwarded to `N8nWorkflowTable`. */
        onToggleWorkflow: (workflowId: string, active: boolean) => void
        /** Deep-links into the n8n builder — forwarded to `N8nWorkflowTable`. */
        onEditWorkflow: (workflowId: string) => void
        /** Id of the workflow whose toggle is in flight, or null — forwarded to `N8nWorkflowTable`. */
        togglingId?: string | null
    }
    | {
        key: "knowledge"
        /** The pod's knowledge sources — forwarded to `KnowledgeSection`. */
        sources: Array<KnowledgeSourceRow>
        /** Opens the add-source flow — forwarded to `KnowledgeSection`. */
        onAddSource: () => void
    }
    | {
        key: "models"
        /** The models available to the pod — forwarded to `ModelsSection`. */
        models: Array<AgentOsModelRow>
    }
    | {
        key: "tools"
        /** The tools available to the pod — forwarded to `ToolsSection`. */
        tools: Array<AgentOsToolRow>
        /** Turn a tool on/off — forwarded to `ToolsSection`. */
        onToggleTool: (toolId: string, enabled: boolean) => void
        /** Id of the tool whose toggle is in flight, or null — forwarded to `ToolsSection`. */
        togglingId?: string | null
    }
    | {
        key: "playground"
        /** Already-resolved caption naming the agent under test — forwarded to `PlaygroundPanel`. */
        agentLabel: string
        /** The test conversation, oldest first — forwarded to `PlaygroundPanel`. */
        turns: Array<PlaygroundTurn>
        /** The composer's current text — forwarded to `PlaygroundPanel`. */
        composerValue: string
        /** Fires as the composer changes — forwarded to `PlaygroundPanel`. */
        onComposerChange: (value: string) => void
        /** Sends the test message — forwarded to `PlaygroundPanel`. */
        onSend: () => void
        /** `true` → a reply is in flight — forwarded to `PlaygroundPanel`. */
        isSending?: boolean
    }

/** Fields every loaded (non-skeleton) status shares. */
interface AgentOsConsoleLoadedCommon {
    /** Pod identity — forwarded to `AgentOsHeader`. */
    pod: AgentOsConsolePod
    /** Which sub-nav section is currently open. */
    activeSection: AgentOsConsoleSectionKey
    /** Select a section — the connected layer swaps `section` to match. */
    onSelectSection: (sectionKey: string) => void
    /** Which sub-nav rendering to draw — forwarded to `AgentOsSubNav`. Default `"mini-rail"` (the proposal's own recommendation). */
    subNavVariant?: "mini-rail" | "segmented"
    /** Already-localized copy. */
    labels: AgentOsConsoleLabels
}

/**
 * Props for {@link AgentOsConsole} — a discriminated union on `status`
 * (`AgentOsHeader`'s own per-status actions), with a leading `isSkeleton`
 * branch bare of every other field, the same shape `AgentOsHeader` itself
 * uses: before the pod's status is known the console mirrors `overview`'s
 * shape, so no `status`/`section`/`pod` is required in that arm.
 */
export type AgentOsConsoleProps =
    | { isSkeleton: true; labels: AgentOsConsoleLabels; subNavVariant?: "mini-rail" | "segmented" }
    | (AgentOsConsoleLoadedCommon & { isSkeleton?: false } & (
        | { status: "active"; onViewLog: () => void; onSuspend: () => void; isSuspending?: boolean; section: AgentOsConsoleSection }
        | { status: "suspended"; onResume: () => void; isResuming?: boolean; section: Extract<AgentOsConsoleSection, { key: "overview" }> }
        | { status: "failed"; onViewLog: () => void; onRetry: () => void; isRetrying?: boolean; section: Extract<AgentOsConsoleSection, { key: "overview" }> }
    ))

/** The nine sub-nav sections, in display order — `events` is the permanent stub (see the file header). */
const SECTION_ORDER: ReadonlyArray<AgentOsConsoleSectionKey | "events"> = [
    "overview",
    "agents",
    "channels",
    "workflows",
    "knowledge",
    "models",
    "tools",
    "playground",
    "events",
]

/** Section → its sub-nav glyph. Fixed brand vocabulary, not text — no label lives here. */
const SECTION_ICON: Record<AgentOsConsoleSectionKey | "events", AgentOsSubNavIcon> = {
    overview: HouseIcon,
    agents: RobotIcon,
    channels: ChatsCircleIcon,
    workflows: FlowArrowIcon,
    knowledge: BookOpenIcon,
    models: CpuIcon,
    tools: PuzzlePieceIcon,
    playground: PlayCircleIcon,
    events: ActivityIcon,
}

/** Placeholder KPI cells for the `isSkeleton` mirror — shimmer covers the text either way. */
const SKELETON_KPIS: readonly [AgentOsConsoleKpi, AgentOsConsoleKpi, AgentOsConsoleKpi, AgentOsConsoleKpi] = [
    { label: "Metric", value: "0" },
    { label: "Metric", value: "0" },
    { label: "Metric", value: "0" },
    { label: "Metric", value: "0" },
]

/** Builds `StatGridCard`'s cells from the overview's four KPIs — one `StatPair` per cell. */
const buildKpiItems = (kpis: readonly [AgentOsConsoleKpi, AgentOsConsoleKpi, AgentOsConsoleKpi, AgentOsConsoleKpi]): Array<StatGridCardItem> =>
    kpis.map((kpi, index) => ({
        key: `kpi-${index}`,
        content: ({ isSkeleton }: SkeletonProps) => <StatPair value={kpi.value} label={kpi.label} isSkeleton={isSkeleton} />,
    }))

/**
 * The active section's own content, as one `StackV`-buildable item PER BLOCK —
 * never a single Fragment holding several, so the shared `StackV` below still
 * puts its own gap seam BETWEEN, say, `HealthCard` and `OpsEventTable` rather
 * than losing it inside one merged node. A single-block section (e.g.
 * `workflows`) is simply an array of one; the seam only ever shows between
 * two or more.
 */
const renderSectionItems = (section: AgentOsConsoleSection, labels: AgentOsConsoleLabels): Array<ComponentTypeWithSkeleton> => {
    switch (section.key) {
        case "overview":
            return [
                () => <StatGridCard items={buildKpiItems(section.kpis)} />,
                () => <HealthCard healthPercent={section.healthPercent} labels={labels.overview.health} />,
                () => <OpsEventTable events={section.events} labels={labels.overview.events} />,
            ]
        case "agents":
            return [
                () =>
                    section.agents.length === 0 ? (
                        <EmptyState icon={RobotIcon} title={labels.agents.emptyTitle} description={labels.agents.emptyDescription} />
                    ) : (
                        <Grid
                            columns={{ base: 1, sm: 2, lg: 4 }}
                            gap={4}
                            items={section.agents.map((agent) => ({
                                key: agent.id,
                                content: () => (
                                    <AgentCard
                                        name={agent.name}
                                        model={agent.model}
                                        channels={agent.channels}
                                        status={agent.status}
                                        onOpen={() => section.onOpenAgent(agent.id)}
                                        labels={labels.agents}
                                    />
                                ),
                            }))}
                        />
                    ),
            ]
        case "channels":
            return [
                () => (
                    <ChannelList
                        channels={section.channels}
                        onViewChannel={section.onViewChannel}
                        onReconnectChannel={section.onReconnectChannel}
                        onConnectNew={section.onConnectNew}
                        labels={labels.channels.list}
                    />
                ),
                () => (
                    <ChannelInbox
                        threads={section.threads}
                        currentPage={section.currentPage}
                        totalPages={section.totalPages}
                        onPageChange={section.onPageChange}
                        onOpenThread={section.onOpenThread}
                        labels={labels.channels.inbox}
                    />
                ),
            ]
        case "workflows":
            return [
                () => (
                    <N8nWorkflowTable
                        workflows={section.workflows}
                        onToggleWorkflow={section.onToggleWorkflow}
                        onEditWorkflow={section.onEditWorkflow}
                        togglingId={section.togglingId}
                        labels={labels.workflows}
                    />
                ),
            ]
        case "knowledge":
            return [() => <KnowledgeSection sources={section.sources} onAddSource={section.onAddSource} labels={labels.knowledge} />]
        case "models":
            return [() => <ModelsSection models={section.models} labels={labels.models} />]
        case "tools":
            return [
                () => (
                    <ToolsSection
                        tools={section.tools}
                        onToggleTool={section.onToggleTool}
                        togglingId={section.togglingId}
                        labels={labels.tools}
                    />
                ),
            ]
        case "playground":
            return [
                () => (
                    <PlaygroundPanel
                        agentLabel={section.agentLabel}
                        turns={section.turns}
                        composerValue={section.composerValue}
                        onComposerChange={section.onComposerChange}
                        onSend={section.onSend}
                        isSending={section.isSending}
                        labels={labels.playground}
                    />
                ),
            ]
    }
}

/**
 * The `/agent-os` manage console. See the file header for why `status` locks
 * every section but `overview`, and how `isSkeleton` mirrors that same shape.
 *
 * @param props - {@link AgentOsConsoleProps}
 */
const AgentOsConsole = (props: AgentOsConsoleProps) => {
    const shell = (children: ReactNode) => (
        <div data-tier="page" data-component="AgentOsConsole" className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
            {children}
        </div>
    )

    const subNavVariant = props.subNavVariant ?? "mini-rail"

    // ── MASTHEAD: `props.status` picks which arm `AgentOsHeader` renders — read
    // off `props.status` directly (not a destructured copy) so the union narrows
    // the SAME branch every handler below reads from.
    const header: ReactNode = props.isSkeleton ? (
        <AgentOsHeader isSkeleton />
    ) : props.status === "active" ? (
        <AgentOsHeader
            status="active"
            podName={props.pod.podName}
            externalWorkspaceRef={props.pod.externalWorkspaceRef}
            labels={props.labels.header}
            onViewLog={props.onViewLog}
            onSuspend={props.onSuspend}
            isSuspending={props.isSuspending}
        />
    ) : props.status === "suspended" ? (
        <AgentOsHeader
            status="suspended"
            podName={props.pod.podName}
            externalWorkspaceRef={props.pod.externalWorkspaceRef}
            labels={props.labels.header}
            onResume={props.onResume}
            isResuming={props.isResuming}
        />
    ) : (
        <AgentOsHeader
            status="failed"
            podName={props.pod.podName}
            externalWorkspaceRef={props.pod.externalWorkspaceRef}
            labels={props.labels.header}
            onViewLog={props.onViewLog}
            onRetry={props.onRetry}
            isRetrying={props.isRetrying}
        />
    )

    // ── READ-ONLY BANNER: only `suspended`/`failed` ever surface one, and each
    // fires the SAME handler its masthead action does — one operation, two triggers.
    const banner: ReactNode = !props.isSkeleton && props.status === "suspended" ? (
        <Callout
            status="warning"
            title={props.labels.suspendedBanner.title}
            description={props.labels.suspendedBanner.description}
            actionLabel={props.labels.suspendedBanner.actionLabel}
            onAction={props.onResume}
        />
    ) : !props.isSkeleton && props.status === "failed" ? (
        <Callout
            status="danger"
            title={props.labels.failedBanner.title}
            description={props.labels.failedBanner.description}
            actionLabel={props.labels.failedBanner.actionLabel}
            onAction={props.onRetry}
        />
    ) : null

    // ── SUB-NAV: locked to `overview` whenever the pod itself is not `active`
    // (§ file header) — `events` is locked unconditionally, it has no screen yet.
    const isLocked = !props.isSkeleton && props.status !== "active"
    const activeKey = props.isSkeleton ? "overview" : props.activeSection
    const sections: Array<AgentOsSubNavSection> = SECTION_ORDER.map((key) => ({
        key,
        label: props.labels.sections[key],
        icon: SECTION_ICON[key],
        isDisabled: key === "events" || (isLocked && key !== "overview"),
    }))
    const subNav: ReactNode = (
        <AgentOsSubNav
            sections={sections}
            activeKey={activeKey}
            onSelect={props.isSkeleton ? () => {} : props.onSelectSection}
            variant={subNavVariant}
            isSkeleton={props.isSkeleton}
        />
    )

    // ── SECTION BODY: `isSkeleton` mirrors `overview`'s shape regardless of
    // which section was open — the first load has nothing else to show yet.
    // Every branch renders through the SAME wrapping `StackV`, so a
    // single-block section (e.g. `workflows`) and a multi-block one (e.g.
    // `overview`) share one width contract.
    const sectionBody: ReactNode = (
        <StackV
            gap={6}
            classNames={["min-w-0", "flex-1"]}
            isSkeleton={props.isSkeleton}
            items={
                props.isSkeleton
                    ? [
                        () => <StatGridCard items={buildKpiItems(SKELETON_KPIS)} isSkeleton />,
                        () => <HealthCard healthPercent={0} labels={props.labels.overview.health} isSkeleton />,
                        () => <OpsEventTable events={[]} labels={props.labels.overview.events} isSkeleton />,
                    ]
                    : renderSectionItems(props.section, props.labels)
            }
        />
    )

    const body: ReactNode = subNavVariant === "segmented" ? (
        <StackV gap={4} items={[() => subNav, () => sectionBody]} />
    ) : (
        <StackH gap={4} align="start" items={[() => subNav, () => sectionBody]} />
    )

    return shell(
        <StackV
            gap={6}
            items={[
                () => header,
                ...(banner ? [() => banner] : []),
                () => body,
            ]}
        />,
    )
}

export { AgentOsConsole }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "page", name: "AgentOsConsole" } as const
