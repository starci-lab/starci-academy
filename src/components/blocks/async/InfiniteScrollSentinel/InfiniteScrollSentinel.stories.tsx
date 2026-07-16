import type { Meta, StoryObj } from "@storybook/nextjs"
import { InfiniteScrollSentinel } from "./index"

const meta: Meta<typeof InfiniteScrollSentinel> = {
    title: "Core/Async/InfiniteScrollSentinel",
    component: InfiniteScrollSentinel,
}
export default meta
type Story = StoryObj<typeof InfiniteScrollSentinel>

/**
 * Chỉ dùng khi list nằm trong container scroll RIÊNG (modal · panel · rail) và dưới nó không còn gì —
 * người dùng chỉ lướt, không đi tìm "trang 3". Nếu list nằm ở CỘT CHÍNH của trang mà dưới còn footer →
 * dùng NÚT "Tải thêm" (auto-scroll sẽ cướp scroll, người dùng không bao giờ chạm tới footer). Nếu list
 * HỮU HẠN và cần tìm/quay lại 1 item → dùng pager (compose AsyncContent + control phân trang).
 * Đang nạp thêm: render SKELETON MIRROR 1-2 item ngay chỗ sentinel (gate bằng isLoadingMore) — không
 * dùng chữ "Đang tải...", không để im lặng. Hết trang thì không hiện gì cả.
 */
export const Default: Story = {
    parameters: {
        usage:
            "Chỉ dùng khi list nằm trong container scroll RIÊNG (modal · panel · rail) và dưới nó không còn gì — " +
            "người dùng chỉ lướt, không đi tìm \"trang 3\". Nếu list nằm ở CỘT CHÍNH của trang mà dưới còn footer → " +
            "dùng NÚT \"Tải thêm\" (auto-scroll sẽ cướp scroll, người dùng không bao giờ chạm tới footer). Nếu list " +
            "HỮU HẠN và cần tìm/quay lại 1 item → dùng pager (compose AsyncContent + control phân trang). " +
            "Đang nạp thêm: render SKELETON MIRROR 1-2 item ngay chỗ sentinel (gate bằng isLoadingMore) — không dùng " +
            "chữ \"Đang tải...\", không để im lặng. Hết trang thì không hiện gì cả.",
    },
    render: () => (
        <div className="w-64 border border-dashed border-default-300 p-3">
            <p className="mb-2 text-sm text-default-500">Danh sách khóa học...</p>
            <InfiniteScrollSentinel onReach={() => {}} />
        </div>
    ),
}
