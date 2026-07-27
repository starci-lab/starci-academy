import type { Meta, StoryObj } from "@storybook/nextjs"
import { HouseIcon, ChartBarIcon, ClockIcon } from "@phosphor-icons/react"
import { Tabs } from "@sb-components/atoms/navigation/Tabs/Tabs"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Tabs.Base` bọc thẳng HeroUI `Tabs`. Các `data-anat-part` nó phát ra
 * (`Tabs.Tab`/`Tabs.Indicator`/`Badge.Anchor`/`Badge`/`Skeleton`) đều là sub-part
 * của compound HeroUI THẬT — 2026-07-27 (heroui tier thêm vào canon): mỗi cái vẫn
 * khai `tier: "heroui"` trong `ANNOTATE` bên dưới, tên khớp Y HỆT identifier import
 * (không cần `storyId`). Đổi tên từ `Tab`/`Badge`/`Indicator` (tên vai, không phải
 * tên component thật) sang tên dotted khớp compound. Span `Icon` bọc glyph Phosphor
 * caller-supplied KHÔNG được tag — không phải component thật của ta lẫn heroui.
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

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Tabs.Tab": { tier: "heroui", role: "one tab — selectable, or disabled per item.isDisabled" },
    "Tabs.Indicator": { tier: "heroui", role: "the moving highlight/underline marking the selected tab" },
    "Badge.Anchor": { tier: "heroui", role: "anchors the count badge to the corner of a tab's label" },
    Badge: { tier: "heroui", role: "the floated unread/pending count" },
    Skeleton: { tier: "heroui", role: "shimmer bar standing in for a tab's label or underline" },
}

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
                annotate={ANNOTATE}
                leaf="Default"
                reason="The one tab-strip atom wrapping HeroUI Tabs. Its variants (icon, badge, disabled) come from per-item props rather than separate components, so the leaf is the composition itself."
                states={[
                    {
                        name: "variant = \"primary\" (default)",
                        why: "The three tabs render as a segmented pill strip with the selected tab's background filled in. This is the look for a page-level switch that stands on its own, not nested inside another surface.",
                        code: `<Tabs.Base ariaLabel="Course" selectedKey="overview" onSelectionChange={fn}
  items={[{ key: "overview", label: "Overview" }, ...]} />`,
                        render: (
                            <Tabs.Base ariaLabel="Course" selectedKey="overview" onSelectionChange={() => {}} items={BASE_ITEMS} showAnatomy />
                        ),
                    },
                    {
                        name: "variant = \"secondary\"",
                        why: "The same three tabs render as plain labels with a thin underline tracking the selected one instead of a filled pill. This is the look for a switch living in-page, inside a surface that already carries its own background.",
                        code: `<Tabs.Base variant="secondary" ariaLabel="Course" selectedKey="overview" onSelectionChange={fn}
  items={[{ key: "overview", label: "Overview" }, ...]} />`,
                        render: (
                            <Tabs.Base
                                variant="secondary"
                                ariaLabel="Course (secondary)"
                                selectedKey="overview"
                                onSelectionChange={() => {}}
                                items={BASE_ITEMS}
                                showAnatomy
                            />
                        ),
                    },
                    {
                        name: "items[2].isDisabled = true",
                        why: "The third tab still renders in place but dims and stops responding to focus or click, while the other two tabs behave normally. The strip stays the same Tab-times-N tree, one item just carries a disabled flag.",
                        code: "items={[…, { key: \"premium\", label: \"Premium\", isDisabled: true }]}",
                        render: (
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
                        ),
                    },
                ]}
            />
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
                annotate={ANNOTATE}
                leaf="WithIcon"
                states={[
                    {
                        name: "items[].icon set",
                        why: "Each tab gains a leading glyph rendered at size-4 to match the label's height, ahead of the same text every plain tab already shows. The story passes the icon as a component reference, not JSX, and the atom picks its own stroke weight without being told.",
                        code: "items={[{ key: \"home\", label: \"Home\", icon: HouseIcon }, ...]}",
                        render: (
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
                        ),
                    },
                ]}
            />
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
                annotate={ANNOTATE}
                leaf="WithBadge"
                states={[
                    {
                        name: "items[].badge set",
                        why: "A small count or notice floats over the corner of a tab's label wherever `badge` is set, and the tab with no `badge` prop shows none. It marks unread or pending items without needing a separate row of chips elsewhere on the page.",
                        code: "items={[{ key: \"inbox\", label: \"Inbox\", badge: 3 }, ...]}",
                        render: (
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
                        ),
                    },
                ]}
            />
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
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                reason="isSkeleton's shape follows variant instead of always drawing the same shimmer pill, the same pixel commitment `size` makes on Button.Base's own skeleton."
                states={[
                    {
                        name: "isSkeleton = true, variant = \"primary\"",
                        why: "A filled pill shimmer stands where the segmented selected tab would sit, matching the primary variant's own resting shape. Nothing about the eventual tab labels shifts the strip's width once real data lands.",
                        code: "<Tabs.Base isSkeleton ariaLabel=\"…\" selectedKey=\"\" onSelectionChange={fn} items={[…]} />",
                        render: (
                            <Tabs.Base isSkeleton ariaLabel="Course" selectedKey="overview" onSelectionChange={() => {}} items={BASE_ITEMS} showAnatomy />
                        ),
                    },
                    {
                        name: "isSkeleton = true, variant = \"secondary\"",
                        why: "A label-bar-plus-underline shimmer stands where the underline tab strip would sit, instead of reusing the primary variant's filled pill. Each variant now rests in the exact shape it will land in once the real tabs render.",
                        code: "<Tabs.Base isSkeleton variant=\"secondary\" ariaLabel=\"…\" selectedKey=\"\" onSelectionChange={fn} items={[…]} />",
                        render: (
                            <Tabs.Base
                                isSkeleton
                                variant="secondary"
                                ariaLabel="Course (secondary)"
                                selectedKey="overview"
                                onSelectionChange={() => {}}
                                items={BASE_ITEMS}
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
