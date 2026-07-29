import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { ThreadConnector } from "@sb-components/atoms/display/ThreadConnector/ThreadConnector"
import { StackH } from "@sb-components/frames/Stack/Stack"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `ThreadConnector`: the curved guide line linking a comment's avatar
 * down into a reply composer's own avatar (thầy 2026-07-29, Facebook-style
 * nested reply). Same family as `Stack.nested`'s straight indent-guide border,
 * bent into a corner instead of a straight drop.
 */
const meta: Meta<typeof ThreadConnector> = {
    title: "Atoms/Display/ThreadConnector/ThreadConnector",
    component: ThreadConnector,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ThreadConnector>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Avatar": { tier: "atom", role: "the parent comment's avatar (above) and the reply composer's own avatar (below) the connector links", storyId: "atoms-display-avatar-avatar--default" },
}

/** LEAF — the connector sitting beside a reply composer's own avatar, under a parent comment. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ThreadConnector"
                tier="atom"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                states={[
                    {
                        name: "beside a reply composer's avatar",
                        why: "`ml-4` centers the line under a `size=\"sm\"` avatar's own center (32px wide); `self-stretch` fills whatever height the reply row ends up being, curving into the reply avatar's left edge.",
                        code: `<StackH gap="tight" align="stretch">
    <ThreadConnector />
    <Avatar name="Bạn" seed="viewer-1" size="sm" />
</StackH>`,
                        render: (
                            <StackH gap="tight" align="stretch">
                                <ThreadConnector />
                                <Avatar name="Bạn" seed="viewer-1" size="sm" />
                            </StackH>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
