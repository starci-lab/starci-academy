import type { Meta, StoryObj } from "@storybook/nextjs"
import { Progress } from "@sb-components/atoms/display/Progress/Progress"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Progress.Circle> = {
    title: "Atoms/Display/Progress/Progress.Circle",
    component: Progress.Circle,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Progress.Circle>

const RING_PARTS: Array<AnatomyNode> = [
    { name: "Track", tier: "atom", role: "vòng nền (HeroUI ProgressCircle.Track — chứa 2 circle)" },
    { name: "Fill", tier: "atom", role: "cung đã chạy (FillCircle) — dài theo value / tone theo color" },
]
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "atom", role: "leaf skeleton do atom tự sở hữu (circle shimmer)" },
]

/** Value — tiến trình xác định dạng vòng (value/max). */
export const Value: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Circle"
                tier="atom"
                leaf="Value"
                parts={RING_PARTS}
                reason="Vòng TIẾN TRÌNH bọc react-aria ProgressBar (dạng circle); cùng ngữ nghĩa với Bar."
                code={"<Progress.Circle value={68} size=\"md\" />"}
            >
                <Progress.Circle value={68} ariaLabel="Tiến độ" showAnatomy />
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
                parts={RING_PARTS}
                note="isIndeterminate → cung animate; react-aria bỏ qua value."
                code={"<Progress.Circle isIndeterminate />"}
            >
                <Progress.Circle isIndeterminate ariaLabel="Đang xử lý" showAnatomy />
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
                parts={SKELETON_PARTS}
                note="isSkeleton → circle shimmer OWNED bởi atom (hybrid C) — trước khi biết value."
                code={"<Progress.Circle isSkeleton />"}
            >
                <Progress.Circle isSkeleton showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}
