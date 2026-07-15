import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import type { Key } from "react"
import { GearIcon, GlobeIcon, PlusIcon } from "@phosphor-icons/react"
import { Button, Card, CardContent, Label, Typography } from "@heroui/react"
import { TabsCard } from "./index"

const meta: Meta<typeof TabsCard> = {
    title: "Core/Card/TabsCard",
    component: TabsCard,
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

const PANEL_CONTENT: Record<string, { title: string; body: string }> = {
    overview: { title: "Tổng quan", body: "Giới thiệu khoá học, mục tiêu đầu ra và lộ trình học theo tuần." },
    content: { title: "Nội dung", body: "Danh sách bài học và bài tập theo từng module, kèm thời lượng." },
    reviews: { title: "Đánh giá", body: "Nhận xét và điểm số từ các học viên đã hoàn thành khoá." },
    start: { title: "Bắt đầu", body: "Cấu hình ban đầu và các bước khởi động khu vực này." },
    history: { title: "Lịch sử", body: "Toàn bộ hoạt động đã diễn ra, sắp theo thời gian gần nhất." },
    stats: { title: "Thống kê", body: "Các số liệu tổng hợp của khu vực — hiện đang khoá." },
}

/** Panel card đổi theo tab đang chọn — TabsCard bấm tab thì render lại cả khối card bên dưới.
 * Card top-level: HeroUI `Card` bake sẵn shadow-surface + no-border + p-4 (đừng tự chế div border). */
const TabPanel = ({ selectedKey }: { selectedKey: string }) => {
    const panel = PANEL_CONTENT[selectedKey]
    return (
        <Card>
            <CardContent>
                <div className="flex flex-col gap-2">
                    <Typography type="h4" weight="semibold">{panel?.title}</Typography>
                    <Typography type="body-sm" color="muted">{panel?.body}</Typography>
                </div>
            </CardContent>
        </Card>
    )
}

/**
 * TabCard — MỘT nhóm tab trong một hàng toolbar: bấm tab đổi CẢ PANEL bên dưới, hoặc
 * văng sang route khác (điều hướng → dải underline). Chỉ đổi 1 setting tại chỗ mà nội
 * dung lớn bên dưới giữ nguyên (VND⇆USD, Lưới⇆Danh sách) → dùng chính TabsCard này ở `variant="primary" size="sm"` (pill nhỏ tại chỗ).
 * Số lượng tab KHÔNG quyết định: 2 tab vẫn là TabsCard nếu nó đổi panel.
 */
export const TabCard: Story = {
    parameters: {
        usage:
            "TabCard (1 nhóm) — bấm tab làm ĐỔI CẢ PANEL bên dưới hoặc văng sang route khác (điều hướng, dải underline). " +
            "Chỉ đổi 1 setting gọn tại chỗ mà nội dung lớn bên dưới giữ nguyên (VND⇆USD, Lưới⇆Danh sách) → dùng chính TabsCard này ở `variant=\"primary\" size=\"sm\"` (pill nhỏ tại chỗ). " +
            "Số lượng lựa chọn KHÔNG quyết định: 2 tab vẫn là TabsCard nếu nó đổi panel — THỨ nó điều khiển mới quyết định.",
    },
    render: () => {
        const [selectedKey, setSelectedKey] = useState("overview")
        return (
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Một nhóm tab (đổi cả panel)</Label>
                    <Typography type="body-sm" color="muted">
                        Bấm tab đổi cả panel bên dưới hoặc văng route khác — điều hướng, dải underline.
                    </Typography>
                </div>
                <div className="flex w-[36rem] flex-col gap-4">
                    <TabsCard
                        leftTabs={{
                            items: CONTENT_TABS,
                            selectedKey,
                            ariaLabel: "Mục khóa học",
                            onSelectionChange: (key: Key) => setSelectedKey(String(key)),
                        }}
                    />
                    <TabPanel selectedKey={selectedKey} />
                </div>
            </div>
        )
    },
}

/**
 * DoubleTabsCard — HAI nhóm tab chung một hàng: `leftTabs` (trục nội dung chính, accent)
 * pinned trái + `rightTabs` (bộ chuyển phụ, vd ngôn ngữ) pinned phải. `rightTabsNeutral`
 * để nhóm phải trung tính (1 accent duy nhất trên hàng). `collapseRightOnMobile` = nhóm
 * phải thu thành dropdown Select dưới `sm`, bung lại thành tab từ `sm` up (bản MOBILE).
 */
export const DoubleTabsCard: Story = {
    parameters: {
        usage:
            "DoubleTabsCard (2 nhóm) — `leftTabs` (trục nội dung chính, accent) + `rightTabs` (bộ chuyển phụ như ngôn ngữ). " +
            "`rightTabsNeutral` giữ nhóm phải trung tính để hàng chỉ có 1 tín hiệu accent. `collapseRightOnMobile` = nhóm phải " +
            "thu thành dropdown dưới `sm` (bản mobile) rồi bung lại thành tab từ `sm` up — thử resize màn hình để thấy. " +
            "Dùng khi nhóm phải là preference set-once (ngôn ngữ) dễ chật cột đọc hẹp.",
    },
    render: () => {
        const [selectedKey, setSelectedKey] = useState("overview")
        const [lang, setLang] = useState("vi")
        return (
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Hai nhóm tab + bản mobile</Label>
                    <Typography type="body-sm" color="muted">
                        Trục nội dung trái (accent) + switcher phụ phải (trung tính); màn hình hẹp thu switcher thành dropdown.
                    </Typography>
                </div>
                <div className="flex w-[36rem] max-w-full flex-col gap-4">
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
                    <TabPanel selectedKey={selectedKey} />
                </div>
            </div>
        )
    },
}

/** Dùng khi cần gắn một hành động liên quan (thêm mới, quản lý) ngay sát nhóm tab trái mà không lồng nó vào trong chính tab. */
export const WithLeftEndAction: Story = {
    parameters: { usage: "Dùng khi cần gắn một hành động liên quan (thêm mới, quản lý) ngay sát nhóm tab trái, không lồng vào trong chính tab (`leftEnd` là sibling của tab list, không phải Tabs.Tab)." },
    render: () => {
        const [selectedKey, setSelectedKey] = useState("overview")
        return (
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Có hành động cạnh tab</Label>
                    <Typography type="body-sm" color="muted">
                        Gắn hành động liên quan (thêm mới, quản lý) ngay sát nhóm tab trái, không lồng vào trong chính tab.
                    </Typography>
                </div>
                <div className="flex w-[36rem] flex-col gap-4">
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
                    <TabPanel selectedKey={selectedKey} />
                </div>
            </div>
        )
    },
}

/** Dùng cho tab chuyển đổi khu vực cấp trang (không phải bộ lọc nội dung) — dải segmented đầy chiều rộng, có thể chứa tab bị khóa/disable. */
export const PrimaryVariant: Story = {
    parameters: { usage: "Dùng cho tab chuyển đổi khu vực cấp trang (`variant=\"primary\"`, không phải bộ lọc nội dung) — dải segmented đầy chiều rộng, có thể chứa tab bị khóa/disable." },
    render: () => {
        const [selectedKey, setSelectedKey] = useState("start")
        return (
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Biến thể primary</Label>
                    <Typography type="body-sm" color="muted">
                        Tab chuyển đổi khu vực cấp trang (không phải bộ lọc nội dung) — segmented đầy chiều rộng, có thể chứa tab bị khoá.
                    </Typography>
                </div>
                <div className="flex w-[36rem] flex-col gap-4">
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
                    <TabPanel selectedKey={selectedKey} />
                </div>
            </div>
        )
    },
}
