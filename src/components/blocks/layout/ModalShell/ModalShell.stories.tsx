import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import { Button, Label, Tabs, Typography } from "@heroui/react"

import { ModalShell } from "./index"

const meta: Meta<typeof ModalShell> = {
    title: "Blocks/Layout/ModalShell",
    component: ModalShell,
}
export default meta
type Story = StoryObj<typeof ModalShell>

const ControlledModal = ({
    label,
    trigger,
    description,
    children,
    ...rest
}: {
    /** Story-level Label naming the STATE this demo shows. */
    label: string
    /** Trigger copy — the modal opens on mount, this reopens it after a close. */
    trigger: string
    /** When this state is the right one, per §2b. */
    description: string
    children: React.ReactNode
} & Omit<React.ComponentProps<typeof ModalShell>, "isOpen" | "onOpenChange" | "children">) => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>{label}</Label>
                <Typography type="body-sm" color="muted">
                    {description}
                </Typography>
            </div>
            <Button variant="secondary" size="sm" className="self-start" onClick={() => setIsOpen(true)}>
                {trigger}
            </Button>
            <ModalShell isOpen={isOpen} onOpenChange={setIsOpen} {...rest}>
                {children}
            </ModalShell>
        </div>
    )
}

/** Dùng cho modal xác nhận/form đơn giản: chỉ cần truyền `title` dạng chuỗi, phần header tự canh khoảng chừa chỗ nút đóng. */
export const Default: Story = {
    parameters: { usage: "Dùng khi cần CHẶN người dùng lại để họ trả lời một câu rồi mới đi tiếp — xác nhận một hành động không hoàn tác được, hoặc một form ngắn. Chỉ cần báo tin rồi thôi thì dùng toast; nội dung đọc song song với trang thì dùng Drawer. Block lo phần vỏ (header, nút đóng, khoảng chừa), caller chỉ truyền `title`." },
    render: () => (
        <ControlledModal
            label="Tiêu đề dạng chuỗi"
            trigger="Mở modal"
            description="ca thường gặp nhất: header chỉ có một dòng chữ nên truyền title dạng chuỗi, block tự chừa chỗ để nút đóng không đè lên tiêu đề."
            title="Xác nhận huỷ ghi danh"
        >
            <Typography type="body-sm" color="muted">
                Bạn sẽ mất toàn bộ tiến độ học của khoá này. Hành động này không thể hoàn tác.
            </Typography>
            <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm">Đóng</Button>
                <Button variant="danger" size="sm">Huỷ ghi danh</Button>
            </div>
        </ControlledModal>
    ),
}

/** Dùng khi một dòng tiêu đề không đủ để người dùng biết mình đang thao tác lên cái gì — cần thêm ngữ cảnh (khoá nào, trạng thái nào) ngay trên header. Đủ một dòng thì dùng `title` ở story Default, đừng với tay `header` cho việc mà chuỗi làm được. */
export const CustomHeader: Story = {
    parameters: { usage: "Dùng khi một dòng tiêu đề không đủ để người dùng biết mình đang thao tác lên cái gì — cần thêm ngữ cảnh (khoá nào, trạng thái nào) ngay trên header. Đủ một dòng thì dùng `title` ở story Default, đừng với tay `header` cho việc mà chuỗi làm được." },
    render: () => (
        <ControlledModal
            label="Header tuỳ chỉnh"
            trigger="Mở modal có header tuỳ chỉnh"
            description="khác nhánh title dạng chuỗi ở chỗ header là node do caller dựng, nên phải TỰ chừa chỗ cho nút đóng — đó là lý do có pr-8 trong ví dụ này."
            header={
                <div className="flex flex-col gap-1 pr-8">
                    <Typography type="body" weight="semibold">Mời học viên</Typography>
                    <Typography type="body-xs" color="muted">Khoá Fullstack Mastery</Typography>
                </div>
            }
        >
            <Typography type="body-sm" color="muted">
                Nhập email học viên, mỗi dòng một địa chỉ.
            </Typography>
        </ControlledModal>
    ),
}

/** Dùng khi nội dung dài hơn màn hình và người dùng cần biết mình vẫn đang ở trong hộp thoại nào khi cuộn — `scroll="inside"` giữ header đứng yên, chỉ thân trôi. Để mặc định thì cả modal trôi theo trang và tiêu đề cuộn mất, người dùng cuộn giữa chừng sẽ mất mốc. */
export const ScrollableBody: Story = {
    parameters: { usage: "Dùng khi nội dung dài hơn màn hình và người dùng cần biết mình vẫn đang ở trong hộp thoại nào khi cuộn — `scroll=\"inside\"` giữ header đứng yên, chỉ thân trôi. Để mặc định thì cả modal trôi theo trang và tiêu đề cuộn mất, người dùng cuộn giữa chừng sẽ mất mốc." },
    render: () => (
        <ControlledModal
            label="Thân cuộn riêng"
            trigger="Mở modal cuộn dài"
            description="trạng thái khi nội dung dài hơn màn: thân tự cuộn còn header ở lại. Cuộn thử trong hộp thoại để thấy tiêu đề không nhúc nhích."
            title="Lịch sử giao dịch"
            size="lg"
            scroll="inside"
        >
            {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between border-b border-default py-2">
                    <Typography type="body-sm">Giao dịch #{1000 + index}</Typography>
                    <Typography type="body-sm" color="muted">1.200.000đ</Typography>
                </div>
            ))}
        </ControlledModal>
    ),
}

/** Dùng khi thứ ĐẦU TIÊN trong thân là một dải tab — bật `bodyStartsWithTabs` để tab nằm sát header như một phần của nó, thay vì trôi lửng giữa khoảng trắng của thân. Thân mở đầu bằng chữ hay form thì để mặc định. */
export const WithLeadingTabs: Story = {
    parameters: { usage: "Dùng khi thứ ĐẦU TIÊN trong thân là một dải tab — bật `bodyStartsWithTabs` để tab nằm sát header như một phần của nó, thay vì trôi lửng giữa khoảng trắng của thân. Thân mở đầu bằng chữ hay form thì để mặc định." },
    render: () => (
        <ControlledModal
            label="Thân mở đầu bằng tab"
            trigger="Mở modal có tab"
            description="khác các nhánh trên ở đúng một khoảng cách: header xuống tab thu về gap-3 thay vì gap-6, để dải tab đọc như thuộc về header chứ không phải một khối rời."
            title="Cài đặt thông báo"
            bodyStartsWithTabs
        >
            <Tabs defaultSelectedKey="email">
                <Tabs.ListContainer>
                    <Tabs.List aria-label="Kênh thông báo">
                        <Tabs.Tab id="email">Email</Tabs.Tab>
                        <Tabs.Tab id="push">Đẩy</Tabs.Tab>
                    </Tabs.List>
                </Tabs.ListContainer>
            </Tabs>
            <Typography type="body-sm" color="muted">
                Chọn kênh nhận thông báo khi có bài học mới.
            </Typography>
        </ControlledModal>
    ),
}
