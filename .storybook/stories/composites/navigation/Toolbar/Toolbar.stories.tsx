import { useState } from "react"
import type { Key, ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { GearIcon, GlobeIcon, PlusIcon } from "@phosphor-icons/react"
import { Toolbar, type ToolbarBaseProps, type ToolbarTabItem } from "@sb-components/composites/navigation/Toolbar/Toolbar"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Toolbar` — khung HÀNG điều hướng/điều khiển nằm TRÊN một panel: nhóm tab chính
 * ghim trái (+ cụm action `leftEnd` ngay sau nó), nhóm tab phụ ghim phải, thu gọn thành
 * dropdown dưới `@app-sm`. Không chrome (không nền/viền/bo/padding), root là
 * `flex items-center justify-between gap-3`.
 *
 * ⚠️ ĐỔI TÊN (2026-07-25): trước đây là `TabsCard` — tên SAI vì trong nó không có card
 * nào cả. Hành vi/thị giác giữ NGUYÊN, chỉ đổi tên + gom vào namespace `Toolbar.*` (§13a).
 *
 * ⚠️ PHẠM VI STATE (§12f/§13): nhóm tab đi vào bằng DỮ LIỆU (`items`/`selectedKey`/
 * `onSelectionChange`), nên state hiển thị của TỪNG tab (disabled/muted) do khung này vẽ
 * → có nhà ở đây. Nội dung panel bên dưới KHÔNG phải state của khung: các story chỉ kèm
 * một mặt card để thấy tab đổi thật.
 */
const meta: Meta<typeof Toolbar> = {
    title: "Composites/Navigation/Toolbar/Toolbar",
    component: Toolbar,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Toolbar>

const CONTENT_TABS: Array<ToolbarTabItem> = [
    { key: "overview", label: "Tổng quan" },
    { key: "content", label: "Nội dung" },
    { key: "reviews", label: "Đánh giá" },
]

// `icon` của tab là NODE dựng sẵn nên story tự ép size + weight: `size-4` nhỏ hơn
// `size-5` ⇒ bù `weight="bold"` cho nét không mảnh đi (§5.0a).
const LANGUAGE_TABS: Array<ToolbarTabItem> = [
    { key: "vi", label: "Tiếng Việt", icon: <GlobeIcon className="size-4" weight="bold" /> },
    { key: "en", label: "English", icon: <GlobeIcon className="size-4" weight="bold" /> },
]

/** One row of the `PANEL_CONTENT` lookup — the title/body shown for a single tab key. */
interface PanelRow {
    /** Panel heading shown for this tab. */
    title: string
    /** Panel body copy shown for this tab. */
    body: string
}

const PANEL_CONTENT: Record<string, PanelRow> = {
    overview: { title: "Tổng quan", body: "Giới thiệu khoá học, kết quả đạt được và lộ trình theo từng tuần." },
    content: { title: "Nội dung", body: "Danh sách bài học và bài tập của từng module, kèm thời lượng." },
    reviews: { title: "Đánh giá", body: "Phản hồi và điểm số từ học viên đã hoàn thành khoá." },
    start: { title: "Bắt đầu", body: "Cấu hình ban đầu và các bước để khu vực này chạy được." },
    history: { title: "Lịch sử", body: "Mọi hoạt động đã diễn ra, mới nhất trước." },
    stats: { title: "Thống kê", body: "Số liệu tổng hợp của khu vực — hiện đang khoá." },
    pro: { title: "Nâng cao", body: "Nội dung dành cho gói trả phí — caller chặn lượt chọn để mở paywall." },
}

/** Props for the `TabPanel` helper. */
interface TabPanelProps {
    /** Key of the currently selected tab, used to look up `PANEL_CONTENT`. */
    selectedKey: string
}

/** Panel đổi theo tab đang chọn — bấm tab là khối dưới render lại (chứng minh tab sống). */
const TabPanel = ({ selectedKey }: TabPanelProps) => {
    const panel = PANEL_CONTENT[selectedKey]
    return (
        <SurfaceCard>
            <div className="flex flex-col gap-2">
                <Typography text={panel?.title} weight="bold" />
                <Typography size="sm" text={panel?.body} color="muted" />
            </div>
        </SurfaceCard>
    )
}

/** Giữ state tab trái/phải hộ story — hai nhóm của `Toolbar` đều CONTROLLED. */
const Controlled = (props: Omit<ToolbarBaseProps, "leftTabs" | "rightTabs"> & {
    leftItems: Array<ToolbarTabItem>
    leftAriaLabel?: string
    defaultLeftKey: string
    rightItems?: Array<ToolbarTabItem>
    rightAriaLabel?: string
    defaultRightKey?: string
}) => {
    const {
        leftItems,
        leftAriaLabel = "Phần của khoá",
        defaultLeftKey,
        rightItems,
        rightAriaLabel = "Ngôn ngữ",
        defaultRightKey,
        ...rest
    } = props
    const [leftKey, setLeftKey] = useState(defaultLeftKey)
    const [rightKey, setRightKey] = useState(defaultRightKey ?? "")
    return (
        <div className="flex w-[36rem] max-w-full flex-col gap-3">
            <Toolbar
                {...rest}
                leftTabs={{
                    items: leftItems,
                    selectedKey: leftKey,
                    ariaLabel: leftAriaLabel,
                    onSelectionChange: (key: Key) => setLeftKey(String(key)),
                }}
                rightTabs={rightItems ? {
                    items: rightItems,
                    selectedKey: rightKey,
                    ariaLabel: rightAriaLabel,
                    onSelectionChange: (key: Key) => setRightKey(String(key)),
                } : undefined}
            />
            <TabPanel selectedKey={leftKey} />
        </div>
    )
}

// Truyền icon dạng COMPONENT xuống atom — atom tự ép size + weight (§5.0a), story không chọn nét.
const addButton: ReactNode = (
    <Button isIconOnly prefixIcon={PlusIcon} ariaLabel="Thêm phần mới" variant="ghost" size="sm" onPress={() => {}} />
)

// Part mà Toolbar compose TRỰC TIẾP — LeftTabs (nhóm chính) · LeftEnd (cụm action
// cạnh nó) · RightTabs (nhóm phụ, inline hoặc thu gọn thành Select dưới `@app-sm`).
// Mỗi leaf chỉ khai đúng thứ nó render.
const LEFT_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "TabsExtended", tier: "atom", role: "the main tab group, driving the whole panel below it", storyId: "atoms-navigation-tabs-tabsextended--default" },
]
const TWO_GROUPS_PARTS: Array<AnatomyNode> = [
    { name: "TabsExtended", tier: "atom", role: "the content tab group (accent), pinned left", storyId: "atoms-navigation-tabs-tabsextended--default" },
    { name: "TabsExtended", tier: "atom", role: "the secondary tab group, pinned right", storyId: "atoms-navigation-tabs-tabsextended--default" },
]
// Collapsed right group mounts BOTH real components at once (one hidden under `@app-sm` via CSS),
// so it gets two nodes instead of one wrapper name that could only honestly describe one of them.
const COLLAPSE_PARTS: Array<AnatomyNode> = [
    { name: "TabsExtended", tier: "atom", role: "the content tab group (accent), pinned left", storyId: "atoms-navigation-tabs-tabsextended--default" },
    { name: "Select.Root", tier: "heroui", role: "the collapsed language group below `@app-sm`, an icon-only dropdown" },
    { name: "TabsExtended", tier: "atom", role: "the language group (neutral), inline from `@app-sm` up", storyId: "atoms-navigation-tabs-tabsextended--default" },
]
// `leftEnd` is an arbitrary caller-supplied slot (any node beside the left group) — the toolbar
// never fixes what renders there and never claims it as its own anatomy (§11a caller-slot rule),
// so it carries no badge even though this demo fills it with a `Button`.
const LEFT_END_PARTS: Array<AnatomyNode> = [
    { name: "TabsExtended", tier: "atom", role: "the main tab group", storyId: "atoms-navigation-tabs-tabsextended--default" },
]

/** Một nhóm tab đổi TOÀN BỘ panel bên dưới (secondary, underline) — hình thái tối thiểu. */
export const SingleGroup: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Toolbar"
                tier="composite"
                leaf="SingleGroup"
                parts={LEFT_ONLY_PARTS}
                reason="A navigation/control ROW that sits above a panel: pin the left tab group, optionally an action cluster right after it, optionally a right tab group. It carries no function of its own, it doesn't know what the panel below is, it only fires `onSelectionChange` for the caller. The old name `TabsCard` was dropped because there is no card here at all, no background, border, radius, or padding."
                states={[
                    {
                        name: "only leftTabs passed",
                        why: "Only the LeftTabs group renders; there is no LeftEnd cluster and no RightTabs group. This is the minimal shape, a single tab group that switches the whole panel below it.",
                        code: `<Toolbar
  leftTabs={{ items, selectedKey, ariaLabel: "Phần của khoá", onSelectionChange }}
/>`,
                        render: <Controlled leftItems={CONTENT_TABS} defaultLeftKey="overview" showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/** `leftEnd`: action ghim ngay SAU nhóm trái — sibling của tab list, không lồng trong Tab. */
export const WithLeftEnd: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Toolbar"
                tier="composite"
                leaf="WithLeftEnd"
                parts={LEFT_END_PARTS}
                states={[
                    {
                        name: "leftEnd passed",
                        why: "A LeftEnd node appears right after LeftTabs as its sibling, gathered tight with `gap-1`, not nested inside any Tab. react-aria forbids nesting an interactive element inside `Tabs.Tab`, so an action like adding a new section has to live beside the tab list instead of inside it.",
                        code: `<Toolbar
  leftTabs={…}
  leftEnd={<Button isIconOnly prefixIcon={PlusIcon} ariaLabel="Thêm phần mới" variant="ghost" size="sm" />}
/>`,
                        render: <Controlled leftItems={CONTENT_TABS} defaultLeftKey="overview" leftEnd={addButton} showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/** Hai nhóm cùng hàng — nhóm phải INLINE, cùng chrome accent như nhóm trái. */
export const TwoGroups: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Toolbar"
                tier="composite"
                leaf="TwoGroups"
                parts={TWO_GROUPS_PARTS}
                states={[
                    {
                        name: "leftTabs and rightTabs both passed",
                        why: "A second RightTabs group appears at the far right, pushed there by `justify-between`, with `gap-3` between the two groups. By default the right group carries the same accent chrome as the left one and always stays inline.",
                        code: "<Toolbar leftTabs={…} rightTabs={…} />",
                        render: (
                            <Controlled
                                leftItems={CONTENT_TABS}
                                defaultLeftKey="overview"
                                rightItems={LANGUAGE_TABS}
                                defaultRightKey="vi"
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
 * `rightTabsNeutral` + `collapseRightOnMobile` — nhóm phải là công tắc "cùng nội dung,
 * khác cách trình bày" (đổi ngôn ngữ): chrome NEUTRAL để hàng chỉ có MỘT tín hiệu accent,
 * và thu gọn thành dropdown icon-only dưới `@app-sm`.
 */
export const RightNeutralCollapsed: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Toolbar"
                tier="composite"
                leaf="RightNeutralCollapsed"
                parts={COLLAPSE_PARTS}
                states={[
                    {
                        name: "rightTabsNeutral = true, collapseRightOnMobile = true",
                        why: "The right group's chrome drops to neutral so only one accent signal remains on the row, and under `@app-sm` it collapses into an icon-only Select with an `sr-only` label instead of inline tabs. This is for a right group that is a presentation switch, such as language, rather than a second real navigation choice.",
                        code: `<Toolbar
  leftTabs={…}
  rightTabs={…}
  rightTabsNeutral
  collapseRightOnMobile
/>`,
                        render: (
                            <Controlled
                                leftItems={CONTENT_TABS}
                                defaultLeftKey="overview"
                                rightItems={LANGUAGE_TABS}
                                defaultRightKey="vi"
                                rightTabsNeutral
                                collapseRightOnMobile
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
 * `variant="primary"` — segmented pill full-width, cho hàng đổi HẲN nội dung panel.
 *
 * GỘP MỘT LEAF (§14d.2): `size="sm"` (tên cũ của leaf riêng: `Compact`) KHÔNG đổi
 * một node nào — vẫn đúng cụm LeftTabs đó, chỉ co `w-fit` + chữ/padding nhỏ hơn.
 * Cùng cây ⇒ là STATE của leaf này, không phải leaf thứ hai. `size` cũng chỉ tác
 * động lên `variant="primary"` (secondary vốn đã hug-content).
 *
 * Chỉ bản `size` mặc định nằm trong `BlockAnatomy`; bản `size="sm"` là sibling
 * tham chiếu bên ngoài panel, nên leaf này giữ đúng một state.
 */
export const PrimaryVariant: Story = {
    render: () => (
        <div className="flex flex-col gap-6 p-8">
            <BlockAnatomy
                name="Toolbar"
                tier="composite"
                leaf="PrimaryVariant"
                states={[
                    {
                        name: "variant = \"primary\"",
                        why: "LeftTabs switches to a segmented, full-width pill instead of the secondary underline style, still the only part rendered, no rightTabs and no leftEnd. This is for a row where selecting a tab replaces the panel content entirely, so the tab group itself deserves the loudest chrome.",
                        code: "<Toolbar variant=\"primary\" leftTabs={…} />",
                        render: (
                            <Controlled
                                leftItems={[
                                    // icon tab `size-4` < `size-5` ⇒ `weight="bold"` (§5.0a).
                                    { key: "start", label: "Bắt đầu", icon: <GearIcon className="size-4" weight="bold" /> },
                                    { key: "history", label: "Lịch sử" },
                                    { key: "stats", label: "Thống kê" },
                                ]}
                                leftAriaLabel="Khu vực"
                                defaultLeftKey="start"
                                variant="primary"
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />
            {/* Reference sibling: same leaf at size="sm" — the strip shrinks to w-fit with
                smaller text/padding, but the composition is identical to the state above. */}
            <Controlled
                leftItems={[
                    { key: "start", label: "Bắt đầu", icon: <GearIcon className="size-4" weight="bold" /> },
                    { key: "history", label: "Lịch sử" },
                    { key: "stats", label: "Thống kê" },
                ]}
                leftAriaLabel="Khu vực (size sm)"
                defaultLeftKey="start"
                variant="primary"
                size="sm"
            />
        </div>
    ),
}

/**
 * State của TỪNG tab do khung vẽ: `isDisabled` (chặn chọn, không bấm được) vs `muted`
 * (vẫn bấm được — parent chặn để mở paywall). Hai thứ KHÁC nhau, đừng dùng lẫn.
 */
export const TabStates: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Toolbar"
                tier="composite"
                leaf="TabStates"
                parts={LEFT_ONLY_PARTS}
                states={[
                    {
                        name: "one tab isDisabled, one tab muted",
                        why: "The `Thống kê` tab locks hard, no focus and no selection reach it, while the `Nâng cao` tab still selects normally but renders muted. `isDisabled` is a hard lock the toolbar itself enforces; `muted` still lets the caller's own handler run so it can open a paywall instead.",
                        code: `leftTabs={{ items: [
  { key: "start", label: "Bắt đầu" },
  { key: "stats", label: "Thống kê", isDisabled: true },
  { key: "pro", label: "Nâng cao", muted: true },
], … }}`,
                        render: (
                            <Controlled
                                leftItems={[
                                    { key: "start", label: "Bắt đầu" },
                                    { key: "history", label: "Lịch sử" },
                                    { key: "stats", label: "Thống kê", isDisabled: true },
                                    { key: "pro", label: "Nâng cao", muted: true },
                                ]}
                                leftAriaLabel="Khu vực"
                                defaultLeftKey="start"
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
