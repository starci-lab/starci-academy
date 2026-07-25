import type { Meta, StoryObj } from "@storybook/nextjs"
import { BrandLockup } from "@sb-components/_designs/identity/BrandLockup/BrandLockup"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof BrandLockup> = {
    title: "Design/Identity/BrandLockup",
    component: BrandLockup,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof BrandLockup>

// Wide container: both direct parts render — the icon AND the wordmark stack.
const FULL_PARTS: Array<AnatomyNode> = [
    { name: "Logo", tier: "primitive", role: "biểu trưng SVG circuit-C" },
    { name: "Wordmark", tier: "primitive", role: "stack 2 dòng StarCi/Academy — ẩn dưới @app-md" },
]

// Narrow container: only the icon is meaningfully present (Wordmark is CSS-hidden).
const ICON_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "Logo", tier: "primitive", role: "biểu trưng SVG circuit-C" },
]

export const IconAndWordmark: Story = {
    render: () => (
        <div className="p-8">
            {/* container ≥ 48rem → wordmark shows */}
            <div className="@container w-full">
                <BlockAnatomy
                    name="BrandLockup"
                    tier="design"
                    leaf="IconAndWordmark"
                    parts={FULL_PARTS}
                    reason="Brand mark (Logo) sát cạnh wordmark 'StarCi / ACADEMY' — dùng chung cho navbar/footer đọc cùng một mark. Wordmark ẩn dưới @app-md nên phần rộng luôn có cả 2 part."
                >
                    <BrandLockup showAnatomy />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

export const IconOnly: Story = {
    render: () => (
        <div className="p-8">
            {/* container narrower than @app-md → wordmark hides, icon-only.
                Container query measures the nearest @container ancestor, not the
                viewport — so a narrow @container reproduces the mobile state. */}
            <div className="@container w-20">
                <BlockAnatomy
                    name="BrandLockup"
                    tier="design"
                    leaf="IconOnly"
                    parts={ICON_ONLY_PARTS}
                    note="Container hẹp hơn @app-md → Wordmark bị CSS ẩn (`hidden`), composition chỉ còn Logo."
                >
                    <BrandLockup showAnatomy />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

export const SelfStartInFlexCol: Story = {
    render: () => (
        <div className="p-8">
            {/* a flex-col parent stretches children horizontally; className="self-start"
                keeps the lockup only as wide as its content, per the block's JSDoc. */}
            <div className="@container flex w-64 flex-col rounded-lg border border-default bg-default/40 p-4">
                <BlockAnatomy
                    name="BrandLockup"
                    tier="design"
                    leaf="SelfStart"
                    parts={ICON_ONLY_PARTS}
                    note="w-64 vẫn hẹp hơn @app-md → Wordmark ẩn; leaf này minh hoạ `self-start` giữ lockup không bị stretch bởi flex-col cha, không đổi cây parts."
                >
                    <BrandLockup className="self-start" showAnatomy />
                </BlockAnatomy>
            </div>
        </div>
    ),
}
