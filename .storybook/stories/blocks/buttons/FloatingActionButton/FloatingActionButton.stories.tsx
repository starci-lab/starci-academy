import type { Meta, StoryObj } from "@storybook/nextjs"
import { PlusIcon } from "@phosphor-icons/react"
import { FloatingActionButton } from "@/components/blocks/buttons/FloatingActionButton"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof FloatingActionButton> = {
    title: "Primitives/Actions/FloatingActionButton",
    component: FloatingActionButton,
}
export default meta
type Story = StoryObj<typeof FloatingActionButton>

/**
 * Toàn bộ trạng thái của FloatingActionButton. Dùng khi cần tra khi nào đặt
 * một nút hành động chính dạng nổi ở góc màn hình.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Default"
                hint="Use when you need a floating button in the bottom-right corner to open the page's main action, for example a quick create. The page's main action that the user must be able to reach at any scroll position. The block pins itself to the bottom-right corner with fixed positioning, so it sticks to the screen edge instead of flowing inline — don't wrap it in another element to position it."
            >
                <FloatingActionButton onPress={() => {}} ariaLabel="Create new">
                    <PlusIcon />
                </FloatingActionButton>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage: "Use when you need a floating button in the bottom-right corner to open the page's main action, for example a quick create.",
    },
}
