import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { CrossListCard, CrossListItem } from "@/components/blocks/cards/CrossListCard"

const meta: Meta<typeof CrossListCard> = {
    title: "Blocks/Cards/CrossListCard",
    component: CrossListCard,
}
export default meta
type Story = StoryObj<typeof CrossListCard>

/** The NEGATIVE mirror of CheckListCard: each row has a faint ✗ — something NOT included/not met (not in the plan, a limitation). */
export const Default: Story = {
    parameters: { usage: "The opposite of CheckListCard: a list of 'not included / not met' — features not in the plan, limitations, unmet conditions. The `XCircleIcon` is FAINT (text-muted, not danger/error), read-only. Need pressable rows → SurfaceListCard; need things ACHIEVED (✓) → CheckListCard." },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Not included in the plan</Label>
                <Typography type="body-sm" color="muted">
                    Each row is something this plan does NOT include — a faint ✗, neutral in tone (not an error).
                </Typography>
            </div>
            <CrossListCard>
                <CrossListItem><Typography type="body-sm">Grading with a premium model</Typography></CrossListItem>
                <CrossListItem><Typography type="body-sm">Unlimited mock interviews</Typography></CrossListItem>
                <CrossListItem><Typography type="body-sm">Priority support over email</Typography></CrossListItem>
            </CrossListCard>
        </div>
    ),
}

/** Sitting inside another surface (modal/drawer/panel): `bordered` → border instead of shadow (surface-in-surface). */
export const SurfaceInSurface: Story = {
    parameters: { usage: "Inside a modal/drawer/panel: pass `bordered` — use a border instead of shadow (the shadow is invisible on a surface background). Same as the `CheckListCard bordered` / `SurfaceListCard bordered` rule." },
    render: () => (
        <div className="w-80 rounded-3xl bg-surface p-3 shadow-surface">
            <CrossListCard bordered>
                <CrossListItem><Typography type="body-sm">Export a PDF certificate</Typography></CrossListItem>
                <CrossListItem><Typography type="body-sm">Weekly 1-on-1 mentoring</Typography></CrossListItem>
            </CrossListCard>
        </div>
    ),
}
