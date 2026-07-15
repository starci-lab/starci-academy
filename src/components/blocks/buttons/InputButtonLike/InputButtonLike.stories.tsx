import type { Meta, StoryObj } from "@storybook/nextjs"
import { Kbd } from "@heroui/react"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"

import { InputButtonLike } from "./index"

const meta: Meta<typeof InputButtonLike> = {
    title: "Blocks/Button/InputButtonLike",
    component: InputButtonLike,
}
export default meta
type Story = StoryObj<typeof InputButtonLike>

/** Dùng khi cần một ô trông như input nhưng thực chất là nút bấm mở overlay, ví dụ mở hộp thoại tìm kiếm toàn cục. */
export const Default: Story = {
    parameters: { usage: "Dùng khi cần một ô trông như input nhưng thực chất là nút bấm mở overlay, ví dụ mở hộp thoại tìm kiếm toàn cục." },
    render: () => (
        <InputButtonLike
            placeholder="Tìm kiếm khóa học..."
            onPress={() => {}}
            className="w-80"
        />
    ),
}

/** Thêm icon kính lúp mờ phía trước khi ô này đóng vai trò một ô tìm kiếm, giúp người dùng nhận ra ngay chức năng. */
export const WithIcon: Story = {
    parameters: { usage: "Thêm icon kính lúp mờ phía trước khi ô này đóng vai trò một ô tìm kiếm, giúp người dùng nhận ra ngay chức năng." },
    render: () => (
        <InputButtonLike
            icon={<MagnifyingGlassIcon size={16} className="text-field-placeholder" />}
            placeholder="Tìm kiếm khóa học, bài học..."
            onPress={() => {}}
            className="w-80"
        />
    ),
}

/** Gắn gợi ý phím tắt (Kbd) ở lề phải khi có thể mở nhanh bằng bàn phím, ví dụ Cmd K cho tìm kiếm toàn cục. */
export const WithShortcutSuffix: Story = {
    parameters: { usage: "Gắn gợi ý phím tắt (Kbd) ở lề phải khi có thể mở nhanh bằng bàn phím, ví dụ Cmd K cho tìm kiếm toàn cục." },
    render: () => (
        <InputButtonLike
            icon={<MagnifyingGlassIcon size={16} className="text-field-placeholder" />}
            placeholder="Tìm kiếm nhanh..."
            suffix={(
                <Kbd>
                    <Kbd.Content>⌘K</Kbd.Content>
                </Kbd>
            )}
            onPress={() => {}}
            className="w-80"
        />
    ),
}

/** Khi nhãn placeholder dài hơn bề rộng cho phép, chữ bị cắt gọn một dòng (truncate) thay vì đẩy vỡ layout. */
export const LongPlaceholderTruncates: Story = {
    parameters: { usage: "Khi nhãn placeholder dài hơn bề rộng cho phép, chữ bị cắt gọn một dòng (truncate) thay vì đẩy vỡ layout." },
    render: () => (
        <InputButtonLike
            icon={<MagnifyingGlassIcon size={16} className="text-field-placeholder" />}
            placeholder="Tìm kiếm khóa học Fullstack, System Design, DevOps và nhiều nội dung khác..."
            onPress={() => {}}
            className="w-64"
        />
    ),
}
