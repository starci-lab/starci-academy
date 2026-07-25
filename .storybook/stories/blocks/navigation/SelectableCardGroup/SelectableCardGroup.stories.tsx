import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { SelectableCardGroup, type SelectableCardItem } from "@sb-components/blocks/navigation/SelectableCardGroup/SelectableCardGroup"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof SelectableCardGroup> = {
    title: "Primitives/Navigation/SelectableCardGroup",
    component: SelectableCardGroup,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SelectableCardGroup>

type PlanValue = "monthly" | "quarterly" | "yearly"

const savePill = (text: string) => (
    <span className="rounded-full bg-accent-soft px-2 py-0 text-xs font-medium text-accent-soft-foreground">
        {text}
    </span>
)

const PLAN_ITEMS: Array<SelectableCardItem<PlanValue>> = [
    { value: "monthly", label: "Monthly", description: "299.000đ / month" },
    { value: "quarterly", label: "Quarterly", description: "799.000đ / quarter", badge: savePill("Save 11%") },
    { value: "yearly", label: "Yearly", description: "2.499.000đ / year", badge: savePill("Save 30%") },
]

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

const LANGUAGE_ITEMS: Array<SelectableCardItem<"ts" | "java" | "csharp" | "go">> = [
    { value: "ts", label: "TypeScript", description: "Node.js / NestJS", icon: <StarIcon /> },
    { value: "java", label: "Java", description: "Spring Boot" },
    { value: "csharp", label: "C#", description: ".NET" },
    { value: "go", label: "Go", description: "Coming soon", isDisabled: true },
]

/** Owns the selection so the group is interactive (the block is fully controlled). */
const ControlledGroup = <T extends string>({
    items,
    initialValue,
    ariaLabel,
    columns,
    width = "420px",
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
            <SelectableCardGroup items={items} value={value} onChange={setValue} ariaLabel={ariaLabel} columns={columns} showAnatomy={showAnatomy} />
        </div>
    )
}

// PLAN_ITEMS: no icon, but description + (on 2/3 items) a trailing "Save N%" badge.
const PLAN_PARTS: Array<AnatomyNode> = [
    { name: "Label", tier: "primitive", role: "label + description mỗi thẻ (vd 'Quarterly' + giá)" },
    { name: "Badge", tier: "design", role: "tag phụ tuỳ chọn (vd 'Save 11%') — không phải mọi thẻ đều có" },
]

// LANGUAGE_ITEMS: first item carries an icon, none carry a badge.
const LANGUAGE_PARTS: Array<AnatomyNode> = [
    { name: "Icon", tier: "primitive", role: "icon nhận diện tuỳ chọn — chỉ TypeScript có trong bộ này" },
    { name: "Label", tier: "primitive", role: "label + description mỗi thẻ (vd 'Java' + 'Spring Boot')" },
]

/** Rich options (icon-less here): label + description + badge, 2 columns — a real radio group. */
export const RichOption: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SelectableCardGroup"
                tier="primitive"
                leaf="RichOption"
                parts={PLAN_PARTS}
                reason="Bộ chọn single-select trên HeroUI RadioGroup/Radio thật — mỗi thẻ là Card trung tính, chọn = viền outline accent (không đổi fill), không phải hand-roll toggle-button."
            >
                <ControlledGroup items={PLAN_ITEMS} initialValue="monthly" ariaLabel="Select billing cycle" columns={2} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** `columns={1}` — stacks in a single column for a narrow block / sidebar. */
export const OneColumn: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SelectableCardGroup"
                tier="primitive"
                leaf="OneColumn"
                parts={PLAN_PARTS}
                note="Cùng composition với leaf RichOption — chỉ đổi `columns={1}` (xếp chồng dọc), không đổi cây parts."
            >
                <ControlledGroup items={PLAN_ITEMS} initialValue="quarterly" ariaLabel="Select billing cycle" columns={1} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** `columns={3}` — many options side by side on a wide block. */
export const ThreeColumns: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SelectableCardGroup"
                tier="primitive"
                leaf="ThreeColumns"
                parts={LANGUAGE_PARTS}
                note="Bộ LANGUAGE_ITEMS: chỉ TypeScript có `icon` → Icon part chỉ badge trên thẻ đó; Badge vắng mặt (không item nào có `badge`)."
            >
                <ControlledGroup items={LANGUAGE_ITEMS} initialValue="ts" ariaLabel="Select language" columns={3} width="640px" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** With an identifying `icon` and a locked (`isDisabled`) option that still shows. */
export const WithIconsAndLocked: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SelectableCardGroup"
                tier="primitive"
                leaf="WithIconsAndLocked"
                parts={LANGUAGE_PARTS}
                note="Cùng composition với leaf ThreeColumns — thêm 1 option `isDisabled` (Go) vẫn hiện, chỉ dimmed."
            >
                <ControlledGroup items={LANGUAGE_ITEMS} initialValue="java" ariaLabel="Select language" columns={2} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}
