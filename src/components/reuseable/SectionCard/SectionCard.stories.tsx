import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { CaretRightIcon, LightningIcon } from "@phosphor-icons/react"

import { SectionCard } from "./index"
import { ListRow } from "@/components/blocks/lists/ListRow"

const meta: Meta<typeof SectionCard> = {
    title: "Core/Card/SectionCard",
    component: SectionCard,
}

export default meta

type Story = StoryObj<typeof SectionCard>

/** Rows body dùng chung. */
const body = (
    <>
        <ListRow title="Ôn tập spaced-repetition" subtitle="8 thẻ đến hạn" trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />} onPress={() => {}} divider />
        <ListRow title="Thử thách coding" subtitle="2 bài chưa nộp" trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />} onPress={() => {}} />
    </>
)

/** Khung "viền" chuẩn: header (icon + title trái, action phải) ngăn bằng đường kẻ, rồi body. Dùng khắp profile + dashboard cho mọi section có tiêu đề. */
export const Default: Story = {
    parameters: { usage: "Khung viền chuẩn: header (icon+title trái, action phải) + body. Dùng cho mọi section có tiêu đề ở profile/dashboard." },
    render: () => (
        <div className="max-w-md">
            <SectionCard
                title="Ôn tập & luyện"
                icon={<LightningIcon className="size-5 text-muted" aria-hidden focusable="false" />}
                action={<Button variant="tertiary" size="sm">Xem tất cả</Button>}
            >
                {body}
            </SectionCard>
        </div>
    ),
}

/** `accent` — viền + nền tô nhẹ theo accent, cho card "của chính người xem" / được làm nổi. */
export const Accent: Story = {
    parameters: { usage: "accent: viền accent tô nhẹ — cho card của chính người xem / được highlight." },
    render: () => (
        <div className="max-w-md">
            <SectionCard
                accent
                title="Hồ sơ của bạn"
                icon={<LightningIcon className="size-5 text-accent" aria-hidden focusable="false" />}
            >
                {body}
            </SectionCard>
        </div>
    ),
}

/** Không header — bỏ title/icon/action → chỉ còn khung + body, cho section mà nội dung tự nói lên. */
export const Plain: Story = {
    parameters: { usage: "Không header: chỉ khung + body, cho section mà nội dung tự đủ nghĩa." },
    render: () => (
        <div className="max-w-md">
            <SectionCard>{body}</SectionCard>
        </div>
    ),
}
