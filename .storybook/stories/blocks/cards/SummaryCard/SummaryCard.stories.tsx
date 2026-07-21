import type { Meta, StoryObj } from "@storybook/nextjs"
import { BookOpenIcon, FireIcon, TrophyIcon } from "@phosphor-icons/react"
import { SummaryCard } from "./SummaryCard"

const meta: Meta<typeof SummaryCard> = {
    title: "Primitives/Card/SummaryCard",
    component: SummaryCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SummaryCard>

/** With hint — a short gloss line under the label (e.g. the most recent milestone). */
export const WithHint: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-xs">
                <SummaryCard
                    icon={<BookOpenIcon className="size-6" aria-hidden focusable="false" />}
                    value="12"
                    label="Khóa đã hoàn thành"
                    hint="Gần nhất: 15/07/2026"
                    onPress={() => {}}
                />
            </div>
        </div>
    ),
}

/** No hint — value + label already explain themselves (e.g. a learning streak). */
export const NoHint: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-xs">
                <SummaryCard
                    icon={<FireIcon className="size-6" aria-hidden focusable="false" />}
                    value="7"
                    label="Ngày học liên tiếp"
                    onPress={() => {}}
                />
            </div>
        </div>
    ),
}

/** Long content — label / hint longer than usual: the card keeps a fixed width and wraps, never truncates. */
export const LongContent: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-xs">
                <SummaryCard
                    icon={<TrophyIcon className="size-6" aria-hidden focusable="false" />}
                    value="4.8/5"
                    label="Điểm trung bình các bài chấm phỏng vấn thử"
                    hint="Tính trên toàn bộ lượt chấm trong 3 tháng gần nhất"
                    onPress={() => {}}
                />
            </div>
        </div>
    ),
}

/** Row — the real usage: several metric cards side by side in the profile overview, each linking to a tab. */
export const Row: Story = {
    render: () => (
        <div className="p-8">
            <div className="flex flex-wrap gap-3">
                <div className="w-56">
                    <SummaryCard
                        icon={<BookOpenIcon className="size-6" aria-hidden focusable="false" />}
                        value="12"
                        label="Khóa đã hoàn thành"
                        hint="Gần nhất: 15/07/2026"
                        onPress={() => {}}
                    />
                </div>
                <div className="w-56">
                    <SummaryCard
                        icon={<FireIcon className="size-6" aria-hidden focusable="false" />}
                        value="7"
                        label="Ngày học liên tiếp"
                        onPress={() => {}}
                    />
                </div>
                <div className="w-56">
                    <SummaryCard
                        icon={<TrophyIcon className="size-6" aria-hidden focusable="false" />}
                        value="4.8/5"
                        label="Điểm trung bình bài chấm"
                        onPress={() => {}}
                    />
                </div>
            </div>
        </div>
    ),
}
