import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { TopLoader } from "@/components/blocks/layout/TopLoader"
import { TriggerNavigation, TriggerReducedMotion } from "./components"

const meta: Meta<typeof TopLoader> = {
    title: "Core/Layout/TopLoader",
    component: TopLoader,
}
export default meta
type Story = StoryObj<typeof TopLoader>

/** Use for navigation BETWEEN pages, when the old content is still there and readable — just a thread at the top edge saying "loading", covering nothing. The first load (cold load, nothing on screen yet) is the opposite: use AppSplash to cover the whole screen. Mount it exactly once at the layout root; it listens for navigation itself and takes no props. */
export const Default: Story = {
    parameters: { usage: "Use for navigation BETWEEN pages, when the old content is still there and readable — just a thread at the top edge saying \"loading\", covering nothing. The first load (cold load, nothing on screen yet) is the opposite: use AppSplash to cover the whole screen. Mount it exactly once at the layout root; it listens for navigation itself and takes no props." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Idle</Label>
                <Typography type="body-sm" color="muted">
                    the steady state when no navigation is running: the bar renders nothing. An empty top edge is CORRECT — the block appears only while waiting on a route, and otherwise takes up not a single pixel.
                </Typography>
            </div>
            <TopLoader />
        </div>
    ),
}

/** Use to inspect the running branch: the bar creeps toward 90% then waits, because no one knows how long the route takes — it signals "running", not a promise of how many percent remain. */
export const Navigating: Story = {
    parameters: { usage: "Use to inspect the running branch: the bar creeps toward 90% then waits, because no one knows how long the route takes — it signals \"running\", not a promise of how many percent remain." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Navigating</Label>
                <Typography type="body-sm" color="muted">
                    the state after the user clicks a link: the story fires a fake navigation on mount so the bar actually runs. Look at the top edge of the preview frame, not here.
                </Typography>
            </div>
            <TriggerNavigation />
        </div>
    ),
}

/** Use to inspect the reduced-motion branch: the bar drops the smooth creep entirely, jumping straight to a level and holding — still signaling loading with nothing crawling in peripheral vision. */
export const ReducedMotion: Story = {
    parameters: { usage: "Use to inspect the reduced-motion branch: the bar drops the smooth creep entirely, jumping straight to a level and holding — still signaling loading with nothing crawling in peripheral vision." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Reduced motion</Label>
                <Typography type="body-sm" color="muted">
                    the state when the device has prefers-reduced-motion on: it differs from the branch above in that the bar holds still at a level instead of creeping. The story forces this flag before firing the fake navigation, so you don't need to change your OS settings to see it.
                </Typography>
            </div>
            <TriggerReducedMotion />
        </div>
    ),
}
