import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import { Button, Tabs, Typography } from "@heroui/react"

import { ModalShell } from "./index"

const meta: Meta<typeof ModalShell> = {
    title: "Blocks/Layout/ModalShell",
    component: ModalShell,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof ModalShell>

const ControlledModal = ({
    label,
    children,
    ...rest
}: {
    label: string
    children: React.ReactNode
} & Omit<React.ComponentProps<typeof ModalShell>, "isOpen" | "onOpenChange" | "children">) => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <>
            <Button variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
                {label}
            </Button>
            <ModalShell isOpen={isOpen} onOpenChange={setIsOpen} {...rest}>
                {children}
            </ModalShell>
        </>
    )
}

/** Dùng cho modal xác nhận/form đơn giản: chỉ cần truyền `title` dạng chuỗi, phần header tự canh khoảng chừa chỗ nút đóng. */
export const Default: Story = {
    parameters: { usage: "Dùng cho modal xác nhận/form đơn giản: chỉ cần truyền title dạng chuỗi, phần header tự canh khoảng chừa chỗ nút đóng." },
    render: () => (
        <ControlledModal label="Mở modal" title="Xác nhận huỷ ghi danh">
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

/** Dùng khi header cần nhiều hơn một dòng tiêu đề (ví dụ kèm subtitle hoặc chip trạng thái) — truyền hẳn node qua `header` thay vì `title`. */
export const CustomHeader: Story = {
    parameters: { usage: "Dùng khi header cần nhiều hơn một dòng tiêu đề (ví dụ kèm subtitle hoặc chip trạng thái) — truyền hẳn node qua header thay vì title." },
    render: () => (
        <ControlledModal
            label="Mở modal có header tuỳ chỉnh"
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

/** Dùng cho modal dài (danh sách, bảng dữ liệu) cần cuộn riêng phần thân trong khi header đứng yên — kết hợp `size="lg"` và `scroll="inside"`. */
export const ScrollableBody: Story = {
    parameters: { usage: "Dùng cho modal dài (danh sách, bảng dữ liệu) cần cuộn riêng phần thân trong khi header đứng yên — kết hợp size=\"lg\" và scroll=\"inside\"." },
    render: () => (
        <ControlledModal
            label="Mở modal cuộn dài"
            title="Lịch sử giao dịch"
            size="lg"
            scroll="inside"
        >
            {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between border-b border-default-200 py-2">
                    <Typography type="body-sm">Giao dịch #{1000 + index}</Typography>
                    <Typography type="body-sm" color="muted">1.200.000đ</Typography>
                </div>
            ))}
        </ControlledModal>
    ),
}

/** Dùng khi nội dung modal mở đầu bằng dải tab — bật `bodyStartsWithTabs` để khoảng cách header→tab thu hẹp về `gap-3` thay vì `gap-6`. */
export const WithLeadingTabs: Story = {
    parameters: { usage: "Dùng khi nội dung modal mở đầu bằng dải tab — bật bodyStartsWithTabs để khoảng cách header→tab thu hẹp về gap-3 thay vì gap-6." },
    render: () => (
        <ControlledModal
            label="Mở modal có tab"
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
