import type { Meta, StoryObj } from "@storybook/nextjs"
import { Hero } from "@sb-components/mia-mia/blocks/marketing/Hero"

const meta: Meta<typeof Hero> = {
    title: "MiaMia/Hero",
    component: Hero,
    args: {
        eyebrow: "National exam prep · play to get better",
        headlineLead: "Get better at English,",
        headlineUnderline: "pass the exam",
        headlineBreakLead: "with no",
        headlineCircled: "limits",
        description:
            "Đề THPT thật, chấm ngay with no lộ đáp án. Vocabulary bằng game, thi cùng bạn trong virtual exam room, có Mia — AI teaching assistant — kèm 24/7.",
        primaryCta: { label: "Start learning free", href: "#" },
        secondaryCta: { label: "View a real exam", href: "#" },
        stickers: {
            paper: { title: "National exam 2026", metaLabel: "50 questions · 60 min", scoreLabel: "Your score", score: "8.5", statusLabel: "Submitted" },
            flashcard: { word: "resilient", phonetic: "/rɪˈzɪliənt/ · adj", meaning: "resilient, persistent" },
            tutor: { avatarText: "M", quote: "This one traps you on the present perfect -- try again!" },
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
