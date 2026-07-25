import type { Meta, StoryObj } from "@storybook/nextjs"
import { Divider } from "@sb-components/atoms/display/Divider/Divider"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Divider.Base> = {
    title: "Atoms/Display/Divider/Divider.Base",
    component: Divider.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Divider.Base>

const LINE_PARTS: Array<AnatomyNode> = [
    { name: "Line", tier: "atom", role: "đường kẻ (HeroUI Separator) — orientation + variant" },
]
const LABELLED_PARTS: Array<AnatomyNode> = [
    { name: "Line", tier: "atom", role: "rule hai bên (2 × Separator flex-1)" },
    { name: "Label", tier: "atom", role: "nhãn giữa (text-xs muted)" },
]

/** Horizontal — đường ngang mặc định (bọc HeroUI Separator). */
export const Horizontal: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Divider.Base"
                tier="atom"
                leaf="Horizontal"
                parts={LINE_PARTS}
                reason="Đường phân cách bọc HeroUI Separator (HeroUI không có 'Divider' — đổi tên cho ngữ vựng app); orientation/label phân bằng prop."
                code={`<Divider.Base />`}
            >
                <div className="w-72">
                    <Divider.Base showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Vertical — đường dọc (cần cha có chiều cao). */
export const Vertical: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Divider.Base"
                tier="atom"
                leaf="Vertical"
                parts={LINE_PARTS}
                note="orientation='vertical' → cần cha có cao (vd h-16); dùng ngăn cách item trên một hàng."
                code={`<Divider.Base orientation="vertical" />`}
            >
                <div className="flex h-16 items-center gap-4">
                    <span className="text-muted text-sm">Bài học</span>
                    <Divider.Base orientation="vertical" showAnatomy />
                    <span className="text-muted text-sm">Bài tập</span>
                    <Divider.Base orientation="vertical" showAnatomy />
                    <span className="text-muted text-sm">Thảo luận</span>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** WithLabel — nhãn giữa hai rule (chỉ ngang): rule · nhãn · rule. */
export const WithLabel: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Divider.Base"
                tier="atom"
                leaf="WithLabel"
                parts={LABELLED_PARTS}
                note="label (horizontal) → atom dựng 2 rule flex-1 kẹp nhãn giữa (vd 'HOẶC' ở form đăng nhập)."
                code={`<Divider.Base label="HOẶC" />`}
            >
                <div className="w-72">
                    <Divider.Base label="HOẶC" showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
