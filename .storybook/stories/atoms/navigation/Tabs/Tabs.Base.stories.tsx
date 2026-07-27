import type { Meta, StoryObj } from "@storybook/nextjs"
import { HouseIcon, ChartBarIcon, ClockIcon } from "@phosphor-icons/react"
import { Tabs } from "@sb-components/atoms/navigation/Tabs/Tabs"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Tabs.Base` bọc thẳng HeroUI `Tabs`. Các `data-anat-part` nó phát ra
 * (`Tab`/`Icon`/`Badge`/`Indicator`) đều là sub-part của compound HeroUI hoặc
 * span nội bộ (`Icon` chỉ là glyph dẫn đầu, `Badge` gọi thẳng HeroUI `Badge`
 * chứ không phải atom `Badge.Base` của hệ) ⇒ KHÔNG có deps thật, nên KHÔNG
 * truyền `annotate` (thầy chốt 2026-07-26 lần 2).
 *
 * Leaf `Skeleton` đổi tên từ `Loading` (2026-07-27, thầy chốt: leaf mang TÊN
 * PROP — prop sinh ra leaf này là `isSkeleton`). §12g: leaf `isSkeleton` phải
 * render đủ mọi nấc CÓ HÌNH biết trước, và `variant` ("primary"/"secondary")
 * chính là trục đó — biết trước lúc gọi, không phụ thuộc data. Trước sửa
 * (2026-07-27) component bỏ qua `variant` trong nhánh `isSkeleton`, luôn ra
 * cùng một pill bất kể variant — bug thật cùng dạng neo `Button.Base` skeleton
 * khoá cứng `w-24` cho mọi size (§12g). Đã sửa `TabsBase.tsx`: `secondary` giờ
 * ra shimmer nhãn+underline thay vì pill đặc.
 */

const meta: Meta<typeof Tabs.Base> = {
    title: "Atoms/Navigation/Tabs/Tabs.Base",
    component: Tabs.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Tabs.Base>

const BASE_ITEMS = [
    { key: "overview", label: "Overview" },
    { key: "lessons", label: "Lessons" },
    { key: "reviews", label: "Reviews" },
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
                reason="The one tab-strip atom wrapping HeroUI Tabs — variants (icon/badge/disabled) come from per-item props, so the leaf is the composition."
                note="variant='primary' (default) is the segmented pill for a page-level switch; 'secondary' is the underline in-page look. Row 3 has an isDisabled item — the tab still renders, just dimmed and unfocusable. All three rows share the same DOM tree, so they stay one leaf."
                code={`<Tabs.Base ariaLabel="Course" selectedKey="overview" onSelectionChange={fn}
  items={[{ key: "overview", label: "Overview" }, ...]} />
<Tabs.Base variant="secondary" … />
items={[…, { key: "premium", label: "Premium", isDisabled: true }]}`}
            >
                <div className="flex flex-col items-start gap-6">
                    <Tabs.Base ariaLabel="Course" selectedKey="overview" onSelectionChange={() => {}} items={BASE_ITEMS} showAnatomy />
                    <Tabs.Base
                        variant="secondary"
                        ariaLabel="Course (secondary)"
                        selectedKey="overview"
                        onSelectionChange={() => {}}
                        items={BASE_ITEMS}
                        showAnatomy
                    />
                    <Tabs.Base
                        ariaLabel="Content"
                        selectedKey="free"
                        onSelectionChange={() => {}}
                        items={[
                            { key: "free", label: "Free" },
                            { key: "pro", label: "Pro" },
                            { key: "premium", label: "Premium", isDisabled: true },
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
                note="icon is a component reference (`HouseIcon`, not `<HouseIcon/>`). The atom renders it at size-4 to match the tab label and picks its own stroke weight — the story never passes `weight`."
                code={"items={[{ key: \"home\", label: \"Home\", icon: HouseIcon }, ...]}"}
            >
                <Tabs.Base
                    ariaLabel="Dashboard"
                    selectedKey="home"
                    onSelectionChange={() => {}}
                    items={[
                        { key: "home", label: "Home", icon: HouseIcon },
                        { key: "stats", label: "Stats", icon: ChartBarIcon },
                        { key: "history", label: "History", icon: ClockIcon },
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
                note="badge floats a count or notice over the label's corner (Badge.Anchor). Use it for a tab with unread or pending items."
                code={"items={[{ key: \"inbox\", label: \"Inbox\", badge: 3 }, ...]}"}
            >
                <Tabs.Base
                    ariaLabel="Notifications"
                    selectedKey="inbox"
                    onSelectionChange={() => {}}
                    items={[
                        { key: "inbox", label: "Inbox", badge: 3 },
                        { key: "mentions", label: "Mentions", badge: "9+" },
                        { key: "archived", label: "Archived" },
                    ]}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Skeleton — atom tự vẽ leaf skeleton; không dùng Skeleton.*. Render ĐỦ HAI HÌNH
 * (§12g): `primary` (pill đặc) · `secondary` (nhãn + underline mảnh) — khớp đúng
 * hình mà mỗi variant sẽ ra khi data về, không còn một pill dùng chung cho cả hai.
 */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Tabs.Base"
                tier="atom"
                leaf="Prop `isSkeleton`"
                note="isSkeleton's shape follows variant — a filled pill shimmer for primary, a label-bar-plus-underline shimmer for secondary — the same pixel commitment `size` makes on Button.Base's skeleton."
                code={`<Tabs.Base isSkeleton ariaLabel="…" selectedKey="" onSelectionChange={fn} items={[…]} />
<Tabs.Base isSkeleton variant="secondary" … />`}
            >
                <div className="flex flex-col items-start gap-6">
                    <Tabs.Base isSkeleton ariaLabel="Course" selectedKey="overview" onSelectionChange={() => {}} items={BASE_ITEMS} showAnatomy />
                    <Tabs.Base
                        isSkeleton
                        variant="secondary"
                        ariaLabel="Course (secondary)"
                        selectedKey="overview"
                        onSelectionChange={() => {}}
                        items={BASE_ITEMS}
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
