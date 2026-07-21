import type { Meta, StoryObj } from "@storybook/nextjs"
import { CircuitryIcon, CloudIcon, DatabaseIcon, RobotIcon } from "@phosphor-icons/react"
import { Label, Typography } from "@heroui/react"
import { ReadinessChecklist, type ReadinessChecklistItem } from "@/components/blocks/feedback/ReadinessChecklist"
import { SurfaceListCard } from "@/components/blocks/cards/SurfaceListCard"

/**
 * `ReadinessChecklist` — a vertical list of setup/prerequisite checks (agent
 * health, model availability, indexing status…), each rendered as a `ListRow`
 * with a leading `IconTile` (success check when ready), a ready/pending
 * subtitle, and a trailing `StatusChip` spelling out the state.
 */
const meta: Meta<typeof ReadinessChecklist> = {
    title: "Blocks/Feedback/ReadinessChecklist",
    component: ReadinessChecklist,
}

export default meta

type Story = StoryObj<typeof ReadinessChecklist>

const ITEMS: Array<ReadinessChecklistItem> = [
    {
        id: "agent",
        icon: <RobotIcon aria-hidden focusable="false" />,
        label: "Ollama agent",
        readyDescription: "Agent is reachable and responding to health checks.",
        pendingDescription: "Waiting for the agent to come online.",
        ready: false,
    },
    {
        id: "ollama",
        icon: <CircuitryIcon aria-hidden focusable="false" />,
        label: "Ollama runtime",
        readyDescription: "Runtime process is up and serving requests.",
        pendingDescription: "Runtime hasn't started yet.",
        ready: false,
    },
    {
        id: "embed",
        icon: <DatabaseIcon aria-hidden focusable="false" />,
        label: "Embedding model",
        readyDescription: "Embedding model is pulled and loaded in memory.",
        pendingDescription: "Embedding model still needs to be pulled.",
        ready: false,
    },
    {
        id: "gen",
        icon: <CloudIcon aria-hidden focusable="false" />,
        label: "Generation model",
        readyDescription: "Generation model is pulled and loaded in memory.",
        pendingDescription: "Generation model still needs to be pulled.",
        ready: false,
    },
]

/** Every prerequisite is still pending — the common state right after boot. */
export const AllPending: Story = {
    tags: ["news"],
    args: {
        items: ITEMS,
        readyLabel: "Sẵn sàng",
        pendingLabel: "Chờ",
    },
    parameters: {
        usage: "Chờ duyệt — every row pending: the state right after the local model stack starts booting, before any health check has passed yet.",
    },
    render: (args) => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Local model stack — booting</Label>
                <Typography type="body-sm" color="muted">
                    None of the 4 prerequisites have reported ready yet.
                </Typography>
            </div>
            {/* mirrors the real call-site: the checklist ALWAYS renders inside a
                bounded list card, and `bordered` because that card is nested on a
                parent surface (card.md §0 "GIỮ border" / surface-in-surface). */}
            <SurfaceListCard bordered>
                <ReadinessChecklist {...args} />
            </SurfaceListCard>
        </div>
    ),
}

/** Some prerequisites are ready, others still pending — the mid-boot state. */
export const PartlyReady: Story = {
    tags: ["news"],
    args: {
        items: ITEMS.map((item) => (
            item.id === "agent" || item.id === "ollama" ? { ...item, ready: true } : item
        )),
        readyLabel: "Sẵn sàng",
        pendingLabel: "Chờ",
    },
    parameters: {
        usage: "Chờ duyệt — the agent and runtime are up, but the models are still being pulled/loaded — a realistic mid-boot snapshot.",
    },
    render: (args) => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Local model stack — mid-boot</Label>
                <Typography type="body-sm" color="muted">
                    Agent + runtime are reachable; the 2 models are still loading.
                </Typography>
            </div>
            {/* mirrors the real call-site: the checklist ALWAYS renders inside a
                bounded list card, and `bordered` because that card is nested on a
                parent surface (card.md §0 "GIỮ border" / surface-in-surface). */}
            <SurfaceListCard bordered>
                <ReadinessChecklist {...args} />
            </SurfaceListCard>
        </div>
    ),
}
