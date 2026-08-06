import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    PodN8nWorkflowList,
    type PodN8nWorkflowListLabels,
    type PodN8nWorkflowRow,
} from "@sb-components/nivo/blocks/agent-os/PodN8nWorkflowList/PodN8nWorkflowList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PodN8nWorkflowList` — the workflows that exist on the POD's own n8n, read
 * straight from the running instance. A second, read-only list that sits BESIDE
 * the control plane's workflow table rather than replacing it: the two answer
 * different questions, and merging them would hide the ones the control plane
 * authored but the pod has never seen.
 *
 * `isActive` is the reason this block exists. An inactive workflow lists, reads
 * as finished, and never fires its trigger, so it carries a DANGER chip rather
 * than a muted one — a quiet grey row is how three dead workflows once looked
 * healthy for eleven hours.
 *
 * There is no toggle and no edit action, because the operation behind this list
 * offers neither. A no-op switch would be a dead control on the one surface whose
 * whole job is telling the truth about whether a workflow runs.
 *
 * `failure` is a NAMED REMEDY, not an error string: the pod has several distinct
 * ways to be unreachable and each has a different fix, so the caller hands the
 * sentence and the action rather than a code this block would have to interpret.
 */
const meta: Meta<typeof PodN8nWorkflowList> = {
    title: "Nivo/Blocks/AgentOs/PodN8nWorkflowList/PodN8nWorkflowList",
    component: PodN8nWorkflowList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PodN8nWorkflowList>

const LABELS: PodN8nWorkflowListLabels = {
    title: "On the pod's n8n",
    description: "Read live from your pod. Workflows nivo authored for you are listed above.",
    workflowColumn: "Workflow",
    statusColumn: "State",
    updatedColumn: "Updated",
    activeLabel: "Running",
    inactiveLabel: "Not switched on",
    noUpdatedAtLabel: "—",
    refreshLabel: "Read again",
    tableAriaLabel: "Workflows on the pod's n8n",
    emptyTitle: "The pod holds no workflows",
    emptyDescription: "Your pod answered, and its n8n has nothing in it yet.",
}

const ONE_ACTIVE: ReadonlyArray<PodN8nWorkflowRow> = [
    { id: "pod-1", name: "Reply after hours", isActive: true, updatedAtLabel: "5 minutes ago" },
]

const ONE_INACTIVE: ReadonlyArray<PodN8nWorkflowRow> = [
    { id: "pod-1", name: "Reply after hours", isActive: false, updatedAtLabel: "5 minutes ago" },
]

const MANY_MIXED: ReadonlyArray<PodN8nWorkflowRow> = [
    { id: "pod-1", name: "Reply after hours", isActive: true, updatedAtLabel: "5 minutes ago" },
    { id: "pod-2", name: "Sync orders to the sheet", isActive: false, updatedAtLabel: "1 hour ago" },
    { id: "pod-3", name: "Remind unpaid customers", isActive: true, updatedAtLabel: "2 days ago" },
    { id: "pod-4", name: "Weekly report to the owner", isActive: false, updatedAtLabel: "12 days ago" },
]

const ALL_INACTIVE: ReadonlyArray<PodN8nWorkflowRow> = [
    { id: "pod-1", name: "Reply after hours", isActive: false, updatedAtLabel: "5 minutes ago" },
    { id: "pod-2", name: "Sync orders to the sheet", isActive: false, updatedAtLabel: "1 hour ago" },
    { id: "pod-3", name: "Remind unpaid customers", isActive: false, updatedAtLabel: "2 days ago" },
]

const NO_UPDATED_AT: ReadonlyArray<PodN8nWorkflowRow> = [
    { id: "pod-1", name: "Reply after hours", isActive: true, updatedAtLabel: null },
    { id: "pod-2", name: "Sync orders to the sheet", isActive: false, updatedAtLabel: null },
]

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: {
        tier: "composite",
        role: "the titled card, with the re-read action in its header slot",
        storyId: "composites-cards-surfacecard-surfacecard--default",
    },
    Table: {
        tier: "composite",
        role: "the workflow rows — name, state, and when the pod last touched it",
        storyId: "composites-data-table-table--default",
    },
    EmptyState: {
        tier: "composite",
        role: "carries both the nothing-here answer and each named failure remedy",
        storyId: "composites-feedback-emptystate--icon-and-title",
    },
    Chip: {
        tier: "atom",
        role: "the state pill — danger when the pod will not fire the workflow",
        storyId: "atoms-chips-chip-chip--default",
    },
    Typography: {
        tier: "atom",
        role: "workflow names and update times",
        storyId: "atoms-text-typography-typography--default",
    },
    Button: {
        tier: "atom",
        role: "re-reads the pod, and carries each failure's remedy",
        storyId: "atoms-buttons-button-button--default",
    },
}

/** LEAF — one shape; empty, one, many, and each named failure are DATA states of it. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PodN8nWorkflowList"
                tier="block"
                leaf="Pod workflows"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                reason="Blocks take no `className`: this one owns the pod's own n8n listing, so empty and populated are states of one shape. It is deliberately read-only — the operation behind it has no toggle and no builder to link to, and a switch that changed nothing would be a dead control on the one surface built to say whether a workflow runs."
                states={[
                    {
                        name: "workflows = [] (the pod answered, and holds nothing)",
                        why: "A real answer, NOT a failure. A viewer with no workspace also lands here, because the operation returns an empty list rather than raising — treating that as an error would show a broken screen to somebody whose pod is simply new.",
                        code: "<PodN8nWorkflowList workflows={[]} onRefresh={refresh} labels={labels} />",
                        render: <PodN8nWorkflowList workflows={[]} onRefresh={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "one workflow, active",
                        why: "The single-row case, and the only one where the list is unambiguously healthy.",
                        code: "<PodN8nWorkflowList workflows={[oneActive]} onRefresh={refresh} labels={labels} />",
                        render: <PodN8nWorkflowList workflows={ONE_ACTIVE} onRefresh={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "one workflow, inactive",
                        why: "The same single row with the flag flipped. It exists, it lists, it reads as finished — and it will never fire. The danger chip is the only thing on screen that says so.",
                        code: "<PodN8nWorkflowList workflows={[oneInactive]} onRefresh={refresh} labels={labels} />",
                        render: <PodN8nWorkflowList workflows={ONE_INACTIVE} onRefresh={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "many, mixed",
                        why: "The ordinary populated list. Two of these four never fire, and the difference has to be readable at a glance rather than by comparing greys.",
                        code: "<PodN8nWorkflowList workflows={manyMixed} onRefresh={refresh} labels={labels} />",
                        render: <PodN8nWorkflowList workflows={MANY_MIXED} onRefresh={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "all inactive",
                        why: "The state that once passed for healthy for eleven hours: a full, tidy list where nothing runs. Rendered on purpose so nobody has to imagine it.",
                        code: "<PodN8nWorkflowList workflows={allInactive} onRefresh={refresh} labels={labels} />",
                        render: <PodN8nWorkflowList workflows={ALL_INACTIVE} onRefresh={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "updatedAtLabel = null",
                        why: "The pod reported no update time. The cell says so with a dash — never \"just now\", and never a date derived from a zero timestamp.",
                        code: "<PodN8nWorkflowList workflows={noUpdatedAt} onRefresh={refresh} labels={labels} />",
                        render: <PodN8nWorkflowList workflows={NO_UPDATED_AT} onRefresh={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "failure — the pod was never registered",
                        why: "Its own state, not a shared \"something went wrong\": the fix is to register the pod, and no amount of retrying will do it.",
                        code: "<PodN8nWorkflowList workflows={[]} failure={registrationMissing} onRefresh={refresh} labels={labels} />",
                        render: (
                            <PodN8nWorkflowList
                                workflows={[]}
                                onRefresh={NOOP}
                                failure={{
                                    title: "This pod has never registered",
                                    description: "Nothing has claimed a registration token for this workspace, so there is no pod to read from yet.",
                                    actionLabel: "Issue access tokens",
                                    onAction: NOOP,
                                }}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "failure — the pod's n8n credential is missing",
                        why: "A different remedy again: the pod is registered and reachable, but nothing on file can sign in to its n8n.",
                        code: "<PodN8nWorkflowList workflows={[]} failure={credentialMissing} onRefresh={refresh} labels={labels} />",
                        render: (
                            <PodN8nWorkflowList
                                workflows={[]}
                                onRefresh={NOOP}
                                failure={{
                                    title: "No n8n credential on file",
                                    description: "The pod is registered, but nothing stored can sign in to its n8n, so its workflows cannot be listed.",
                                    actionLabel: "Open channel keys",
                                    onAction: NOOP,
                                }}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "failure — the pod did not answer",
                        why: "The third remedy: nothing is misconfigured, the pod is simply not answering right now, so retrying is the whole fix.",
                        code: "<PodN8nWorkflowList workflows={[]} failure={unreachable} onRefresh={refresh} labels={labels} />",
                        render: (
                            <PodN8nWorkflowList
                                workflows={[]}
                                onRefresh={NOOP}
                                failure={{
                                    title: "The pod did not answer",
                                    description: "Its n8n could not be reached. This is usually brief — try again in a moment.",
                                    actionLabel: "Read again",
                                    onAction: NOOP,
                                }}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The first read is in flight. The card keeps its title and draws three workflow-shaped rows with every cell shimmering, so the list does not jump when the pod answers.",
                        code: "<PodN8nWorkflowList workflows={[]} onRefresh={refresh} labels={labels} isSkeleton />",
                        render: <PodN8nWorkflowList workflows={[]} onRefresh={NOOP} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
