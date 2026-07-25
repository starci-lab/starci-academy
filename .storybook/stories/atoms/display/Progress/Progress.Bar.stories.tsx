import type { Meta, StoryObj } from "@storybook/nextjs"
import { Progress } from "@sb-components/atoms/display/Progress/Progress"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Progress.Bar> = {
    title: "Atoms/Display/Progress/Progress.Bar",
    component: Progress.Bar,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Progress.Bar>

const TRACK_PARTS: Array<AnatomyNode> = [
    { name: "Track", tier: "atom", role: "rãnh nền (HeroUI ProgressBar.Track)" },
    { name: "Fill", tier: "atom", role: "phần đã chạy (ProgressBar.Fill) — rộng theo value / tone theo color" },
]
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "atom", role: "leaf skeleton do atom tự sở hữu (thanh shimmer)" },
]

/** Value — tiến trình xác định (value/max). */
export const Value: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Bar"
                tier="atom"
                leaf="Value"
                parts={TRACK_PARTS}
                reason="Thanh TIẾN TRÌNH tuyến tính bọc react-aria ProgressBar; xác định (value) hoặc indeterminate."
                code={"<Progress.Bar value={62} max={100} />"}
            >
                <div className="w-72">
                    <Progress.Bar value={62} ariaLabel="Tiến độ khoá học" showAnatomy />
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
                parts={TRACK_PARTS}
                note="isIndeterminate → fill animate; react-aria bỏ qua value."
                code={"<Progress.Bar isIndeterminate />"}
            >
                <div className="w-72">
                    <Progress.Bar isIndeterminate ariaLabel="Đang xử lý" showAnatomy />
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
                parts={SKELETON_PARTS}
                note="isSkeleton → thanh shimmer OWNED bởi atom (hybrid C) — trước khi biết value."
                code={"<Progress.Bar isSkeleton />"}
            >
                <div className="w-72">
                    <Progress.Bar isSkeleton showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
