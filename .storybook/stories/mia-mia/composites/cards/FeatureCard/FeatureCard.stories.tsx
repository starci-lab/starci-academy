import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { FeatureCard } from "@sb-components/mia-mia/composites/cards/FeatureCard"

const DocIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B1622" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 2h9l5 5v15H6zM15 2v5h5M9 13h6M9 17h6" />
    </svg>
)

const meta: Meta<typeof FeatureCard> = {
    title: "MiaMia/FeatureCard",
    component: FeatureCard,
    args: {
        title: "National exam practice",
        description: "Đề thật của các Sở, chấm ngay theo đáp án server — with no lộ đáp án khi đang làm. Xem lại từng câu sai.",
        ctaLabel: "Try a sample exam",
        ctaHref: "#",
        tone: "white",
        tilt: "left",
    },
}

export default meta

type Story = StoryObj<typeof FeatureCard>

/** One cell of the "three ways to get better" row: an icon tile, a title, a short pitch, and a learn-more link. Use it in a three-across grid for the product pillars; the icon is a slot, so pass the SVG that fits the feature. Not for a dense feature LIST — this card wants room to breathe. */
export const Default: Story = {
    parameters: { usage: "One cell of the \"three ways to get better\" row: an icon tile, a title, a short pitch, and a learn-more link. Use it in a three-across grid for the product pillars; the icon is a slot, so pass the SVG that fits the feature. Not for a dense feature LIST — this card wants room to breathe." },
    render: (args) => (
        <div className="max-w-sm">
            <FeatureCard {...args} icon={<DocIcon />} />
        </div>
    ),
}

/** The alternating surfaces of the row — `white` and `blush` — with the alternating lean. Alternate them across the grid so neighbouring cards read as distinct stickers. */
export const Tones: Story = {
    parameters: { usage: "The alternating surfaces of the row — `white` and `blush` — with the alternating lean. Alternate them across the grid so neighbouring cards read as distinct stickers." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>White (leans left)</Label>
                    <Typography type="body-sm" color="muted">the default surface; first and third in the row.</Typography>
                </div>
                <div className="max-w-sm">
                    <FeatureCard icon={<DocIcon />} title="National exam practice" description="Real provincial exams, graded instantly against the server key." ctaLabel="Try a sample exam" ctaHref="#" tone="white" tilt="left" />
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Blush (leans right)</Label>
                    <Typography type="body-sm" color="muted">the accent surface; the middle card of the row.</Typography>
                </div>
                <div className="max-w-sm">
                    <FeatureCard icon={<DocIcon />} title="Vocabulary bằng game" description="Four speed games: beat monsters to remember words, defend a base, match pairs." ctaLabel="Play ngay" ctaHref="#" tone="blush" tilt="right" />
                </div>
            </div>
        </div>
    ),
}
