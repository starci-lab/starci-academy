import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Pagination } from "@sb-components/atoms/navigation/Pagination/Pagination"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Pagination.Base` bọc thẳng HeroUI `Pagination` (`Pagination.Previous`/
 * `Pagination.Link`/`Pagination.Ellipsis`/`Pagination.Next` đều là sub-part của
 * compound HeroUI, không phải atom nào của hệ có story riêng). 2026-07-27: heroui
 * tier thêm vào canon — mỗi sub-part đó vẫn là import THẬT, nên vẫn khai
 * `tier: "heroui"` trong `ANNOTATE` bên dưới, tên khớp Y HỆT identifier import
 * (không cần `storyId`, không có story CỦA TA để nhảy sang).
 *
 * Leaf `Skeleton` đổi tên từ `Loading` (2026-07-27, thầy chốt: leaf mang TÊN
 * PROP — prop sinh ra leaf này là `isSkeleton`). §12g đòi Skeleton render đủ
 * mọi nấc CÓ HÌNH biết trước — nhưng trục "windowing" (Default = mọi trang hiện
 * đủ, ManyPages = gộp '…') phụ thuộc THẲNG vào `totalPages`, chính là con số
 * CHƯA CÓ trong lúc loading (đúng lý do đang skeleton). Không như `size` của
 * `Button.Base` hay `collapseFrom` của `Breadcrumbs.Base` (caller biết trước,
 * độc lập với data), windowing ở đây KHÔNG thể biết trước ⇒ một hình đại diện
 * (dải ô vuông) là đủ, không phải lỗi bỏ sót nấc.
 *
 * MIGRATED TO `states` (2026-07-27): each leaf below still renders exactly one
 * shape, so each carries a single `states[]` entry.
 */

const meta: Meta<typeof Pagination.Base> = {
    title: "Atoms/Navigation/Pagination/Pagination.Base",
    component: Pagination.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Pagination.Base>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Pagination.Previous": { tier: "heroui", role: "steps back one page, disabled on page 1" },
    "Pagination.Link": { tier: "heroui", role: "one concrete page number, filled when it's the active page" },
    "Pagination.Ellipsis": { tier: "heroui", role: "collapses a run of distant pages between the visible ones" },
    "Pagination.Next": { tier: "heroui", role: "steps forward one page, disabled on the last page" },
    "Skeleton": { tier: "heroui", role: "shimmer square standing in for a page link before totalPages is known" },
}

/** Default — ít trang → hiện đủ mọi trang, không '…'. Migrated to `states` 2026-07-27. */
export const Default: Story = {
    render: () => {
        const [page, setPage] = useState(2)
        return (
            <div className="p-8">
                <BlockAnatomy
                    name="Pagination.Base"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Default"
                    reason="The one page-nav atom wrapping HeroUI Pagination — windowing and the '…' ellipsis are a leaf (prop-driven) for large page counts, not a separate component."
                    states={[
                        {
                            name: "totalPages = 5 (under the collapse threshold)",
                            why: "Every page link from 1 to 5 renders in a row, with no `Ellipsis` node anywhere in it. Below the collapse threshold there is nothing worth hiding, so showing every page keeps the whole range one glance away.",
                            code: "<Pagination.Base currentPage={page} totalPages={5} onPageChange={setPage} />",
                            render: <Pagination.Base currentPage={page} totalPages={5} onPageChange={setPage} showAnatomy />,
                        },
                    ]}
                />
            </div>
        )
    },
}

/** ManyPages — nhiều trang → gộp phần xa thành '…' (đầu · … · current±1 · … · cuối). Migrated to `states` 2026-07-27. */
export const ManyPages: Story = {
    render: () => {
        const [page, setPage] = useState(12)
        return (
            <div className="p-8">
                <BlockAnatomy
                    name="Pagination.Base"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="ManyPages"
                    states={[
                        {
                            name: "totalPages = 24, currentPage = 12 (over the collapse threshold)",
                            why: "Two `Ellipsis` nodes appear, collapsing the run between page 1 and page 11, and between page 13 and page 24, into `1 · … · 11 12 13 · … · 24`. Listing all 24 links would make the current page hard to find, so only the first, last, and immediate neighbours of the current page stay visible.",
                            code: "<Pagination.Base currentPage={12} totalPages={24} onPageChange={setPage} />",
                            render: <Pagination.Base currentPage={page} totalPages={24} onPageChange={setPage} showAnatomy />,
                        },
                    ]}
                />
            </div>
        )
    },
}

/** Skeleton — atom tự vẽ leaf skeleton (hàng ô vuông); không dùng Skeleton.*. Migrated to `states` 2026-07-27. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Pagination.Base"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The whole page-link row is replaced by a row of shimmer squares owned by this atom, instead of any real `Previous`/`Link`/`Next` node. Windowing can't be previewed here because `totalPages` is exactly the number that hasn't loaded yet, so a single representative shape is all a caller can show.",
                        code: "<Pagination.Base isSkeleton currentPage={1} totalPages={5} onPageChange={fn} />",
                        render: <Pagination.Base isSkeleton currentPage={1} totalPages={5} onPageChange={() => {}} showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}
