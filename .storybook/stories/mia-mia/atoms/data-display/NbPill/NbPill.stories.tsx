import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { NbPill } from "@sb-components/mia-mia/atoms/data-display/NbPill"

const Star = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1B1622" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" />
    </svg>
)

const meta: Meta<typeof NbPill> = {
    title: "MiaMia/NbPill",
    component: NbPill,
    args: {
        children: "National exam prep · play to get better",
        tone: "sun",
        size: "md",
        shadow: true,
    },
}

export default meta

type Story = StoryObj<typeof NbPill>

/** The smallest labelled value on the marketing surface. Reach for the shadowed `md` sun pill as a hero eyebrow; drop to a flat `sm` white or sun pill for a card's meta or status tag. Not for interactive filters — this is a label, not a control. */
export const Default: Story = {
    parameters: { usage: "The smallest labelled value on the marketing surface. Reach for the shadowed `md` sun pill as a hero eyebrow; drop to a flat `sm` white or sun pill for a card's meta or status tag. Not for interactive filters — this is a label, not a control." },
    render: (args) => <NbPill {...args} icon={<Star />} />,
}

/** The recurring uses at their real size: the shadowed eyebrow, a flat meta tag, a status tag. */
export const Roles: Story = {
    parameters: { usage: "The recurring uses at their real size: the shadowed eyebrow, a flat meta tag, a status tag." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Eyebrow (md, sun, shadow)</Label>
                    <Typography type="body-sm" color="muted">sits above the hero headline.</Typography>
                </div>
                <NbPill tone="sun" size="md" shadow icon={<Star />}>National exam prep · play to get better</NbPill>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Meta tag (sm, white)</Label>
                    <Typography type="body-sm" color="muted">a flat detail chip inside a card.</Typography>
                </div>
                <NbPill tone="white" size="sm">50 questions · 60 min</NbPill>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Status tag (sm, sun)</Label>
                    <Typography type="body-sm" color="muted">a state marker on a submitted paper.</Typography>
                </div>
                <NbPill tone="sun" size="sm">Submitted</NbPill>
            </div>
        </div>
    ),
}
