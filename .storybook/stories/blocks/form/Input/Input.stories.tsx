import type { Meta, StoryObj } from "@storybook/nextjs"
import { Card, CardContent, Input, Label, Typography } from "@heroui/react"

/**
 * `Input` (HeroUI) — a bare single-line text field (styled `<input>`): accepts native props
 * (`type`, `placeholder`, `disabled`, `readOnly`, `defaultValue`). Pick `variant` by the
 * SURFACE CONTEXT the field sits on, NOT by emphasis level:
 * - `primary` = field sits ON THE PAGE BACKGROUND — its own border/fill to stand out from
 *   the background (comment composer, chat field, a form directly on the page).
 * - `secondary` = field sits INSIDE a surface/card/modal — the card already separates from
 *   the background so the field is lighter (muted fill); most form fields use this.
 * In real forms it is almost always wrapped in `TextField` (Label + a11y + error line); use a
 * bare `Input` only when the field needs no label/grouping (inline search, quick-edit cell).
 */
const meta: Meta<typeof Input> = {
    title: "Core/Form/Input",
    component: Input,
}
export default meta
type Story = StoryObj<typeof Input>

/** Two variants by SURFACE CONTEXT: `primary` field on the page background; `secondary` field inside a card. */
export const Variants: Story = {
    parameters: {
        usage: "Pick `variant` by the SURFACE the field sits on, not by emphasis level. `primary` = field on the PAGE BACKGROUND (its own border/fill to stand out from the background — composer, chat, a form directly on the page). `secondary` = field INSIDE a card/modal (the card already separates from the background so the field is lighter — most form fields). Keep it consistent per surface; don't mix the two variants in the same block.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Primary — on the page background</Label>
                    <Typography type="body-sm" color="muted">
                        Field standing directly on the background: its own border/fill to separate from the background. Use for a comment composer, chat field, or a form directly on the page.
                    </Typography>
                </div>
                <div className="w-80">
                    <Input variant="primary" placeholder="Write a comment…" />
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Secondary — inside a surface (card)</Label>
                    <Typography type="body-sm" color="muted">
                        Field sitting INSIDE a card/modal: the card already separates from the background so the field is lighter (muted fill). Most form fields use this.
                    </Typography>
                </div>
                <Card className="w-80">
                    <CardContent>
                        <Input variant="secondary" placeholder="you@email.com" />
                    </CardContent>
                </Card>
            </div>
        </div>
    ),
}

/** Native states (demoed in a card = the common secondary context): default, disabled, readOnly. */
export const States: Story = {
    parameters: {
        usage: "States via native props: default (editable), `disabled` (dimmed, no focus/typing), `readOnly` (not editable but still focusable/selectable — for viewing/copying a locked value). Demoed inside a `Card` because that's the most common `secondary` context (field inside a surface). The error state is toggled on `TextField isInvalid`, not on a bare Input.",
    },
    render: () => (
        <Card className="w-80">
            <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <Label>Default</Label>
                        <Typography type="body-sm" color="muted">
                            A normal input, focusable and editable.
                        </Typography>
                    </div>
                    <Input variant="secondary" placeholder="Enter content…" />
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <Label>Disabled</Label>
                        <Typography type="body-sm" color="muted">
                            Locked by context — dimmed, cannot focus or type.
                        </Typography>
                    </div>
                    <Input variant="secondary" defaultValue="FS-2026-K12" disabled />
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <Label>Read-only</Label>
                        <Typography type="body-sm" color="muted">
                            Not editable but still focusable and selectable — for viewing/copying a locked value.
                        </Typography>
                    </div>
                    <Input variant="secondary" defaultValue="sk_live_a1b2c3d4" readOnly />
                </div>
            </CardContent>
        </Card>
    ),
}
