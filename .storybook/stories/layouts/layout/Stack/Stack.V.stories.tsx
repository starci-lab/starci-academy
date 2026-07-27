import type { Meta, StoryObj } from "@storybook/nextjs"
import { Stack } from "@sb-components/layouts/layout/Stack/Stack"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
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
    title: "Layouts/Layout/Stack/Stack.V",
    component: Stack.V,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Stack.V>

/** The frame carries no content — the fixture is a real card so the seam between two children is visible. */
const Panel = ({ text }: { text: string }) => (
    <SurfaceCard.Base>
        <Typography.Base size="sm" text={text} />
    </SurfaceCard.Base>
)

const TRACK_PARTS: Array<AnatomyNode> = [
    { name: "Track", tier: "primitive", role: "vertical flex axis — owns gap (§10), align, justify" },
]
const DIVIDER_PARTS: Array<AnatomyNode> = [
    { name: "Track", tier: "primitive", role: "vertical flex axis — owns gap (§10)" },
    { name: "Line", tier: "atom", role: "Divider.Base inserted BETWEEN two children (N children → N−1 lines)" },
]

/** The six VALID steps of §10 — `gap` is a union literal, so there is no seventh step. */
const SCALE = [
    { gap: 0, name: "flush (0)" },
    { gap: 1, name: "tight (1)" },
    { gap: 2, name: "related (2)" },
    { gap: 3, name: "grouped (3)" },
    { gap: 6, name: "section (6)" },
    { gap: 8, name: "page (8)" },
] as const

/** Default — a column with a `grouped(3)` seam: the default rhythm between blocks inside a card. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stack.V"
                tier="primitive"
                leaf="Default"
                parts={TRACK_PARTS}
                reason="A single-axis VERTICAL frame: it only decides direction, seam, and alignment — it carries no content or function (§13). It's a WRAPPING frame so it takes `children` (a single axis has EXACTLY ONE slot, so there's no header/body/footer set to name)."
                code={`<Stack.V gap={3}>
  <Panel text="Tổng quan" />
  <Panel text="Lộ trình" />
  <Panel text="Bài tập" />
</Stack.V>`}
            >
                <div className="w-96 max-w-full">
                    <Stack.V gap={3} showAnatomy>
                        <Panel text="Tổng quan" />
                        <Panel text="Lộ trình" />
                        <Panel text="Bài tập" />
                    </Stack.V>
                </div>
            </BlockAnatomy>
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
                tier="primitive"
                leaf="Gaps"
                parts={TRACK_PARTS}
                note="`gap` is a required union literal `0|1|2|3|6|8` — there's no default, so a seam can't be picked wrong by accident (§10a: every seam has exactly one owner, chosen on purpose)."
                code={`<Stack.V gap={0}>…</Stack.V>   // flush
<Stack.V gap={2}>…</Stack.V>   // related
<Stack.V gap={6}>…</Stack.V>   // section`}
            >
                <div className="flex flex-wrap gap-6">
                    {SCALE.map((step, index) => (
                        <div key={step.gap} className="flex w-40 flex-col gap-2">
                            <Typography.Base size="xs" text={step.name} color="muted" />
                            <Stack.V gap={step.gap} showAnatomy={index === 0}>
                                <Panel text="Một" />
                                <Panel text="Hai" />
                            </Stack.V>
                        </div>
                    ))}
                </div>
            </BlockAnatomy>
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
                tier="primitive"
                leaf="WithDivider"
                parts={DIVIDER_PARTS}
                note="The HORIZONTAL line (cutting across the vertical axis) is drawn by `Divider.Base` — the frame only inserts it in between. `gap` still applies to both children and the line, so both sides of the line always balance."
                code={`<Stack.V gap={3} divider>
  <Typography.Base size="sm" text="Đã hoàn thành 12 bài" />
  <Typography.Base size="sm" text="Chuỗi 5 ngày" />
  <Typography.Base size="sm" text="Xếp hạng 34/120" />
</Stack.V>`}
            >
                <div className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">
                    <Stack.V gap={3} divider showAnatomy>
                        <Typography.Base size="sm" text="Đã hoàn thành 12 bài" />
                        <Typography.Base size="sm" text="Chuỗi 5 ngày" />
                        <Typography.Base size="sm" text="Xếp hạng 34/120" />
                    </Stack.V>
                </div>
            </BlockAnatomy>
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
                tier="primitive"
                leaf="Align"
                parts={TRACK_PARTS}
                note="The fixture is a button (has its own natural width), so the difference reads clearly: `stretch` overrides its natural width, the other three values keep it."
                code={`<Stack.V gap={2} align="center">
  …
</Stack.V>`}
            >
                <div className="flex flex-wrap gap-6">
                    {(["stretch", "start", "center", "end"] as const).map((align, index) => (
                        <div key={align} className="flex w-56 flex-col gap-2">
                            <Typography.Base size="xs" text={align} color="muted" />
                            <div className="rounded-3xl border border-dashed border-default p-3">
                                <Stack.V gap={2} align={align} showAnatomy={index === 0}>
                                    <Button.Base label="Tiếp tục học" variant="secondary" size="sm" />
                                    <Button.Base label="Lưu" variant="secondary" size="sm" />
                                </Stack.V>
                            </div>
                        </div>
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}
