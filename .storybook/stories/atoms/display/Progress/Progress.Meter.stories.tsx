import type { Meta, StoryObj } from "@storybook/nextjs"
import { Progress, type ProgressColor, type ProgressSize } from "@sb-components/atoms/display/Progress/Progress"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Progress.Meter`: ĐO LƯỜNG tĩnh (dung lượng, pin, hạn mức), bọc THẲNG
 * HeroUI/react-aria Meter.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). Bộ leaf: `Value` (gộp `value`+`max` — hai prop nhưng
 * MỘT hình, cùng lối `Chip.Base` gộp `dotColor`/`dotClassName` vào leaf `Dot`) ·
 * `Colors` · `Sizes` · `Loading`.
 *
 * ⛔ KHÔNG có leaf `Indeterminate` — react-aria Meter luôn determinate; một phép đo
 * lường không thể "không rõ" (khác `Progress.Bar`/`Circle`).
 * ⛔ `ariaLabel` KHÔNG có leaf (§12g.1): nó chỉ chạy vào `aria-label`, không đổi pixel.
 *
 * ⭐ DEPS RỖNG (thầy chốt 2026-07-26): `Meter` gọi `HeroMeter` riêng, KHÔNG compose lại
 * `Progress.Bar`. `Track`/`Fill` là khe nội tại, không có story riêng để nhảy tới ⇒ bỏ
 * hẳn prop `annotate`.
 *
 * ⚠️ Sửa 2026-07-26: leaf `Bands` cũ chỉ render 3/5 giá trị `color` (thiếu `accent`,
 * `default`) — giá trị sót sẽ mọc thành story lạc chỗ, nên đổi thành leaf `Colors` phủ
 * đủ union; ý "tone = ngưỡng" chuyển vào `reason`. Leaf `Sizes` trước đây KHÔNG tồn tại
 * dù `size` đổi chiều cao thật.
 */
const meta: Meta<typeof Progress.Meter> = {
    title: "Atoms/Display/Progress/Progress.Meter",
    component: Progress.Meter,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Progress.Meter>

/** ĐỦ union `ProgressColor` — 5 tone. Với Meter, màu tải nghĩa NGƯỠNG chứ không trang trí. */
const METER_COLORS: Array<{ color: ProgressColor; label: string; value: number }> = [
    { color: "accent", label: "Storage used", value: 55 },
    { color: "success", label: "Well within limit", value: 30 },
    { color: "warning", label: "Approaching the cap", value: 65 },
    { color: "danger", label: "Almost full", value: 92 },
    { color: "default", label: "Unrated measurement", value: 48 },
]

/** ĐỦ union `ProgressSize` — 3 mốc chiều cao. */
const METER_SIZES: Array<{ size: ProgressSize; label: string }> = [
    { size: "sm", label: "Compact row" },
    { size: "md", label: "Default row" },
    { size: "lg", label: "Prominent row" },
]

/**
 * Leaf props `value` / `max` — HAI prop nhưng MỘT hình: cả hai chỉ đẩy cùng một vạch
 * fill. Tách đôi sẽ ra hai khung y hệt, nên gộp (neo: `Chip.Base` leaf `Dot`).
 */
export const Value: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Meter"
                tier="atom"
                leaf="Props `value` / `max`"
                reason="A meter is a static measurement, not a task running — so there is no indeterminate state. The fill is always the value read against its own ceiling."
                note="Both rows sit at 72, but the second one measures against a ceiling of 200 — same number, half the bar. Read the pair together or the fill means nothing."
                code={`<Progress.Meter value={72} />           // max defaults to 100
<Progress.Meter value={72} max={200} />`}
            >
                <div className="flex w-72 flex-col gap-4">
                    <Progress.Meter value={72} ariaLabel="Disk usage out of 100" showAnatomy />
                    <Progress.Meter value={72} max={200} ariaLabel="Disk usage out of 200" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `color` — 5 tone, render ĐỦ union (bản cũ chỉ có 3). */
export const Colors: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Meter"
                tier="atom"
                leaf="Prop `color`"
                reason="On a meter the tone is information, not decoration: the same measurement reads as safe, watch-it, or act-now depending on which band it lands in. Pick the tone from the number, and let it change as the number moves."
                note="Only the Fill takes the tone; the Track stays neutral in all five, so a column of meters still reads as one family. Use `default` when the reading carries no verdict yet."
                code={`<Progress.Meter color="accent" value={55} />
<Progress.Meter color="success" value={30} />
<Progress.Meter color="warning" value={65} />
<Progress.Meter color="danger" value={92} />
<Progress.Meter color="default" value={48} />`}
            >
                <div className="flex w-72 flex-col gap-4">
                    {METER_COLORS.map(({ color, label, value }, index) => (
                        <Progress.Meter
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

/** Leaf prop `size` — 3 mốc chiều cao, render ĐỦ union. */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Meter"
                tier="atom"
                leaf="Prop `size`"
                note="Same reading at all three heights — the atom owns the scale, so a caller never hand-sets a bar height."
                code={`<Progress.Meter size="sm" value={62} />
<Progress.Meter value={62} />          // md = default
<Progress.Meter size="lg" value={62} />`}
            >
                <div className="flex w-72 flex-col gap-4">
                    {METER_SIZES.map(({ size, label }, index) => (
                        <Progress.Meter
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

/** Leaf prop `isSkeleton` — atom tự vẽ shimmer của chính nó (§12c), không dùng Skeleton.*. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Meter"
                tier="atom"
                leaf="Prop `isSkeleton`"
                note="The atom draws its own shimmer bar at the same height as the real track, so nothing shifts once the measurement lands."
                code={"<Progress.Meter isSkeleton />"}
            >
                <div className="w-72">
                    <Progress.Meter isSkeleton showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
