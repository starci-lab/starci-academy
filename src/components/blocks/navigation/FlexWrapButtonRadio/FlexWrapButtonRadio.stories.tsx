import type { Meta, StoryObj } from "@storybook/nextjs"
import React, { useState } from "react"
import { DotsThreeVerticalIcon, TrashIcon } from "@phosphor-icons/react"
import { Button, Label, Typography } from "@heroui/react"
import { FlexWrapButtonRadio, type FlexWrapButtonRadioItem } from "./index"

/** Difficulty-picker items — mirrors a real config-row caller (plain text content). */
const DIFFICULTY_ITEMS: Array<FlexWrapButtonRadioItem<string>> = [
    { value: "easy", content: "Dễ" },
    { value: "medium", content: "Trung bình" },
    { value: "hard", content: "Khó" },
    { value: "expert", content: "Chuyên gia" },
]

/** Attempt-picker items — realistic candidate for `itemAction`. */
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
            trailing={props.trailing}
            itemAction={props.itemAction}
        />
    )
}

const meta: Meta<typeof FlexWrapButtonRadio> = {
    title: "Core/Navigation/FlexWrapButtonRadio",
    component: FlexWrapButtonRadio,
    parameters: {
        docs: {
            description: {
                component:
                    "Single-select toggle-button group laid out as a flex-wrap row of independent HeroUI Buttons (secondary/ghost) with no own surface. With `itemAction`, each item becomes one connected ButtonGroup (`[select | 🗑 | ⋮]`) with full-height dividers.",
            },
        },
    },
}

export default meta
type Story = StoryObj<typeof FlexWrapButtonRadio>

/**
 * Chọn 1-trong-N khi option ngắn, gọn và cần wrap xuống hàng — mỗi option là một `<Button>` THẬT: chiều cao
 * ĐỒNG NHẤT (Button bake sẵn height theo size) và mỗi option có thể kèm nút phụ cùng hàng (`itemAction`: xoá,
 * menu "⋮"). Vì nhét `<Button>` vào trong label của `Radio` sẽ vỡ nested-interactive, bản này bỏ `RadioGroup`
 * mà dùng `role="group"` + `aria-pressed` từng nút (đổi lại mất arrow-key roving của radio thật). Nếu card TO
 * có icon + mô tả + badge và cần lưới cột cố định → dùng `SelectableCardGroup`. Nếu vài option luôn nằm gọn 1
 * hàng và không bao giờ wrap → dùng `TabsCard` (`variant="primary"`). Mặc định là cụm NGOÀI card (filter/toolbar rời): option
 * chưa chọn là `ghost` hollow, lấy nền trang hoặc card cha làm surface — không dựng viền/nền riêng cho mỗi lựa chọn.
 */
export const Default: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Cụm nút chọn</Label>
                <Typography type="body-sm" color="muted">
                    Chọn 1-trong-N khi option ngắn gọn và cần wrap xuống hàng — mỗi option là một Button thật, không dựng surface riêng.
                </Typography>
            </div>
            <Controlled items={DIFFICULTY_ITEMS} initialValue="medium" ariaLabel="Chọn độ khó" />
        </div>
    ),
    parameters: {
        usage: "Chọn 1-trong-N khi option ngắn, gọn và cần wrap xuống hàng — mỗi option là một `<Button>` THẬT: "
            + "chiều cao ĐỒNG NHẤT (Button bake sẵn height theo size) và mỗi option có thể kèm nút phụ cùng hàng "
            + "(`itemAction`: xoá, menu \"⋮\"). Vì nhét `<Button>` vào trong label của `Radio` sẽ vỡ nested-interactive, "
            + "bản này bỏ `RadioGroup` mà dùng `role=\"group\"` + `aria-pressed` từng nút (đổi lại mất arrow-key "
            + "roving của radio thật). Nếu card TO có icon + mô tả + badge và cần lưới cột cố định → dùng "
            + "`SelectableCardGroup`. Nếu vài option luôn nằm gọn 1 hàng và không bao giờ wrap → dùng "
            + "`TabsCard` (`variant=\"primary\"`). Mặc định là cụm NGOÀI card (filter/toolbar rời): option chưa chọn là `ghost` "
            + "hollow, lấy nền trang hoặc card cha làm surface — không dựng viền/nền riêng cho mỗi lựa chọn.",
    },
}

/** Dùng khi trong nhóm có 1 lựa chọn CHƯA MỞ (gói/tier khoá) — item đó vẫn hiện nhưng không bấm được, không ẩn khỏi danh sách. */
export const WithDisabledItem: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Có mục khoá</Label>
                <Typography type="body-sm" color="muted">
                    Khi trong nhóm có lựa chọn chưa mở (gói / tier khoá) — item vẫn hiện nhưng không bấm được, không ẩn khỏi danh sách.
                </Typography>
            </div>
            <Controlled items={TIER_ITEMS} initialValue="economy" ariaLabel="Chọn gói" />
        </div>
    ),
    parameters: {
        usage: "Dùng khi trong nhóm có 1 lựa chọn CHƯA MỞ (gói/tier khoá) — item đó vẫn hiện nhưng không bấm được, không ẩn khỏi danh sách.",
    },
}

/** Dùng `trailing` khi cần gắn thêm 1 nút phụ CÙNG HÀNG với các lựa chọn (vd nút "+N" mở rộng overflow), không phải một lựa chọn thật. */
export const WithTrailing: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Có nút phụ cuối hàng</Label>
                <Typography type="body-sm" color="muted">
                    Dùng trailing khi cần gắn thêm một nút phụ cùng hàng với các lựa chọn (vd +N mở rộng overflow), không phải một lựa chọn thật.
                </Typography>
            </div>
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
        </div>
    ),
    parameters: {
        usage: "Dùng `trailing` khi cần gắn thêm 1 nút phụ CÙNG HÀNG với các lựa chọn (vd nút \"+N\" mở rộng overflow), không phải một lựa chọn thật.",
    },
}

/** Dùng `itemAction` khi mỗi lựa chọn cần hành động RIÊNG đi kèm (vd nút xoá + menu "⋮") — cả cụm nối liền thành 1 button group, hành động không làm đổi lựa chọn đang chọn. */
export const WithItemAction: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Mỗi item có hành động riêng</Label>
                <Typography type="body-sm" color="muted">
                    Dùng itemAction khi mỗi lựa chọn cần hành động riêng đi kèm (xoá, menu) — cả cụm nối liền thành một button group.
                </Typography>
            </div>
            <Controlled
                items={ATTEMPT_ITEMS}
                initialValue="attempt-1"
                ariaLabel="Chọn lần làm bài"
                itemAction={(item) => [
                    <Button key="delete" size="sm" variant="tertiary" isIconOnly aria-label={`Xoá ${item.value}`}>
                        <TrashIcon className="size-4" />
                    </Button>,
                    <Button key="more" size="sm" variant="tertiary" isIconOnly aria-label={`Thêm tùy chọn cho ${item.value}`}>
                        <DotsThreeVerticalIcon className="size-4" />
                    </Button>,
                ]}
            />
        </div>
    ),
    parameters: {
        usage: "Dùng `itemAction` khi mỗi lựa chọn cần hành động RIÊNG đi kèm (vd nút xoá + menu \"⋮\") — cả cụm nối liền thành 1 button group, hành động không làm đổi lựa chọn đang chọn.",
    },
}
