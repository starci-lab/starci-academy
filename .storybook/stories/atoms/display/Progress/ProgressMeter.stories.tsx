import type { Meta, StoryObj } from "@storybook/nextjs"
import { ProgressMeter } from "@sb-components/atoms/display/Progress/Progress"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `ProgressMeter`: ĐO LƯỜNG tĩnh (dung lượng, pin, hạn mức), bọc THẲNG
 * HeroUI/react-aria Meter.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). Bộ leaf: `Value` (gộp `value`+`max` — hai prop nhưng
 * MỘT hình, cùng lối `Chip` gộp `dotColor`/`dotClassName` vào leaf `Dot`) ·
 * `Colors` · `Sizes` · `Loading`.
 *
 * ⛔ KHÔNG có leaf `Indeterminate` — react-aria Meter luôn determinate; một phép đo
 * lường không thể "không rõ" (khác `ProgressBar`/`Circle`).
 * ⛔ `ariaLabel` KHÔNG có leaf (§12g.1): nó chỉ chạy vào `aria-label`, không đổi pixel.
 *
 * ⭐ `Meter` gọi thẳng `HeroMeter` riêng, KHÔNG compose lại `ProgressBar`.
 * `Meter.Track`/`Meter.Fill` LÀ compound component thật của HeroUI (không phải
 * khe nội tại) ⇒ `tier: "heroui"`, không `storyId` (§ naming pass, 2026-07-28) —
 * đổi tên thật từ `Track`/`Fill`, tên đó từng đụng trùng `ProgressBar`/
 * `ProgressCircle`'s own `Track`/`Fill` (compound KHÁC NHAU dù cùng chữ).
 *
 * ⚠️ Sửa 2026-07-26: leaf `Bands` cũ chỉ render 3/5 giá trị `color` (thiếu `accent`,
 * `default`) — giá trị sót sẽ mọc thành story lạc chỗ, nên đổi thành leaf `Colors` phủ
 * đủ union; ý "tone = ngưỡng" chuyển vào `reason`. Leaf `Sizes` trước đây KHÔNG tồn tại
 * dù `size` đổi chiều cao thật.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Meter.Track": {
        tier: "heroui",
        role: "the neutral rail the fill sits inside",
    },
    "Meter.Fill": {
        tier: "heroui",
        role: "the filled portion, always a fixed width at a value — a meter is never indeterminate",
    },
    "Skeleton": {
        tier: "heroui",
        role: "the resting shimmer bar, drawn in place of the whole track/fill pair while isSkeleton is on",
    },
}

const meta: Meta<typeof ProgressMeter> = {
    title: "Atoms/Display/Progress/ProgressMeter",
    component: ProgressMeter,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ProgressMeter>

/**
 * Leaf props `value` / `max` — HAI prop nhưng MỘT hình: cả hai chỉ đẩy cùng một vạch
 * fill. Tách đôi sẽ ra hai khung y hệt, nên gộp (neo: `Chip` leaf `Dot`).
 */
export const Value: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ProgressMeter"
                tier="atom"
                leaf="Props `value` / `max`"
                annotate={ANNOTATE}
                reason="A meter is a static measurement, not a task running, so there is no indeterminate state. The fill is always the value read against its own ceiling."
                states={[
                    {
                        name: "value = 72, max = 100 (default)",
                        why: "The fill sits at 72% of the track's width. `max` defaults to 100, so a bare `value` reads directly as a percentage.",
                        code: "<ProgressMeter value={72} />   // max defaults to 100",
                        render: <ProgressMeter value={72} ariaLabel="Disk usage out of 100" showAnatomy />,
                    },
                    {
                        name: "value = 72, max = 200",
                        why: "The fill sits at only 36% of the track's width even though the raw number is the same 72. Reading the fill without knowing `max` gives the wrong answer, so the two props always have to be read together.",
                        code: "<ProgressMeter value={72} max={200} />",
                        render: <ProgressMeter value={72} max={200} ariaLabel="Disk usage out of 200" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `color` — 5 tone, render ĐỦ union (bản cũ chỉ có 3). */
export const Colors: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ProgressMeter"
                tier="atom"
                leaf="Prop `color`"
                annotate={ANNOTATE}
                reason="On a meter the tone is information, not decoration: the same measurement reads as safe, watch-it, or act-now depending on which band it lands in. Only the Fill takes the tone; the Track stays neutral in all five, so a column of meters still reads as one family."
                states={[
                    {
                        name: "color = accent",
                        why: "The fill renders in the neutral accent tone. This is the default reading, used when the number carries no verdict of its own yet.",
                        code: "<ProgressMeter color=\"accent\" value={55} />",
                        render: <ProgressMeter color="accent" value={55} ariaLabel="Storage used" showAnatomy />,
                    },
                    {
                        name: "color = success",
                        why: "The fill renders green. This band tells the reader the measurement is comfortably within its limit.",
                        code: "<ProgressMeter color=\"success\" value={30} />",
                        render: <ProgressMeter color="success" value={30} ariaLabel="Well within limit" />,
                    },
                    {
                        name: "color = warning",
                        why: "The fill renders amber. This band tells the reader the measurement is approaching its cap.",
                        code: "<ProgressMeter color=\"warning\" value={65} />",
                        render: <ProgressMeter color="warning" value={65} ariaLabel="Approaching the cap" />,
                    },
                    {
                        name: "color = danger",
                        why: "The fill renders red. This band tells the reader the measurement is almost full and needs action.",
                        code: "<ProgressMeter color=\"danger\" value={92} />",
                        render: <ProgressMeter color="danger" value={92} ariaLabel="Almost full" />,
                    },
                    {
                        name: "color = default",
                        why: "The fill renders in the plain neutral tone, with no verdict attached at all. Use this when the reading has not yet been classified into a band.",
                        code: "<ProgressMeter color=\"default\" value={48} />",
                        render: <ProgressMeter color="default" value={48} ariaLabel="Unrated measurement" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `size` — 3 mốc chiều cao, render ĐỦ union. */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ProgressMeter"
                tier="atom"
                leaf="Prop `size`"
                annotate={ANNOTATE}
                reason="Height is picked from a fixed 3-step scale so the atom owns it, and a caller never hand-sets a bar height with a class."
                states={[
                    {
                        name: "size = sm",
                        why: "The track renders at its shortest height. Use this in a compact row where several meters sit close together.",
                        code: "<ProgressMeter size=\"sm\" value={62} />",
                        render: <ProgressMeter size="sm" value={62} ariaLabel="Compact row" showAnatomy />,
                    },
                    {
                        name: "size = md (default)",
                        why: "The track renders at its default height. This is the height a caller gets without passing `size` at all.",
                        code: "<ProgressMeter value={62} />          // md = default",
                        render: <ProgressMeter size="md" value={62} ariaLabel="Default row" />,
                    },
                    {
                        name: "size = lg",
                        why: "The track renders at its tallest height. Use this when the reading is the single most prominent element on the screen.",
                        code: "<ProgressMeter size=\"lg\" value={62} />",
                        render: <ProgressMeter size="lg" value={62} ariaLabel="Prominent row" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `isSkeleton` — atom tự vẽ shimmer của chính nó (§12c), không dùng Skeleton.*. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ProgressMeter"
                tier="atom"
                leaf="Prop `isSkeleton`"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The track is replaced by a shimmer bar at the same height as the real track, no fill and no value. Since the atom draws its own shimmer, nothing shifts once the measurement lands and the real fill appears.",
                        code: "<ProgressMeter isSkeleton />",
                        render: <ProgressMeter isSkeleton showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}
