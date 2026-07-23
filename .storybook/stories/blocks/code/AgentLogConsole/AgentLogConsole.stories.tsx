import type { Meta, StoryObj } from "@storybook/nextjs"
import { AgentLogConsole } from "./AgentLogConsole"

const meta: Meta<typeof AgentLogConsole> = {
    title: "Design/Code/AgentLogConsole",
    component: AgentLogConsole,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof AgentLogConsole>

const streamedLines = [
    { text: "$ docker compose up -d", level: "info" as const },
    { text: "Pulling postgres (postgres:16)...", level: "info" as const },
    { text: "Container academy-postgres  Started", level: "success" as const },
    { text: "Container academy-redis  Started", level: "success" as const },
    { text: "Warning: no .env found, using defaults", level: "warn" as const },
    { text: "Waiting for healthcheck...", level: "info" as const },
]

/** Mixed-level streamed log: info/success/warn lines colour-coded, pinned to the newest line. */
export const Default: Story = {
    render: () => (
        <div className="max-w-md p-8">
            <AgentLogConsole lines={streamedLines} />
        </div>
    ),
}

/** A failing step: the error line reads in danger foreground alongside the earlier info/success lines. */
export const WithError: Story = {
    render: () => (
        <div className="max-w-md p-8">
            <AgentLogConsole
                lines={[
                    { text: "$ kubectl apply -f deployment.yaml", level: "info" },
                    { text: "deployment.apps/web created", level: "success" },
                    { text: "Error: ImagePullBackOff for container web", level: "error" },
                ]}
            />
        </div>
    ),
}

/** No lines yet — the console keeps its frame and shows the muted empty hint instead of streamed text. */
export const Empty: Story = {
    render: () => (
        <div className="max-w-md p-8">
            <AgentLogConsole lines={[]} emptyHint="Chưa có log nào — chạy lệnh trên máy của bạn để bắt đầu." />
        </div>
    ),
}

/** Bare `string[]` shorthand — every line defaults to the muted "info" level. */
export const PlainStrings: Story = {
    render: () => (
        <div className="max-w-md p-8">
            <AgentLogConsole
                lines={[
                    "Connected to agent",
                    "Watching for resource changes...",
                    "Snapshot requested",
                ]}
            />
        </div>
    ),
}

/** Loading mirror — same bordered mono frame, a few varying-width placeholder lines instead of text. */
export const Skeleton: Story = {
    render: () => (
        <div className="max-w-md p-8">
            <AgentLogConsole isSkeleton />
        </div>
    ),
}

/** Custom body escape hatch — `children` overrides `lines` entirely, same mono shell. */
export const CustomChildren: Story = {
    render: () => (
        <div className="max-w-md p-8">
            <AgentLogConsole>
                <div className="text-muted">$ ping agent...</div>
                <div className="text-success-soft-foreground">Round-trip 42ms</div>
            </AgentLogConsole>
        </div>
    ),
}
