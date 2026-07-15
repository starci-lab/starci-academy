import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import { Label, Tabs, Typography } from "@heroui/react"
import { HouseIcon, CompassIcon, GraduationCapIcon } from "@phosphor-icons/react"
import { ExtendedTabs } from "./index"
import type { ExtendedTabsProps } from "./index"

/**
 * `ExtendedTabs` — dải tab chuẩn StarCi, 3 LOẠI theo `variant` × `size`:
 * 1. Tabs-as-input (`primary` `sm`) — segmented nhỏ như một control/toggle, w-fit.
 * 2. Primary lớn (`primary` `md`) — full-width, đổi CẢ nội dung trang.
 * 3. Secondary (`secondary`) — underline hug-content, bộ lọc nội dung; nằm DƯỚI
 *    tabs primary khi hệ thống có 2 tầng tab.
 */
const meta: Meta<typeof ExtendedTabs> = {
    title: "Core/Navigation/ExtendedTabs",
    component: ExtendedTabs,
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

/**
 * LOẠI 1 — Tabs as input: dải segmented nhỏ (`variant="primary" size="sm"`) dùng như
 * một control/toggle gọn (chu kỳ thanh toán, chế độ xem) trong khu vực hẹp. Mặc định
 * w-fit (co theo nhãn); ép w-full thì các segment giãn đều và nhãn dài bị truncate.
 */
export const TabsAsInput: Story = {
    parameters: {
        usage: "Loại 1 — tabs dạng INPUT: dải segmented nhỏ (`variant=\"primary\" size=\"sm\"`) dùng như một control/toggle gọn trong khu vực hẹp (chu kỳ thanh toán, chế độ xem). Mặc định w-fit (co theo nhãn, không chiếm hết hàng). Đặt trong container cố định hẹp thì các segment chia đều bề rộng và nhãn dài truncate thay vì tràn. Chỉ đổi 1 setting tại chỗ (nội dung lớn bên dưới giữ nguyên) thì dùng chính bản `primary size=\"sm\"` này (pill toggle).",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>w-fit — co theo nội dung</Label>
                    <Typography type="body-sm" color="muted">
                        Mặc định: dải co gọn theo nhãn, dùng như toggle trong panel/modal.
                    </Typography>
                </div>
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
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>w-full — giãn đều, nhãn dài truncate</Label>
                    <Typography type="body-sm" color="muted">
                        Trong container cố định hẹp: các segment chia đều bề rộng, nhãn dài hơn ô thì cắt gọn.
                    </Typography>
                </div>
                <div className="w-64">
                    <Controlled defaultKey="grid" variant="primary" size="md">
                        <Tabs.ListContainer>
                            <Tabs.List aria-label="Chế độ xem">
                                <Tabs.Tab id="grid" aria-controls="panel-grid" aria-label="Dạng lưới chi tiết" className="min-w-0">
                                    <span className="block truncate">Dạng lưới chi tiết</span>
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                                <Tabs.Tab id="list" aria-controls="panel-list" aria-label="Dạng danh sách rút gọn" className="min-w-0">
                                    <span className="block truncate">Dạng danh sách rút gọn</span>
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                            </Tabs.List>
                        </Tabs.ListContainer>
                    </Controlled>
                </div>
            </div>
        </div>
    ),
}

/**
 * LOẠI 2 — Primary lớn: `variant="primary" size="md"` full-width, evenly-stretched.
 * Tab đổi CẢ nội dung trang (top-level section switch), ví dụ các mục lớn của dashboard.
 */
export const PagePrimary: Story = {
    parameters: {
        usage: "Loại 2 — tabs LỚN (`variant=\"primary\" size=\"md\"`): dải segmented full-width, đổi TOÀN BỘ nội dung trang. Dùng cho chuyển mục cấp trang (Tổng quan/Khám phá/Khóa học của dashboard). Kèm icon để tăng gợi ý trực quan.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Điều khiển cả trang</Label>
                <Typography type="body-sm" color="muted">
                    Tab đổi toàn bộ nội dung trang — chuyển giữa các mục lớn của dashboard.
                </Typography>
            </div>
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
        </div>
    ),
}

/**
 * LOẠI 3 — Secondary: `variant="secondary"` underline, hug-content. Bộ lọc nội dung
 * cạnh một cột đọc (chuyển ngôn ngữ, lọc bài) — thường nằm DƯỚI dải primary khi trang
 * có 2 tầng tab (primary đổi trang, secondary lọc trong trang). Kèm icon tuỳ chọn.
 */
export const SecondaryFilter: Story = {
    parameters: {
        usage: "Loại 3 — tabs SECONDARY (`variant=\"secondary\"`, mặc định): underline hug-content, là bộ lọc nội dung trong trang (chuyển ngôn ngữ, lọc bài viết). Trong hệ thống 2 tầng tab, secondary nằm DƯỚI dải primary — primary đổi trang, secondary lọc trong panel. Có thể kèm icon; ở màn hình hẹp icon-only, nhãn hiện lại từ md up.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Bộ lọc nội dung</Label>
                    <Typography type="body-sm" color="muted">
                        Underline hug-content, cạnh cột đọc — chuyển ngôn ngữ, lọc bài viết. Nằm dưới tabs primary khi 2 tầng.
                    </Typography>
                </div>
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
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Kèm icon</Label>
                    <Typography type="body-sm" color="muted">
                        Icon + nhãn khi cần gợi ý trực quan; màn hình hẹp icon-only, nhãn hiện lại từ md up.
                    </Typography>
                </div>
                <Controlled defaultKey="courses">
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
            </div>
        </div>
    ),
}
