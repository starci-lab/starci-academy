import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import { FlexWrapCardRadio } from "./index"
import type { FlexWrapCardRadioColor, FlexWrapCardRadioItem } from "./index"

const meta: Meta<typeof FlexWrapCardRadio> = {
    title: "Blocks/Navigation/FlexWrapCardRadio",
    component: FlexWrapCardRadio,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof FlexWrapCardRadio>

const colorItems: Array<FlexWrapCardRadioItem<string>> = [
    { value: "monthly", content: <span>Hàng tháng</span> },
    { value: "quarterly", content: <span>Hàng quý</span> },
    { value: "yearly", content: <span>Hàng năm</span> },
]

const colorVariants: Array<{ color: FlexWrapCardRadioColor; label: string }> = [
    { color: "accent", label: "accent — trung tính, lựa chọn mặc định" },
    { color: "success", label: "success — trạng thái tích cực (đã duyệt)" },
    { color: "danger", label: "danger — trạng thái tiêu cực (từ chối)" },
    { color: "warning", label: "warning — cần chú ý (chờ xử lý)" },
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

/** So sánh cả bốn token màu selected-state (accent/success/danger/warning) cạnh nhau để chọn màu khớp ý nghĩa nghiệp vụ của nhóm lựa chọn. */
export const AllColors: Story = {
    parameters: { usage: "Dùng khi cần đối chiếu bốn token màu selected-state cạnh nhau để chọn màu phản ánh đúng ý nghĩa nghiệp vụ: accent trung tính cho lựa chọn mặc định, còn success/danger/warning khi bản thân lựa chọn mang ý nghĩa trạng thái." },
    render: () => (
        <div className="flex flex-col gap-4">
            {colorVariants.map(({ color, label }) => (
                <div key={color} className="flex flex-col gap-1">
                    <span className="text-xs text-muted">{label}</span>
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
