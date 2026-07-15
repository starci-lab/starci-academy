import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import type { Key } from "react"
import { GearIcon, GlobeIcon, PlusIcon } from "@phosphor-icons/react"
import { Button } from "@heroui/react"
import { TabsCard } from "./index"

const meta: Meta<typeof TabsCard> = {
    title: "Blocks/Navigation/TabsCard",
    component: TabsCard,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof TabsCard>

const CONTENT_TABS = [
    { key: "overview", label: "Tổng quan" },
    { key: "content", label: "Nội dung" },
    { key: "reviews", label: "Đánh giá" },
]

const LANGUAGE_TABS = [
    { key: "vi", label: "Tiếng Việt", icon: <GlobeIcon size={16} /> },
    { key: "en", label: "English", icon: <GlobeIcon size={16} /> },
]

/** Dùng khi một trang chỉ cần một dải tab nội dung đơn giản, không có nhóm phụ bên phải. */
export const Default: Story = {
    parameters: { usage: "Dùng khi một trang chỉ cần một dải tab nội dung đơn giản, không có nhóm phụ bên phải." },
    render: () => {
        const [selectedKey, setSelectedKey] = useState("overview")
        return (
            <div className="w-[36rem]">
                <TabsCard
                    leftTabs={{
                        items: CONTENT_TABS,
                        selectedKey,
                        ariaLabel: "Mục khóa học",
                        onSelectionChange: (key: Key) => setSelectedKey(String(key)),
                    }}
                />
            </div>
        )
    },
}

/** Dùng khi cần thêm một bộ chuyển đổi phụ (ví dụ ngôn ngữ) tách biệt khỏi trục tab nội dung chính, với sắc thái trung tính để không cạnh tranh điểm nhấn accent, và thu gọn thành dropdown trên màn hình hẹp. */
export const WithLanguageSwitcher: Story = {
    parameters: { usage: "Dùng khi cần thêm một bộ chuyển đổi phụ (ví dụ ngôn ngữ) tách biệt khỏi trục tab nội dung chính, với sắc thái trung tính để không cạnh tranh điểm nhấn accent, và thu gọn thành dropdown trên màn hình hẹp." },
    render: () => {
        const [selectedKey, setSelectedKey] = useState("overview")
        const [lang, setLang] = useState("vi")
        return (
            <div className="w-[36rem]">
                <TabsCard
                    leftTabs={{
                        items: CONTENT_TABS,
                        selectedKey,
                        ariaLabel: "Mục khóa học",
                        onSelectionChange: (key: Key) => setSelectedKey(String(key)),
                    }}
                    rightTabs={{
                        items: LANGUAGE_TABS,
                        selectedKey: lang,
                        ariaLabel: "Ngôn ngữ",
                        onSelectionChange: (key: Key) => setLang(String(key)),
                    }}
                    rightTabsNeutral
                    collapseRightOnMobile
                />
            </div>
        )
    },
}

/** Dùng khi cần gắn một hành động liên quan (thêm mới, quản lý) ngay sát nhóm tab trái mà không lồng nó vào trong chính tab. */
export const WithLeftEndAction: Story = {
    parameters: { usage: "Dùng khi cần gắn một hành động liên quan (thêm mới, quản lý) ngay sát nhóm tab trái mà không lồng nó vào trong chính tab." },
    render: () => {
        const [selectedKey, setSelectedKey] = useState("overview")
        return (
            <div className="w-[36rem]">
                <TabsCard
                    leftTabs={{
                        items: CONTENT_TABS,
                        selectedKey,
                        ariaLabel: "Mục khóa học",
                        onSelectionChange: (key: Key) => setSelectedKey(String(key)),
                    }}
                    leftEnd={(
                        <Button isIconOnly variant="ghost" size="sm" aria-label="Thêm mục mới">
                            <PlusIcon size={16} />
                        </Button>
                    )}
                />
            </div>
        )
    },
}

/** Dùng cho tab chuyển đổi khu vực cấp trang (không phải bộ lọc nội dung) — dải segmented đầy chiều rộng, có thể chứa tab bị khóa/disable. */
export const PrimaryVariant: Story = {
    parameters: { usage: "Dùng cho tab chuyển đổi khu vực cấp trang (không phải bộ lọc nội dung) — dải segmented đầy chiều rộng, có thể chứa tab bị khóa/disable." },
    render: () => {
        const [selectedKey, setSelectedKey] = useState("start")
        return (
            <div className="w-[36rem]">
                <TabsCard
                    variant="primary"
                    leftTabs={{
                        items: [
                            { key: "start", label: "Bắt đầu", icon: <GearIcon size={16} /> },
                            { key: "history", label: "Lịch sử" },
                            { key: "stats", label: "Thống kê", isDisabled: true },
                        ],
                        selectedKey,
                        ariaLabel: "Khu vực",
                        onSelectionChange: (key: Key) => setSelectedKey(String(key)),
                    }}
                />
            </div>
        )
    },
}
