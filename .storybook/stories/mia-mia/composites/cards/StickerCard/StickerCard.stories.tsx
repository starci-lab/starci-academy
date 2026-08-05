import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { StickerCard } from "@sb-components/mia-mia/composites/cards/StickerCard"

const meta: Meta<typeof StickerCard> = {
    title: "MiaMia/StickerCard",
    component: StickerCard,
}

export default meta

type Story = StoryObj<typeof StickerCard>

/** The tilted study sticker, in its default `paper` shape. Pick the `variant` by the CONTENT it must carry — a submitted exam is `paper`, a vocabulary item is `flashcard`, a line of coaching is `tutor` — never by the colour you want. The tilt and float are placement on the board; width and position come from `className`. */
export const Default: Story = {
    parameters: { usage: "The tilted study sticker, in its default `paper` shape. Pick the `variant` by the CONTENT it must carry — a submitted exam is `paper`, a vocabulary item is `flashcard`, a line of coaching is `tutor` — never by the colour you want. The tilt and float are placement on the board; width and position come from `className`." },
    render: () => (
        <div className="w-56">
            <StickerCard
                variant="paper"
                tilt="left"
                title="National exam 2026"
                metaLabel="50 questions · 60 min"
                scoreLabel="Your score"
                score="8.5"
                statusLabel="Submitted"
            />
        </div>
    ),
}

/** All three content shapes side by side — the `paper` exam, the `flashcard`, and the `tutor` bubble. Use this to choose the shape whose fields match the data in hand. */
export const Variants: Story = {
    parameters: { usage: "All three content shapes side by side — the `paper` exam, the `flashcard`, and the `tutor` bubble. Use this to choose the shape whose fields match the data in hand." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Paper</Label>
                    <Typography type="body-sm" color="muted">a submitted mock exam: title, timing, score, status.</Typography>
                </div>
                <div className="w-56">
                    <StickerCard variant="paper" tilt="left" title="National exam 2026" metaLabel="50 questions · 60 min" scoreLabel="Your score" score="8.5" statusLabel="Submitted" />
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Flashcard</Label>
                    <Typography type="body-sm" color="muted">one vocabulary item: word, phonetics, meaning.</Typography>
                </div>
                <div className="w-52">
                    <StickerCard variant="flashcard" tilt="right" word="resilient" phonetic="/rɪˈzɪliənt/ · adj" meaning="resilient, persistent" />
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Tutor</Label>
                    <Typography type="body-sm" color="muted">a line of coaching from Mia beside her avatar.</Typography>
                </div>
                <div className="w-64">
                    <StickerCard variant="tutor" avatarText="M" quote="This one traps you on the present perfect -- try again!" />
                </div>
            </div>
        </div>
    ),
}
