import React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Label, Typography } from "@heroui/react"
import { ConfirmDialog } from "."

/**
 * `ConfirmDialog` — hộp thoại xác nhận cho hành động không hoàn tác được (huỷ ghi
 * danh, xoá bài nộp) dựng trên HeroUI `AlertDialog`. Controlled: `isOpen` +
 * `onOpenChange` do call-site giữ. `tone="danger"` tô nút xác nhận thành nút phá
 * huỷ (variant `danger`) cho việc xoá/hoàn tác. Tier-3 thuần trình bày — nút xác
 * nhận KHÔNG tự đóng thoại; call-site đóng qua `onOpenChange` sau khi hành động
 * xong (async giữ thoại mở bằng `isConfirming`).
 */
const meta: Meta<typeof ConfirmDialog> = {
    title: "Core/Feedback/ConfirmDialog",
    component: ConfirmDialog,
}
export default meta
type Story = StoryObj<typeof ConfirmDialog>

/** Bọc controlled cho demo — nút mở thoại, thoại tự đóng khi xác nhận/huỷ. */
const Controlled = ({
    tone = "default",
    triggerLabel,
    title,
    description,
    confirmLabel,
}: {
    tone?: "default" | "danger"
    triggerLabel: string
    title: React.ReactNode
    description?: React.ReactNode
    confirmLabel?: string
}) => {
    const [isOpen, setOpen] = React.useState(false)
    return (
        <>
            <Button
                variant={tone === "danger" ? "danger" : "primary"}
                onPress={() => setOpen(true)}
            >
                {triggerLabel}
            </Button>
            <ConfirmDialog
                isOpen={isOpen}
                onOpenChange={setOpen}
                tone={tone}
                title={title}
                description={description}
                confirmLabel={confirmLabel}
                onConfirm={() => setOpen(false)}
            />
        </>
    )
}

/** Xác nhận thường: tone mặc định, nút xác nhận primary — cho lựa chọn không phá huỷ. */
export const DefaultConfirm: Story = {
    parameters: {
        usage:
            "Xác nhận thông thường (không phá huỷ) — `tone=\"default\"`, nút xác nhận là primary. Dùng khi cần " +
            "chốt một lựa chọn quan trọng nhưng vẫn hoàn tác được. `title` là câu hỏi ngắn, `description` nói rõ " +
            "điều sẽ xảy ra. Nút xác nhận không tự đóng thoại — call-site đóng qua `onOpenChange` sau khi xử lý.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Xác nhận thường</Label>
                <Typography type="body-sm" color="muted">
                    Bấm nút để mở thoại — lựa chọn quan trọng nhưng không phá huỷ.
                </Typography>
            </div>
            <Controlled
                triggerLabel="Nộp bài kiểm tra"
                title="Nộp bài kiểm tra này?"
                description="Sau khi nộp, bạn không sửa được câu trả lời cho tới khi có kết quả chấm."
                confirmLabel="Nộp bài"
            />
        </div>
    ),
}

/** Xác nhận phá huỷ: `tone="danger"`, nút xác nhận danger — cho xoá / hoàn tác. */
export const DestructiveDelete: Story = {
    parameters: {
        usage:
            "Hành động phá huỷ (xoá / hoàn tác không lấy lại được) — `tone=\"danger\"` tô nút xác nhận thành variant " +
            "`danger` và icon chuyển đỏ. `description` phải nói rõ HẬU QUẢ (\"không khôi phục được\") để lựa chọn " +
            "có đủ thông tin. Async thì truyền `isConfirming` để nút hiện spinner và chặn bấm lặp.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Xác nhận phá huỷ</Label>
                <Typography type="body-sm" color="muted">
                    Bấm nút để mở thoại — hành động xoá vĩnh viễn, nút xác nhận đỏ.
                </Typography>
            </div>
            <Controlled
                tone="danger"
                triggerLabel="Xoá bài nộp"
                title="Xoá bài nộp này?"
                description="Bài nộp sẽ bị xoá vĩnh viễn và không khôi phục được."
                confirmLabel="Xoá bài nộp"
            />
        </div>
    ),
}
