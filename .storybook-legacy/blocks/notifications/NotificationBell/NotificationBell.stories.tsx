import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { NotificationBell } from "@/components/blocks/notifications/NotificationBell"
import { Gallery, Variant } from "../../../../story-kit"
import { SAMPLE_GROUPS } from "./components"

const meta: Meta<typeof NotificationBell> = {
    title: "Legacy/Blocks/Notifications/NotificationBell",
    component: NotificationBell,
}
export default meta
type Story = StoryObj<typeof NotificationBell>

/**
 * Local controlled wrapper — each gallery specimen owns its own open/close
 * state (via `isOpen` + `onOpenChange`), so opening one does not affect its
 * neighbours in the gallery.
 */
const NotificationBellDemo = ({
    unreadCount,
    defaultOpen,
}: {
    unreadCount: number
    defaultOpen: boolean
}) => {
    const [isOpen, setOpen] = useState(defaultOpen)
    return (
        <div className="flex min-h-[420px] items-start justify-end pr-2">
            <NotificationBell
                unreadCount={unreadCount}
                groups={SAMPLE_GROUPS}
                onMarkAllRead={() => {}}
                isOpen={isOpen}
                onOpenChange={setOpen}
            />
        </div>
    )
}

/**
 * Every real badge/panel state the bell renders: an unread count that opens
 * the date-grouped popover, a count of zero (badge fully hidden), and a
 * count past the cap threshold ("9+"). `isOpen` is controlled, so each
 * specimen below owns its own `useState`.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Use in the navbar: a bell button with an unread-count badge that opens a popover of recent notifications on click. The badge is hidden at 0 and caps at '9+' past the threshold. Supports both controlled (isOpen + onOpenChange) and uncontrolled use.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Có thông báo chưa đọc (popover mở)"
                hint="Badge hiện số lượng chưa đọc; popover đang mở để thấy danh sách gom theo ngày (Hôm nay/Trước đó) bên trong."
            >
                <NotificationBellDemo unreadCount={3} defaultOpen />
            </Variant>
            <Variant
                label="Không có thông báo chưa đọc"
                hint="unreadCount = 0 — badge ẩn hoàn toàn, chỉ còn icon chuông trơn."
            >
                <NotificationBellDemo unreadCount={0} defaultOpen={false} />
            </Variant>
            <Variant
                label="Vượt ngưỡng đếm — hiện '9+'"
                hint="unreadCount lớn hơn ngưỡng (9) — badge hiển thị '9+' thay vì số thật, tránh badge quá dài."
            >
                <NotificationBellDemo unreadCount={15} defaultOpen={false} />
            </Variant>
        </Gallery>
    ),
}
