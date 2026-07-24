import type { Meta, StoryObj } from "@storybook/nextjs"
import { AiCategoryChip, AiModelCategory } from "./AiCategoryChip"

const meta: Meta<typeof AiCategoryChip> = {
    title: "Design/Chips/AiCategoryChip",
    component: AiCategoryChip,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof AiCategoryChip>

/** Free: the cheapest tier. Anyone can pick it, no unlock required. */
export const Free: Story = {
    render: () => (
        <div className="p-8">
            <AiCategoryChip category={AiModelCategory.Free} />
        </div>
    ),
}

/** Economy: still selectable without unlocking — only Balanced+ fall within PLAN_CATEGORIES. */
export const Economy: Story = {
    render: () => (
        <div className="p-8">
            <AiCategoryChip category={AiModelCategory.Economy} />
        </div>
    ),
}

/** Balanced: the FIRST tier that requires unlocking (pay or be enrolled to pick it). */
export const Balanced: Story = {
    render: () => (
        <div className="p-8">
            <AiCategoryChip category={AiModelCategory.Balanced} />
        </div>
    ),
}

/** Premium: requires unlocking. Tier 4 of 5 on the CATEGORY_ORDER scale. */
export const Premium: Story = {
    render: () => (
        <div className="p-8">
            <AiCategoryChip category={AiModelCategory.Premium} />
        </div>
    ),
}

/** Frontier: the strongest model, requires unlocking — the top tier, its own colour. */
export const Frontier: Story = {
    render: () => (
        <div className="p-8">
            <AiCategoryChip category={AiModelCategory.Frontier} />
        </div>
    ),
}

/** Đang tải: skeleton mirror (chấm tròn + thanh nhãn) thay cho chip thật. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <AiCategoryChip category={AiModelCategory.Balanced} isSkeleton />
        </div>
    ),
}
