import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { PlusIcon } from "@phosphor-icons/react"
import { FloatingActionButton } from "@/components/blocks/buttons/FloatingActionButton"

const meta: Meta<typeof FloatingActionButton> = {
    title: "Core/Button/FloatingActionButton",
    component: FloatingActionButton,
}
export default meta
type Story = StoryObj<typeof FloatingActionButton>

/** Use when you need a floating button in the bottom-right corner to open the page's main action, for example a quick create. */
export const Default: Story = {
    parameters: { usage: "Use when you need a floating button in the bottom-right corner to open the page's main action, for example a quick create." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Default</Label>
                <Typography type="body-sm" color="muted">
                    The page's main action that the user must be able to reach at any scroll position. The block pins itself to the bottom-right corner with fixed positioning, so it sticks to the screen edge instead of flowing inline — don't wrap it in another element to position it.
                </Typography>
            </div>
            <FloatingActionButton onPress={() => {}} ariaLabel="Create new">
                <PlusIcon />
            </FloatingActionButton>
        </div>
    ),
}
