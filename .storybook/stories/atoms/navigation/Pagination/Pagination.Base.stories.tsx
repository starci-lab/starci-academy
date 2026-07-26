import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Pagination } from "@sb-components/atoms/navigation/Pagination/Pagination"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Pagination.Base` bọc thẳng HeroUI `Pagination` (`Previous`/`Link`/
 * `Ellipsis`/`Next` đều là sub-part của compound HeroUI, không phải atom nào
 * của hệ có story riêng) ⇒ KHÔNG có deps, nên KHÔNG truyền `annotate` (thầy
 * chốt 2026-07-26 lần 2: "atom lá bọc thẳng HeroUI thì bỏ hẳn prop").
 */

const meta: Meta<typeof Pagination.Base> = {
    title: "Atoms/Navigation/Pagination/Pagination.Base",
    component: Pagination.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Pagination.Base>

/** Default — ít trang → hiện đủ mọi trang, không '…'. */
export const Default: Story = {
    render: () => {
        const [page, setPage] = useState(2)
        return (
            <div className="p-8">
                <BlockAnatomy
                    name="Pagination.Base"
                    tier="atom"
                    leaf="Default"
                    reason="The one page-nav atom wrapping HeroUI Pagination — windowing and the '…' ellipsis are a leaf (prop-driven) for large page counts, not a separate component."
                    code={"<Pagination.Base currentPage={page} totalPages={5} onPageChange={setPage} />"}
                >
                    <Pagination.Base currentPage={page} totalPages={5} onPageChange={setPage} showAnatomy />
                </BlockAnatomy>
            </div>
        )
    },
}

/** ManyPages — nhiều trang → gộp phần xa thành '…' (đầu · … · current±1 · … · cuối). */
export const ManyPages: Story = {
    render: () => {
        const [page, setPage] = useState(12)
        return (
            <div className="p-8">
                <BlockAnatomy
                    name="Pagination.Base"
                    tier="atom"
                    leaf="ManyPages"
                    note="totalPages=24, current=12 → 1 · … · 11 12 13 · … · 24. siblings=1 (default)."
                    code={"<Pagination.Base currentPage={12} totalPages={24} onPageChange={setPage} />"}
                >
                    <Pagination.Base currentPage={page} totalPages={24} onPageChange={setPage} showAnatomy />
                </BlockAnatomy>
            </div>
        )
    },
}

/** Loading — atom tự vẽ leaf skeleton (hàng ô vuông); không dùng Skeleton.*. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Pagination.Base"
                tier="atom"
                leaf="Loading"
                note="isSkeleton renders a row of shimmer squares OWNED by the atom (hybrid C) while the total page count is still unknown."
                code={"<Pagination.Base isSkeleton currentPage={1} totalPages={5} onPageChange={fn} />"}
            >
                <Pagination.Base isSkeleton currentPage={1} totalPages={5} onPageChange={() => {}} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}
