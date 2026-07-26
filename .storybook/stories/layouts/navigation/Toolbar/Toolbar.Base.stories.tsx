import { useState } from "react"
import type { Key, ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { GearIcon, GlobeIcon, PlusIcon } from "@phosphor-icons/react"
import { Toolbar, type ToolbarTabItem, type ToolbarBaseProps } from "@sb-components/layouts/navigation/Toolbar/Toolbar"
import { SurfaceCard } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Toolbar.Base` — khung HÀNG điều hướng/điều khiển nằm TRÊN một panel: nhóm tab chính
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
const meta: Meta<typeof Toolbar.Base> = {
    title: "Layouts/Navigation/Toolbar/Toolbar.Base",
    component: Toolbar.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Toolbar.Base>

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

const PANEL_CONTENT: Record<string, { title: string; body: string }> = {
    overview: { title: "Tổng quan", body: "Giới thiệu khoá học, kết quả đạt được và lộ trình theo từng tuần." },
    content: { title: "Nội dung", body: "Danh sách bài học và bài tập của từng module, kèm thời lượng." },
    reviews: { title: "Đánh giá", body: "Phản hồi và điểm số từ học viên đã hoàn thành khoá." },
    start: { title: "Bắt đầu", body: "Cấu hình ban đầu và các bước để khu vực này chạy được." },
    history: { title: "Lịch sử", body: "Mọi hoạt động đã diễn ra, mới nhất trước." },
    stats: { title: "Thống kê", body: "Số liệu tổng hợp của khu vực — hiện đang khoá." },
    pro: { title: "Nâng cao", body: "Nội dung dành cho gói trả phí — caller chặn lượt chọn để mở paywall." },
}

/** Panel đổi theo tab đang chọn — bấm tab là khối dưới render lại (chứng minh tab sống). */
const TabPanel = ({ selectedKey }: { selectedKey: string }) => {
    const panel = PANEL_CONTENT[selectedKey]
    return (
        <SurfaceCard.Base>
            <div className="flex flex-col gap-2">
                <Typography.Base text={panel?.title} weight="bold" />
                <Typography.Base size="sm" text={panel?.body} color="muted" />
            </div>
        </SurfaceCard.Base>
    )
}

/** Giữ state tab trái/phải hộ story — hai nhóm của `Toolbar.Base` đều CONTROLLED. */
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
            <Toolbar.Base
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
    <Button.Base isIconOnly prefixIcon={PlusIcon} ariaLabel="Thêm phần mới" variant="ghost" size="sm" onPress={() => {}} />
)

// Part mà Toolbar.Base compose TRỰC TIẾP — LeftTabs (nhóm chính) · LeftEnd (cụm action
// cạnh nó) · RightTabs (nhóm phụ, inline hoặc thu gọn thành Select dưới `@app-sm`).
// Mỗi leaf chỉ khai đúng thứ nó render.
const LEFT_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "LeftTabs", tier: "primitive", role: "nhóm tab chính (ExtendedTabs), điều khiển toàn panel bên dưới" },
]
const TWO_GROUPS_PARTS: Array<AnatomyNode> = [
    { name: "LeftTabs", tier: "primitive", role: "nhóm tab nội dung (accent), ghim trái" },
    { name: "RightTabs", tier: "primitive", role: "nhóm tab phụ, ghim phải" },
]
const COLLAPSE_PARTS: Array<AnatomyNode> = [
    { name: "LeftTabs", tier: "primitive", role: "nhóm tab nội dung (accent), ghim trái" },
    { name: "RightTabs", tier: "primitive", role: "nhóm ngôn ngữ (neutral) — inline từ `@app-sm`, dưới đó là Select icon-only" },
]
const LEFT_END_PARTS: Array<AnatomyNode> = [
    { name: "LeftTabs", tier: "primitive", role: "nhóm tab chính" },
    { name: "LeftEnd", tier: "design", role: "cụm action cạnh nhóm trái (vd nút +) — sibling của tab list, không lồng trong Tab" },
]

/** Một nhóm tab đổi TOÀN BỘ panel bên dưới (secondary, underline) — hình thái tối thiểu. */
export const SingleGroup: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Toolbar.Base"
                tier="primitive"
                leaf="SingleGroup"
                parts={LEFT_ONLY_PARTS}
                reason="Khung HÀNG điều hướng: ghim nhóm tab trái, (tuỳ chọn) cụm action ngay sau, (tuỳ chọn) nhóm tab phải. Không mang chức năng — nó không biết panel dưới là gì, chỉ bắn `onSelectionChange` cho caller. Tên cũ `TabsCard` bị bỏ vì không có card nào ở đây (không nền/viền/bo/padding)."
                code={`<Toolbar.Base
  leftTabs={{ items, selectedKey, ariaLabel: "Phần của khoá", onSelectionChange }}
/>`}
            >
                <Controlled leftItems={CONTENT_TABS} defaultLeftKey="overview" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** `leftEnd`: action ghim ngay SAU nhóm trái — sibling của tab list, không lồng trong Tab. */
export const WithLeftEnd: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Toolbar.Base"
                tier="primitive"
                leaf="WithLeftEnd"
                parts={LEFT_END_PARTS}
                note="react-aria cấm lồng phần tử tương tác trong `Tabs.Tab`, nên nút nằm SIBLING của tab list, cụm trái gom lại bằng `gap-1` (tight)."
                code={`<Toolbar.Base
  leftTabs={…}
  leftEnd={<Button.Base isIconOnly prefixIcon={PlusIcon} ariaLabel="Thêm phần mới" variant="ghost" size="sm" />}
/>`}
            >
                <Controlled leftItems={CONTENT_TABS} defaultLeftKey="overview" leftEnd={addButton} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Hai nhóm cùng hàng — nhóm phải INLINE, cùng chrome accent như nhóm trái. */
export const TwoGroups: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Toolbar.Base"
                tier="primitive"
                leaf="TwoGroups"
                parts={TWO_GROUPS_PARTS}
                note="Mặc định nhóm phải cũng accent và luôn inline — `justify-between` đẩy nó về mép phải, `gap-3` là máng giữa hai nhóm."
                code={"<Toolbar.Base leftTabs={…} rightTabs={…} />"}
            >
                <Controlled
                    leftItems={CONTENT_TABS}
                    defaultLeftKey="overview"
                    rightItems={LANGUAGE_TABS}
                    defaultRightKey="vi"
                    showAnatomy
                />
            </BlockAnatomy>
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
                name="Toolbar.Base"
                tier="primitive"
                leaf="RightNeutralCollapsed"
                parts={COLLAPSE_PARTS}
                note="Kéo hẹp khung để thấy nhóm phải đổi hình: dưới `@app-sm` là Select icon-only (nhãn `sr-only`), từ `@app-sm` trở lên là tab underline foreground."
                code={`<Toolbar.Base
  leftTabs={…}
  rightTabs={…}
  rightTabsNeutral
  collapseRightOnMobile
/>`}
            >
                <Controlled
                    leftItems={CONTENT_TABS}
                    defaultLeftKey="overview"
                    rightItems={LANGUAGE_TABS}
                    defaultRightKey="vi"
                    rightTabsNeutral
                    collapseRightOnMobile
                    showAnatomy
                />
            </BlockAnatomy>
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
 */
export const PrimaryVariant: Story = {
    render: () => (
        <div className="flex flex-col gap-6 p-8">
            <BlockAnatomy
                name="Toolbar.Base"
                tier="primitive"
                leaf="PrimaryVariant"
                parts={LEFT_ONLY_PARTS}
                note={"Đổi hình sang segmented-pill full-width; part vẫn CHỈ LeftTabs (không rightTabs/leftEnd). Mẫu thứ hai là cùng leaf ở `size=\"sm\"` — strip co `w-fit`, tỉ lệ nhỏ hơn, composition y hệt."}
                code={`<Toolbar.Base variant="primary" leftTabs={…} />
<Toolbar.Base variant="primary" size="sm" leftTabs={…} />`}
            >
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
            </BlockAnatomy>
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
                name="Toolbar.Base"
                tier="primitive"
                leaf="TabStates"
                parts={LEFT_ONLY_PARTS}
                note="`Thống kê` disabled = khoá cứng (không nhận focus/chọn); `Nâng cao` muted = vẫn chọn được, caller tự chặn để mở paywall."
                code={`leftTabs={{ items: [
  { key: "start", label: "Bắt đầu" },
  { key: "stats", label: "Thống kê", isDisabled: true },
  { key: "pro", label: "Nâng cao", muted: true },
], … }}`}
            >
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
            </BlockAnatomy>
        </div>
    ),
}
