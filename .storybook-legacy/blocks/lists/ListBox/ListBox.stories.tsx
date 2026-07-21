import type { Meta, StoryObj } from "@storybook/nextjs"
import { ListBox } from "@heroui/react"
import { ControlledListBox } from "./components"
import { Gallery, Variant } from "../../../../story-kit"

/**
 * `ListBox` + `ListBox.Item` (HeroUI, react-aria) — a SELECTABLE list: each row is a
 * choice, up/down keys + Enter select, and `selectedKeys`/`onSelectionChange` control
 * the state. Unlike `RadioGroup` (a few short choices, always showing radio buttons),
 * ListBox suits LONG/dynamic lists (filter rail, item picker); each `ListBox.Item` needs
 * an `id` + `textValue` for keyboard and selection to work.
 */
const meta: Meta<typeof ListBox> = {
    title: "Primitives/Form/ListBox",
    component: ListBox,
}
export default meta
type Story = StoryObj<typeof ListBox>

/**
 * Toàn bộ trạng thái của ListBox: chọn đơn bình thường và có item bị khoá bằng
 * disabledKeys. Dùng để tra khi nào chọn ListBox thay RadioGroup, và cách hiện một
 * lựa chọn tồn tại nhưng chưa mở khoá cho user.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Chọn đơn"
                hint="Danh sách dài hoặc động cần chọn một mục và điều hướng bằng bàn phím — item được chọn nổi lên với nền accent; khác RadioGroup (vài lựa chọn ngắn, luôn hiện nút radio)."
            >
                <ControlledListBox initial="string" />
            </Variant>
            <Variant
                label="Có item bị khoá"
                hint="Dùng disabledKeys khi một lựa chọn tồn tại nhưng chưa mở khoá cho user này — item vẫn hiện (mờ đi, không bấm được) để user biết nó tồn tại, thay vì ẩn hẳn."
            >
                <ControlledListBox initial="array" disabledKeys={["sliding-window"]} />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ trạng thái của ListBox: chọn đơn cho danh sách dài/động cần điều hướng " +
            "bàn phím, và item bị khoá bằng disabledKeys khi một lựa chọn tồn tại nhưng chưa mở " +
            "khoá cho user (vẫn hiện, mờ, không bấm được, thay vì ẩn hẳn).",
    },
}
