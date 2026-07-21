import type { Meta, StoryObj } from "@storybook/nextjs"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof BackLink> = {
    title: "Blocks/Navigation/BackLink",
    component: BackLink,
}
export default meta
type Story = StoryObj<typeof BackLink>

/**
 * Trạng thái duy nhất của BackLink: nhãn chung "Trở lại" khi subpage chỉ cần
 * một đường về chung, không cần nêu đích cụ thể.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Đường về chung"
                hint="Dùng khi subpage chỉ cần một đường về chung, không cần nêu đích cụ thể quay lại."
            >
                <BackLink onPress={() => {}} />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage: "Use when a subpage only needs a generic way back, without naming the specific destination it returns to.",
    },
}
