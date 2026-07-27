import type { Meta, StoryObj } from "@storybook/nextjs"
import { Stack } from "@sb-components/frames/Stack/Stack"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE: `Stack.H` is the single-axis HORIZONTAL frame. Its own states =
 * `wrap` (only a horizontal row overflows into new lines) and `justify` (legible
 * because a row always has leftover width), plus the VERTICAL rule from
 * `divider`. `gap` (§10 scale) and `align` were already demoed in `Stack.V`,
 * same prop, not repeated here.
 */
const meta: Meta<typeof Stack.H> = {
    title: "Frames/Stack/Stack.H",
    component: Stack.H,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Stack.H>

const TRACK_PARTS: Array<AnatomyNode> = [
    { name: "Track", tier: "composite", role: "the horizontal flex axis, owning gap (§10), align, justify, and wrap" },
]
const DIVIDER_PARTS: Array<AnatomyNode> = [
    { name: "Track", tier: "composite", role: "the horizontal flex axis, owning gap (§10)" },
    { name: "Line", tier: "atom", role: "a vertical Divider.Base (`self-stretch`) inserted between two children" },
]

/** Default — a horizontal row, seam `related(2)`: elements belonging to the SAME cluster. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stack.H"
                tier="frame"
                leaf="Default"
                parts={TRACK_PARTS}
                reason="The same single-axis frame as `Stack.V`, turned into a row, and only a row gets `wrap`. It accepts ARBITRARY `children`; when the content is N repeating elements of the same kind, that calls for `Cluster`/`Grid` (§13b) instead of this frame."
                states={[
                    {
                        name: "2 buttons, gap = 2",
                        why: "Two buttons sit in a single row with a `related(2)` gap between them, the spacing for elements that belong to the same cluster. A row this size needs nothing more than the default axis: no wrap, no justify, no divider.",
                        code: "<Stack.H gap=\"related\">\n  <Button.Base label=\"Bắt đầu\" />\n  <Button.Base label=\"Xem đề cương\" variant=\"secondary\" />\n</Stack.H>",
                        render: (
                            <Stack.H gap="related" showAnatomy>
                                <Button.Base label="Bắt đầu" />
                                <Button.Base label="Xem đề cương" variant="secondary" />
                            </Stack.H>
                        ),
                    },
                ]}
            />
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
                tier="frame"
                leaf="Wrap"
                parts={TRACK_PARTS}
                reason="The frame is deliberately narrow (`w-80`) in both states below so the row is forced past its available width, which is what makes `wrap` observable at all."
                states={[
                    {
                        name: "wrap = true",
                        why: "Inside the narrow `w-80` frame the four filter buttons flow onto a new line instead of shrinking, and each button keeps its own natural width. `gap` applies to both axes, so the space between the two lines matches the space between the buttons on each line.",
                        code: "<Stack.H gap=\"related\" wrap>\n  …\n</Stack.H>",
                        render: (
                            <div className="w-80 rounded-3xl border border-dashed border-default p-3">
                                <Stack.H gap="related" wrap showAnatomy>
                                    <Button.Base label="Tất cả" variant="secondary" size="sm" />
                                    <Button.Base label="Đang học" variant="secondary" size="sm" />
                                    <Button.Base label="Đã hoàn thành" variant="secondary" size="sm" />
                                    <Button.Base label="Đã lưu" variant="secondary" size="sm" />
                                </Stack.H>
                            </div>
                        ),
                    },
                    {
                        name: "wrap = false (default)",
                        why: "In the identical `w-80` frame the same four buttons shrink and spill past the dashed border instead of moving to a new line. A horizontal frame does not shrink or wrap its children on its own, so this is the shape every row falls back to unless `wrap` is turned on.",
                        code: "<Stack.H gap=\"related\">\n  …\n</Stack.H>",
                        render: (
                            <div className="w-80 rounded-3xl border border-dashed border-default p-3">
                                <Stack.H gap="related" showAnatomy>
                                    <Button.Base label="Tất cả" variant="secondary" size="sm" />
                                    <Button.Base label="Đang học" variant="secondary" size="sm" />
                                    <Button.Base label="Đã hoàn thành" variant="secondary" size="sm" />
                                    <Button.Base label="Đã lưu" variant="secondary" size="sm" />
                                </Stack.H>
                            </div>
                        ),
                    },
                ]}
            />
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
                tier="frame"
                leaf="Justify"
                parts={TRACK_PARTS}
                reason="`justify` only reads legibly when the main axis has leftover space to distribute, which is why this state belongs to a row and has no equivalent on `Stack.V`. Every render below shares the same `w-96` frame and the same two buttons, so only the distribution changes."
                states={[
                    {
                        name: "justify = start",
                        why: "The two buttons pack against the left edge of the row, leaving the leftover space empty on the right. Use it when the row's content should read as one left-aligned cluster instead of spreading across the available width.",
                        code: "<Stack.H gap=\"related\" justify=\"start\">\n  …\n</Stack.H>",
                        render: (
                            <div className="w-96 max-w-full rounded-3xl border border-dashed border-default p-3">
                                <Stack.H gap="related" justify="start" showAnatomy>
                                    <Button.Base label="Huỷ" variant="secondary" size="sm" />
                                    <Button.Base label="Lưu" size="sm" />
                                </Stack.H>
                            </div>
                        ),
                    },
                    {
                        name: "justify = center",
                        why: "The two buttons shift to the middle of the row, with equal empty space left on both sides. Centering suits a row that is not the layout's primary focus, so it does not need to claim either edge.",
                        code: "<Stack.H gap=\"related\" justify=\"center\">\n  …\n</Stack.H>",
                        render: (
                            <div className="w-96 max-w-full rounded-3xl border border-dashed border-default p-3">
                                <Stack.H gap="related" justify="center" showAnatomy>
                                    <Button.Base label="Huỷ" variant="secondary" size="sm" />
                                    <Button.Base label="Lưu" size="sm" />
                                </Stack.H>
                            </div>
                        ),
                    },
                    {
                        name: "justify = end",
                        why: "The two buttons pack against the right edge of the row, mirroring `start`. A form's cancel/save pair often sits here, aligned under content that itself reads out to the same edge.",
                        code: "<Stack.H gap=\"related\" justify=\"end\">\n  …\n</Stack.H>",
                        render: (
                            <div className="w-96 max-w-full rounded-3xl border border-dashed border-default p-3">
                                <Stack.H gap="related" justify="end" showAnatomy>
                                    <Button.Base label="Huỷ" variant="secondary" size="sm" />
                                    <Button.Base label="Lưu" size="sm" />
                                </Stack.H>
                            </div>
                        ),
                    },
                    {
                        name: "justify = between",
                        why: "The two buttons are pushed to opposite ends of the row, with all the leftover space landing between them instead of around them. `between` only reads legibly because a row always has space left over to distribute, which is exactly why this state lives on `Stack.H` and not `Stack.V`.",
                        code: "<Stack.H gap=\"related\" justify=\"between\">\n  …\n</Stack.H>",
                        render: (
                            <div className="w-96 max-w-full rounded-3xl border border-dashed border-default p-3">
                                <Stack.H gap="related" justify="between" showAnatomy>
                                    <Button.Base label="Huỷ" variant="secondary" size="sm" />
                                    <Button.Base label="Lưu" size="sm" />
                                </Stack.H>
                            </div>
                        ),
                    },
                ]}
            />
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
                tier="frame"
                leaf="WithDivider"
                parts={DIVIDER_PARTS}
                states={[
                    {
                        name: "divider = true, 3 children",
                        why: "A vertical rule appears between each pair of the three text items, standing the row's full height even though the row itself is `items-center`. `align-self: stretch` wins over that centering on purpose, so the rule always spans the row's full height without the caller ever having to set one.",
                        code: "<Stack.H gap=\"grouped\" divider>\n  <Typography.Base size=\"sm\" text=\"12 bài\" />\n  <Typography.Base size=\"sm\" text=\"4 giờ\" />\n  <Typography.Base size=\"sm\" text=\"Trung cấp\" />\n</Stack.H>",
                        render: (
                            <div className="w-fit rounded-3xl bg-surface p-3 shadow-surface">
                                <Stack.H gap="grouped" divider showAnatomy>
                                    <Typography.Base size="sm" text="12 bài" color="muted" />
                                    <Typography.Base size="sm" text="4 giờ" color="muted" />
                                    <Typography.Base size="sm" text="Trung cấp" color="muted" />
                                </Stack.H>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
