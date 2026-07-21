import type { Meta, StoryObj } from "@storybook/nextjs"
import { LightningIcon } from "@phosphor-icons/react"

import { HighlightCard } from "@/components/blocks/cards/HighlightCard"
import { SectionCard } from "@/components/blocks/cards/SectionCard"

const meta: Meta<typeof HighlightCard> = {
    title: "Legacy/Blocks/Cards/HighlightCard",
    component: HighlightCard,
}

export default meta

type Story = StoryObj<typeof HighlightCard>

/** `HighlightCard` — 1 vệt sáng accent QUÉT quanh card được bọc (không phải cả vòng sáng đều), nằm ở lớp TRONG đằng SAU card thật (card ngoài nhỏ hơn 2px bán kính, chồng lên che phần giữa) — thuần trang trí "nổi bật", KHÔNG mang tín hiệu dữ liệu gì (khác `SectionCard.withVerdict` — dải trái tĩnh, mang band/tier/zone thật, `card.md` §3i vs §3j). Chỉ dùng cho 1 card THẬT SỰ cần nổi bật trên cả màn (vd hero "tiếp tục phiên đang dở") — nhiều card cùng lúc dùng thì mất hết ý nghĩa "nổi bật". */
export const Default: Story = {
    parameters: { usage: "HighlightCard: 1 vệt sáng accent quét quanh card (card trong = lớp hiệu ứng, card ngoài nhỏ hơn 2px chồng lên), thuần trang trí (không phải data-signal như withVerdict). Chỉ dùng cho card ĐIỂM NHẤN DUY NHẤT trên 1 surface." },
    render: () => (
        <div className="max-w-md p-6">
            <HighlightCard>
                <SectionCard
                    title="Review in progress"
                    icon={<LightningIcon className="size-5 text-accent" aria-hidden focusable="false" />}
                >
                    Card 1/20
                </SectionCard>
            </HighlightCard>
        </div>
    ),
}
