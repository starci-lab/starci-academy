import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import type { Key } from "react"

import { TabsCard } from "./index"

const meta: Meta<typeof TabsCard> = {
    title: "Blocks/TabsCard",
    component: TabsCard,
}

export default meta

type Story = StoryObj<typeof TabsCard>

const CONTENT_TABS = [
    { key: "overview", label: "Tổng quan" },
    { key: "content", label: "Nội dung" },
    { key: "reviews", label: "Đánh giá" },
]

/** `secondary` (mặc định) — tab NỘI DUNG trong trang: gạch chân, ôm width label, không nền full. Cho filter/switch nội dung. */
export const Secondary: Story = {
    parameters: { usage: "secondary (mặc định): tab nội dung gạch chân, ôm label — cho filter/switch trong trang." },
    render: () => {
        const [k, setK] = useState("overview")
        return (
            <div className="max-w-2xl">
                <TabsCard
                    variant="secondary"
                    leftTabs={{
                        items: CONTENT_TABS,
                        selectedKey: k,
                        ariaLabel: "Mục khóa học",
                        onSelectionChange: (key: Key) => setK(String(key)),
                    }}
                />
            </div>
        )
    },
}

/** `primary` — tab FEATURE đổi CẢ panel: pill segmented full-width, đều nhau. Cho chuyển section cấp cao (Bắt đầu/Lịch sử/Thống kê). */
export const Primary: Story = {
    parameters: { usage: "primary: tab feature đổi cả panel — pill segmented full-width. Cho chuyển section cấp cao." },
    render: () => {
        const [k, setK] = useState("start")
        return (
            <div className="max-w-2xl">
                <TabsCard
                    variant="primary"
                    leftTabs={{
                        items: [
                            { key: "start", label: "Bắt đầu" },
                            { key: "history", label: "Lịch sử" },
                            { key: "stats", label: "Thống kê" },
                        ],
                        selectedKey: k,
                        ariaLabel: "Khu vực",
                        onSelectionChange: (key: Key) => setK(String(key)),
                    }}
                />
            </div>
        )
    },
}

/** 2 nhóm: `leftTabs` (nội dung, accent) + `rightTabs` (đổi ngôn ngữ, `rightTabsNeutral` = gạch chân foreground) — toolbar chỉ MỘT tín hiệu accent. `collapseRightOnMobile` gộp nhóm phải thành dropdown dưới `sm`. */
export const WithLanguageSwitcher: Story = {
    parameters: { usage: "2 nhóm: leftTabs (nội dung, accent) + rightTabs (ngôn ngữ, neutral) — 1 tín hiệu accent. collapseRightOnMobile → dropdown dưới sm." },
    render: () => {
        const [k, setK] = useState("overview")
        const [lang, setLang] = useState("vi")
        return (
            <div className="max-w-2xl">
                <TabsCard
                    variant="secondary"
                    leftTabs={{
                        items: CONTENT_TABS,
                        selectedKey: k,
                        ariaLabel: "Mục khóa học",
                        onSelectionChange: (key: Key) => setK(String(key)),
                    }}
                    rightTabsNeutral
                    collapseRightOnMobile
                    rightTabs={{
                        items: [
                            { key: "vi", label: "Tiếng Việt" },
                            { key: "en", label: "English" },
                        ],
                        selectedKey: lang,
                        ariaLabel: "Ngôn ngữ",
                        onSelectionChange: (key: Key) => setLang(String(key)),
                    }}
                />
            </div>
        )
    },
}
