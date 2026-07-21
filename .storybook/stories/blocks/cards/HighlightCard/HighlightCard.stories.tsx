import type { Meta, StoryObj } from "@storybook/nextjs"
import { LightningIcon } from "@phosphor-icons/react"
import { HighlightCard } from "./HighlightCard"
import { SectionCard } from "../SectionCard/SectionCard"

const meta: Meta<typeof HighlightCard> = {
    title: "Primitives/Card/HighlightCard",
    component: HighlightCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof HighlightCard>

/**
 * A single accent arc sweeps around the wrapped card (inner layer = the effect, the wrapped
 * card sits in front). Pure "nổi bật" decoration — NOT a data signal like `withVerdict`. Use
 * it for the ONE emphasis card on a surface (e.g. a "resume your session" hero).
 */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <HighlightCard>
                    <SectionCard
                        title="Review in progress"
                        icon={<LightningIcon className="size-5 text-accent" aria-hidden focusable="false" />}
                    >
                        Card 1/20
                    </SectionCard>
                </HighlightCard>
            </div>
        </div>
    ),
}
