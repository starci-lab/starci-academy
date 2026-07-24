import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { SelfHostGpuMark } from "./SelfHostGpuMark"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — a leaf mark: an accent GPU icon + tooltip that sits beside a model
 * name in the grading dropdown to flag models self-hosted on StarCi hardware.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof SelfHostGpuMark> = {
    title: "Design/Grading/SelfHostGpuMark",
    component: SelfHostGpuMark,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SelfHostGpuMark>

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-4xl p-8">{node}</div>

// The mark's composition — mirrors the real DOM: a Tooltip root wrapping a
// Trigger (which holds the icon) and a Content bubble. Both leaves share this
// one shape (BesideModelName only adds a Typography OUTSIDE the mark).
const MARK_PARTS: Array<AnatomyNode> = [
    {
        name: "Tooltip",
        tier: "primitive",
        role: "gốc mark — bọc trigger + nội dung, mở giải thích self-host khi hover/focus (HeroUI base)",
        children: [
            {
                name: "Tooltip.Trigger",
                tier: "primitive",
                role: "vùng hover/focus inline (aria-label), bọc icon",
                children: [
                    {
                        name: "CpuIcon",
                        tier: "primitive",
                        role: "icon GPU accent, đánh dấu model chạy trên hạ tầng nội bộ",
                    },
                ],
            },
            {
                name: "Tooltip.Content",
                tier: "primitive",
                role: "bong bóng giải thích: model chạy GPU nội bộ StarCi, không gọi API bên ngoài",
            },
        ],
    },
]

export const Standalone: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="SelfHostGpuMark"
                tier="design"
                leaf="Standalone"
                parts={MARK_PARTS}
                reason="Một dấu hiệu leaf: icon GPU + tooltip đứng cạnh tên model trong dropdown chấm bài để phân biệt model self-host (RTX 5060) với model gọi API bên ngoài. Chi tiết nằm trong tooltip nên dòng không phải gánh thêm chip — chỉ một icon nhỏ."
            >
                <SelfHostGpuMark showAnatomy />
            </BlockAnatomy>,
        ),
}

export const BesideModelName: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="SelfHostGpuMark"
                tier="design"
                leaf="BesideModelName"
                parts={MARK_PARTS}
                note="Đặt cạnh tên model trong một dòng — CÙNG composition với leaf 'Đứng riêng', chỉ thêm Typography ngoài mark."
            >
                <div className="flex items-center gap-2">
                    <Typography type="body-sm">Qwen2.5-Coder 7B</Typography>
                    <SelfHostGpuMark showAnatomy />
                </div>
            </BlockAnatomy>,
        ),
}
