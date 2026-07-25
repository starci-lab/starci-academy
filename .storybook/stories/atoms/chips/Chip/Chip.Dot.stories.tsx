import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Chip.Dot> = {
    title: "Atoms/Chips/Chip/Chip.Dot",
    component: Chip.Dot,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof Chip.Dot>

const DOT_PARTS: Array<AnatomyNode> = [
    { name: "Dot", tier: "atom", role: "chấm trạng thái (gravity CircleFill w6) — màu qua `dotClassName` (currentColor)" },
    { name: "Label", tier: "atom", role: "nhãn chip (HeroChip.Label) — màu foreground" },
]
const REMOVE_PARTS: Array<AnatomyNode> = [
    { name: "Dot", tier: "atom", role: "chấm trạng thái (CircleFill w6)" },
    { name: "Label", tier: "atom", role: "nhãn chip" },
    { name: "Remove", tier: "atom", role: "nút × (onRemove)" },
]
const SKELETON_PARTS: Array<AnatomyNode> = [{ name: "Skeleton", tier: "atom", role: "leaf skeleton pill (hybrid C)" }]

/** Default — chip trung tính (bg-default) + chấm success dẫn đầu. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Chip.Dot"
                tier="atom"
                leaf="Default"
                parts={DOT_PARTS}
                reason="Body chip trung tính (bg-default · text foreground); CHẤM nói lên trạng thái — màu chấm tách khỏi màu chip."
                code={`<Chip.Dot text="Đang hoạt động" dotClassName="text-success" />`}
            >
                <Chip.Dot text="Đang hoạt động" dotClassName="text-success" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Colors — cùng body trung tính, đổi màu CHẤM qua `dotClassName` (tailwind text-color). */
export const Colors: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Chip.Dot"
                tier="atom"
                leaf="Colors"
                parts={DOT_PARTS}
                note="dotClassName ăn `currentColor` của gravity CircleFill → text-success/warning/danger/muted đổi màu chấm; text vẫn foreground."
                code={`<Chip.Dot text="Online" dotClassName="text-success" />
<Chip.Dot text="Bận" dotClassName="text-warning" />
<Chip.Dot text="Offline" dotClassName="text-danger" />
<Chip.Dot text="Nháp" dotClassName="text-muted" />`}
            >
                <div className="flex flex-wrap items-center gap-2">
                    <Chip.Dot text="Online" dotClassName="text-success" showAnatomy />
                    <Chip.Dot text="Bận" dotClassName="text-warning" />
                    <Chip.Dot text="Offline" dotClassName="text-danger" />
                    <Chip.Dot text="Nháp" dotClassName="text-muted" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Removable — `onRemove` bật trailing ×, chấm vẫn dẫn đầu. */
export const Removable: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Chip.Dot"
                tier="atom"
                leaf="Removable"
                parts={REMOVE_PARTS}
                note="onRemove bật × — dùng khi dot-chip là token lọc theo trạng thái."
                code={`<Chip.Dot text="Đang mở" dotClassName="text-success" onRemove={fn} removeLabel="Bỏ lọc" />`}
            >
                <Chip.Dot text="Đang mở" dotClassName="text-success" onRemove={() => {}} removeLabel="Bỏ lọc" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Loading — atom tự vẽ leaf skeleton (pill shimmer). */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Chip.Dot"
                tier="atom"
                leaf="Loading"
                parts={SKELETON_PARTS}
                note="isSkeleton → pill shimmer OWNED bởi atom (hybrid C)."
                code={`<Chip.Dot isSkeleton text="Đang hoạt động" />`}
            >
                <Chip.Dot isSkeleton text="Đang hoạt động" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}
