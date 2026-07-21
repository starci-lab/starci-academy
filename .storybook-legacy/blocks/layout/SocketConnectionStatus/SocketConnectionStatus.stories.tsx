import type { Meta, StoryObj } from "@storybook/nextjs"
import { SocketConnectionStatus } from "@/components/blocks/layout/SocketConnectionStatus"
import { Variant } from "../../../../story-kit"
import { SocketScenario } from "./components"

const meta: Meta<typeof SocketConnectionStatus> = {
    title: "Features/Realtime/SocketConnectionStatus",
    component: SocketConnectionStatus,
}
export default meta
type Story = StoryObj<typeof SocketConnectionStatus>

/**
 * Use when losing realtime doesn't BLOCK anything — the app keeps running over HTTP, so this is a
 * notifying toast (in the same `ToastProvider` queue as every other toast), not a blocking Modal.
 * If a disconnect truly blocks an action, that's a job for a Modal, not this block.
 *
 * The block itself renders nothing (`return null`) and is mounted exactly once, globally — it only
 * drives the shared toast queue. That makes it the same shape as TopLoader/AppSplash: each phase
 * stays its OWN export instead of a `<Gallery>`, because stacking multiple live scenarios side by
 * side would mount several `ToastProvider`s at once and their timers would race/overlap the same
 * toast slot.
 */
export const Default: Story = {
    parameters: {
        usage: "Use when losing realtime doesn't BLOCK anything — the app keeps running over HTTP, so this is a notifying toast (in the same `ToastProvider` queue as every other toast), not a blocking Modal. If a disconnect truly blocks an action, that's a job for a Modal, not this block.",
    },
    render: () => (
        <Variant
            label="Ổn định"
            hint="Trạng thái bình thường: mọi socket đều sống, không toast nào bật lên. Canvas rỗng là ĐÚNG — block chỉ lên tiếng khi có sự cố, không chiếm chỗ liên tục để báo mọi thứ vẫn ổn."
        >
            <SocketScenario scenario="stable" />
        </Variant>
    ),
}

/**
 * Use to inspect the "disconnected" branch: the toast only appears after the socket has been dead
 * longer than the 2-second grace period, so a brief network blip never makes it pop out.
 */
export const Down: Story = {
    name: "Reconnecting",
    parameters: {
        usage: "Use to inspect the \"disconnected\" branch: the warning toast only appears after the socket has been dead longer than the 2-second grace period (`timeout: 0` — it stays until reconnected), so a brief network blip never makes it pop out.",
    },
    render: () => (
        <Variant
            label="Đang kết nối lại"
            hint="Toast warning chỉ hiện sau khi socket chết quá 2 giây (grace period, `timeout: 0` — ở lại tới khi kết nối lại). Đợi khoảng 2 giây sau khi mở story để thấy toast xuất hiện — đó là grace period đang chạy thật."
        >
            <SocketScenario scenario="drop" />
        </Variant>
    ),
}

/**
 * Use to inspect the "reconnected" branch: the toast switches to success on its own, then auto-hides
 * after 1.5 seconds; the user doesn't have to click anything to close it.
 */
export const Recovered: Story = {
    name: "Reconnected",
    parameters: {
        usage: "Use to inspect the \"reconnected\" branch: close the warning toast, fire a success toast, then auto-hide after 1.5 seconds — the user doesn't have to click anything to close it.",
    },
    render: () => (
        <Variant
            label="Đã kết nối lại"
            hint="Sau khi kết nối lại, toast tự chuyển sang success rồi tự ẩn sau 1.5 giây — người dùng không cần bấm gì để đóng. Story chạy trọn kịch bản rớt-rồi-hồi, đợi vài giây để thấy đủ 3 pha: ẩn, rớt, xác nhận."
        >
            <SocketScenario scenario="recover" />
        </Variant>
    ),
}
