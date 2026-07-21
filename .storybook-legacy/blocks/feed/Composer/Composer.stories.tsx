import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { PaperclipIcon } from "@phosphor-icons/react"
import { Composer } from "@/components/blocks/feed/Composer"
import { Gallery, Variant } from "../../../../story-kit"
import { Controlled } from "./components"

const meta: Meta<typeof Composer> = {
    title: "Legacy/Blocks/Feed/Composer",
    component: Composer,
}
export default meta
type Story = StoryObj<typeof Composer>

/**
 * Toàn bộ ma trận trạng thái của Composer: rỗng (Send bị khoá), đang gõ nhiều dòng
 * (field tự giãn cao, có nút đính kèm), và đang gửi (Send hoá spinner, khoá luôn cả
 * phím tắt Ctrl/Cmd+Enter). Dùng để tra khi nào Send bật/khoá và hành vi auto-grow.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Rỗng"
                hint="Trạng thái khởi tạo của composer: chưa gõ gì thì nút Send bị khoá, chỉ mở lại khi đã có nội dung; Ctrl/Cmd+Enter cũng chỉ gửi được khi có nội dung."
            >
                <Controlled initialValue="" />
            </Variant>
            <Variant
                label="Đang gõ"
                hint="Đã có nội dung nhiều dòng: nút Send được bật, field tự giãn cao đúng theo số dòng thay vì cuộn nội bộ, và slot đính kèm nằm ngay trước nút Send."
            >
                <Controlled
                    initialValue={"I have a question about the data denormalization part of this week's lesson.\nI'm not sure when I should split the table out."}
                    attachSlot={(
                        <Button size="sm" variant="tertiary" isIconOnly aria-label="Attach">
                            <PaperclipIcon aria-hidden focusable="false" className="size-4" />
                        </Button>
                    )}
                />
            </Variant>
            <Variant
                label="Đang gửi"
                hint="Trong lúc một lượt gửi đang chạy: nút Send chuyển thành spinner và bị khoá, phím tắt Ctrl/Cmd+Enter cũng bị chặn để tránh gửi trùng."
            >
                <Controlled initialValue="I'll send this question, thank you." isSubmitting />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của Composer: rỗng (Send khoá tới khi có nội dung), đang gõ nhiều dòng " +
            "(field tự giãn cao theo số dòng, có nút đính kèm), và đang gửi (Send hoá spinner, khoá cả " +
            "Ctrl/Cmd+Enter). Dùng để tra khi nào Send bật/khoá và hành vi auto-grow khi gõ nhiều dòng.",
    },
}
