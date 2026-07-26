import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { SelectableCardGroup, type SelectableCardItem } from "@sb-components/atoms/navigation/SelectableCardGroup/SelectableCardGroup"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `SelectableCardGroup.Base`: nhóm thẻ chọn-một trên `RadioGroup`/`Radio` của
 * HeroUI, mỗi lựa chọn là một `Card` trung tính, chọn xong nổi viền outline accent.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g — luật TẦNG ATOM):
 * - `items` — dữ liệu dựng ra N thẻ con ⇒ **leaf `Default`** (§12g.2, neo `Button.Group`).
 *   Mọi field TUỲ CHỌN của một item (`description` · `icon` · `badge` · `isDisabled`) đều
 *   là HÌNH THÁI của `items`, không phải trục riêng của atom ⇒ nằm chung TRONG `Default`,
 *   KHÔNG đẻ leaf `Icon`/`Badge`/`Disabled` riêng — đúng câu neo *"item có label ra nút
 *   thường, không có ra nút chỉ-icon"*.
 * - `columns` — đổi pixel thật (số cột grid) ⇒ **leaf `Columns`**, render ĐỦ 1/2/3 chồng
 *   dọc trên CÙNG một `items` để mắt thấy chỉ số cột đổi, không gì khác đổi theo.
 * - `value`/`onChange` — không phải union giá trị cần liệt kê, chỉ là dây điều khiển; mọi
 *   leaf đều tự chạy nó qua `ControlledGroup` nên không cần leaf riêng.
 * - `ariaLabel` — CHỈ chạy vào `aria-label` của `RadioGroup`, không đổi một pixel nào ⇒
 *   **KHÔNG leaf** (§12g.1, cùng họ với `ariaLabel` của `Choice.RadioGroup`).
 * - `className`/`showAnatomy` — escape hatch / cờ dev, không phải hình của atom ⇒ không leaf.
 *
 * ⚠️ SỬA 2026-07-26: bản trước tách `OneColumn`/`ThreeColumns` theo GIÁ TRỊ của
 * `columns` (đúng thứ §12g cấm), lại nhét icon/badge/isDisabled rải rác ở `ThreeColumns`/
 * `WithIconsAndLocked` thay vì gộp vào `Default`. Gộp lại còn 2 leaf: `Default` (prop
 * `items`, đủ hình thái item) + `Columns` (prop `columns`, đủ 1/2/3).
 *
 * `Icon`/`Label`/`Badge` mà component phát ra qua `data-anat-part` đều là SPAN nội bộ
 * (không phải atom nào của hệ có story riêng — component gọi thẳng HeroUI
 * `Card`/`Radio`/`RadioGroup`, không qua `Choice.Radio`) ⇒ KHÔNG có deps thật, nên KHÔNG
 * truyền `annotate` (thầy chốt 2026-07-26 lần 2).
 *
 * ✍️ Chữ hiện trên panel (`leaf`/`reason`/`note`/`code`) và nhãn demo viết TIẾNG ANH;
 * JSDoc/comment giữ tiếng Việt.
 */

const meta: Meta<typeof SelectableCardGroup.Base> = {
    title: "Atoms/Navigation/SelectableCardGroup",
    component: SelectableCardGroup.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SelectableCardGroup.Base>

type PlanValue = "free" | "pro" | "team" | "enterprise"

/** Pill dùng cho slot `badge` — trung tính, không gắn nghĩa "giảm giá" cụ thể. */
const badgePill = (text: string) => (
    <span className="rounded-full bg-accent-soft px-2 py-0 text-xs font-medium text-accent-soft-foreground">
        {text}
    </span>
)

const StarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
            d="M8 1.5l1.9 4.2 4.6.5-3.4 3.2.9 4.6L8 11.8l-4 2.2.9-4.6-3.4-3.2 4.6-.5L8 1.5z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
        />
    </svg>
)

/**
 * MỘT bộ item duy nhất phủ đủ mọi field tuỳ chọn của `SelectableCardItem` — mỗi field
 * xuất hiện đúng một lần để tương phản với phần còn lại đang thiếu nó:
 * `free` không `description`/`icon`/`badge` (baseline) · `pro` có `description` + `icon`
 * (đánh dấu gợi ý) · `team` có `description` + `badge` ("Most popular") · `enterprise`
 * có `description` + `isDisabled` (mờ đi, phải liên hệ sales chứ không chọn trực tiếp).
 */
const PLAN_ITEMS: Array<SelectableCardItem<PlanValue>> = [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro", description: "For solo developers shipping side projects", icon: <StarIcon /> },
    { value: "team", label: "Team", description: "Shared workspaces and roles for a growing team", badge: badgePill("Most popular") },
    { value: "enterprise", label: "Enterprise", description: "Custom limits, SSO, and a dedicated success manager", isDisabled: true },
]

/** Owns the selection so the group is interactive (the block is fully controlled). */
const ControlledGroup = <T extends string>({
    items,
    initialValue,
    ariaLabel,
    columns,
    width = "480px",
    showAnatomy,
}: {
    items: Array<SelectableCardItem<T>>
    initialValue: T
    ariaLabel: string
    columns?: 1 | 2 | 3
    width?: string
    showAnatomy?: boolean
}) => {
    const [value, setValue] = useState<T>(initialValue)
    return (
        <div style={{ width }}>
            <SelectableCardGroup.Base items={items} value={value} onChange={setValue} ariaLabel={ariaLabel} columns={columns} showAnatomy={showAnatomy} />
        </div>
    )
}

/**
 * Leaf prop `items` — cụm dựng từ DỮ LIỆU; mọi field tuỳ chọn của một item
 * (`description`/`icon`/`badge`/`isDisabled`) sống NGAY TRONG bộ dữ liệu này thay vì
 * tách leaf riêng (§12g.2).
 */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SelectableCardGroup"
                tier="atom"
                leaf="Prop `items`"
                reason="The group is a cluster built from data, not JSX children — items is the whole surface worth reading. Free carries only a label, Pro adds a description and an identifying icon, Team adds a badge, and Enterprise is dimmed and unselectable — one array, four shapes an item can take."
                note="value/onChange make the group fully controlled — this story just owns the state locally so the ring can move when you click a card. ariaLabel never reaches the screen; it only feeds the RadioGroup's accessible name, so it gets no leaf of its own."
                code={`<SelectableCardGroup.Base
  items={[
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro", description: "For solo developers shipping side projects", icon: <StarIcon /> },
    { value: "team", label: "Team", description: "Shared workspaces and roles for a growing team", badge: badgePill("Most popular") },
    { value: "enterprise", label: "Enterprise", description: "Custom limits, SSO, and a dedicated success manager", isDisabled: true },
  ]}
  value={value}
  onChange={setValue}
  ariaLabel="Select plan"
/>`}
            >
                <ControlledGroup items={PLAN_ITEMS} initialValue="pro" ariaLabel="Select plan" columns={2} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Leaf prop `columns` — ĐỦ 1/2/3 chồng dọc trên CÙNG một `PLAN_ITEMS`, để mắt thấy chỉ
 * số cột grid đổi, không gì khác đổi theo.
 */
export const Columns: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SelectableCardGroup"
                tier="atom"
                leaf="Prop `columns`"
                reason="columns is the group's own grid: stack cards in a sidebar with 1, pair them at 2 (the default), or line up more options side by side at 3."
                note="All three rows use the same PLAN_ITEMS array — the only thing that changes on screen is the grid-template-columns count, nothing about item shape."
                code={`<SelectableCardGroup.Base items={PLAN_ITEMS} value={value} onChange={setValue} ariaLabel="Select plan" columns={1} />
<SelectableCardGroup.Base items={PLAN_ITEMS} value={value} onChange={setValue} ariaLabel="Select plan" columns={2} />  // default
<SelectableCardGroup.Base items={PLAN_ITEMS} value={value} onChange={setValue} ariaLabel="Select plan" columns={3} />`}
            >
                <div className="flex flex-col gap-6">
                    <ControlledGroup items={PLAN_ITEMS} initialValue="free" ariaLabel="Select plan (1 column)" columns={1} width="360px" showAnatomy />
                    <ControlledGroup items={PLAN_ITEMS} initialValue="pro" ariaLabel="Select plan (2 columns)" columns={2} width="480px" />
                    <ControlledGroup items={PLAN_ITEMS} initialValue="team" ariaLabel="Select plan (3 columns)" columns={3} width="720px" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
