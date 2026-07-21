import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, ToastProvider } from "@heroui/react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import { fire } from "./components"

/**
 * `toast` — a TRANSIENT (self-dismissing) notification for the result of an action: saved / submitted OK /
 * error / warning. Call it IMPERATIVELY as `toast.<status>(title, { description })`, do NOT render it
 * as a component. It needs a `<ToastProvider />` mounted once in the layout (in the app: `InnerLayout`);
 * the story mounts it itself for the demo. An error that REQUIRES the user to act → use `Callout`/inline, not a toast.
 */
const meta: Meta = {
    title: "Legacy/Overlays/Toast",
}

export default meta

type Story = StoryObj

/** Press each button to fire a toast by status — each status is a distinct shade (success/error/warning/info). */
export const Default: Story = {
    parameters: {
        usage: "A transient notification: `toast.<status>(title, { description })`. status = success/danger/warning/info. Needs a `<ToastProvider/>` mounted in the layout.",
    },
    render: () => (
        <>
            <ToastProvider />
            <div className="flex flex-wrap gap-3">
                <Button size="sm" variant="secondary" onPress={fire.success}>
                    success
                </Button>
                <Button size="sm" variant="secondary" onPress={fire.danger}>
                    danger
                </Button>
                <Button size="sm" variant="secondary" onPress={fire.warning}>
                    warning
                </Button>
                <Button size="sm" variant="secondary" onPress={fire.info}>
                    info
                </Button>
            </div>
        </>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(await canvas.findByRole("button", { name: "success" }))
        await waitFor(() => expect(screen.getByText("Progress saved")).toBeInTheDocument())
    },
}
