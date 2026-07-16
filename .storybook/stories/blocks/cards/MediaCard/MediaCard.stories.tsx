import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Chip, Label, Typography } from "@heroui/react"
import { MediaCard } from "@/components/blocks/cards/MediaCard"

const meta: Meta<typeof MediaCard> = {
    title: "Blocks/Cards/MediaCard",
    component: MediaCard,
}
export default meta
type Story = StoryObj<typeof MediaCard>

/** A single-shape content card for course/lesson/blog grids: a 16:9 full-bleed cover on top, then title, meta, summary and CTA. */
export const Default: Story = {
    parameters: {
        usage:
            "A single-shape content card shared across every entity grid (course, lesson, challenge, blog): " +
            "a 16:9 full-bleed cover on top (flush to the card edge, Card p-0) then title, meta, summary, CTA in the body p-3. " +
            "No cover passed → fallback 16:9 placeholder. Leave any text slot empty when it has no data. " +
            "The card is NOT pressable on its own: to make the whole card pressable pass `href`/`onPress`, otherwise the footer must carry its own button. " +
            "The description is clamped to 2 lines (line-clamp) so the card height doesn't grow with the data.",
    },
    render: () => (
        <div className="flex flex-col gap-3" style={{ width: 320 }}>
            <div className="flex flex-col gap-2">
                <Label>Content card</Label>
                <Typography type="body-sm" color="muted">
                    Choose this when an entity has a cover image and needs to read as one block in a grid. The 16:9 image spans the full card on top, and the text
                    stacks below on a fixed rhythm (p-3).
                </Typography>
            </div>
            <MediaCard
                cover={
                    <img
                        src="https://placehold.co/640x360"
                        alt="Course cover"
                        className="size-full object-cover"
                    />
                }
                title="Fullstack Mastery path"
                meta={
                    <>
                        <Chip size="sm">Fullstack</Chip>
                        <Chip size="sm" variant="soft">Intermediate</Chip>
                    </>
                }
                description="Build a solid foundation from frontend to backend through hands-on projects, graded by AI."
                footer={<Button size="sm">View course</Button>}
            />
        </div>
    ),
}

/** No cover passed — MediaCard falls back to a 16:9 full-bleed placeholder. */
export const FallbackCover: Story = {
    parameters: {
        usage:
            "Use when an entity has no cover image yet: omit `cover`, and the card renders a 16:9 full-bleed placeholder " +
            "so the grid stays evenly aligned instead of leaving the media slot empty.",
    },
    render: () => (
        <div className="flex flex-col gap-3" style={{ width: 320 }}>
            <div className="flex flex-col gap-2">
                <Label>No image — 16:9 fallback</Label>
                <Typography type="body-sm" color="muted">
                    No cover passed. MediaCard fills in a 16:9 placeholder flush to the card edge.
                </Typography>
            </div>
            <MediaCard
                title="Fullstack Mastery path"
                meta={
                    <>
                        <Chip size="sm">Fullstack</Chip>
                        <Chip size="sm" variant="soft">Intermediate</Chip>
                    </>
                }
                description="Build a solid foundation from frontend to backend through hands-on projects, graded by AI."
                footer={<Button size="sm">View course</Button>}
            />
        </div>
    ),
}
