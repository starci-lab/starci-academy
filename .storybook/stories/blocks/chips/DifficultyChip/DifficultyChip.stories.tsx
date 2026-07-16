import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { DifficultyChip } from "@/components/blocks/chips/DifficultyChip"

const meta: Meta<typeof DifficultyChip> = {
    title: "Core/Chip/DifficultyChip",
    component: DifficultyChip,
}
export default meta
type Story = StoryObj<typeof DifficultyChip>

/** The 4-level difficulty scale → dot color, drawn from DIFFICULTY_COLOR — the SINGLE source of this ramp; import it instead of re-declaring the map at each surface. */
export const AllDifficulties: Story = {
    parameters: { usage: "Reference table mapping the 4 difficulty levels → dot color, read from `DIFFICULTY_COLOR` (`DifficultyChip/index.tsx`) — the SINGLE source of the ramp. Need difficulty colors on another surface? IMPORT this constant, don't re-declare a separate map (re-declaring is how surfaces diverge — `FlashcardDeckList` has this bug). Difficulty is a RANK, not a status — colors come from the Tailwind palette, not borrowed accent/success/warning/danger: 4 levels need 4 distinct colors, whereas 4 semantic tokens would read `advanced` as an ERROR instead of HARD." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Beginner</Label>
                    <Typography type="body-sm" color="muted">
                        An opening lesson that needs almost no prior knowledge. Green because this is a safe place to start.
                    </Typography>
                </div>
                <DifficultyChip difficulty="beginner" />
            </div>
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Intermediate</Label>
                    <Typography type="body-sm" color="muted">
                        Requires grasping the core concepts first. Yellow = consider carefully, not yet a warning.
                    </Typography>
                </div>
                <DifficultyChip difficulty="intermediate" />
            </div>
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Advanced</Label>
                    <Typography type="body-sm" color="muted">
                        Requires non-trivial design decisions. Orange, one step deeper than Intermediate — no longer borrowing the error color (danger) to signal HARD.
                    </Typography>
                </div>
                <DifficultyChip difficulty="advanced" />
            </div>
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Insane</Label>
                    <Typography type="body-sm" color="muted">
                        The highest level. Now has its own color instead of borrowing accent — four levels, four colors, no overlaps.
                    </Typography>
                </div>
                <DifficultyChip difficulty="insane" />
            </div>
        </div>
    ),
}
