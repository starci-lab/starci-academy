import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { StackIcon } from "@phosphor-icons/react"
import { NestedCard, NestedCardSection } from "./NestedCard"

const meta: Meta<typeof NestedCard> = {
    title: "Primitives/Card/NestedCard",
    component: NestedCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof NestedCard>

const stackIcon = <StackIcon aria-hidden focusable="false" className="size-4 shrink-0" />

const relatedSections = (
    <>
        <NestedCardSection eyebrow="Relational databases" title="Data normalization and normal forms">
            <Typography type="body-sm" color="muted">
                Normalization splits data into multiple tables to reduce redundancy and update anomalies.
            </Typography>
        </NestedCardSection>
        <NestedCardSection eyebrow="Database review deck" title="When should you denormalize to optimize reads?" />
    </>
)

/**
 * `bordered` (the common case) — surface-in-surface: the card sits inside a filled parent
 * (chat panel / bubble / modal / page card), so it delineates with a BORDER, not a shadow.
 */
export const Bordered: Story = {
    render: () => (
        <div className="p-8">
            <div className="flex flex-col overflow-hidden rounded-2xl border border-default bg-surface">
                <div className="flex flex-col gap-2 p-3">
                    <div className="max-w-[85%] rounded-2xl bg-surface-secondary px-3 py-2">
                        <Typography type="body-sm">
                            It&apos;s usually when you see data repeated across many rows, or a column that depends on a non-primary-key column.
                        </Typography>
                    </div>
                    <div className="max-w-[85%]">
                        <NestedCard title="Related lessons" icon={stackIcon} bordered>{relatedSections}</NestedCard>
                    </div>
                </div>
            </div>
        </div>
    ),
}

/**
 * `bordered={false}` (rare) — rendered directly on `bg-background` with no parent surface,
 * so the card owns its own surface: `bg-surface shadow-surface`.
 */
export const OnBackground: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <NestedCard title="Related lessons" icon={stackIcon} bordered={false}>{relatedSections}</NestedCard>
            </div>
        </div>
    ),
}
