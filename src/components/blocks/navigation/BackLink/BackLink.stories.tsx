import type { Meta, StoryObj } from "@storybook/nextjs"
import { BackLink } from "./index"

const meta: Meta<typeof BackLink> = {
    title: "Blocks/Navigation/BackLink",
    component: BackLink,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof BackLink>

/** Dùng khi trang con chỉ cần quay lại chung chung, không nêu đích danh nơi sẽ về. */
export const Default: Story = {
    parameters: { usage: "Dùng khi trang con chỉ cần quay lại chung chung, không nêu đích danh nơi sẽ về." },
    render: () => <BackLink onPress={() => {}} />,
}

/** Dùng khi cần nói rõ nơi sẽ quay về để người học định hướng, ví dụ trở lại danh sách thử thách. */
export const WithTarget: Story = {
    parameters: { usage: "Dùng khi cần nói rõ nơi sẽ quay về để người học định hướng, ví dụ trở lại danh sách thử thách." },
    render: () => <BackLink target="danh sách thử thách" onPress={() => {}} />,
}
