import type { Meta, StoryObj } from "@storybook/nextjs"
import { QaChatBubble } from "@sb-components/starci/blocks/learn/QaChatBubble/QaChatBubble"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `QaChatBubble`: the one surface every message in a Q&A
 * conversation renders inside — accent+right for the viewer's own message,
 * neutral+left for anyone else's. `rounded-2xl`, the documented chat
 * exception to the usual card `rounded-3xl`.
 */
const meta: Meta<typeof QaChatBubble> = {
    title: "StarCi/Blocks/Learn/QaChatBubble/QaChatBubble",
    component: QaChatBubble,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof QaChatBubble>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "MarkdownContent": { tier: "composite", role: "the message body", storyId: "composites-viewers-markdowncontent--compact" },
}

/** LEAF — role decides tint + which corner clips toward a tail: user (own message) vs assistant (everyone else). */
export const Roles: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-col gap-4 p-8">
            <BlockAnatomy
                name="QaChatBubble"
                tier="block"
                leaf="Roles"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "role = assistant (someone else's message)",
                        why: "Neutral surface, tail toward the left — this is what every OTHER participant's message looks like.",
                        code: "<QaChatBubble role=\"assistant\"><MarkdownContent source=\"Have you tried restarting the container?\" measure=\"compact\" /></QaChatBubble>",
                        render: (
                            <div data-tier="fixture" className="flex w-full max-w-sm justify-start">
                                <QaChatBubble anatPart="QaChatBubble" role="assistant">
                                    <MarkdownContent showAnatomy anatPart="MarkdownContent" source="Have you tried restarting the container?" measure="compact" />
                                </QaChatBubble>
                            </div>
                        ),
                    },
                    {
                        name: "role = user (the viewer's own message)",
                        why: "Accent surface, tail toward the right — the viewer's own message reads as visually theirs without needing an extra label.",
                        code: "<QaChatBubble role=\"user\"><MarkdownContent source=\"I restarted it but I'm still getting the error.\" measure=\"compact\" /></QaChatBubble>",
                        render: (
                            <div data-tier="fixture" className="flex w-full max-w-sm justify-end">
                                <QaChatBubble role="user">
                                    <MarkdownContent source="I restarted it but I'm still getting the error." measure="compact" />
                                </QaChatBubble>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
