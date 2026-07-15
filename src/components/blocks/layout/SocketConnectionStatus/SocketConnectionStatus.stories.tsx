import type { Meta, StoryObj } from "@storybook/nextjs"
import { useEffect } from "react"
import { Label, Typography } from "@heroui/react"
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
}
export default meta
type Story = StoryObj<typeof SocketConnectionStatus>

/** Dùng khi mất realtime là chuyện KHÔNG chặn được việc gì — app vẫn chạy tiếp qua HTTP, nên đây là pill báo tin trôi qua rồi thôi, không phải Modal chặn hay toast lỗi bắt người dùng bấm. Mất kết nối mà thật sự chặn thao tác thì đó là việc của Modal, không phải block này. */
export const Default: Story = {
    parameters: { usage: "Dùng khi mất realtime là chuyện KHÔNG chặn được việc gì — app vẫn chạy tiếp qua HTTP, nên đây là pill báo tin trôi qua rồi thôi, không phải Modal chặn hay toast lỗi bắt người dùng bấm. Mất kết nối mà thật sự chặn thao tác thì đó là việc của Modal, không phải block này." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Kết nối bình thường</Label>
                <Typography type="body-sm" color="muted">
                    trạng thái thường trực: mọi socket đều sống nên pill không render gì cả. Khung dưới đây trống là ĐÚNG — block chỉ lên tiếng khi có sự cố, không chiếm chỗ thường xuyên để báo mọi thứ vẫn ổn.
                </Typography>
            </div>
            <SocketScenario scenario="stable" />
        </div>
    ),
}

/** Dùng để soi nhánh "mất kết nối": pill chỉ hiện sau khi socket chết lâu hơn khoảng ân hạn 2 giây, nên một cú chớp mạng ngắn không bao giờ làm nó nhảy ra. */
export const Down: Story = {
    name: "Đang kết nối lại",
    parameters: { usage: "Dùng để soi nhánh \"mất kết nối\": pill chỉ hiện sau khi socket chết lâu hơn khoảng ân hạn 2 giây, nên một cú chớp mạng ngắn không bao giờ làm nó nhảy ra." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Đang kết nối lại</Label>
                <Typography type="body-sm" color="muted">
                    trạng thái sau khi socket chết quá 2 giây ân hạn: pill hiện và ở lại cho tới khi nối lại được. Chờ khoảng 2 giây sau khi mở story thì nó mới xuất hiện — đó chính là khoảng ân hạn đang chạy thật.
                </Typography>
            </div>
            <SocketScenario scenario="drop" />
        </div>
    ),
}

/** Dùng để soi nhánh "đã nối lại": pill tự đổi sang xác nhận rồi tự ẩn sau 1,5 giây, người dùng không phải bấm gì để đóng. */
export const Recovered: Story = {
    name: "Đã kết nối lại",
    parameters: { usage: "Dùng để soi nhánh \"đã nối lại\": pill tự đổi sang xác nhận rồi tự ẩn sau 1,5 giây, người dùng không phải bấm gì để đóng." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Đã kết nối lại</Label>
                <Typography type="body-sm" color="muted">
                    trạng thái đóng vòng: sau khi nối lại, pill xác nhận 1,5 giây rồi tự biến mất. Story chạy trọn kịch bản mất rồi nối lại nên phải chờ vài giây mới thấy đủ ba chặng ẩn, mất, xác nhận.
                </Typography>
            </div>
            <SocketScenario scenario="recover" />
        </div>
    ),
}
