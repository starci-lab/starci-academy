import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    AgentOsConsole,
    type AgentOsConsoleLabels,
    type AgentOsConsolePod,
    type AgentOsConsoleSection,
} from "@sb-components/nivo/pages/AgentOsConsole/AgentOsConsole"
import type { OpsEventFeedRow } from "@sb-components/nivo/blocks/agent-os/OpsEventTable/OpsEventTable"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

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
const meta: Meta<typeof AgentOsConsole> = {
    title: "Nivo/Pages/AgentOsConsole/AgentOsConsole",
    component: AgentOsConsole,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AgentOsConsole>

const NOOP = () => {}

const POD: AgentOsConsolePod = { podName: "Agent OS · Pod Pro", externalWorkspaceRef: "aos-ws-7f2a91c" }

const LABELS: AgentOsConsoleLabels = {
    header: {
        statusLabels: { provisioning: "Provisioning", active: "Running", suspended: "Suspended", failed: "Failed" },
        refLabel: "ref:",
        refPendingLabel: "waiting to be assigned…",
        viewLogLabel: "View log",
        suspendLabel: "Suspend",
        resumeLabel: "Resume",
        retryLabel: "Retry",
    },
    sections: {
        overview: "Overview",
        agents: "Agents",
        channels: "Channels",
        workflows: "Workflows",
        knowledge: "Knowledge",
        models: "Models",
        tools: "Tools",
        playground: "Playground",
        events: "Events",
    },
    overview: {
        health: { title: "Pod health", illustrativeNote: "30-day uptime · illustrative — no real operating data yet" },
        events: {
            title: "Recent events",
            description: "The pod's timestamped activity feed.",
            timeColumn: "Time",
            eventColumn: "Event",
            resultColumn: "Result",
            resultOptions: { success: "Success", info: "Info", failure: "Failure" },
            tableAriaLabel: "Recent pod events",
            emptyTitle: "No events yet",
            emptyDescription: "Activity from agents, workflows, and channels will show up here.",
        },
    },
    agents: {
        statusOptions: { active: "Active", paused: "Paused" },
        channelOptions: { zalo: "Zalo", telegram: "Telegram", whatsapp: "WhatsApp" },
        openAriaLabel: "Open agent",
        emptyTitle: "No agents yet",
        emptyDescription: "The Basic plan ships with 1 agent — create your first one to start answering customers on Zalo/Telegram.",
    },
    channels: {
        list: {
            title: "Connected channels",
            connectLabel: "Connect channel",
            channelOptions: { zalo: "Zalo", telegram: "Telegram", whatsapp: "WhatsApp" },
            statusOptions: { connected: "Connected", disconnected: "Disconnected", error: "Token error" },
            viewLabel: "View conversations",
            reconnectLabel: "Reconnect",
            emptyTitle: "No channels connected",
            emptyDescription: "Connect Zalo, Telegram, or WhatsApp so your agents can start answering customers.",
        },
        inbox: {
            title: "Conversations",
            openAriaLabel: "Open conversation",
            pagerAriaLabel: "Conversation pages",
            emptyTitle: "No conversations yet",
            emptyDescription: "Threads from every connected channel will show up here.",
        },
    },
    workflows: {
        title: "Workflows",
        description: "n8n automations wired to this pod.",
        workflowColumn: "Workflow",
        triggerColumn: "Trigger",
        activeColumn: "Active",
        lastRunColumn: "Last run",
        actionsColumn: "Actions",
        activeLabel: "Active",
        inactiveLabel: "Inactive",
        noLastRunLabel: "Never run",
        editLabel: "Edit",
        tableAriaLabel: "Pod workflows",
        emptyTitle: "No workflows yet",
        emptyDescription: "Add a workflow to automate repeat tasks — payment reminders, order syncs, recurring reports.",
    },
    knowledge: {
        title: "Knowledge",
        description: "RAG sources an agent can draw on.",
        addLabel: "Add source",
        statusOptions: { indexed: "Indexed", processing: "Processing", failed: "Failed" },
        emptyTitle: "No knowledge sources yet",
        emptyDescription: "Add a document, page, or FAQ import so agents can answer from it.",
    },
    models: {
        title: "Models",
        description: "AI models available to this pod's agents.",
        defaultLabel: "Default",
        emptyTitle: "No models available",
        emptyDescription: "Models available to this pod will show up here.",
    },
    tools: {
        title: "Tools",
        description: "Integrations an agent can call.",
        enabledLabel: "Enabled",
        disabledLabel: "Disabled",
        emptyTitle: "No tools available",
        emptyDescription: "Tools available to this pod's agents will show up here.",
    },
    playground: {
        title: "Playground",
        description: "Try an agent's replies before it goes live.",
        roleOptions: { user: "You", agent: "Agent" },
        composerPlaceholder: "Type a test message…",
        sendLabel: "Send",
        composerAriaLabel: "Test message",
        emptyTitle: "No messages yet",
        emptyDescription: "Send a message to see how the agent replies.",
    },
    suspendedBanner: {
        title: "Pod is suspended",
        description: "Agents are not replying and workflows are not running. Resume to continue operating — your data and configuration are kept as-is.",
        actionLabel: "Resume",
    },
    failedBanner: {
        title: "Could not start the pod",
        description: "Provisioning failed at the \"Connect channels\" step — the Zalo OA token is invalid. Agents stay unresponsive until a retry succeeds.",
        actionLabel: "Retry",
    },
}

const EVENTS: Array<OpsEventFeedRow> = [
    { id: "evt-1", timeLabel: "09:41", description: "Agent \"Sales — Mai\" replied to a customer on Zalo", result: "success" },
    { id: "evt-2", timeLabel: "09:22", description: "Workflow \"Sync orders → Sheet\" ran", result: "success" },
    { id: "evt-3", timeLabel: "08:55", description: "WhatsApp Business channel reconnected", result: "success" },
    { id: "evt-4", timeLabel: "08:10", description: "Agent \"Accounting — Ha\" paused by an admin", result: "info" },
    { id: "evt-5", timeLabel: "07:30", description: "Workflow \"Remind unpaid customers\" failed to send", result: "failure" },
]

const ACTIVE_OVERVIEW: AgentOsConsoleSection = {
    key: "overview",
    kpis: [
        { label: "Agents", value: "4" },
        { label: "Connected channels", value: "3" },
        { label: "Workflows on", value: "3" },
        { label: "Events today", value: "27" },
    ],
    healthPercent: 99,
    events: EVENTS,
}

const SUSPENDED_OVERVIEW: AgentOsConsoleSection = {
    key: "overview",
    kpis: [
        { label: "Agents", value: "4" },
        { label: "Connected channels", value: "3" },
        { label: "Workflows on", value: "0" },
        { label: "Events today", value: "0" },
    ],
    healthPercent: 0,
    events: [],
}

const FAILED_OVERVIEW: AgentOsConsoleSection = {
    key: "overview",
    kpis: [
        { label: "Agents", value: "4" },
        { label: "Connected channels", value: "2" },
        { label: "Workflows on", value: "0" },
        { label: "Events today", value: "3" },
    ],
    healthPercent: 0,
    events: [
        { id: "evt-fail-1", timeLabel: "07:12", description: "Zalo OA token rejected during channel connect", result: "failure" },
    ],
}

const EMPTY_AGENTS_SECTION: AgentOsConsoleSection = { key: "agents", agents: [], onOpenAgent: NOOP }

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    AgentOsHeader: {
        tier: "block",
        role: "the masthead — pod name + status chip + ref + the one primary action, which changes with `status`",
        storyId: "nivo-blocks-agentos-agentosheader-agentosheader--default",
    },
    AgentOsSubNav: {
        tier: "block",
        role: "the nine-section secondary nav; `events` is a permanent stub with no screen yet",
        storyId: "nivo-blocks-agentos-agentossubnav-agentossubnav--default",
    },
    StatGridCard: { tier: "composite", role: "the overview's four-KPI row" },
    StatPair: { tier: "composite", role: "one KPI cell (a count + its caption)" },
    HealthCard: {
        tier: "block",
        role: "the pod-health tile, illustrative-labelled",
        storyId: "nivo-blocks-agentos-healthcard-healthcard--default",
    },
    OpsEventTable: {
        tier: "block",
        role: "the recent-activity feed",
        storyId: "nivo-blocks-agentos-opseventtable-opseventtable--default",
    },
    AgentCard: {
        tier: "block",
        role: "one agent in the `agents` section's grid",
        storyId: "nivo-blocks-agentos-agentcard-agentcard--default",
    },
    EmptyState: { tier: "composite", role: "the `agents` section's empty state — no `AgentCard` grid to name it" },
    Callout: { tier: "composite", role: "the read-only banner shown while suspended/failed, sharing the header's own retry/resume handler" },
    Grid: { tier: "frame", role: "the `agents` section's card grid" },
    StackV: { tier: "frame", role: "the page's own vertical rhythm and each section's block seam" },
    StackH: { tier: "frame", role: "the mini-rail beside the section body" },
}

/** STATE — the pod is running: overview open, full data. */
export const Active: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AgentOsConsole"
                tier="screen"
                leaf="Active"
                annotate={ANNOTATE}
                reason="A page's story is one complete state per render, not a leaf-per-prop map. The pod's resting state: the masthead reads Running with Suspend as the one primary action, every sub-nav section is reachable, and the overview shows real counts, an illustrative health bar, and the recent-events feed."
                states={[
                    {
                        name: "status = active, activeSection = overview",
                        why: "The everyday landing view once a pod is up: four real KPIs, a healthy pod, and today's activity.",
                        code: `<AgentOsConsole
    status="active"
    pod={pod}
    activeSection="overview"
    onSelectSection={onSelectSection}
    section={{ key: "overview", kpis, healthPercent: 99, events }}
    onViewLog={onViewLog}
    onSuspend={onSuspend}
    labels={labels}
/>`,
                        render: (
                            <AgentOsConsole
                                status="active"
                                pod={POD}
                                activeSection="overview"
                                onSelectSection={NOOP}
                                section={ACTIVE_OVERVIEW}
                                onViewLog={NOOP}
                                onSuspend={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the console's own first fetch is in flight; everything mirrors `overview`'s shape while shimmering. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AgentOsConsole"
                tier="screen"
                leaf="Loading"
                annotate={ANNOTATE}
                reason="`isSkeleton` mirrors the SAME `overview` tree rather than swapping in a different shape — the masthead, the sub-nav, the KPI row, the health tile, and the events table each thread the co-located flag straight into their own leaves. The first load has no `activeSection` to honour yet, so it always mirrors `overview`."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Right after the route mounts, before the workspace status has resolved. Every region shows its resting shimmer shape instead of resolved counts, so nothing jumps once the data lands.",
                        code: "<AgentOsConsole isSkeleton labels={labels} />",
                        render: <AgentOsConsole isSkeleton labels={LABELS} />,
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the pod is suspended: every section but overview is locked, counts read zero. */
export const Suspended: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AgentOsConsole"
                tier="screen"
                leaf="Suspended"
                annotate={ANNOTATE}
                reason="`suspended` locks every sub-nav section but `overview` — the sub-nav renders the rest `isDisabled`, and `section` can only ever be the `overview` shape. The read-only impression comes entirely from DATA (workflows-on and events-today both read zero, the health tile carries no signal) plus the warning `Callout`, never from a page-drawn dimming treatment."
                states={[
                    {
                        name: "status = suspended",
                        why: "An owner (or the system) paused the pod. Agents stop replying and workflows stop running, but nothing is lost — Resume picks up exactly where it left off.",
                        code: `<AgentOsConsole
    status="suspended"
    pod={pod}
    activeSection="overview"
    onSelectSection={onSelectSection}
    section={{ key: "overview", kpis: suspendedKpis, healthPercent: 0, events: [] }}
    onResume={onResume}
    labels={labels}
/>`,
                        render: (
                            <AgentOsConsole
                                status="suspended"
                                pod={POD}
                                activeSection="overview"
                                onSelectSection={NOOP}
                                section={SUSPENDED_OVERVIEW}
                                onResume={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — provisioning failed on top of an otherwise-existing pod: every section but overview is locked. */
export const Failed: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AgentOsConsole"
                tier="screen"
                leaf="Failed"
                annotate={ANNOTATE}
                reason="`failed` locks the same sections `suspended` does, with a danger `Callout` explaining what broke and a danger-toned Retry as the masthead's primary action. The overview's own recent-events feed carries the failure itself as its one row, rather than the page inventing a separate error surface."
                states={[
                    {
                        name: "status = failed",
                        why: "A redeploy or a channel reconnect failed. The owner needs to know without losing the pod — the banner, the masthead, and the events feed all say so.",
                        code: `<AgentOsConsole
    status="failed"
    pod={pod}
    activeSection="overview"
    onSelectSection={onSelectSection}
    section={{ key: "overview", kpis: failedKpis, healthPercent: 0, events: failedEvents }}
    onViewLog={onViewLog}
    onRetry={onRetry}
    labels={labels}
/>`,
                        render: (
                            <AgentOsConsole
                                status="failed"
                                pod={POD}
                                activeSection="overview"
                                onSelectSection={NOOP}
                                section={FAILED_OVERVIEW}
                                onViewLog={NOOP}
                                onRetry={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the pod is active, but the open section (agents) has zero rows. */
export const EmptyInSection: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AgentOsConsole"
                tier="screen"
                leaf="Empty in section"
                annotate={ANNOTATE}
                reason="`status` stays `active` — the pod itself is healthy and every section is reachable — but the open section's own array is empty, so it falls to its own `EmptyState` rather than an empty grid. `agents` has no dedicated list block of its own (unlike `channels`/`workflows`/the stub sections, each of which already wraps its rows in a titled card with a built-in empty branch), so the page reaches for the `EmptyState` composite directly here — a composite import stays inside a page's allowed imports (never an atom)."
                states={[
                    {
                        name: "status = active, activeSection = agents, agents = []",
                        why: "A pod whose owner has not created an agent yet — the Basic plan still ships with pod access, so the section opens onto an explicit empty state rather than a blank grid.",
                        code: `<AgentOsConsole
    status="active"
    pod={pod}
    activeSection="agents"
    onSelectSection={onSelectSection}
    section={{ key: "agents", agents: [], onOpenAgent }}
    onViewLog={onViewLog}
    onSuspend={onSuspend}
    labels={labels}
/>`,
                        render: (
                            <AgentOsConsole
                                status="active"
                                pod={POD}
                                activeSection="agents"
                                onSelectSection={NOOP}
                                section={EMPTY_AGENTS_SECTION}
                                onViewLog={NOOP}
                                onSuspend={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
