import type { Meta, StoryObj } from "@storybook/nextjs"
import { CircuitryIcon, CloudIcon, DatabaseIcon, RobotIcon } from "@phosphor-icons/react"
import { ReadinessChecklist, type ReadinessChecklistItem } from "@sb-components/_legacy/blocks/feedback/ReadinessChecklist/ReadinessChecklist"
import { SurfaceCard } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof ReadinessChecklist> = {
    title: "Legacy/Block/Feedback/ReadinessChecklist",
    component: ReadinessChecklist,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ReadinessChecklist>

const ITEMS: Array<ReadinessChecklistItem> = [
    {
        id: "agent",
        icon: RobotIcon,
        label: "Ollama agent",
        readyDescription: "Agent is reachable and responding to health checks.",
        pendingDescription: "Waiting for the agent to come online.",
        ready: false,
    },
    {
        id: "ollama",
        icon: CircuitryIcon,
        label: "Ollama runtime",
        readyDescription: "Runtime process is up and serving requests.",
        pendingDescription: "Runtime hasn't started yet.",
        ready: false,
    },
    {
        id: "embed",
        icon: DatabaseIcon,
        label: "Embedding model",
        readyDescription: "Embedding model is pulled and loaded in memory.",
        pendingDescription: "Embedding model still needs to be pulled.",
        ready: false,
    },
    {
        id: "gen",
        icon: CloudIcon,
        label: "Generation model",
        readyDescription: "Generation model is pulled and loaded in memory.",
        pendingDescription: "Generation model still needs to be pulled.",
        ready: false,
    },
]

// ROW — one repeated per item: List.Row (leading·title·subtitle·trailing, opaque —
// badged via AnatomyOverlay) composing an IconTile (leading) + StatusChip (trailing).
const ROW_PARTS: Array<AnatomyNode> = [
    { name: "List.Row", tier: "design", role: "hàng leading·title·subtitle·trailing — lặp mỗi item", storyId: "layouts-lists-list-list-row--title-only" },
    { name: "IconTile", tier: "primitive", role: "leading — check tròn (success) khi ready, icon caller (neutral) khi chờ" },
    { name: "StatusChip", tier: "primitive", role: "trailing — nhãn Sẵn sàng/Chờ theo tone success/neutral" },
]

/** All waiting — no prerequisite ready yet (right after the local model cluster boots, no health check passed). */
export const AllWaiting: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="ReadinessChecklist"
                    tier="block"
                    leaf="AllWaiting"
                    parts={ROW_PARTS}
                    reason="Danh sách prerequisite/setup: mỗi hàng = List.Row ghép IconTile (leading) + StatusChip (trailing) theo state ready/pending của item."
                >
                    {/* 2026-07-26: bordered+flushContent (boolean) → variant="nested"+padding={0} (ba trục độc lập, thầy chốt). */}
                    <SurfaceCard.Base variant="nested" padding={0}>
                        <ReadinessChecklist
                            items={ITEMS}
                            readyLabel="Sẵn sàng"
                            pendingLabel="Chờ"
                            showAnatomy
                        />
                    </SurfaceCard.Base>
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** Partially ready — agent + runtime are up, but the two models are still loading (mid-boot). */
export const PartiallyReady: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="ReadinessChecklist"
                    tier="block"
                    leaf="PartiallyReady"
                    parts={ROW_PARTS}
                    note="CÙNG composition leaf AllWaiting; 2 hàng đầu đổi sang state ready (IconTile success + StatusChip success)."
                >
                    {/* 2026-07-26: bordered+flushContent (boolean) → variant="nested"+padding={0} (ba trục độc lập, thầy chốt). */}
                    <SurfaceCard.Base variant="nested" padding={0}>
                        <ReadinessChecklist
                            items={ITEMS.map((item) => (
                                item.id === "agent" || item.id === "ollama" ? { ...item, ready: true } : item
                            ))}
                            readyLabel="Sẵn sàng"
                            pendingLabel="Chờ"
                            showAnatomy
                        />
                    </SurfaceCard.Base>
                </BlockAnatomy>
            </div>
        </div>
    ),
}
