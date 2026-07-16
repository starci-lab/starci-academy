import type { Meta, StoryObj } from "@storybook/nextjs"
import { CloudWarningIcon } from "@phosphor-icons/react"
import { Label, Typography } from "@heroui/react"
import { ErrorContent } from "@/components/blocks/async/ErrorContent"

const meta: Meta<typeof ErrorContent> = {
    title: "Blocks/Async/ErrorContent",
    component: ErrorContent,
}
export default meta
type Story = StoryObj<typeof ErrorContent>

/** Use as the default errorContent of AsyncContent when a data-loading request fails and the user can retry. */
export const Default: Story = {
    parameters: { usage: "Use as the default errorContent of AsyncContent when a data-loading request fails and the user can retry." },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Default</Label>
                <Typography type="body-sm" color="muted">
                    A load error that retrying can fix — this is AsyncContent's default errorContent.
                </Typography>
            </div>
            <ErrorContent
                title="Couldn't load data"
                description="Something went wrong, please try again later."
                onRetry={() => {}}
                retryLabel="Try again"
            />
        </div>
    ),
}

/** Use when you only need a brief error message with no recovery action to offer the user. */
export const WithoutRetry: Story = {
    parameters: { usage: "Use when you only need a brief error message with no recovery action to offer the user." },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Without retry button</Label>
                <Typography type="body-sm" color="muted">
                    An error that retrying WON'T fix (not found, no permission) — don't invite a tap on a button that can't help.
                </Typography>
            </div>
            <ErrorContent title="Content not found" />
        </div>
    ),
}

/** Use when you want to replace the default warning icon with one that better fits a specific error context. */
export const CustomIcon: Story = {
    parameters: { usage: "Use when you want to replace the default warning icon with one that better fits a specific error context." },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Custom icon</Label>
                <Typography type="body-sm" color="muted">
                    A kind of error an icon states more clearly than the generic warning octagon (maintenance, lost connection).
                </Typography>
            </div>
            <ErrorContent
                icon={<CloudWarningIcon aria-hidden focusable="false" weight="duotone" className="size-8 text-foreground" />}
                title="Server under maintenance"
                description="Please check back in a few minutes."
                onRetry={() => {}}
                retryLabel="Check again"
            />
        </div>
    ),
}
