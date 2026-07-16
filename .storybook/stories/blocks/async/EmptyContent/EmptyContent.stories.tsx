import type { Meta, StoryObj } from "@storybook/nextjs"
import { CalendarBlankIcon } from "@phosphor-icons/react"
import { Label, Typography } from "@heroui/react"
import { EmptyContent } from "@/components/blocks/async/EmptyContent"

const meta: Meta<typeof EmptyContent> = {
    title: "Blocks/Async/EmptyContent",
    component: EmptyContent,
}
export default meta
type Story = StoryObj<typeof EmptyContent>

/** Use when a list or data block has nothing to show and you just need to let the user know. */
export const Default: Story = {
    parameters: { usage: "Use when a list or data block has nothing to show and you just need to let the user know." },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Default</Label>
                <Typography type="body-sm" color="muted">
                    Just signals emptiness, with no action to suggest — the list has nothing yet and that's perfectly normal.
                </Typography>
            </div>
            <EmptyContent title="No content yet" />
        </div>
    ),
}

/** Use when a data-loading error can be recovered by retrying and needs a clear action button. */
export const WithRetry: Story = {
    parameters: { usage: "Use when a data-loading error can be recovered by retrying and needs a clear action button." },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With retry button</Label>
                <Typography type="body-sm" color="muted">
                    Empty because the load failed and the user can retry. Needs BOTH onRetry AND retryLabel — miss either one and the button won't render.
                </Typography>
            </div>
            <EmptyContent
                title="Couldn't load data"
                description="Something went wrong while loading the content. Please try again."
                onRetry={() => {}}
                retryLabel="Try again"
            />
        </div>
    ),
}

/** Use when a specific empty context (a calendar or cart, say) needs its own icon instead of the default tray icon. */
export const WithCustomIcon: Story = {
    parameters: { usage: "Use when a specific empty context (a calendar or cart, say) needs its own icon instead of the default tray icon." },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Custom icon</Label>
                <Typography type="body-sm" color="muted">
                    A specific empty context (calendar, cart) where the default tray icon feels too generic.
                </Typography>
            </div>
            <EmptyContent
                icon={<CalendarBlankIcon aria-hidden focusable="false" weight="duotone" className="size-8 text-foreground" />}
                title="No scheduled sessions yet"
                description="Your class schedule is currently empty."
            />
        </div>
    ),
}
