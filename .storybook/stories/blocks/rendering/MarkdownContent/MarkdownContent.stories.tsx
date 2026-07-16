import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"

import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { sample, inlineSample } from "./components"

const meta: Meta<typeof MarkdownContent> = {
    title: "Core/Rendering/Markdown",
    component: MarkdownContent,
}

export default meta

type Story = StoryObj<typeof MarkdownContent>

/** COMPACT scale (default): 14px, tight line rhythm — for cards, chat, flashcards, modals. */
export const Default: Story = {
    parameters: { usage: "Compact scale (default): small body, tight line rhythm — for cards/chat/flashcards/modals." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Compact (default)</Label>
                <Typography type="body-sm" color="muted">
                    Compact scale: small body, tight line rhythm — for cards, chat, flashcards, modals.
                </Typography>
            </div>
            <div className="max-w-2xl">
                <MarkdownContent markdown={sample} />
            </div>
        </div>
    ),
}

/** `reading` — the reading scale: 16px body, airy line rhythm, a stronger heading ladder, for full lessons. */
export const Reading: Story = {
    parameters: { usage: "reading: the 16px reading scale, airy rhythm, a stronger heading ladder — for full lessons." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Reading</Label>
                <Typography type="body-sm" color="muted">
                    The reading scale: 16px body, airy line rhythm, a stronger heading ladder — for full lessons.
                </Typography>
            </div>
            <div className="max-w-2xl">
                <MarkdownContent markdown={sample} reading />
            </div>
        </div>
    ),
}

/** A short, single-line markdown string — for annotations, description badges, table cells… no block-level needed. */
export const Inline: Story = {
    parameters: { usage: "Single-line markdown (inline bold/code/:muted[]) — for short annotations, badges, table cells." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Inline single line</Label>
                <Typography type="body-sm" color="muted">
                    Single-line markdown (inline bold / code / :muted[]) — for short annotations, badges, table cells.
                </Typography>
            </div>
            <div className="max-w-md">
                <MarkdownContent markdown={inlineSample} />
            </div>
        </div>
    ),
}
