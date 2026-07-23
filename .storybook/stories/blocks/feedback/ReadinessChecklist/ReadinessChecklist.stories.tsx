import type { Meta, StoryObj } from "@storybook/nextjs"
import { CircuitryIcon, CloudIcon, DatabaseIcon, RobotIcon } from "@phosphor-icons/react"
import { ReadinessChecklist, type ReadinessChecklistItem } from "./ReadinessChecklist"
import { SurfaceListCard } from "../../cards/SurfaceListCard/SurfaceListCard"

const meta: Meta<typeof ReadinessChecklist> = {
    title: "Block/Feedback/ReadinessChecklist",
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

/** All waiting — no prerequisite ready yet (right after the local model cluster boots, no health check passed). */
export const AllWaiting: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <SurfaceListCard bordered>
                    <ReadinessChecklist
                        items={ITEMS}
                        readyLabel="Sẵn sàng"
                        pendingLabel="Chờ"
                    />
                </SurfaceListCard>
            </div>
        </div>
    ),
}

/** Partially ready — agent + runtime are up, but the two models are still loading (mid-boot). */
export const PartiallyReady: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <SurfaceListCard bordered>
                    <ReadinessChecklist
                        items={ITEMS.map((item) => (
                            item.id === "agent" || item.id === "ollama" ? { ...item, ready: true } : item
                        ))}
                        readyLabel="Sẵn sàng"
                        pendingLabel="Chờ"
                    />
                </SurfaceListCard>
            </div>
        </div>
    ),
}
