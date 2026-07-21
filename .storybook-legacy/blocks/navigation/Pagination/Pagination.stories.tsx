import type { Meta, StoryObj } from "@storybook/nextjs"

import { Pagination } from "@/components/blocks/navigation/Pagination"
import { Demo } from "./components"

const meta: Meta<typeof Pagination> = {
    title: "Primitives/Navigation/Pagination",
    component: Pagination,
}

export default meta

type Story = StoryObj<typeof Pagination>

/** Many pages: a compact ellipsis in the middle, clickable. */
export const Default: Story = {
    parameters: { usage: "Controlled 1-based: click a number / prev-next to change page, the parent holds state. Many pages → middle ellipsis." },
    render: () => <Demo total={10} start={4} />,
}

/** Few pages: all shown, no ellipsis. */
export const Few: Story = {
    parameters: { usage: "Few pages: all shown, no ellipsis." },
    render: () => <Demo total={3} start={1} />,
}
