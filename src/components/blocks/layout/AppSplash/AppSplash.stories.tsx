import type { Meta, StoryObj } from "@storybook/nextjs"
import { AppSplash } from "./index"

const meta: Meta<typeof AppSplash> = {
    title: "Blocks/Layout/AppSplash",
    component: AppSplash,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof AppSplash>

/** Dùng khi ứng dụng vừa được nạp lần đầu (cold load / hard refresh), che toàn màn hình bằng logo StarCi và thanh trickle hồng cho tới khi client sẵn sàng. */
export const Default: Story = {
    parameters: { usage: "Dùng khi ứng dụng vừa được nạp lần đầu (cold load / hard refresh), che toàn màn hình bằng logo StarCi và thanh trickle hồng cho tới khi client sẵn sàng." },
    render: () => <AppSplash />,
}
