import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { LightningIcon } from "@phosphor-icons/react"

import { SectionCard } from "@/components/blocks/cards/SectionCard"
import { body } from "./components"

const meta: Meta<typeof SectionCard> = {
    title: "Core/Card/SectionCard",
    component: SectionCard,
}

export default meta

type Story = StoryObj<typeof SectionCard>

/** The standard "bordered" frame: a header (icon + title on the left, action on the right) separated by a rule, then the body. Used across profile + dashboard for every titled section. */
export const Default: Story = {
    parameters: { usage: "Standard bordered frame: header (icon+title left, action right) + body. For every titled section in profile/dashboard." },
    render: () => (
        <div className="max-w-md">
            <SectionCard
                title="Review & practice"
                icon={<LightningIcon className="size-5 text-muted" aria-hidden focusable="false" />}
                action={<Button variant="tertiary" size="sm">View all</Button>}
            >
                {body}
            </SectionCard>
        </div>
    ),
}

/** `accent` — border + a lightly tinted background in the accent color, for a card that is "the viewer's own" / highlighted. */
export const Accent: Story = {
    parameters: { usage: "accent: a lightly tinted accent border — for the viewer's own card / a highlighted one." },
    render: () => (
        <div className="max-w-md">
            <SectionCard
                accent
                title="Your profile"
                icon={<LightningIcon className="size-5 text-accent" aria-hidden focusable="false" />}
            >
                {body}
            </SectionCard>
        </div>
    ),
}

/** No header — drop title/icon/action → just the frame + body, for a section whose content speaks for itself. */
export const Plain: Story = {
    parameters: { usage: "No header: just the frame + body, for a section whose content is self-explanatory." },
    render: () => (
        <div className="max-w-md">
            <SectionCard>{body}</SectionCard>
        </div>
    ),
}
