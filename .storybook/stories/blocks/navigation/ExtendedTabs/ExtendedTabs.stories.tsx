import type { Meta, StoryObj } from "@storybook/nextjs"
import { Tabs } from "@heroui/react"
import { HouseIcon, CompassIcon, GraduationCapIcon } from "@phosphor-icons/react"
import { ExtendedTabs } from "@/components/blocks/navigation/ExtendedTabs"
import { Gallery, Variant } from "../../../../story-kit"
import { Controlled } from "./components"

/**
 * `ExtendedTabs` — the standard StarCi tab strip, 3 TYPES by `variant` × `size`:
 * 1. Tabs-as-input (`primary` `sm`) — a small segmented control/toggle, w-fit.
 * 2. Large primary (`primary` `md`) — full-width, switches the WHOLE page content.
 * 3. Secondary (`secondary`) — hug-content underline, a content filter; sits BELOW
 *    the primary tabs when the system has two tab tiers.
 */
const meta: Meta<typeof ExtendedTabs> = {
    title: "Primitives/Navigation/ExtendedTabs",
    component: ExtendedTabs,
}
export default meta
type Story = StoryObj<typeof ExtendedTabs>

/**
 * Toàn bộ ma trận trạng thái của ExtendedTabs: tabs-as-input (w-fit / w-full
 * truncate), primary lớn điều khiển toàn trang, và secondary lọc nội dung
 * (trần / kèm icon). Dùng để tra khi nào chọn variant/size nào và cách mỗi
 * loại phản ứng khi container hẹp lại.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="w-fit — ôm nội dung"
                hint="Type 1 — tabs làm INPUT: dải segmented nhỏ (variant=&quot;primary&quot; size=&quot;sm&quot;) dùng như control/toggle gọn trong khu vực hẹp (chu kỳ thanh toán, chế độ xem). Mặc định w-fit — ôm nhãn, không chiếm hết dòng; dùng trong panel/modal."
            >
                <Controlled defaultKey="monthly" variant="primary" size="sm">
                    <Tabs.ListContainer>
                        <Tabs.List aria-label="Billing cycle">
                            <Tabs.Tab id="monthly" aria-controls="panel-monthly">
                                Monthly
                                <Tabs.Indicator />
                            </Tabs.Tab>
                            <Tabs.Tab id="yearly" aria-controls="panel-yearly">
                                Yearly
                                <Tabs.Indicator />
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs.ListContainer>
                </Controlled>
            </Variant>
            <Variant
                label="w-full — giãn đều, nhãn dài bị cắt"
                hint="Đặt trong container hẹp cố định: các segment chia đều chiều rộng, nhãn dài hơn ô sẽ bị cắt (truncate) thay vì tràn ra ngoài."
            >
                <div className="w-64">
                    <Controlled defaultKey="grid" variant="primary" size="md">
                        <Tabs.ListContainer>
                            <Tabs.List aria-label="View mode">
                                <Tabs.Tab id="grid" aria-controls="panel-grid" aria-label="Detailed grid view" className="min-w-0">
                                    <span className="block truncate">Detailed grid view</span>
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                                <Tabs.Tab id="list" aria-controls="panel-list" aria-label="Compact list view" className="min-w-0">
                                    <span className="block truncate">Compact list view</span>
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                            </Tabs.List>
                        </Tabs.ListContainer>
                    </Controlled>
                </div>
            </Variant>
            <Variant
                label="Primary lớn — điều khiển toàn trang"
                hint="Type 2 — tabs LỚN (variant=&quot;primary&quot; size=&quot;md&quot;): dải segmented full-width, chuyển đổi TOÀN BỘ nội dung trang (chuyển section cấp trang của dashboard). Kết hợp icon để tăng tín hiệu nhận diện."
            >
                <Controlled defaultKey="overview" variant="primary">
                    <Tabs.ListContainer>
                        <Tabs.List aria-label="Dashboard navigation">
                            <Tabs.Tab id="overview" aria-controls="panel-overview">
                                <span className="flex items-center gap-2">
                                    <HouseIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                    <span>Overview</span>
                                </span>
                                <Tabs.Indicator />
                            </Tabs.Tab>
                            <Tabs.Tab id="explore" aria-controls="panel-explore">
                                <span className="flex items-center gap-2">
                                    <CompassIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                    <span>Explore</span>
                                </span>
                                <Tabs.Indicator />
                            </Tabs.Tab>
                            <Tabs.Tab id="courses" aria-controls="panel-courses">
                                <span className="flex items-center gap-2">
                                    <GraduationCapIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                    <span>Courses</span>
                                </span>
                                <Tabs.Indicator />
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs.ListContainer>
                </Controlled>
            </Variant>
            <Variant
                label="Secondary — bộ lọc nội dung"
                hint="Type 3 — tabs SECONDARY (variant=&quot;secondary&quot;, mặc định): gạch chân ôm nội dung, lọc nội dung trong một trang (chuyển ngôn ngữ, lọc bài viết). Ở hệ 2 tầng tab, secondary nằm DƯỚI dải primary — primary chuyển trang, secondary lọc trong panel."
            >
                <Controlled defaultKey="overview">
                    <Tabs.ListContainer>
                        <Tabs.List aria-label="Content filter">
                            <Tabs.Tab id="overview" aria-controls="panel-overview">
                                Overview
                                <Tabs.Indicator />
                            </Tabs.Tab>
                            <Tabs.Tab id="reviews" aria-controls="panel-reviews">
                                Reviews
                                <Tabs.Indicator />
                            </Tabs.Tab>
                            <Tabs.Tab id="qna" aria-controls="panel-qna">
                                Q&A
                                <Tabs.Indicator />
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs.ListContainer>
                </Controlled>
            </Variant>
            <Variant
                label="Secondary kèm icon"
                hint="Icon + nhãn để tăng tín hiệu nhận diện; ở màn hẹp chỉ hiện icon, nhãn xuất hiện lại từ mốc md trở lên."
            >
                <Controlled defaultKey="courses">
                    <Tabs.ListContainer>
                        <Tabs.List aria-label="Learning categories">
                            <Tabs.Tab id="courses" aria-controls="panel-courses">
                                <span className="flex items-center gap-2">
                                    <GraduationCapIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                    <span className="hidden @app-md:inline">Courses</span>
                                </span>
                                <Tabs.Indicator />
                            </Tabs.Tab>
                            <Tabs.Tab id="explore" aria-controls="panel-explore">
                                <span className="flex items-center gap-2">
                                    <CompassIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                    <span className="hidden @app-md:inline">Explore</span>
                                </span>
                                <Tabs.Indicator />
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs.ListContainer>
                </Controlled>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của ExtendedTabs: tabs-as-input (w-fit / w-full truncate), " +
            "primary lớn điều khiển toàn trang, và secondary lọc nội dung (trần / kèm icon). Dùng để " +
            "tra khi nào chọn variant/size nào và cách mỗi loại phản ứng khi container hẹp lại.",
    },
}
