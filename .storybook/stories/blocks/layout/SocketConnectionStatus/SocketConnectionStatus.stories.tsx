import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { SocketConnectionStatus } from "@/components/blocks/layout/SocketConnectionStatus"
import { SocketScenario } from "./components"

const meta: Meta<typeof SocketConnectionStatus> = {
    title: "Core/Layout/SocketConnectionStatus",
    component: SocketConnectionStatus,
}
export default meta
type Story = StoryObj<typeof SocketConnectionStatus>

/** Use when losing realtime doesn't BLOCK anything — the app keeps running over HTTP, so this is a notifying toast, not a blocking Modal or an error toast that forces the user to click. If a disconnect truly blocks an action, that's a job for a Modal, not this block. */
export const Default: Story = {
    parameters: { usage: "Use when losing realtime doesn't BLOCK anything — the app keeps running over HTTP, so this is a notifying toast (in the same `ToastProvider` queue as every other toast), not a blocking Modal. If a disconnect truly blocks an action, that's a job for a Modal, not this block." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Normal connection</Label>
                <Typography type="body-sm" color="muted">
                    The steady state: every socket is alive, so no toast fires. An empty canvas is CORRECT — the block only speaks up when something goes wrong; it doesn't take up space constantly to report that everything is fine.
                </Typography>
            </div>
            <SocketScenario scenario="stable" />
        </div>
    ),
}

/** Use to inspect the "disconnected" branch: the toast only appears after the socket has been dead longer than the 2-second grace period, so a brief network blip never makes it pop out. */
export const Down: Story = {
    name: "Reconnecting",
    parameters: { usage: "Use to inspect the \"disconnected\" branch: the warning toast only appears after the socket has been dead longer than the 2-second grace period (`timeout: 0` — it stays until reconnected), so a brief network blip never makes it pop out." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Reconnecting</Label>
                <Typography type="body-sm" color="muted">
                    The state after the socket has been dead past the 2-second grace period: a warning toast appears and stays until it reconnects. Wait about 2 seconds after opening the story for it to appear — that's the grace period actually running.
                </Typography>
            </div>
            <SocketScenario scenario="drop" />
        </div>
    ),
}

/** Use to inspect the "reconnected" branch: the toast switches to success on its own, then auto-hides after 1.5 seconds; the user doesn't have to click anything to close it. */
export const Recovered: Story = {
    name: "Reconnected",
    parameters: { usage: "Use to inspect the \"reconnected\" branch: close the warning toast, fire a success toast, then auto-hide after 1.5 seconds — the user doesn't have to click anything to close it." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Reconnected</Label>
                <Typography type="body-sm" color="muted">
                    The closing-loop state: after reconnecting, the toast confirms for 1.5 seconds then disappears on its own. The story runs the full drop-then-reconnect scenario, so wait a few seconds to see all three stages: hidden, dropped, confirmed.
                </Typography>
            </div>
            <SocketScenario scenario="recover" />
        </div>
    ),
}
