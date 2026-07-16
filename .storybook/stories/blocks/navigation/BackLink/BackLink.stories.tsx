import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { BackLink } from "@/components/blocks/navigation/BackLink"

const meta: Meta<typeof BackLink> = {
    title: "Core/Navigation/BackLink",
    component: BackLink,
}
export default meta
type Story = StoryObj<typeof BackLink>

/** Use when a subpage only needs a generic way back, without naming the specific destination it returns to. */
export const Default: Story = {
    parameters: { usage: "Use when a subpage only needs a generic way back, without naming the specific destination it returns to." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Generic back</Label>
                <Typography type="body-sm" color="muted">
                    Use when a subpage only needs a generic way back, without naming the specific destination it returns to.
                </Typography>
            </div>
            <BackLink onPress={() => {}} />
        </div>
    ),
}
