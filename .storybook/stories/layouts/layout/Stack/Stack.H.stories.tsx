import type { Meta, StoryObj } from "@storybook/nextjs"
import { Stack } from "@sb-components/layouts/layout/Stack/Stack"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE: `Stack.H` is the single-axis HORIZONTAL frame. Its own states =
 * `wrap` (only a horizontal row overflows into new lines) and `justify` (legible
 * because a row always has leftover width), plus the VERTICAL rule from
 * `divider`. `gap` (§10 scale) and `align` were already demoed in `Stack.V` —
 * same prop, not repeated here.
 */
const meta: Meta<typeof Stack.H> = {
    title: "Layouts/Layout/Stack/Stack.H",
    component: Stack.H,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Stack.H>

const TRACK_PARTS: Array<AnatomyNode> = [
    { name: "Track", tier: "primitive", role: "the horizontal flex axis — owns gap (§10), align, justify, wrap" },
]
const DIVIDER_PARTS: Array<AnatomyNode> = [
    { name: "Track", tier: "primitive", role: "the horizontal flex axis — owns gap (§10)" },
    { name: "Line", tier: "atom", role: "a vertical Divider.Base (`self-stretch`) inserted BETWEEN two children" },
]

/** Default — a horizontal row, seam `related(2)`: elements belonging to the SAME cluster. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stack.H"
                tier="primitive"
                leaf="Default"
                parts={TRACK_PARTS}
                reason="The same single-axis frame as `Stack.V`, turned into a row — and ONLY a row gets `wrap`. Accepts ARBITRARY `children`; if the content is N repeating elements of the SAME kind, that's `Cluster`/`Grid` (§13b), not this frame."
                code={`<Stack.H gap={2}>
  <Button.Base label="Bắt đầu" />
  <Button.Base label="Xem đề cương" variant="secondary" />
</Stack.H>`}
            >
                <Stack.H gap={2} showAnatomy>
                    <Button.Base label="Bắt đầu" />
                    <Button.Base label="Xem đề cương" variant="secondary" />
                </Stack.H>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Wrap — a state ONLY `Stack.H` has: when the row runs out of width, children flow
 * onto a new line instead of shrinking. `gap` applies to BOTH axes, so the space
 * between lines matches the space between children.
 */
export const Wrap: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stack.H"
                tier="primitive"
                leaf="Wrap"
                parts={TRACK_PARTS}
                note="The frame is deliberately narrow (`w-80`) so the row is forced to overflow. Without `wrap` → the buttons shrink/spill outside the frame; with `wrap` → they flow onto a new line, keeping their own width."
                code={`<Stack.H gap={2} wrap>
  …
</Stack.H>`}
            >
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <Typography.Base size="xs" text="wrap" color="muted" />
                        <div className="w-80 rounded-3xl border border-dashed border-default p-3">
                            <Stack.H gap={2} wrap showAnatomy>
                                <Button.Base label="Tất cả" variant="secondary" size="sm" />
                                <Button.Base label="Đang học" variant="secondary" size="sm" />
                                <Button.Base label="Đã hoàn thành" variant="secondary" size="sm" />
                                <Button.Base label="Đã lưu" variant="secondary" size="sm" />
                            </Stack.H>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Typography.Base size="xs" text="no wrap (default)" color="muted" />
                        <div className="w-80 rounded-3xl border border-dashed border-default p-3">
                            <Stack.H gap={2}>
                                <Button.Base label="Tất cả" variant="secondary" size="sm" />
                                <Button.Base label="Đang học" variant="secondary" size="sm" />
                                <Button.Base label="Đã hoàn thành" variant="secondary" size="sm" />
                                <Button.Base label="Đã lưu" variant="secondary" size="sm" />
                            </Stack.H>
                        </div>
                    </div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Justify — distributes along the MAIN axis (horizontal). `between` pushes both
 * ends to the edges; when a row has EXACTLY TWO named sides, use `Split.Base` (a
 * separate frame) instead of this one.
 */
export const Justify: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stack.H"
                tier="primitive"
                leaf="Justify"
                parts={TRACK_PARTS}
                note="`justify` only reads legibly when the main axis has leftover space — so it's a row's state, not a column's."
                code={`<Stack.H gap={2} justify="between">
  …
</Stack.H>`}
            >
                <div className="flex flex-col gap-6">
                    {(["start", "center", "end", "between"] as const).map((justify, index) => (
                        <div key={justify} className="flex flex-col gap-2">
                            <Typography.Base size="xs" text={justify} color="muted" />
                            <div className="w-96 max-w-full rounded-3xl border border-dashed border-default p-3">
                                <Stack.H gap={2} justify={justify} showAnatomy={index === 0}>
                                    <Button.Base label="Huỷ" variant="secondary" size="sm" />
                                    <Button.Base label="Lưu" size="sm" />
                                </Stack.H>
                            </div>
                        </div>
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * WithDivider — on a horizontal row, the rule is VERTICAL and `self-stretch`
 * (as tall as the row) even while the row is `items-center`. Same `divider` prop,
 * but the rule's shape is decided by the AXIS.
 */
export const WithDivider: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stack.H"
                tier="primitive"
                leaf="WithDivider"
                parts={DIVIDER_PARTS}
                note="`align-self: stretch` wins over the row's `items-center`, so the rule is always the row's full height — no need for the caller to set a height."
                code={`<Stack.H gap={3} divider>
  <Typography.Base size="sm" text="12 bài" />
  <Typography.Base size="sm" text="4 giờ" />
  <Typography.Base size="sm" text="Trung cấp" />
</Stack.H>`}
            >
                <div className="w-fit rounded-3xl bg-surface p-3 shadow-surface">
                    <Stack.H gap={3} divider showAnatomy>
                        <Typography.Base size="sm" text="12 bài" color="muted" />
                        <Typography.Base size="sm" text="4 giờ" color="muted" />
                        <Typography.Base size="sm" text="Trung cấp" color="muted" />
                    </Stack.H>
                </div>
            </BlockAnatomy>
        </div>
    ),
}
