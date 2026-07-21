import type { Meta, StoryObj } from "@storybook/nextjs"
import { CircuitryIcon, CloudIcon, DatabaseIcon, RobotIcon } from "@phosphor-icons/react"
import { ReadinessChecklist, type ReadinessChecklistItem } from "@/components/blocks/feedback/ReadinessChecklist"
import { SurfaceListCard } from "@/components/blocks/cards/SurfaceListCard"
import { Gallery, Variant } from "../../../../story-kit"

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

/**
 * Toàn bộ ma trận trạng thái của ReadinessChecklist: chờ hết (ngay sau khi cụm
 * model local vừa boot) và chờ một phần (agent/runtime đã lên nhưng model còn
 * tải) — checklist luôn render trong một `SurfaceListCard bordered` vì đó là
 * cách nó được dùng thật (card lồng trên một surface cha).
 */
export const AllVariants: Story = {
    tags: ["news"],
    render: () => (
        <Gallery>
            <Variant
                label="Toàn bộ đang chờ"
                hint="Chưa có tiền điều kiện nào báo sẵn sàng — trạng thái ngay sau khi cụm model local vừa khởi động, chưa health check nào pass."
            >
                <div className="max-w-md">
                    <SurfaceListCard bordered>
                        <ReadinessChecklist
                            items={ITEMS}
                            readyLabel="Sẵn sàng"
                            pendingLabel="Chờ"
                        />
                    </SurfaceListCard>
                </div>
            </Variant>
            <Variant
                label="Một phần đã sẵn sàng"
                hint="Agent và runtime đã lên, nhưng 2 model vẫn đang tải/nạp — một lát cắt thực tế giữa quá trình boot."
            >
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
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage: "Chờ duyệt — toàn bộ ma trận trạng thái của ReadinessChecklist: chờ hết (right after boot, chưa health check nào pass) và chờ một phần (mid-boot, agent + runtime đã lên nhưng model còn tải/nạp). Checklist luôn render trong SurfaceListCard bordered vì đó mirrors call-site thật (surface-in-surface).",
    },
}
