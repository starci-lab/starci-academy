import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"

import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { content, skeleton } from "./components"

const meta: Meta<typeof AsyncContent> = {
    title: "Core/Async/AsyncContent",
    component: AsyncContent,
}

export default meta

type Story = StoryObj<typeof AsyncContent>

/** The four branches of `AsyncContent` side by side in exact priority order error → loading → empty → content — the only logic this wrapper holds. */
export const Branches: Story = {
    parameters: { usage: "Compare all 4 branches side by side to see the priority order error → loading → empty → content that every data-backed region runs through. Use it when you need the whole async switch at a glance rather than a demo of each state in isolation." },
    render: () => (
        <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Error (highest priority)</Label>
                    <Typography type="body-sm" color="muted">
                        Wins over every other branch. Needs BOTH error AND errorContent — pass an error but
                        forget errorContent and it falls through to the loading branch, silently swallowing the error.
                    </Typography>
                </div>
                <AsyncContent
                    isLoading={false}
                    error={new globalThis.Error("boom")}
                    skeleton={skeleton}
                    errorContent={{ title: "Couldn't load the list", onRetry: () => {}, retryLabel: "Try again" }}
                >
                    {content}
                </AsyncContent>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Loading</Label>
                    <Typography type="body-sm" color="muted">
                        The FIRST load, with nothing in hand yet — pass a settled condition, for example isLoading and
                        an still-empty list. Don't turn it on for a background revalidate once you already have data,
                        or the skeleton flickers over content the user is reading.
                    </Typography>
                </div>
                <AsyncContent isLoading skeleton={skeleton}>{content}</AsyncContent>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Empty</Label>
                    <Typography type="body-sm" color="muted">
                        Finished loading but no data — differs from Error in that nobody did anything wrong. Omit emptyContent
                        and the section HIDES ITSELF (renders null) instead of showing an empty frame.
                    </Typography>
                </div>
                <AsyncContent
                    isLoading={false}
                    isEmpty
                    skeleton={skeleton}
                    emptyContent={{ title: "No submissions yet", description: "Complete a challenge to see it here." }}
                >
                    {content}
                </AsyncContent>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Content</Label>
                    <Typography type="body-sm" color="muted">
                        The final branch: no error, done loading, has data → render children.
                    </Typography>
                </div>
                <AsyncContent isLoading={false} skeleton={skeleton}>{content}</AsyncContent>
            </div>
        </div>
    ),
}
