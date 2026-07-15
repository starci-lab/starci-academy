import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import { Tabs } from "@heroui/react"
import { HouseIcon, CompassIcon, GraduationCapIcon } from "@phosphor-icons/react"
import { ExtendedTabs } from "./index"
import type { ExtendedTabsProps } from "./index"

const meta: Meta<typeof ExtendedTabs> = {
    title: "Blocks/Navigation/ExtendedTabs",
    component: ExtendedTabs,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof ExtendedTabs>

/** Wrapper that owns the selected-tab state since `ExtendedTabs` is fully controlled. */
const Controlled = (props: Omit<ExtendedTabsProps, "selectedKey" | "onSelectionChange"> & {
    defaultKey: string
}) => {
    const { defaultKey, ...rest } = props
    const [selectedKey, setSelectedKey] = useState(defaultKey)
    return (
        <ExtendedTabs {...rest} selectedKey={selectedKey} onSelectionChange={setSelectedKey}>
            {rest.children}
        </ExtendedTabs>
    )
}

/** Dùng tab dạng "secondary" (mặc định) khi cần bộ lọc nội dung nhỏ nằm cạnh một cột đọc, ví dụ chuyển ngôn ngữ hoặc lọc bài viết. */
export const Default: Story = {
    parameters: { usage: "Dùng tab dạng \"secondary\" (mặc định) khi cần bộ lọc nội dung nhỏ nằm cạnh một cột đọc, ví dụ chuyển ngôn ngữ hoặc lọc bài viết." },
    render: () => (
        <Controlled defaultKey="overview">
            <Tabs.ListContainer>
                <Tabs.List aria-label="Bộ lọc nội dung">
                    <Tabs.Tab id="overview" aria-controls="panel-overview">
                        Tổng quan
                        <Tabs.Indicator />
                    </Tabs.Tab>
                    <Tabs.Tab id="reviews" aria-controls="panel-reviews">
                        Đánh giá
                        <Tabs.Indicator />
                    </Tabs.Tab>
                    <Tabs.Tab id="qna" aria-controls="panel-qna">
                        Hỏi đáp
                        <Tabs.Indicator />
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs.ListContainer>
        </Controlled>
    ),
}

/** Chuyển sang "primary" khi tab điều khiển toàn bộ nội dung trang, ví dụ chuyển giữa các mục lớn của dashboard. */
export const Primary: Story = {
    parameters: { usage: "Chuyển sang \"primary\" khi tab điều khiển toàn bộ nội dung trang, ví dụ chuyển giữa các mục lớn của dashboard." },
    render: () => (
        <Controlled defaultKey="overview" variant="primary">
            <Tabs.ListContainer>
                <Tabs.List aria-label="Điều hướng dashboard">
                    <Tabs.Tab id="overview" aria-controls="panel-overview">
                        <span className="flex items-center gap-2">
                            <HouseIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                            <span>Tổng quan</span>
                        </span>
                        <Tabs.Indicator />
                    </Tabs.Tab>
                    <Tabs.Tab id="explore" aria-controls="panel-explore">
                        <span className="flex items-center gap-2">
                            <CompassIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                            <span>Khám phá</span>
                        </span>
                        <Tabs.Indicator />
                    </Tabs.Tab>
                    <Tabs.Tab id="courses" aria-controls="panel-courses">
                        <span className="flex items-center gap-2">
                            <GraduationCapIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                            <span>Khóa học</span>
                        </span>
                        <Tabs.Indicator />
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs.ListContainer>
        </Controlled>
    ),
}

/** Dùng size "sm" với tab "primary" khi tab nằm gọn trong một khu vực hẹp như panel cài đặt trong modal, không nên chiếm hết chiều rộng. */
export const PrimarySmall: Story = {
    parameters: { usage: "Dùng size \"sm\" với tab \"primary\" khi tab nằm gọn trong một khu vực hẹp như panel cài đặt trong modal, không nên chiếm hết chiều rộng." },
    render: () => (
        <Controlled defaultKey="monthly" variant="primary" size="sm">
            <Tabs.ListContainer>
                <Tabs.List aria-label="Chu kỳ thanh toán">
                    <Tabs.Tab id="monthly" aria-controls="panel-monthly">
                        Hàng tháng
                        <Tabs.Indicator />
                    </Tabs.Tab>
                    <Tabs.Tab id="yearly" aria-controls="panel-yearly">
                        Hàng năm
                        <Tabs.Indicator />
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs.ListContainer>
        </Controlled>
    ),
}

/** Kết hợp icon và nhãn văn bản trên từng tab khi cần thêm gợi ý trực quan bên cạnh chữ, đặc biệt hữu ích ở màn hình hẹp nơi nhãn có thể bị ẩn. */
export const WithIcons: Story = {
    parameters: { usage: "Kết hợp icon và nhãn văn bản trên từng tab khi cần thêm gợi ý trực quan bên cạnh chữ, đặc biệt hữu ích ở màn hình hẹp nơi nhãn có thể bị ẩn." },
    render: () => (
        <Controlled defaultKey="courses" variant="secondary">
            <Tabs.ListContainer>
                <Tabs.List aria-label="Danh mục học tập">
                    <Tabs.Tab id="courses" aria-controls="panel-courses">
                        <span className="flex items-center gap-2">
                            <GraduationCapIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                            <span className="hidden md:inline">Khóa học</span>
                        </span>
                        <Tabs.Indicator />
                    </Tabs.Tab>
                    <Tabs.Tab id="explore" aria-controls="panel-explore">
                        <span className="flex items-center gap-2">
                            <CompassIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                            <span className="hidden md:inline">Khám phá</span>
                        </span>
                        <Tabs.Indicator />
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs.ListContainer>
        </Controlled>
    ),
}
