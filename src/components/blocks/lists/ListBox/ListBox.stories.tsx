import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import type { Key } from "react"
import { Label, ListBox, Typography } from "@heroui/react"

/**
 * `ListBox` + `ListBox.Item` (HeroUI, react-aria) — danh sách CHỌN ĐƯỢC: mỗi dòng là
 * một lựa chọn, bàn phím lên/xuống + Enter chọn, `selectedKeys`/`onSelectionChange`
 * điều khiển state. Khác `RadioGroup` (vài lựa chọn ngắn, luôn thấy nút tròn) — ListBox
 * hợp danh sách DÀI/động (rail lọc, menu chọn mục), mỗi `ListBox.Item` cần `id` +
 * `textValue` để bàn phím và selection hoạt động.
 */
const meta: Meta<typeof ListBox> = {
    title: "Core/List/ListBox",
    component: ListBox,
}
export default meta
type Story = StoryObj<typeof ListBox>

const TOPICS = [
    { id: "array", label: "Mảng" },
    { id: "string", label: "Chuỗi" },
    { id: "hashmap", label: "Bảng băm" },
    { id: "two-pointer", label: "Hai con trỏ" },
    { id: "sliding-window", label: "Cửa sổ trượt" },
]

/** Wrapper giữ state chọn để story bấm được thật (ListBox là controlled qua selectedKeys). */
const ControlledListBox = ({ initial, disabledKeys }: { initial: string; disabledKeys?: string[] }) => {
    const [selected, setSelected] = useState<string>(initial)
    return (
        <ListBox
            aria-label="Chủ đề luyện tập"
            selectionMode="single"
            selectedKeys={[selected]}
            disabledKeys={disabledKeys}
            onSelectionChange={(keys) => {
                const [first] = keys as Set<Key>
                if (first !== undefined) {
                    setSelected(String(first))
                }
            }}
            className="w-64 gap-1 p-0"
        >
            {TOPICS.map((topic) => (
                <ListBox.Item
                    key={topic.id}
                    id={topic.id}
                    textValue={topic.label}
                    className="cursor-pointer rounded-xl px-3 py-2 data-[hovered=true]:bg-default data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent-soft-foreground"
                >
                    {topic.label}
                </ListBox.Item>
            ))}
        </ListBox>
    )
}

/** Danh sách chọn một mục — dùng cho rail lọc/menu chọn khi danh sách dài hoặc động, cần điều hướng bàn phím. */
export const SingleSelect: Story = {
    parameters: {
        usage: "Dùng khi cần một danh sách chọn được, mục đang chọn nổi nền accent; hợp danh sách dài hoặc động (rail lọc chủ đề, menu chọn mục) cần điều hướng bàn phím — khác RadioGroup vốn cho vài lựa chọn ngắn luôn hiện nút tròn.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Chọn một mục</Label>
                <Typography type="body-sm" color="muted">
                    Danh sách dài hoặc động cần chọn một và điều hướng bằng bàn phím.
                </Typography>
            </div>
            <ControlledListBox initial="string" />
        </div>
    ),
}

/** Có mục bị khoá — dùng disabledKeys khi một lựa chọn tồn tại nhưng chưa mở cho người dùng này, vẫn hiện nhưng mờ và không chọn được. */
export const WithDisabledItem: Story = {
    parameters: {
        usage: "Dùng disabledKeys khi một mục tồn tại nhưng chưa mở cho người dùng này, để mục đó vẫn hiện (mờ, không chọn được) thay vì ẩn đi — người dùng biết nó có mà không bấm được.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Có mục bị khoá</Label>
                <Typography type="body-sm" color="muted">
                    Mục khoá vẫn hiện mờ để người dùng biết nó tồn tại.
                </Typography>
            </div>
            <ControlledListBox initial="array" disabledKeys={["sliding-window"]} />
        </div>
    ),
}
