import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"

import { Pagination } from "./index"

const meta: Meta<typeof Pagination> = {
    title: "Reuseable/Pagination",
    component: Pagination,
}

export default meta

type Story = StoryObj<typeof Pagination>

/** Điều khiển trang (controlled, 1-based). Bấm số / prev-next để đổi trang — parent giữ state. */
const Demo = ({ total, start }: { total: number; start: number }) => {
    const [page, setPage] = useState(start)
    return <Pagination currentPage={page} totalPages={total} onPageChange={setPage} />
}

/** Nhiều trang: ellipsis gọn giữa, bấm được. */
export const Default: Story = {
    parameters: { usage: "Controlled 1-based: bấm số / prev-next để đổi trang, parent giữ state. Nhiều trang → ellipsis giữa." },
    render: () => <Demo total={10} start={4} />,
}

/** Ít trang: hiện đủ, không ellipsis. */
export const Few: Story = {
    parameters: { usage: "Ít trang: hiện đủ, không ellipsis." },
    render: () => <Demo total={3} start={1} />,
}
