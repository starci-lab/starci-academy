import type { Meta, StoryObj } from "@storybook/nextjs"
import { Card, CardContent, Label, Typography } from "@heroui/react"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { CheckListCard, CheckListItem } from "@/components/blocks/cards/CheckListCard"

const meta: Meta<typeof CheckListCard> = {
    title: "Blocks/Cards/CheckListCard",
    component: CheckListCard,
}
export default meta
type Story = StoryObj<typeof CheckListCard>

/**
 * Use for a "brief with/without tick" list — value gained, outcomes, learning goals. The icon here is
 * FIXED to a success tick: that is both its strength (no thinking required) and its limit. If you need a
 * different icon per row, or an icon colored by state → use SurfaceListCardItem (free-form).
 * A list where each row is pressable to go somewhere → SurfaceListCard.
 */
export const Default: Story = {
    parameters: {
        usage:
            "Use for a \"brief with/without tick\" list — value gained, outcomes, learning goals. The icon here is " +
            "FIXED to a success tick: that is both its strength (no thinking required) and its limit. If you need a " +
            "different icon per row, or an icon colored by state → use SurfaceListCardItem (free-form). A list where " +
            "each row is pressable to go somewhere → SurfaceListCard.",
    },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With tick</Label>
                <Typography type="body-sm" color="muted">
                    Each row is something the learner ACHIEVES — the tick confirms it is done. This is the block's default.
                </Typography>
            </div>
            <CheckListCard>
                <CheckListItem>Build a complete RESTful API</CheckListItem>
                <CheckListItem>Implement secure JWT authentication</CheckListItem>
                <CheckListItem>Optimize database queries</CheckListItem>
            </CheckListCard>
        </div>
    ),
}

/** Still a brief list, but each row is a CONDITION rather than an achievement — turn off the tick because a tick reads as "done", whereas no one has yet confirmed the learner meets the prerequisites. */
export const WithoutCheck: Story = {
    parameters: { usage: "Still a brief list, but each row is a CONDITION rather than an achievement — turn off the tick because a tick reads as \"done\", whereas no one has yet confirmed the learner meets the prerequisites." },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Without tick</Label>
                <Typography type="body-sm" color="muted">
                    Turn off showCheck when each row is an entry REQUIREMENT that no one has confirmed the learner meets yet — a tick here would affirm it on their behalf.
                </Typography>
            </div>
            <CheckListCard>
                <CheckListItem showCheck={false}>Completed a basic programming course</CheckListItem>
                <CheckListItem showCheck={false}>A machine with Node.js 20+ installed</CheckListItem>
                <CheckListItem showCheck={false}>A basic understanding of Git</CheckListItem>
            </CheckListCard>
        </div>
    ),
}

/** A long row is NOT truncated — it wraps, and the tick stays anchored at the start of the first line instead of drifting into the middle of the text block. So don't shorten content at the call-site just to "make it fit": the block can handle it, and a truncated outcome loses its meaning. */
export const LongText: Story = {
    parameters: { usage: "A long row is NOT truncated — it wraps, and the tick stays anchored at the start of the first line instead of drifting into the middle of the text block. So don't shorten content at the call-site just to \"make it fit\": the block can handle it, and a truncated outcome loses its meaning." },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Long text</Label>
                <Typography type="body-sm" color="muted">
                    Narrow frame and a row longer than one line — check that the tick anchors to the start of the first line and the text margin stays aligned when it wraps.
                </Typography>
            </div>
            <CheckListCard>
                <CheckListItem>
                    Design and implement a highly scalable microservices system handling millions of requests per day with low latency
                </CheckListItem>
                <CheckListItem>Write unit tests with over 80% coverage</CheckListItem>
            </CheckListCard>
        </div>
    ),
}

/**
 * Surface-in-surface: a list nested inside a parent surface (modal/panel body) → `bordered`
 * (border XOR shadow). Pair with `LabeledCard frameless` — label outside, no card-in-card.
 */
export const SurfaceInSurface: Story = {
    parameters: {
        usage: "When CheckListCard sits inside a visible PARENT surface (modal/drawer/panel body): `LabeledCard frameless` + `CheckListCard bordered`. `bordered` = BORDER instead of shadow (shadow is invisible on bg-surface). Standing top-level on a page → drop `bordered`. Don't hack `shadow-none` / `border` via className.",
    },
    render: () => (
        <div className="flex max-w-sm flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Nested in a parent surface</Label>
                <Typography type="body-sm" color="muted">
                    Outer card = modal body. The inner checklist uses bordered.
                </Typography>
            </div>
            <Card>
                <CardContent>
                    <LabeledCard label="Included" frameless>
                        <CheckListCard bordered>
                            <CheckListItem>The entire learning path</CheckListItem>
                            <CheckListItem>AI grading</CheckListItem>
                            <CheckListItem>Course community</CheckListItem>
                        </CheckListCard>
                    </LabeledCard>
                </CardContent>
            </Card>
        </div>
    ),
}
