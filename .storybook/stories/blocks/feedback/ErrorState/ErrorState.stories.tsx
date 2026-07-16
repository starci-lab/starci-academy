import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { ErrorState } from "@/components/blocks/feedback/ErrorState"

const meta: Meta<typeof ErrorState> = {
    title: "Blocks/Feedback/ErrorState",
    component: ErrorState,
}
export default meta
type Story = StoryObj<typeof ErrorState>

/** Use when data loading fails and can be retried right away: shows a title, short description, and a retry button. */
export const Default: Story = {
    parameters: { usage: "Use when data loading fails and can be retried right away: shows a title, short description, and a retry button." },
    render: () => (
        <ErrorState
            title="Couldn't load data"
            description="Something went wrong while loading the content. Please try again."
            retryLabel="Try again"
            onRetry={() => {}}
        />
    ),
}

/** Use when the error has no recovery action: compares a title-only variant and one with an added description, neither showing a retry button. */
export const WithoutRetry: Story = {
    parameters: { usage: "Use when the error has no recovery action: compares a title-only variant and one with an added description, neither showing a retry button." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Title only</Label>
                    <Typography type="body-sm" color="muted">Use when the error is self-explanatory and there's nothing more to explain — pass only the title.</Typography>
                </div>
                <ErrorState title="An error occurred" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Title and description</Label>
                    <Typography type="body-sm" color="muted">Use when you need to spell out the cause — add a description but still without a recovery action.</Typography>
                </div>
                <ErrorState
                    title="Course not found"
                    description="This course may have been removed or the link is no longer valid."
                />
            </div>
        </div>
    ),
}

/** Use with a long error message to check that the description wraps and stays centered without breaking the layout. */
export const LongDescription: Story = {
    parameters: { usage: "Use with a long error message to check that the description wraps and stays centered without breaking the layout." },
    render: () => (
        <ErrorState
            title="Connection to the server was interrupted"
            description="The system is having trouble connecting to the server, possibly due to an unstable network or scheduled maintenance. Please check your network connection and try again in a few minutes."
            retryLabel="Try again"
            onRetry={() => {}}
        />
    ),
}
