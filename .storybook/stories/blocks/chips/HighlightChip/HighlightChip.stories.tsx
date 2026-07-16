import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { HighlightChip } from "@/components/blocks/chips/HighlightChip"

const meta: Meta<typeof HighlightChip> = {
    title: "Blocks/Chips/HighlightChip",
    component: HighlightChip,
}
export default meta
type Story = StoryObj<typeof HighlightChip>

/** Compare all five tones side by side to pick a color by the MEANING of the number, not by what looks nice — each tone maps to a different kind of metric. */
export const AllTones: Story = {
    parameters: { usage: "Compare all five tones side by side to pick a color by the MEANING of the number, not by feel. Used in the `PageHeader` meta row; a meta cluster should carry only ONE chip on one classification axis (axis-1 §Chip), leaving the rest as plain text + icon." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Neutral</Label>
                    <Typography type="body-sm" color="muted">
                        The default when the tone prop is left empty. Use for a purely descriptive figure — neither praise nor warning.
                    </Typography>
                </div>
                <HighlightChip value={24} label="Modules" />
            </div>
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Accent</Label>
                    <Typography type="body-sm" color="muted">
                        When the number is a concept worth emphasizing — not yet an achievement, not yet something to act on.
                    </Typography>
                </div>
                <HighlightChip tone="accent" value="42h" label="Study hours" />
            </div>
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Success</Label>
                    <Typography type="body-sm" color="muted">
                        When the number is an achievement already earned. Don't use it for pending or neutral figures.
                    </Typography>
                </div>
                <HighlightChip tone="success" value={276} label="Lessons completed" />
            </div>
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Warning</Label>
                    <Typography type="body-sm" color="muted">
                        When attention is needed but it is NOT yet late — still time to act.
                    </Typography>
                </div>
                <HighlightChip tone="warning" value={3} label="Lessons due soon" />
            </div>
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Danger</Label>
                    <Typography type="body-sm" color="muted">
                        When something is overdue or broken and needs immediate action. Don't borrow danger just to stand out.
                    </Typography>
                </div>
                <HighlightChip tone="danger" value={5} label="Lessons overdue" />
            </div>
        </div>
    ),
}
