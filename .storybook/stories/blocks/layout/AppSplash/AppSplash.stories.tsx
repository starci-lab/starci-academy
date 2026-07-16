import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { AppSplash } from "@/components/blocks/layout/AppSplash"

const meta: Meta<typeof AppSplash> = {
    title: "Block/Layout/AppSplash",
    component: AppSplash,
}
export default meta
type Story = StoryObj<typeof AppSplash>

/** Use for the FIRST load (cold load / hard refresh), when there's nothing on screen yet to wait on — cover the whole screen with the StarCi lockup. For navigation between pages do NOT use this; use TopLoader instead: the old content is still there and readable, and covering it with a splash takes away what the user is reading. Both blocks share the same accent bar, differing only in whether they cover the screen. */
export const Default: Story = {
    parameters: { usage: "Use for the FIRST load (cold load / hard refresh), when there's nothing on screen yet to wait on — cover the whole screen with the StarCi lockup. For navigation between pages do NOT use this; use TopLoader instead: the old content is still there and readable, and covering it with a splash takes away what the user is reading. Both blocks share the same accent bar, differing only in whether they cover the screen." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Startup splash</Label>
                <Typography type="body-sm" color="muted">
                    the block manages its own lifecycle: it shows for at least 550ms, then fades out over 350ms and returns null permanently, so on this canvas it only flashes by in the first second or so — reload the preview to see it again. No prop keeps it on screen.
                </Typography>
            </div>
            <AppSplash />
        </div>
    ),
}
