import type { Meta, StoryObj } from "@storybook/nextjs"
import { LanguageDonut } from "@sb-components/_legacy/blocks/stats/LanguageDonut/LanguageDonut"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof LanguageDonut> = {
    title: "Legacy/Block/Stats/LanguageDonut",
    component: LanguageDonut,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof LanguageDonut>

// Both leaves share the same two direct parts — only size/item count differ.
const DONUT_PARTS: Array<AnatomyNode> = [
    { name: "Donut", tier: "composite", role: "vành recharts theo màu brand ngôn ngữ + tổng số ở tâm" },
    { name: "Legend", tier: "composite", role: "danh sách dot màu + tên · count · % mỗi ngôn ngữ" },
]

/** Default size for many languages — ring split by brand colour, total at the centre, legend with count + %. */
export const MultiLanguage: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="LanguageDonut"
                tier="block"
                leaf="MultiLanguage"
                parts={DONUT_PARTS}
                reason="Donut GitHub-style: vành recharts tô theo màu brand ngôn ngữ đứng cạnh legend liệt kê count + share — hai part cố định, không phụ thuộc số lượng ngôn ngữ."
            >
                <LanguageDonut
                    ariaLabel="Phân bố bài giải theo ngôn ngữ"
                    unitLabel="bài giải"
                    items={[
                        { key: "typescript", value: 128 },
                        { key: "python", value: 64 },
                        { key: "java", value: 31 },
                        { key: "go", value: 18 },
                        { key: "csharp", value: 9 },
                    ]}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Compact (smaller size/thickness) — for a narrow block; total + legend stay readable. */
export const Compact: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="LanguageDonut"
                tier="block"
                leaf="Compact"
                parts={DONUT_PARTS}
                note="Cùng composition với leaf MultiLanguage — chỉ đổi `size`/`thickness` nhỏ hơn, không đổi cây parts."
            >
                <LanguageDonut
                    size={96}
                    thickness={6}
                    ariaLabel="Phân bố bài giải theo ngôn ngữ (compact)"
                    unitLabel="bài giải"
                    items={[
                        { key: "typescript", value: 42 },
                        { key: "go", value: 15 },
                    ]}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}
