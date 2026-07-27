import type { Meta, StoryObj } from "@storybook/nextjs"
import { Progress, type ProgressColor, type ProgressSize } from "@sb-components/atoms/display/Progress/Progress"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Progress.Circle> = {
    title: "Atoms/Display/Progress/Progress.Circle",
    component: Progress.Circle,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Progress.Circle>

/**
 * KHÔNG có `annotate` (thầy chốt 2026-07-26): atom lá bọc thẳng react-aria
 * ProgressBar (dạng circle). `Track`/`Fill` là span nội tại (khe), không phải
 * component có story riêng để nhảy tới — nên không phải deps thật.
 */

/** Value — tiến trình xác định dạng vòng (value/max). */
export const Value: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Circle"
                tier="atom"
                leaf="Value"
                reason="The circular progress ring wrapping react-aria ProgressBar; same semantics as Bar."
                code={"<Progress.Circle value={68} size=\"md\" />"}
            >
                <Progress.Circle value={68} ariaLabel="Progress" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Indeterminate — không rõ thời lượng → cung tự quay (không value). */
export const Indeterminate: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Circle"
                tier="atom"
                leaf="Indeterminate"
                note="isIndeterminate spins the arc on its own; react-aria ignores value."
                code={"<Progress.Circle isIndeterminate />"}
            >
                <Progress.Circle isIndeterminate ariaLabel="Processing" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Loading — atom tự vẽ leaf skeleton (circle); không dùng Skeleton.*. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Circle"
                tier="atom"
                leaf="Loading"
                note="isSkeleton draws its own circle shimmer (hybrid C) — before the value is known."
                code={"<Progress.Circle isSkeleton />"}
            >
                <Progress.Circle isSkeleton showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** One row of the color demo table below. */
interface CircleColorRow {
    /** color token applied to the ring's fill arc */
    color: ProgressColor
    /** aria-label describing what the ring measures */
    label: string
    /** progress value (0-100) shown by this row */
    value: number
}

/** ĐỦ union `ProgressColor` — thiếu một giá trị là giá trị đó sẽ mọc thành leaf lạc chỗ. */
const CIRCLE_COLORS: Array<CircleColorRow> = [
    { color: "accent", label: "Course progress", value: 55 },
    { color: "success", label: "Upload complete", value: 100 },
    { color: "warning", label: "Sync needs attention", value: 40 },
    { color: "danger", label: "Deploy failed", value: 20 },
    { color: "default", label: "Idle queue", value: 65 },
]

/** Leaf prop `color` — 5 tone, render ĐỦ union. */
export const Colors: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Circle"
                tier="atom"
                leaf="Prop `color`"
                reason="Same tone semantics as Bar — the arc's colour carries the meaning of the number inside its ring, from a plain accent run to an explicit success/warning/danger outcome."
                note="Only the FillCircle arc takes the tone; the TrackCircle stays neutral in every case, so the ring family reads as one set."
                code={`<Progress.Circle color="accent" value={55} />
<Progress.Circle color="success" value={100} />
<Progress.Circle color="warning" value={40} />
<Progress.Circle color="danger" value={20} />
<Progress.Circle color="default" value={65} />`}
            >
                <div className="flex flex-wrap items-center gap-6">
                    {CIRCLE_COLORS.map(({ color, label, value }, index) => (
                        <Progress.Circle
                            key={color}
                            color={color}
                            value={value}
                            ariaLabel={label}
                            showAnatomy={index === 0}
                        />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** One row of the size demo table below. */
interface CircleSizeRow {
    /** diameter step applied to the ring */
    size: ProgressSize
    /** aria-label describing what the ring measures */
    label: string
}

/** ĐỦ union `ProgressSize` — thiếu một giá trị là giá trị đó sẽ mọc thành leaf lạc chỗ. */
const CIRCLE_SIZES: Array<CircleSizeRow> = [
    { size: "sm", label: "Compact ring" },
    { size: "md", label: "Default ring" },
    { size: "lg", label: "Prominent ring" },
]

/** Leaf prop `size` — 3 mốc đường kính, render ĐỦ union. */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Circle"
                tier="atom"
                leaf="Prop `size`"
                reason="Diameter signals weight — a compact ring inside a stat row vs. a prominent ring anchoring a dashboard tile on its own."
                note="The skeleton box (CIRCLE_BOX) matches each diameter 1:1, so a loading ring never resizes once the value lands."
                code={`<Progress.Circle size="sm" value={68} />
<Progress.Circle size="md" value={68} />
<Progress.Circle size="lg" value={68} />`}
            >
                <div className="flex flex-wrap items-end gap-6">
                    {CIRCLE_SIZES.map(({ size, label }, index) => (
                        <Progress.Circle
                            key={size}
                            size={size}
                            value={68}
                            ariaLabel={label}
                            showAnatomy={index === 0}
                        />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}
