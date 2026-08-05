import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { ChunkyButton } from "@sb-components/mia-mia/atoms/buttons/ChunkyButton"

const Arrow = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
)

const meta: Meta<typeof ChunkyButton> = {
    title: "MiaMia/ChunkyButton",
    component: ChunkyButton,
    args: {
        href: "#",
        children: "Start learning free",
        tone: "pink",
        size: "md",
    },
}

export default meta

type Story = StoryObj<typeof ChunkyButton>

/** The one CTA the whole marketing surface repeats. Reach for `tone="pink"` as the primary action on a light surface and `tone="sun"` as the secondary beside it; switch `shadow="cream"` only on the dark banner, where an ink shadow disappears. Not for in-body text links — those are plain anchors. */
export const Default: Story = {
    parameters: { usage: "The one CTA the whole marketing surface repeats. Reach for `tone=\"pink\"` as the primary action on a light surface and `tone=\"sun\"` as the secondary beside it; switch `shadow=\"cream\"` only on the dark banner, where an ink shadow disappears. Not for in-body text links — those are plain anchors." },
    render: (args) => <ChunkyButton {...args} endIcon={<Arrow />} />,
}

/** The colour roles side by side — `pink` leads, `sun` supports. Choose by role, never by the colour you want to see. */
export const Tones: Story = {
    parameters: { usage: "The colour roles side by side — `pink` leads, `sun` supports. Choose by role, never by the colour you want to see." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Pink — primary</Label>
                    <Typography type="body-sm" color="muted">the main action on a surface; at most one per beat.</Typography>
                </div>
                <ChunkyButton href="#" tone="pink" endIcon={<Arrow />}>Start learning free</ChunkyButton>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Sun — secondary</Label>
                    <Typography type="body-sm" color="muted">a supporting action paired with a pink primary.</Typography>
                </div>
                <ChunkyButton href="#" tone="sun">View a real exam</ChunkyButton>
            </div>
        </div>
    ),
}

/** The `lg` size with a `cream` shadow, as used on the dark closing banner — verify the offset shadow stays visible against the ink fill. */
export const OnDarkBanner: Story = {
    parameters: { usage: "The `lg` size with a `cream` shadow, as used on the dark closing banner — verify the offset shadow stays visible against the ink fill." },
    render: () => (
        <div className="flex flex-col gap-3 rounded-3xl bg-[var(--nb-ink)] p-8">
            <ChunkyButton href="#" tone="pink" size="lg" shadow="cream" endIcon={<Arrow />}>Start learning free</ChunkyButton>
        </div>
    ),
}
