import type { Meta, StoryObj } from "@storybook/nextjs"
import { House, ChartColumn, Clock } from "@gravity-ui/icons"
import { Tabs } from "@sb-components/atoms/navigation/Tabs/Tabs"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Tabs.Base> = {
    title: "Atoms/Navigation/Tabs/Tabs.Base",
    component: Tabs.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Tabs.Base>

// LEAF = composition (theo per-item prop). Mỗi leaf render 1 tab strip + anatomy đúng parts.
const TAB_PARTS: Array<AnatomyNode> = [
    { name: "Tab", tier: "atom", role: "một tab (HeroTabs.Tab) — id + label từ `items`" },
    { name: "Indicator", tier: "atom", role: "thanh chỉ báo tab đang chọn (HeroTabs.Indicator)" },
]
const ICON_PARTS: Array<AnatomyNode> = [
    { name: "Tab", tier: "atom", role: "một tab (HeroTabs.Tab)" },
    { name: "Icon", tier: "atom", role: "glyph dẫn đầu — `icon` truyền COMPONENT, atom ép size-4" },
    { name: "Indicator", tier: "atom", role: "thanh chỉ báo tab đang chọn" },
]
const BADGE_PARTS: Array<AnatomyNode> = [
    { name: "Tab", tier: "atom", role: "một tab (HeroTabs.Tab)" },
    { name: "Badge", tier: "atom", role: "số/notice nổi trên nhãn (HeroBadge.Anchor + Badge) — prop `badge`" },
    { name: "Indicator", tier: "atom", role: "thanh chỉ báo tab đang chọn" },
]
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "atom", role: "leaf skeleton do atom tự sở hữu (một pill mỗi tab)" },
]

const BASE_ITEMS = [
    { key: "overview", label: "Tổng quan" },
    { key: "lessons", label: "Bài học" },
    { key: "reviews", label: "Đánh giá" },
]

/** Default — tab chữ trơn, tab đầu đang chọn. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Tabs.Base"
                tier="atom"
                leaf="Default"
                parts={TAB_PARTS}
                reason="Atom tab-strip DUY NHẤT bọc HeroUI Tabs; biến thể (icon/badge/disabled) phân bằng per-item prop → leaf = composition."
                code={`<Tabs.Base ariaLabel="Khoá học" selectedKey="overview" onSelectionChange={fn}
  items={[{ key: "overview", label: "Tổng quan" }, ...]} />`}
            >
                <Tabs.Base ariaLabel="Khoá học" selectedKey="overview" onSelectionChange={() => {}} items={BASE_ITEMS} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Secondary — `variant="secondary"`: kiểu gạch chân dùng cho content-tabs trong trang. */
export const Secondary: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Tabs.Base"
                tier="atom"
                leaf="Secondary"
                parts={TAB_PARTS}
                note="variant='secondary' → underline in-page; 'primary' (mặc định) là pill segmented cho page-level switch."
                code={"<Tabs.Base variant=\"secondary\" ariaLabel=\"Khoá học\" selectedKey=\"overview\" onSelectionChange={fn} items={BASE_ITEMS} />"}
            >
                <Tabs.Base
                    variant="secondary"
                    ariaLabel="Khoá học"
                    selectedKey="overview"
                    onSelectionChange={() => {}}
                    items={BASE_ITEMS}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** WithIcon — mỗi tab có `icon` truyền COMPONENT (gravity, không JSX); atom ép size-4. */
export const WithIcon: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Tabs.Base"
                tier="atom"
                leaf="WithIcon"
                parts={ICON_PARTS}
                note="icon = component reference (`House`, không `<House/>`). Atom render size-4 khớp nhãn tab."
                code={"items={[{ key: \"home\", label: \"Trang chủ\", icon: House }, ...]}"}
            >
                <Tabs.Base
                    ariaLabel="Bảng điều khiển"
                    selectedKey="home"
                    onSelectionChange={() => {}}
                    items={[
                        { key: "home", label: "Trang chủ", icon: House },
                        { key: "stats", label: "Thống kê", icon: ChartColumn },
                        { key: "history", label: "Lịch sử", icon: Clock },
                    ]}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** WithBadge — `badge` nổi số chưa đọc trên nhãn (HeroUI Badge). */
export const WithBadge: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Tabs.Base"
                tier="atom"
                leaf="WithBadge"
                parts={BADGE_PARTS}
                note="badge = count/notice nổi góc nhãn (Badge.Anchor). Dùng cho tab có mục chưa xử lý."
                code={"items={[{ key: \"inbox\", label: \"Hộp thư\", badge: 3 }, ...]}"}
            >
                <Tabs.Base
                    ariaLabel="Thông báo"
                    selectedKey="inbox"
                    onSelectionChange={() => {}}
                    items={[
                        { key: "inbox", label: "Hộp thư", badge: 3 },
                        { key: "mentions", label: "Nhắc đến", badge: "9+" },
                        { key: "archived", label: "Lưu trữ" },
                    ]}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** DisabledTab — một tab `isDisabled` (hiện nhưng chặn chọn). */
export const DisabledTab: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Tabs.Base"
                tier="atom"
                leaf="DisabledTab"
                parts={TAB_PARTS}
                note="isDisabled trên 1 item → tab render mờ, không focus/không chọn được."
                code={"items={[..., { key: \"premium\", label: \"Nâng cao\", isDisabled: true }]}"}
            >
                <Tabs.Base
                    ariaLabel="Nội dung"
                    selectedKey="free"
                    onSelectionChange={() => {}}
                    items={[
                        { key: "free", label: "Miễn phí" },
                        { key: "pro", label: "Chuyên nghiệp" },
                        { key: "premium", label: "Nâng cao", isDisabled: true },
                    ]}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Loading — atom tự vẽ leaf skeleton (một pill mỗi tab); không dùng Skeleton.*. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Tabs.Base"
                tier="atom"
                leaf="Loading"
                parts={SKELETON_PARTS}
                note="isSkeleton → hàng pill shimmer OWNED bởi atom (hybrid C)."
                code={"<Tabs.Base isSkeleton ariaLabel=\"…\" selectedKey=\"\" onSelectionChange={fn} items={[…]} />"}
            >
                <Tabs.Base isSkeleton ariaLabel="Khoá học" selectedKey="overview" onSelectionChange={() => {}} items={BASE_ITEMS} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}
