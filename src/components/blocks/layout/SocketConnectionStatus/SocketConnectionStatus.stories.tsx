import type { Meta, StoryObj } from "@storybook/nextjs"
import { useEffect } from "react"
import { SocketConnectionStatus } from "./index"
import { useSocketConnectionStore } from "@/hooks/socketio/connectionStore"

/**
 * Drives the real connection store through a timeline so the pill's debounced
 * phases (hidden → down → recovered → hidden) show up exactly as they would in
 * the app, without faking the component's own state.
 */
const SocketScenario = ({ scenario }: { scenario: "stable" | "drop" | "recover" }) => {
    useEffect(() => {
        const { setStatus } = useSocketConnectionStore.getState()
        const timers: Array<ReturnType<typeof setTimeout>> = []

        if (scenario === "drop") {
            setStatus("job_notifications", "disconnected")
        } else if (scenario === "recover") {
            setStatus("job_notifications", "disconnected")
            timers.push(
                setTimeout(() => setStatus("job_notifications", "connected"), 2200),
            )
        }

        return () => {
            timers.forEach(clearTimeout)
            setStatus("job_notifications", "connected")
        }
    }, [scenario])

    return <SocketConnectionStatus />
}

const meta: Meta<typeof SocketConnectionStatus> = {
    title: "Blocks/Layout/SocketConnectionStatus",
    component: SocketConnectionStatus,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof SocketConnectionStatus>

/** Trạng thái mặc định khi mọi socket realtime đều kết nối bình thường — pill không hiển thị gì cả. */
export const Default: Story = {
    parameters: { usage: "Trạng thái mặc định khi mọi socket realtime đều kết nối bình thường — pill không hiển thị gì cả." },
    render: () => <SocketScenario scenario="stable" />,
}

/** Khi một socket mất kết nối lâu hơn khoảng ân hạn, pill hiện "đang kết nối lại" để người dùng biết dữ liệu realtime tạm gián đoạn. */
export const DangKetNoiLai: Story = {
    parameters: { usage: "Khi một socket mất kết nối lâu hơn khoảng ân hạn, pill hiện \"đang kết nối lại\" để người dùng biết dữ liệu realtime tạm gián đoạn." },
    render: () => <SocketScenario scenario="drop" />,
}

/** Sau khi socket kết nối lại thành công, pill xác nhận "đã kết nối lại" trong chốc lát rồi tự ẩn, trấn an người dùng mà không cần thao tác gì. */
export const DaKetNoiLai: Story = {
    parameters: { usage: "Sau khi socket kết nối lại thành công, pill xác nhận \"đã kết nối lại\" trong chốc lát rồi tự ẩn, trấn an người dùng mà không cần thao tác gì." },
    render: () => <SocketScenario scenario="recover" />,
}
