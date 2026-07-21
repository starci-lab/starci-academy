import type { Meta, StoryObj } from "@storybook/nextjs"

import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { Gallery, Variant } from "../../../../story-kit"
import { content, skeleton } from "./components"

const meta: Meta<typeof AsyncContent> = {
    title: "Blocks/Async/AsyncContent",
    component: AsyncContent,
}

export default meta

type Story = StoryObj<typeof AsyncContent>

/**
 * The four branches of `AsyncContent` side by side in exact priority order
 * error → loading → empty → content — the only logic this wrapper holds. Use
 * it to see the whole async switch at a glance rather than a demo of each
 * state in isolation.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Error (highest priority)"
                hint="Wins over every other branch. Needs BOTH error AND errorContent — pass an error but forget errorContent and it falls through to the loading branch, silently swallowing the error."
            >
                <AsyncContent
                    isLoading={false}
                    error={new globalThis.Error("boom")}
                    skeleton={skeleton}
                    errorContent={{ title: "Couldn't load the list", onRetry: () => {}, retryLabel: "Try again" }}
                >
                    {content}
                </AsyncContent>
            </Variant>
            <Variant
                label="Loading"
                hint="The FIRST load, with nothing in hand yet — pass a settled condition, for example isLoading and an still-empty list. Don't turn it on for a background revalidate once you already have data, or the skeleton flickers over content the user is reading."
            >
                <AsyncContent isLoading skeleton={skeleton}>{content}</AsyncContent>
            </Variant>
            <Variant
                label="Empty"
                hint="Finished loading but no data — differs from Error in that nobody did anything wrong. Omit emptyContent and the section HIDES ITSELF (renders null) instead of showing an empty frame."
            >
                <AsyncContent
                    isLoading={false}
                    isEmpty
                    skeleton={skeleton}
                    emptyContent={{ title: "No submissions yet", description: "Complete a challenge to see it here." }}
                >
                    {content}
                </AsyncContent>
            </Variant>
            <Variant
                label="Content"
                hint="The final branch: no error, done loading, has data → render children."
            >
                <AsyncContent isLoading={false} skeleton={skeleton}>{content}</AsyncContent>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Compare all 4 branches side by side to see the priority order error → loading → empty → content " +
            "that every data-backed region runs through. Use it when you need the whole async switch at a " +
            "glance rather than a demo of each state in isolation.",
    },
}
