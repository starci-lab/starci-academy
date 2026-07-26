import type { Meta, StoryObj } from "@storybook/nextjs"
import { Progress, type ProgressColor, type ProgressSize } from "@sb-components/atoms/display/Progress/Progress"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Progress.Bar> = {
    title: "Atoms/Display/Progress/Progress.Bar",
    component: Progress.Bar,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Progress.Bar>

/**
 * KHÔNG có `annotate` (thầy chốt 2026-07-26): atom lá bọc thẳng react-aria
 * ProgressBar. `Track`/`Fill` là span nội tại (khe), không phải component có
 * story riêng để nhảy tới — nên không phải deps thật.
 */

/** Value — tiến trình xác định (value/max). */
export const Value: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Bar"
                tier="atom"
                leaf="Value"
                reason="The linear progress bar wrapping react-aria ProgressBar; determinate (value) or indeterminate."
                code={"<Progress.Bar value={62} max={100} />"}
            >
                <div className="w-72">
                    <Progress.Bar value={62} ariaLabel="Course progress" showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Indeterminate — không rõ thời lượng → fill tự chạy (không value). */
export const Indeterminate: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Bar"
                tier="atom"
                leaf="Indeterminate"
                note="isIndeterminate animates the fill on its own; react-aria ignores value."
                code={"<Progress.Bar isIndeterminate />"}
            >
                <div className="w-72">
                    <Progress.Bar isIndeterminate ariaLabel="Processing" showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Loading — atom tự vẽ leaf skeleton; không dùng Skeleton.*. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Bar"
                tier="atom"
                leaf="Loading"
                note="isSkeleton draws its own shimmer bar (hybrid C) — before the value is known."
                code={"<Progress.Bar isSkeleton />"}
            >
                <div className="w-72">
                    <Progress.Bar isSkeleton showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** ĐỦ union `ProgressColor` — thiếu một giá trị là giá trị đó sẽ mọc thành leaf lạc chỗ. */
const BAR_COLORS: Array<{ color: ProgressColor; label: string; value: number }> = [
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
                name="Progress.Bar"
                tier="atom"
                leaf="Prop `color`"
                reason="The fill tone carries meaning — accent for a plain run, success/warning/danger for an outcome the value implies, default when the tone should stay silent."
                note="Only the Fill part takes the tone; the Track stays neutral in every case, so five bars side by side still read as one family."
                code={`<Progress.Bar color="accent" value={55} />
<Progress.Bar color="success" value={100} />
<Progress.Bar color="warning" value={40} />
<Progress.Bar color="danger" value={20} />
<Progress.Bar color="default" value={65} />`}
            >
                <div className="flex w-72 flex-col gap-4">
                    {BAR_COLORS.map(({ color, label, value }, index) => (
                        <Progress.Bar
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

/** ĐỦ union `ProgressSize` — thiếu một giá trị là giá trị đó sẽ mọc thành leaf lạc chỗ. */
const BAR_SIZES: Array<{ size: ProgressSize; label: string }> = [
    { size: "sm", label: "Compact row" },
    { size: "md", label: "Default row" },
    { size: "lg", label: "Prominent row" },
]

/** Leaf prop `size` — 3 mốc chiều cao, render ĐỦ union. */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Bar"
                tier="atom"
                leaf="Prop `size`"
                reason="Height signals how much weight the progress deserves on the page — a compact row inside a dense list vs. a prominent bar carrying the whole screen's attention."
                note="Only the track height changes; the fill colour and rounding stay identical across sizes."
                code={`<Progress.Bar size="sm" value={62} />
<Progress.Bar size="md" value={62} />
<Progress.Bar size="lg" value={62} />`}
            >
                <div className="flex w-72 flex-col gap-4">
                    {BAR_SIZES.map(({ size, label }, index) => (
                        <Progress.Bar
                            key={size}
                            size={size}
                            value={62}
                            ariaLabel={label}
                            showAnatomy={index === 0}
                        />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}
