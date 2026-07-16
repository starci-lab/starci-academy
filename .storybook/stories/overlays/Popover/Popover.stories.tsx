import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Popover, Typography } from "@heroui/react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

/**
 * `Popover` — a floating panel ANCHORED to its trigger, opened by CLICK/TAP (not hover). Use
 * for "look-then-return" content that needs careful reading / interaction: a price breakdown, a
 * mini-menu, a mini-form. NOT for a one-line term explanation (→ `InfoTooltip`) or a BLOCKING step
 * that requires a decision/input (→ Modal). The trigger must be a focusable element (`Button`/`<button>`).
 */
const meta: Meta<typeof Popover> = {
    title: "Overlays/Popover",
    component: Popover,
}

export default meta

type Story = StoryObj<typeof Popover>

/** Use when you need an info panel anchored to a button, opened by click/tap — works on mobile too (unlike a hover Tooltip). */
export const Default: Story = {
    parameters: {
        usage: "A panel anchored to a button, opened by click/tap (not hover) — used for breakdowns, mini-menus, mini-forms. Closes on outside click / Esc. Works on mobile too.",
    },
    render: () => (
        <Popover>
            <Popover.Trigger>
                <Button size="sm" variant="secondary">
                    Details
                </Button>
            </Popover.Trigger>
            <Popover.Content className="max-w-xs">
                <div className="flex flex-col gap-1 p-3">
                    <Typography type="body-xs" color="muted">
                        More info
                    </Typography>
                    <Typography type="body-sm">
                        The panel closes when you click outside or press Esc.
                    </Typography>
                </div>
            </Popover.Content>
        </Popover>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(await canvas.findByRole("button", { name: "Details" }))
        await waitFor(() =>
            expect(screen.getByText("The panel closes when you click outside or press Esc.")).toBeInTheDocument(),
        )
    },
}

/** Use for a content-rich panel (a title + rows of numbers) — still a click/tap Popover, content `gap-3`, the final line separated by `border-t`. */
export const RichContent: Story = {
    parameters: {
        usage: "A multi-line panel (breakdown/summary): label `text-sm text-muted`, content `gap-3`, the final line separated by `border-t` — still opened by click/tap.",
    },
    render: () => (
        <Popover>
            <Popover.Trigger>
                <Button size="sm" variant="secondary">
                    Price details
                </Button>
            </Popover.Trigger>
            <Popover.Content className="max-w-xs">
                <div className="flex flex-col gap-1 p-3">
                    <Typography type="body-xs" color="muted">
                        Price details
                    </Typography>
                    <div className="flex items-center justify-between gap-3">
                        <Typography type="body-sm">Original price</Typography>
                        <Typography type="body-sm">1.990.000₫</Typography>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <Typography type="body-sm" color="muted">Early-bird discount</Typography>
                        <Typography type="body-sm" className="text-success-soft-foreground">−400.000₫</Typography>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-default pt-1">
                        <Typography type="body-sm" weight="semibold">You pay</Typography>
                        <Typography type="body-sm" weight="semibold">1.590.000₫</Typography>
                    </div>
                </div>
            </Popover.Content>
        </Popover>
    ),
}
