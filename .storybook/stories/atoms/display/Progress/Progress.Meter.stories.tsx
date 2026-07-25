import type { Meta, StoryObj } from "@storybook/nextjs"
import { Progress } from "@sb-components/atoms/display/Progress/Progress"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Progress.Meter> = {
    title: "Atoms/Display/Progress/Progress.Meter",
    component: Progress.Meter,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Progress.Meter>

const METER_PARTS: Array<AnatomyNode> = [
    { name: "Track", tier: "atom", role: "rãnh nền (HeroUI Meter.Track)" },
    { name: "Fill", tier: "atom", role: "mức đo (Meter.Fill) — rộng theo value / tone theo band" },
]
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "atom", role: "leaf skeleton do atom tự sở hữu (thanh shimmer)" },
]

/**
 * Value — ĐO LƯỜNG tĩnh (dung lượng/pin/điểm). Khác Bar/Circle: Meter LUÔN có giá
 * trị xác định → KHÔNG có leaf `Indeterminate` (react-aria Meter không hỗ trợ; một
 * phép đo lường không thể "không rõ").
 */
export const Value: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Meter"
                tier="atom"
                leaf="Value"
                parts={METER_PARTS}
                reason="Meter = ĐO LƯỜNG tĩnh (bọc react-aria Meter). Không phải tiến-trình → không có indeterminate; tone tải nghĩa NGƯỠNG (xem Bands)."
                code={"<Progress.Meter value={72} max={100} />"}
            >
                <div className="w-72">
                    <Progress.Meter value={72} ariaLabel="Dung lượng ổ đĩa" showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Bands — tone tải nghĩa NGƯỠNG: success (thấp) → warning (giữa) → danger (cao). */
export const Bands: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Meter"
                tier="atom"
                leaf="Bands"
                parts={METER_PARTS}
                note="Với Meter, MÀU là thông tin: cùng phép đo, band khác nhau theo mức (an toàn → cảnh báo → nguy hiểm)."
                code={"<Progress.Meter value={30|65|92} color=\"success|warning|danger\" />"}
            >
                <div className="flex w-72 flex-col gap-4">
                    <Progress.Meter value={30} color="success" ariaLabel="Mức an toàn" showAnatomy />
                    <Progress.Meter value={65} color="warning" ariaLabel="Mức cảnh báo" showAnatomy />
                    <Progress.Meter value={92} color="danger" ariaLabel="Mức nguy hiểm" showAnatomy />
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
                name="Progress.Meter"
                tier="atom"
                leaf="Loading"
                parts={SKELETON_PARTS}
                note="isSkeleton → thanh shimmer OWNED bởi atom (hybrid C) — trước khi biết phép đo."
                code={"<Progress.Meter isSkeleton value={0} />"}
            >
                <div className="w-72">
                    <Progress.Meter isSkeleton value={0} showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
