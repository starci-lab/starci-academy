import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label } from "@heroui/react"
import { useState } from "react"
import { FlexWrapCardRadio } from "./index"
import type { FlexWrapCardRadioColor, FlexWrapCardRadioItem } from "./index"

const meta: Meta<typeof FlexWrapCardRadio> = {
    title: "Blocks/Navigation/FlexWrapCardRadio",
    component: FlexWrapCardRadio,
}
export default meta
type Story = StoryObj<typeof FlexWrapCardRadio>

const colorItems: Array<FlexWrapCardRadioItem<string>> = [
    { value: "monthly", content: <span>Hàng tháng</span> },
    { value: "quarterly", content: <span>Hàng quý</span> },
    { value: "yearly", content: <span>Hàng năm</span> },
]

const colorVariants: Array<{ color: FlexWrapCardRadioColor; label: string }> = [
    { color: "accent", label: "Accent — trung tính, lựa chọn mặc định" },
    { color: "success", label: "Success — trạng thái tích cực (đã duyệt)" },
    { color: "danger", label: "Danger — trạng thái tiêu cực (từ chối)" },
    { color: "warning", label: "Warning — cần chú ý (chờ xử lý)" },
]

const levelItems: Array<FlexWrapCardRadioItem<string>> = [
    { value: "junior", content: <span>Junior</span> },
    { value: "middle", content: <span>Middle</span> },
    { value: "senior", content: <span>Senior</span> },
    { value: "staff", content: <span>Staff</span>, isDisabled: true },
]

const langItems: Array<FlexWrapCardRadioItem<string>> = [
    { value: "ts", content: <span>TypeScript</span> },
    { value: "java", content: <span>Java</span> },
    { value: "csharp", content: <span>C#</span> },
    { value: "go", content: <span>Go</span> },
]

const Controlled = ({
    items,
    initialValue,
    ariaLabel,
    color,
    trailing,
}: {
    items: Array<FlexWrapCardRadioItem<string>>
    initialValue: string
    ariaLabel: string
    color?: FlexWrapCardRadioColor
    trailing?: React.ReactNode
}) => {
    const [value, setValue] = useState(initialValue)
    return (
        <FlexWrapCardRadio
            items={items}
            value={value}
            onChange={setValue}
            ariaLabel={ariaLabel}
            color={color}
            trailing={trailing}
        />
    )
}

/**
 * Chọn 1-trong-N khi option ngắn, gọn và cần wrap xuống hàng — mỗi option là một box card nhỏ có viền và nền
 * riêng, nên hợp khi cụm chọn đứng trên nền trang trần (thẻ tự dựng surface cho chính nó). Đây là `RadioGroup`
 * thật: arrow-key roving, single-select, focus ring. Nếu option cần chiều cao ĐỒNG NHẤT, hoặc mỗi option cần nút
 * phụ riêng cùng hàng (xoá, menu "⋮") → dùng `FlexWrapButtonRadio` (nhét `<Button>` vào trong label của `Radio`
 * sẽ vỡ nested-interactive, nên bản button bỏ `RadioGroup` mà dùng `role="group"` + `aria-pressed`). Nếu card TO
 * có icon + mô tả + badge và cần lưới cột cố định → dùng `SelectableCardGroup`. Nếu vài option luôn nằm gọn 1
 * hàng và không bao giờ wrap → dùng `SegmentedControl`. Bốn token màu selected-state: `accent` cho lựa chọn
 * trung tính mặc định; `success`/`danger`/`warning` chỉ khi bản thân lựa chọn mang nghĩa trạng thái.
 */
export const AllColors: Story = {
    parameters: {
        usage: "Chọn 1-trong-N khi option ngắn, gọn và cần wrap xuống hàng — mỗi option là một box card nhỏ có "
            + "viền và nền riêng, nên hợp khi cụm chọn đứng trên nền trang trần (thẻ tự dựng surface cho chính nó). "
            + "Đây là `RadioGroup` thật: arrow-key roving, single-select, focus ring. Nếu option cần chiều cao ĐỒNG "
            + "NHẤT, hoặc mỗi option cần nút phụ riêng cùng hàng (xoá, menu \"⋮\") → dùng `FlexWrapButtonRadio` "
            + "(nhét `<Button>` vào trong label của `Radio` sẽ vỡ nested-interactive, nên bản button bỏ `RadioGroup` "
            + "mà dùng `role=\"group\"` + `aria-pressed`). Nếu card TO có icon + mô tả + badge và cần lưới cột cố "
            + "định → dùng `SelectableCardGroup`. Nếu vài option luôn nằm gọn 1 hàng và không bao giờ wrap → dùng "
            + "`SegmentedControl`. Bốn token màu selected-state: `accent` cho lựa chọn trung tính mặc định; "
            + "`success`/`danger`/`warning` chỉ khi bản thân lựa chọn mang nghĩa trạng thái.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            {colorVariants.map(({ color, label }) => (
                <div key={color} className="flex flex-col gap-3">
                    <Label>{label}</Label>
                    <Controlled
                        items={colorItems}
                        initialValue="quarterly"
                        ariaLabel={`Chọn chu kỳ thanh toán (màu ${color})`}
                        color={color}
                    />
                </div>
            ))}
        </div>
    ),
}

/** Dùng khi một số lựa chọn tạm thời chưa khả dụng (ví dụ hạng chưa mở khoá) nhưng vẫn cần hiển thị để người dùng biết lộ trình. */
export const WithDisabledItem: Story = {
    parameters: { usage: "Dùng khi một số lựa chọn tạm thời chưa khả dụng (ví dụ hạng chưa mở khoá) nhưng vẫn cần hiển thị để người dùng biết lộ trình." },
    render: () => <Controlled items={levelItems} initialValue="middle" ariaLabel="Chọn cấp độ phỏng vấn" color="warning" />,
}

/** Dùng khi cần thêm một thẻ hành động (ví dụ "+N ngôn ngữ khác") đi kèm nhóm chọn, nằm cùng hàng và cùng xuống dòng nhưng không tính là một lựa chọn. */
export const WithTrailingAction: Story = {
    parameters: { usage: "Dùng khi cần thêm một thẻ hành động (ví dụ \"+N ngôn ngữ khác\") đi kèm nhóm chọn, nằm cùng hàng và cùng xuống dòng nhưng không tính là một lựa chọn." },
    render: () => (
        <Controlled
            items={langItems}
            initialValue="ts"
            ariaLabel="Chọn ngôn ngữ lập trình"
            color="accent"
            trailing={
                <button type="button" className="rounded-xl border border-default bg-surface px-3 py-2 text-sm text-muted hover:bg-default">
                    +3 ngôn ngữ khác
                </button>
            }
        />
    ),
}
