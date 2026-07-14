import type { Meta, StoryObj } from "@storybook/nextjs"
import React, { useState } from "react"
import { TrashIcon } from "@phosphor-icons/react"
import { Button } from "@heroui/react"
import { FlexWrapButtonRadio, type FlexWrapButtonRadioColor, type FlexWrapButtonRadioItem } from "./index"

/** Difficulty-picker items — mirrors a real config-row caller (plain text content). */
const DIFFICULTY_ITEMS: Array<FlexWrapButtonRadioItem<string>> = [
    { value: "easy", content: "Dễ" },
    { value: "medium", content: "Trung bình" },
    { value: "hard", content: "Khó" },
    { value: "expert", content: "Chuyên gia" },
]

/** Attempt-picker items — realistic candidate for `insideCard`. */
const ATTEMPT_ITEMS: Array<FlexWrapButtonRadioItem<string>> = [
    { value: "attempt-1", content: "Lần 1 · 6/10đ" },
    { value: "attempt-2", content: "Lần 2 · 8/10đ" },
    { value: "attempt-3", content: "Lần 3 · 9/10đ" },
]

/** Items including one disabled option (locked tier). */
const TIER_ITEMS: Array<FlexWrapButtonRadioItem<string>> = [
    { value: "free", content: "Miễn phí" },
    { value: "economy", content: "Economy" },
    { value: "balanced", content: "Balanced" },
    { value: "premium", content: "Premium", isDisabled: true },
]

/**
 * Wrapper that owns selection state so the story is truly interactive in the
 * Storybook canvas (the block itself is fully controlled — `value`/`onChange`).
 */
const Controlled = <T extends string>(props: {
    items: Array<FlexWrapButtonRadioItem<T>>
    initialValue: T
    ariaLabel: string
    color?: FlexWrapButtonRadioColor
    insideCard?: boolean
    trailing?: React.ReactNode
    itemAction?: (item: FlexWrapButtonRadioItem<T>) => React.ReactNode
}) => {
    const [value, setValue] = useState<T>(props.initialValue)
    return (
        <FlexWrapButtonRadio
            items={props.items}
            value={value}
            onChange={setValue}
            ariaLabel={props.ariaLabel}
            color={props.color}
            insideCard={props.insideCard}
            trailing={props.trailing}
            itemAction={props.itemAction}
        />
    )
}

const meta: Meta<typeof FlexWrapButtonRadio> = {
    title: "Blocks/FlexWrapButtonRadio",
    component: FlexWrapButtonRadio,
    parameters: {
        docs: {
            description: {
                component:
                    "Single-select toggle-button group laid out as a flex-wrap row. `insideCard=false` (default) uses clean native HeroUI variants (secondary/ghost) with no own surface. `insideCard=true` gives each option a card-styled surface with a colored border on selection.",
            },
        },
    },
}

export default meta
type Story = StoryObj<typeof FlexWrapButtonRadio>

/** Default: clean look (`insideCard=false`), accent selected color. */
export const Default: Story = {
    render: () => (
        <Controlled items={DIFFICULTY_ITEMS} initialValue="medium" ariaLabel="Chọn độ khó" />
    ),
}

/** `insideCard=true`: each option renders as its own card-styled button. */
export const InsideCard: Story = {
    render: () => (
        <Controlled items={ATTEMPT_ITEMS} initialValue="attempt-2" ariaLabel="Chọn lần làm bài" insideCard />
    ),
}

/** Selected color = success (e.g. a "passed" state picker). */
export const ColorSuccess: Story = {
    render: () => (
        <Controlled
            items={ATTEMPT_ITEMS}
            initialValue="attempt-3"
            ariaLabel="Chọn lần làm bài"
            insideCard
            color="success"
        />
    ),
}

/** Selected color = danger (e.g. a risk/severity picker). */
export const ColorDanger: Story = {
    render: () => (
        <Controlled
            items={[
                { value: "low", content: "Thấp" },
                { value: "med", content: "Trung bình" },
                { value: "high", content: "Cao" },
            ]}
            initialValue="high"
            ariaLabel="Chọn mức độ rủi ro"
            insideCard
            color="danger"
        />
    ),
}

/** Selected color = warning. */
export const ColorWarning: Story = {
    render: () => (
        <Controlled
            items={[
                { value: "draft", content: "Bản nháp" },
                { value: "review", content: "Đang duyệt" },
                { value: "published", content: "Đã đăng" },
            ]}
            initialValue="review"
            ariaLabel="Chọn trạng thái"
            insideCard
            color="warning"
        />
    ),
}

/** One option disabled (e.g. a locked/premium tier). */
export const WithDisabledItem: Story = {
    render: () => (
        <Controlled items={TIER_ITEMS} initialValue="economy" ariaLabel="Chọn gói" />
    ),
}

/** `trailing`: an extra action node in the same wrap row (e.g. a "+N" overflow button). */
export const WithTrailing: Story = {
    render: () => (
        <Controlled
            items={DIFFICULTY_ITEMS.slice(0, 3)}
            initialValue="easy"
            ariaLabel="Chọn độ khó"
            trailing={
                <Button size="sm" variant="ghost">
                    +2
                </Button>
            }
        />
    ),
}

/** `itemAction`: a per-item sibling action (e.g. a delete button next to each option). */
export const WithItemAction: Story = {
    render: () => (
        <Controlled
            items={ATTEMPT_ITEMS}
            initialValue="attempt-1"
            ariaLabel="Chọn lần làm bài"
            itemAction={(item) => (
                <Button size="sm" variant="ghost" isIconOnly aria-label={`Xoá ${item.value}`}>
                    <TrashIcon className="size-4" />
                </Button>
            )}
        />
    ),
}
