import type { Meta, StoryObj } from "@storybook/nextjs"
import { Kbd, Label, Typography } from "@heroui/react"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"

import { InputButtonLike } from "./index"

const meta: Meta<typeof InputButtonLike> = {
    title: "Core/Button/InputButtonLike",
    component: InputButtonLike,
}
export default meta
type Story = StoryObj<typeof InputButtonLike>

/** Dùng khi cần một ô trông như input nhưng thực chất là nút bấm mở overlay, ví dụ mở hộp thoại tìm kiếm toàn cục. */
export const Default: Story = {
    parameters: { usage: "Dùng khi cần một ô trông như input nhưng thực chất là nút bấm mở overlay, ví dụ mở hộp thoại tìm kiếm toàn cục." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Mặc định</Label>
                <Typography type="body-sm" color="muted">
                    Cần một ô TRÔNG như input nhưng thực chất là nút mở overlay. Không gõ được vào đây — cần gõ thật thì dùng Input.
                </Typography>
            </div>
            <InputButtonLike
                placeholder="Tìm kiếm khóa học..."
                onPress={() => {}}
                className="w-80"
            />
        </div>
    ),
}

/** Thêm icon kính lúp mờ phía trước khi ô này đóng vai trò một ô tìm kiếm, giúp người dùng nhận ra ngay chức năng. */
export const WithIcon: Story = {
    parameters: { usage: "Thêm icon kính lúp mờ phía trước khi ô này đóng vai trò một ô tìm kiếm, giúp người dùng nhận ra ngay chức năng." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Có icon</Label>
                <Typography type="body-sm" color="muted">
                    Ô đóng vai trò tìm kiếm — icon kính lúp cho người dùng nhận ra chức năng trước cả khi đọc chữ.
                </Typography>
            </div>
            <InputButtonLike
                icon={<MagnifyingGlassIcon size={16} className="text-field-placeholder" />}
                placeholder="Tìm kiếm khóa học, bài học..."
                onPress={() => {}}
                className="w-80"
            />
        </div>
    ),
}

/** Gắn gợi ý phím tắt (Kbd) ở lề phải khi có thể mở nhanh bằng bàn phím, ví dụ Cmd K cho tìm kiếm toàn cục. */
export const WithShortcutSuffix: Story = {
    parameters: { usage: "Gắn gợi ý phím tắt (Kbd) ở lề phải khi có thể mở nhanh bằng bàn phím, ví dụ Cmd K cho tìm kiếm toàn cục." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Có gợi ý phím tắt</Label>
                <Typography type="body-sm" color="muted">
                    Overlay mở được bằng bàn phím — Kbd ở lề phải dạy phím tắt ngay tại chỗ, không bắt người dùng đi tìm.
                </Typography>
            </div>
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
        </div>
    ),
}

/** Khi nhãn placeholder dài hơn bề rộng cho phép, chữ bị cắt gọn một dòng (truncate) thay vì đẩy vỡ layout. */
export const LongPlaceholderTruncates: Story = {
    parameters: { usage: "Khi nhãn placeholder dài hơn bề rộng cho phép, chữ bị cắt gọn một dòng (truncate) thay vì đẩy vỡ layout." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Placeholder dài bị cắt</Label>
                <Typography type="body-sm" color="muted">
                    Kiểm placeholder dài hơn bề rộng cho phép: cắt gọn một dòng thay vì đẩy vỡ layout.
                </Typography>
            </div>
            <InputButtonLike
                icon={<MagnifyingGlassIcon size={16} className="text-field-placeholder" />}
                placeholder="Tìm kiếm khóa học Fullstack, System Design, DevOps và nhiều nội dung khác..."
                onPress={() => {}}
                className="w-64"
            />
        </div>
    ),
}
