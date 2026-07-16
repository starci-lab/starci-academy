import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { ProgressRing } from "@/components/blocks/stats/ProgressRing"

const meta: Meta<typeof ProgressRing> = {
    title: "Primitives/DataDisplay/ProgressRing",
    component: ProgressRing,
}
export default meta
type Story = StoryObj<typeof ProgressRing>

/** Use when you need to choose the ring diameter by where it's placed — sm for tight spots next to a line of text, md for cards, lg for a standout metric at the top of a page. */
export const Sizes: Story = {
    parameters: { usage: "Use when you need to choose the ring diameter by where it's placed: sm (64px) for tight/inline spots, md (96px) for regular cards, lg (128px) for a hero metric at the top of a page. The center label scales with the size." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Small</Label>
                    <Typography type="body-sm" color="muted">Use in tight spots, next to a line of text or in a compact list, when the ring is only a secondary detail.</Typography>
                </div>
                <ProgressRing value={68} size="sm" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Medium</Label>
                    <Typography type="body-sm" color="muted">Use in a regular stat card, when the ring is the card's main content.</Typography>
                </div>
                <ProgressRing value={68} size="md" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Large</Label>
                    <Typography type="body-sm" color="muted">Use as a standout metric at the top of a page or dashboard, when you want the number to catch the eye first.</Typography>
                </div>
                <ProgressRing value={68} size="lg" />
            </div>
        </div>
    ),
}

/** Use when the value itself carries meaning and the color should change by threshold — accent for neutral progress, success/warning/danger when the number says good or bad. */
export const Tones: Story = {
    parameters: { usage: "Use when the ring color should reflect the MEANING of the number: accent for neutral progress, success when doing well, warning when it needs attention, danger when below the threshold. Don't change the color just for decoration." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Accent</Label>
                    <Typography type="body-sm" color="muted">Use for neutral progress, when the number only shows how far along you are and says nothing good or bad.</Typography>
                </div>
                <ProgressRing value={68} tone="accent" caption="Course progress" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Success</Label>
                    <Typography type="body-sm" color="muted">Use when the number has reached a good level, e.g. a test score above the passing threshold.</Typography>
                </div>
                <ProgressRing value={92} tone="success" caption="Test score" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Warning</Label>
                    <Typography type="body-sm" color="muted">Use when the number is at a level that needs attention — not yet there, but not yet worrying either.</Typography>
                </div>
                <ProgressRing value={45} tone="warning" caption="This week's progress" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Danger</Label>
                    <Typography type="body-sm" color="muted">Use when the number is below the threshold and needs a warning, e.g. a completion rate that's too low.</Typography>
                </div>
                <ProgressRing value={18} tone="danger" caption="Completion rate" />
            </div>
        </div>
    ),
}

/** Use when you need a line of context below the ring to say what it's measuring — caption is an optional slot, drop it when the surrounding context is already clear. */
export const WithCaption: Story = {
    parameters: { usage: "Use when you need a line of context below the ring to say what it's measuring; caption is an optional slot, drop it when the surrounding context (card title, column header) is already clear. The center label can be the default percentage or a custom fraction." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>With caption</Label>
                    <Typography type="body-sm" color="muted">Add a caption when the ring stands alone and needs to spell out what it measures.</Typography>
                </div>
                <ProgressRing value={68} size="lg" caption="Course progress" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Custom label</Label>
                    <Typography type="body-sm" color="muted">Override the center label with a fraction when a count is easier to understand than a percentage.</Typography>
                </div>
                <ProgressRing value={90} size="lg" tone="success" label="9/10" caption="Lessons completed" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>No caption</Label>
                    <Typography type="body-sm" color="muted">Drop the caption when the surrounding context is enough and you only need the ring and the number.</Typography>
                </div>
                <ProgressRing value={68} size="lg" />
            </div>
        </div>
    ),
}
