import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Pagination } from "./Pagination"

const meta: Meta<typeof Pagination> = {
    title: "Primitives/Navigation/Pagination",
    component: Pagination,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Pagination>

/** Controlled (1-based): the parent holds page state; click a number / prev-next to change it. */
const Demo = ({ total, start }: { total: number; start: number }) => {
    const [page, setPage] = useState(start)
    return <Pagination currentPage={page} totalPages={total} onPageChange={setPage} />
}

/** Many pages — every page number rendered, prev/next bracket them. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <Demo total={10} start={4} />
        </div>
    ),
}

/** Few pages: all shown, no overflow. */
export const Few: Story = {
    render: () => (
        <div className="p-8">
            <Demo total={3} start={1} />
        </div>
    ),
}
