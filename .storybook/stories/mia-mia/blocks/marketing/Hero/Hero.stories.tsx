import type { Meta, StoryObj } from "@storybook/nextjs"
import { Hero } from "@sb-components/mia-mia/blocks/marketing/Hero"

const meta: Meta<typeof Hero> = {
    title: "MiaMia/Hero",
    component: Hero,
    args: {
        eyebrow: "Luyện thi THPT · chơi mà giỏi",
        headlineLead: "Giỏi tiếng Anh,",
        headlineUnderline: "đậu THPT",
        headlineBreakLead: "không",
        headlineCircled: "giới hạn",
        description:
            "Đề THPT thật, chấm ngay không lộ đáp án. Ôn từ vựng bằng game, thi cùng bạn trong phòng thi ảo, có Mia — trợ giảng AI — kèm 24/7.",
        primaryCta: { label: "Vào học miễn phí", href: "#" },
        secondaryCta: { label: "Xem đề thi thật", href: "#" },
        stickers: {
            paper: { title: "Đề THPT 2026", metaLabel: "50 câu · 60′", scoreLabel: "Điểm của bạn", score: "8.5", statusLabel: "Đã nộp" },
            flashcard: { word: "resilient", phonetic: "/rɪˈzɪliənt/ · adj", meaning: "kiên cường, bền bỉ" },
            tutor: { avatarText: "M", quote: "“Câu này bẫy ở thì hoàn thành nha — thử lại xem!”" },
        },
    },
}

export default meta

type Story = StoryObj<typeof Hero>

/** The landing hero — the first screen a visitor sees. One per page, directly under the header. The headline's two scribble accents and the floating sticker cluster are intrinsic to the block; the copy and CTA targets are passed in. */
export const Default: Story = {
    parameters: { usage: "The landing hero — the first screen a visitor sees. One per page, directly under the header. The headline's two scribble accents and the floating sticker cluster are intrinsic to the block; the copy and CTA targets are passed in." },
    render: (args) => <Hero {...args} />,
}
