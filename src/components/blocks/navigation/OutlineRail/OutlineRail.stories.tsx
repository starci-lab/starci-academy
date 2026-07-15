import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import { OutlineRail } from "./index"
import type { OutlineRailGroup, OutlineRailProps } from "./index"

const meta: Meta<typeof OutlineRail> = {
    title: "Blocks/Navigation/OutlineRail",
    component: OutlineRail,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof OutlineRail>

const mockGroups: Array<OutlineRailGroup> = [
    {
        id: "module-1",
        title: "Module 1: Nhập môn React",
        progress: { done: 3, total: 5 },
        collapsedCountLabel: "3/5 bài",
        items: [
            {
                id: "lesson-1",
                title: "Giới thiệu JSX",
                isActive: false,
                isRead: true,
                onPress: () => {},
            },
            {
                id: "lesson-2",
                title: "Component và Props",
                isActive: true,
                isRead: false,
                onPress: () => {},
            },
            {
                id: "lesson-3",
                title: "State và Hooks nâng cao dành cho ứng dụng lớn",
                isActive: false,
                isRead: false,
                isPremium: true,
                meta: "12 phút",
                onPress: () => {},
            },
        ],
    },
    {
        id: "module-2",
        title: "Module 2: Quản lý dữ liệu",
        progress: { done: 0, total: 4 },
        collapsedCountLabel: "0/4 bài",
        items: [
            {
                id: "lesson-4",
                title: "Fetch dữ liệu với SWR",
                isActive: false,
                isRead: false,
                isLocked: true,
                onPress: () => {},
            },
        ],
    },
]

/** Wrapper nội bộ giữ state cho search và bộ khoá mở-rộng của accordion vì OutlineRail là component controlled. */
const Controlled = (props: Omit<OutlineRailProps, "search" | "expandedKeys" | "onExpandedChange"> & { initialQuery?: string; initialExpanded?: Array<string> }) => {
    const { initialQuery, initialExpanded, ...rest } = props
    const [query, setQuery] = useState(initialQuery ?? "")
    const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set(initialExpanded ?? ["module-1"]))
    return (
        <div className="h-[560px] w-[360px] rounded-xl border border-default-200">
            <OutlineRail
                {...rest}
                search={{
                    value: query,
                    onChange: setQuery,
                    placeholder: "Tìm bài học...",
                    ariaLabel: "Tìm kiếm nội dung",
                }}
                expandedKeys={expandedKeys}
                onExpandedChange={setExpandedKeys}
            />
        </div>
    )
}

/** Dùng khi hiển thị thanh điều hướng khoá học với tiến độ tổng, ô tìm kiếm và các module đã có dữ liệu. */
export const Default: Story = {
    parameters: { usage: "Dùng khi hiển thị thanh điều hướng khoá học với tiến độ tổng, ô tìm kiếm và các module đã có dữ liệu." },
    render: () => (
        <Controlled
            header={{
                label: "Tiến độ",
                progress: { done: 3, total: 9 },
                countLabel: "3/9 bài",
                continue: { label: "Tiếp tục học", onPress: () => {} },
            }}
            groups={mockGroups}
            async={{
                isLoading: false,
                skeleton: null,
                isEmpty: false,
                emptyTitle: "Chưa có nội dung",
                errorTitle: "Không tải được nội dung",
                onRetry: () => {},
                retryLabel: "Thử lại",
                noMatchLabel: "Không tìm thấy bài học phù hợp",
            }}
        />
    ),
}

/** Dùng khi dữ liệu các module đang được tải lần đầu, trước khi có tiến độ để hiển thị header. */
export const DangTai: Story = {
    parameters: { usage: "Dùng khi dữ liệu các module đang được tải lần đầu, trước khi có tiến độ để hiển thị header." },
    render: () => (
        <Controlled
            groups={[]}
            async={{
                isLoading: true,
                skeleton: (
                    <div className="flex flex-col gap-3">
                        <div className="h-14 w-full animate-pulse rounded-lg bg-default-100" />
                        <div className="h-14 w-full animate-pulse rounded-lg bg-default-100" />
                        <div className="h-14 w-full animate-pulse rounded-lg bg-default-100" />
                    </div>
                ),
                isEmpty: false,
                emptyTitle: "Chưa có nội dung",
                errorTitle: "Không tải được nội dung",
                onRetry: () => {},
                retryLabel: "Thử lại",
                noMatchLabel: "Không tìm thấy bài học phù hợp",
            }}
        />
    ),
}

/** Dùng khi khoá học chưa có module/bài học nào được xuất bản. */
export const Trong: Story = {
    parameters: { usage: "Dùng khi khoá học chưa có module/bài học nào được xuất bản." },
    render: () => (
        <Controlled
            groups={[]}
            async={{
                isLoading: false,
                skeleton: null,
                isEmpty: true,
                emptyTitle: "Chưa có nội dung nào cho khoá học này",
                errorTitle: "Không tải được nội dung",
                onRetry: () => {},
                retryLabel: "Thử lại",
                noMatchLabel: "Không tìm thấy bài học phù hợp",
            }}
        />
    ),
}

/** Dùng khi từ khoá tìm kiếm không khớp với bài học nào trong các module hiện có. */
export const KhongTimThay: Story = {
    parameters: { usage: "Dùng khi từ khoá tìm kiếm không khớp với bài học nào trong các module hiện có." },
    render: () => (
        <Controlled
            initialQuery="đồ hoạ 3d nâng cao"
            groups={[]}
            async={{
                isLoading: false,
                skeleton: null,
                isEmpty: false,
                emptyTitle: "Chưa có nội dung",
                errorTitle: "Không tải được nội dung",
                onRetry: () => {},
                retryLabel: "Thử lại",
                noMatchLabel: "Không tìm thấy bài học phù hợp với từ khoá",
            }}
        />
    ),
}

/** Dùng khi việc tải dữ liệu module thất bại và cần cho phép người dùng thử lại. */
export const Loi: Story = {
    parameters: { usage: "Dùng khi việc tải dữ liệu module thất bại và cần cho phép người dùng thử lại." },
    render: () => (
        <Controlled
            groups={[]}
            async={{
                isLoading: false,
                skeleton: null,
                isEmpty: false,
                emptyTitle: "Chưa có nội dung",
                errorTitle: "Không tải được danh sách bài học",
                error: new Error("Network request failed"),
                onRetry: () => {},
                retryLabel: "Thử lại",
                noMatchLabel: "Không tìm thấy bài học phù hợp",
            }}
        />
    ),
}
