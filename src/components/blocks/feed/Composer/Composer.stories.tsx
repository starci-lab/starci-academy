import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Label, Typography } from "@heroui/react"
import { PaperclipIcon } from "@phosphor-icons/react"
import { Composer } from "./index"

const meta: Meta<typeof Composer> = {
    title: "Block/Feed/Composer",
    component: Composer,
}
export default meta
type Story = StoryObj<typeof Composer>

/** Ảnh avatar mẫu dùng cho slot dẫn đầu, cố định để story không phụ thuộc dữ liệu thật. */
const avatarSrc = "https://i.pravatar.cc/80?img=12"

/**
 * Wrapper sở hữu state cục bộ của bản nháp, mô phỏng đúng luồng controlled: giá trị nằm ở
 * cha, Composer chỉ soi lại + tự giãn chiều cao + bắn callback. onSubmit ở đây chỉ xoá nháp.
 */
const Controlled = ({
    initialValue,
    isSubmitting,
    attachSlot,
}: {
    initialValue: string
    isSubmitting?: boolean
    attachSlot?: ReactNode
}) => {
    const [value, setValue] = useState(initialValue)

    return (
        <Composer
            value={value}
            onChange={setValue}
            onSubmit={() => setValue("")}
            placeholder="Nhắn gì đó cho trợ giảng..."
            avatarSrc={avatarSrc}
            isSubmitting={isSubmitting}
            attachSlot={attachSlot}
        />
    )
}

/** Dùng khi ô soạn còn trống: nút Gửi bị vô hiệu hoá cho tới khi có nội dung, tránh gửi rỗng. */
export const Empty: Story = {
    parameters: { usage: "Dùng cho trạng thái khởi đầu của ô soạn tin: chưa gõ gì thì nút Gửi bị khoá, gõ vào mới bật. Ctrl/Cmd+Enter cũng gửi được khi đã có nội dung." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Ô soạn trống</Label>
                <Typography type="body-sm" color="muted">
                    Chưa có nội dung nên nút Gửi bị vô hiệu hoá; gõ một ký tự bất kỳ là nút bật lại.
                </Typography>
            </div>
            <Controlled initialValue="" />
        </div>
    ),
}

/** Dùng khi viewer đang gõ dở một tin nhiều dòng: ô tự giãn cao theo nội dung, nút Gửi đã bật. */
export const Typing: Story = {
    parameters: { usage: "Dùng khi đã có nội dung nháp: nút Gửi bật, ô tự giãn chiều cao theo số dòng thay vì cuộn bên trong. Slot đính kèm đứng trước nút Gửi." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Đang gõ</Label>
                <Typography type="body-sm" color="muted">
                    Có nội dung nhiều dòng: ô textarea tự cao lên vừa khít, nút Gửi sẵn sàng, có thêm nút đính kèm ở cụm hành động.
                </Typography>
            </div>
            <Controlled
                initialValue={"Cho mình hỏi phần khử chuẩn hoá dữ liệu trong bài học tuần này.\nMình chưa rõ khi nào nên tách bảng ra."}
                attachSlot={(
                    <Button size="sm" variant="tertiary" isIconOnly aria-label="Đính kèm">
                        <PaperclipIcon aria-hidden focusable="false" className="size-4" />
                    </Button>
                )}
            />
        </div>
    ),
}

/** Dùng khi tin đang được gửi đi: nút Gửi hiện spinner và bị khoá, Ctrl/Cmd+Enter cũng bị chặn để không gửi trùng. */
export const Submitting: Story = {
    parameters: { usage: "Dùng khi một lần gửi đang bay: nút Gửi đổi sang spinner và bị vô hiệu hoá, phím tắt Ctrl/Cmd+Enter bị bỏ qua để chặn gửi trùng." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Đang gửi</Label>
                <Typography type="body-sm" color="muted">
                    Trong lúc gửi, nút chuyển sang spinner và khoá lại; người dùng không thể bấm hay dùng phím tắt để gửi lần nữa.
                </Typography>
            </div>
            <Controlled initialValue="Mình gửi câu hỏi này nhé, cảm ơn thầy." isSubmitting />
        </div>
    ),
}
