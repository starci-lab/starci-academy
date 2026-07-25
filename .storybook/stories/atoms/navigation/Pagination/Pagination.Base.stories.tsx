import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Pagination } from "@sb-components/atoms/navigation/Pagination/Pagination"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Pagination.Base> = {
    title: "Atoms/Navigation/Pagination/Pagination.Base",
    component: Pagination.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Pagination.Base>

const BASE_PARTS: Array<AnatomyNode> = [
    { name: "Previous", tier: "atom", role: "nút về trang trước (HeroPagination.Previous) — disabled ở trang 1" },
    { name: "PageLink", tier: "atom", role: "một link trang (HeroPagination.Link); active = trang hiện tại" },
    { name: "Next", tier: "atom", role: "nút sang trang sau (HeroPagination.Next) — disabled ở trang cuối" },
]
const MANY_PARTS: Array<AnatomyNode> = [
    { name: "Previous", tier: "atom", role: "nút về trang trước" },
    { name: "PageLink", tier: "atom", role: "một link trang; giữ đầu · cuối · current±siblings" },
    { name: "Ellipsis", tier: "atom", role: "'…' gộp khoảng trang xa (HeroPagination.Ellipsis)" },
    { name: "Next", tier: "atom", role: "nút sang trang sau" },
]
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "atom", role: "leaf skeleton do atom tự sở hữu (hàng ô vuông)" },
]

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
                    parts={BASE_PARTS}
                    reason="Atom page-nav DUY NHẤT bọc HeroUI Pagination; windowing/'…' là leaf (prop) khi nhiều trang, không component riêng."
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
                    parts={MANY_PARTS}
                    note="totalPages=24, current=12 → 1 · … · 11 12 13 · … · 24. siblings=1 (mặc định)."
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
                parts={SKELETON_PARTS}
                note="isSkeleton → hàng ô shimmer OWNED bởi atom (hybrid C) khi tổng trang chưa biết."
                code={"<Pagination.Base isSkeleton currentPage={1} totalPages={5} onPageChange={fn} />"}
            >
                <Pagination.Base isSkeleton currentPage={1} totalPages={5} onPageChange={() => {}} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}
