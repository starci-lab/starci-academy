import type { Meta, StoryObj } from "@storybook/nextjs"

import { BackLink } from "./index"

const meta: Meta<typeof BackLink> = {
    title: "Blocks/BackLink",
    component: BackLink,
}

export default meta

type Story = StoryObj<typeof BackLink>

/** Back affordance DUY NHẤT của trang lá/sub-view (thường nhét vào slot `breadcrumb` của PageHeader). Text link mờ, KHÔNG pill/button. Rê chuột: mũi tên trượt trái + label gạch chân. */
export const Default: Story = {
    parameters: { usage: "Back affordance duy nhất của trang lá — text link mờ (không pill). Hover: mũi tên trượt trái + gạch chân label." },
    args: { label: "Quay lại thử thách", onPress: () => {} },
}

/** `target` → ghép nhãn "Trở lại {target}" (dịch tự caller); dùng khi muốn nêu rõ đích quay về. */
export const WithTarget: Story = {
    parameters: { usage: "target → ghép nhãn \"Trở lại {target}\" — nêu rõ đích quay về." },
    args: { target: "preview", onPress: () => {} },
}
