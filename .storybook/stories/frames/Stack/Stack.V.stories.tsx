import type { Meta, StoryObj } from "@storybook/nextjs"
import { Stack } from "@sb-components/frames/Stack/Stack"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE: `Stack.V` is a single-axis VERTICAL frame. The state it PRODUCES =
 * whatever it decides itself: `gap` (the §10 scale — the reason this frame exists),
 * `align` (the horizontal axis), `divider` (a line between children). `wrap` is NOT here
 * (a column doesn't overflow into rows — that's `Stack.H`'s state), and `justify` is only
 * readable when the column has extra height, so leave it to `Stack.H`'s demo — don't
 * repeat another member's state.
 */
const meta: Meta<typeof Stack.V> = {
    title: "Frames/Stack/Stack.V",
    component: Stack.V,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Stack.V>

/** The frame carries no content — the fixture is a real card so the seam between two children is visible. */
/** Props for the `Panel` fixture helper. */
interface PanelProps {
    /** label text shown inside the panel */
    text: string
}

const Panel = ({ text }: PanelProps) => (
    <SurfaceCard.Base>
        <Typography.Base size="sm" text={text} />
    </SurfaceCard.Base>
)

const TRACK_PARTS: Array<AnatomyNode> = [
    { name: "Track", tier: "composite", role: "the vertical flex axis, owning gap (§10), align, and justify" },
]
const DIVIDER_PARTS: Array<AnatomyNode> = [
    { name: "Track", tier: "composite", role: "the vertical flex axis, owning gap (§10)" },
    { name: "Line", tier: "atom", role: "a Divider.Base inserted between two children, so N children produce N minus 1 lines" },
]

/** Default — a column with a `grouped(3)` seam: the default rhythm between blocks inside a card. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stack.V"
                tier="frame"
                leaf="Default"
                parts={TRACK_PARTS}
                reason="A single-axis VERTICAL frame: it only decides direction, seam, and alignment, carrying no content or function of its own (§13). It's a WRAPPING frame so it takes `children` (a single axis has EXACTLY ONE slot, so there's no header/body/footer set to name)."
                states={[
                    {
                        name: "gap = 3 (grouped)",
                        why: "Three panels stack with a `grouped(3)` seam between each. This is the default rhythm between blocks inside a card, the shape every other leaf below narrows down from.",
                        code: `<Stack.V gap={3}>
  <Panel text="Tổng quan" />
  <Panel text="Lộ trình" />
  <Panel text="Bài tập" />
</Stack.V>`,
                        render: (
                            <div className="w-96 max-w-full">
                                <Stack.V gap={3} showAnatomy>
                                    <Panel text="Tổng quan" />
                                    <Panel text="Lộ trình" />
                                    <Panel text="Bài tập" />
                                </Stack.V>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Gaps — the REASON this frame exists: `gap` only accepts EXACTLY six steps `0·1·2·3·6·8` (§10c).
 * `gap={4}` or `gap={5}` is a COMPILE ERROR, not a review comment.
 */
export const Gaps: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stack.V"
                tier="frame"
                leaf="Gaps"
                parts={TRACK_PARTS}
                reason="`gap` is a required union literal `0|1|2|3|6|8`, with no default, so a seam can't be picked wrong by accident (§10a: every seam has exactly one owner, chosen on purpose)."
                states={[
                    {
                        name: "gap = 0",
                        why: "The two panels touch with no seam between them at all. Use this only when the two children are meant to read as one visually continuous block.",
                        code: "<Stack.V gap={0}>…</Stack.V>   // flush",
                        render: (
                            <Stack.V gap={0} showAnatomy>
                                <Panel text="Một" />
                                <Panel text="Hai" />
                            </Stack.V>
                        ),
                    },
                    {
                        name: "gap = 1",
                        why: "A tight seam separates the two panels, the smallest step on the scale above flush. This is the rhythm for elements that belong to the same small cluster.",
                        code: "<Stack.V gap={1}>…</Stack.V>",
                        render: (
                            <Stack.V gap={1} showAnatomy>
                                <Panel text="Một" />
                                <Panel text="Hai" />
                            </Stack.V>
                        ),
                    },
                    {
                        name: "gap = 2",
                        why: "A related seam separates the two panels, wider than tight but still reading as one family. This is the rhythm for elements that relate to each other without being one cluster.",
                        code: "<Stack.V gap={2}>…</Stack.V>",
                        render: (
                            <Stack.V gap={2} showAnatomy>
                                <Panel text="Một" />
                                <Panel text="Hai" />
                            </Stack.V>
                        ),
                    },
                    {
                        name: "gap = 3",
                        why: "A grouped seam separates the two panels, the default rhythm between blocks inside a card. This is the step `Default` above uses.",
                        code: "<Stack.V gap={3}>…</Stack.V>",
                        render: (
                            <Stack.V gap={3} showAnatomy>
                                <Panel text="Một" />
                                <Panel text="Hai" />
                            </Stack.V>
                        ),
                    },
                    {
                        name: "gap = 6",
                        why: "A section seam separates the two panels, wide enough to read as two distinct regions rather than one group. This is the rhythm between whole sections of a page.",
                        code: "<Stack.V gap={6}>…</Stack.V>   // section",
                        render: (
                            <Stack.V gap={6} showAnatomy>
                                <Panel text="Một" />
                                <Panel text="Hai" />
                            </Stack.V>
                        ),
                    },
                    {
                        name: "gap = 8",
                        why: "A page seam separates the two panels, the widest step on the scale. This is the rhythm reserved for the largest divisions of a page.",
                        code: "<Stack.V gap={8}>…</Stack.V>",
                        render: (
                            <Stack.V gap={8} showAnatomy>
                                <Panel text="Một" />
                                <Panel text="Hai" />
                            </Stack.V>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * WithDivider — `divider` inserts `Divider.Base` (an ATOM) BETWEEN children: N children →
 * N−1 lines, none at the start/end. The frame does NOT draw the line itself (§13c: overlaps
 * an atom ⇒ use the atom).
 */
export const WithDivider: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stack.V"
                tier="frame"
                leaf="WithDivider"
                parts={DIVIDER_PARTS}
                reason="The horizontal line, cutting across the vertical axis, is drawn by `Divider.Base`; the frame only inserts it in between. `gap` still applies to both children and the line, so both sides of the line always balance."
                states={[
                    {
                        name: "divider = true, 3 children",
                        why: "Two lines grow between the three children, one before the second and one before the third, with none at the very start or end. Three text rows read as one bounded group when the seams between them are visibly marked, instead of only implied by whitespace.",
                        code: `<Stack.V gap={3} divider>
  <Typography.Base size="sm" text="Đã hoàn thành 12 bài" />
  <Typography.Base size="sm" text="Chuỗi 5 ngày" />
  <Typography.Base size="sm" text="Xếp hạng 34/120" />
</Stack.V>`,
                        render: (
                            <div className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">
                                <Stack.V gap={3} divider showAnatomy>
                                    <Typography.Base size="sm" text="Đã hoàn thành 12 bài" />
                                    <Typography.Base size="sm" text="Chuỗi 5 ngày" />
                                    <Typography.Base size="sm" text="Xếp hạng 34/120" />
                                </Stack.V>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Align — on the VERTICAL axis, `align` aligns along the HORIZONTAL direction. `stretch`
 * (default) stretches children to full width; `start`/`center`/`end` let children keep
 * their natural width.
 */
export const Align: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stack.V"
                tier="frame"
                leaf="Align"
                parts={TRACK_PARTS}
                reason="The fixture is a button with its own natural width, so the difference reads clearly: `stretch` overrides that natural width, the other three values keep it."
                states={[
                    {
                        name: "align = stretch (default)",
                        why: "Both buttons grow to the full width of the dashed frame around them. This is the alignment a column gets without passing `align` at all.",
                        code: `<Stack.V gap={2} align="stretch">
  …
</Stack.V>`,
                        render: (
                            <div className="w-56 rounded-3xl border border-dashed border-default p-3">
                                <Stack.V gap={2} align="stretch" showAnatomy>
                                    <Button.Base label="Tiếp tục học" variant="secondary" size="sm" />
                                    <Button.Base label="Lưu" variant="secondary" size="sm" />
                                </Stack.V>
                            </div>
                        ),
                    },
                    {
                        name: "align = start",
                        why: "Both buttons keep their natural width and sit flush against the left edge of the frame. Neither button stretches to fill the column.",
                        code: `<Stack.V gap={2} align="start">
  …
</Stack.V>`,
                        render: (
                            <div className="w-56 rounded-3xl border border-dashed border-default p-3">
                                <Stack.V gap={2} align="start">
                                    <Button.Base label="Tiếp tục học" variant="secondary" size="sm" />
                                    <Button.Base label="Lưu" variant="secondary" size="sm" />
                                </Stack.V>
                            </div>
                        ),
                    },
                    {
                        name: "align = center",
                        why: "Both buttons keep their natural width and sit centered inside the frame. Neither button stretches, but both share the same horizontal midpoint.",
                        code: `<Stack.V gap={2} align="center">
  …
</Stack.V>`,
                        render: (
                            <div className="w-56 rounded-3xl border border-dashed border-default p-3">
                                <Stack.V gap={2} align="center">
                                    <Button.Base label="Tiếp tục học" variant="secondary" size="sm" />
                                    <Button.Base label="Lưu" variant="secondary" size="sm" />
                                </Stack.V>
                            </div>
                        ),
                    },
                    {
                        name: "align = end",
                        why: "Both buttons keep their natural width and sit flush against the right edge of the frame. Neither button stretches to fill the column.",
                        code: `<Stack.V gap={2} align="end">
  …
</Stack.V>`,
                        render: (
                            <div className="w-56 rounded-3xl border border-dashed border-default p-3">
                                <Stack.V gap={2} align="end">
                                    <Button.Base label="Tiếp tục học" variant="secondary" size="sm" />
                                    <Button.Base label="Lưu" variant="secondary" size="sm" />
                                </Stack.V>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
