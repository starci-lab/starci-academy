import type { Meta, StoryObj } from "@storybook/nextjs"
import { HouseIcon, ChartBarIcon, ClockIcon } from "@phosphor-icons/react"
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
    { name: "Icon", tier: "atom", role: "glyph dẫn đầu — `icon` truyền COMPONENT phosphor, atom ép size-4" },
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

/**
 * Default — tab chữ trơn. MỘT leaf render ĐỦ VARIANT + STATE (§14d.2): `primary`
 * (pill segmented) · `secondary` (underline in-page) · strip có một item
 * `isDisabled`. Cả ba CÙNG CÂY DOM (Tab × n + Indicator) — chỉ khác skin/cờ
 * per-item — nên KHÔNG tách thành leaf riêng.
 */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Tabs.Base"
                tier="atom"
                leaf="Default"
                parts={TAB_PARTS}
                reason="Atom tab-strip DUY NHẤT bọc HeroUI Tabs; biến thể (icon/badge/disabled) phân bằng per-item prop → leaf = composition."
                note="variant='primary' (mặc định) = pill segmented cho page-level switch · 'secondary' = underline in-page. Hàng 3 có item `isDisabled`: tab vẫn render, chỉ mờ + không focus/không chọn được. Ba hàng cùng cây DOM ⇒ một leaf (§14d.2)."
                code={`<Tabs.Base ariaLabel="Khoá học" selectedKey="overview" onSelectionChange={fn}
  items={[{ key: "overview", label: "Tổng quan" }, ...]} />
<Tabs.Base variant="secondary" … />
items={[…, { key: "premium", label: "Nâng cao", isDisabled: true }]}`}
            >
                <div className="flex flex-col items-start gap-6">
                    <Tabs.Base ariaLabel="Khoá học" selectedKey="overview" onSelectionChange={() => {}} items={BASE_ITEMS} showAnatomy />
                    <Tabs.Base
                        variant="secondary"
                        ariaLabel="Khoá học (secondary)"
                        selectedKey="overview"
                        onSelectionChange={() => {}}
                        items={BASE_ITEMS}
                        showAnatomy
                    />
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
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** WithIcon — mỗi tab có `icon` truyền COMPONENT (phosphor `*Icon`, không JSX); atom ép size-4. */
export const WithIcon: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Tabs.Base"
                tier="atom"
                leaf="WithIcon"
                parts={ICON_PARTS}
                note="icon = component reference (`HouseIcon`, không `<HouseIcon/>`). Atom render size-4 khớp nhãn tab + weight theo §5⃣0a — story KHÔNG truyền `weight`."
                code={"items={[{ key: \"home\", label: \"Trang chủ\", icon: HouseIcon }, ...]}"}
            >
                <Tabs.Base
                    ariaLabel="Bảng điều khiển"
                    selectedKey="home"
                    onSelectionChange={() => {}}
                    items={[
                        { key: "home", label: "Trang chủ", icon: HouseIcon },
                        { key: "stats", label: "Thống kê", icon: ChartBarIcon },
                        { key: "history", label: "Lịch sử", icon: ClockIcon },
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
