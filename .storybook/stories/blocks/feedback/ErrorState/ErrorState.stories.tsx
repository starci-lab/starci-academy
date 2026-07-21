import type { Meta, StoryObj } from "@storybook/nextjs"
import { ErrorState } from "./ErrorState"

const meta: Meta<typeof ErrorState> = {
    title: "Primitives/Feedback/ErrorState",
    component: ErrorState,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ErrorState>

/** A failed load that can be retried immediately — title, short description, and a retry button. */
export const WithRetry: Story = {
    render: () => (
        <div className="p-8">
            <ErrorState
                title="Couldn't load data"
                description="Something went wrong while loading the content. Please try again."
                retryLabel="Try again"
                onRetry={() => {}}
            />
        </div>
    ),
}

/** Self-explanatory error — only a title, no description or retry. */
export const TitleOnly: Story = {
    render: () => (
        <div className="p-8">
            <ErrorState title="An error occurred" />
        </div>
    ),
}

/** An error with no remedy — title + description explain the cause, but no retry button. */
export const TitleAndDescription: Story = {
    render: () => (
        <div className="p-8">
            <ErrorState
                title="Course not found"
                description="This course may have been removed or the link is no longer valid."
            />
        </div>
    ),
}

/** Long message — checks the description wraps and stays centered without breaking layout. */
export const LongDescription: Story = {
    render: () => (
        <div className="p-8">
            <ErrorState
                title="Connection to the server was interrupted"
                description="The system is having trouble connecting to the server, possibly due to an unstable network or scheduled maintenance. Please check your network connection and try again in a few minutes."
                retryLabel="Try again"
                onRetry={() => {}}
            />
        </div>
    ),
}
