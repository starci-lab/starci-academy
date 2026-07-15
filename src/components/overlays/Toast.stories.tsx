import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, ToastProvider, toast } from "@heroui/react"
import { CheckCircleIcon, InfoIcon, WarningIcon, XCircleIcon } from "@phosphor-icons/react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

/**
 * `toast` — thông báo TRANSIENT (tự tắt) cho kết quả một hành động: đã lưu / nộp OK /
 * lỗi / cảnh báo. Gọi MỆNH LỆNH `toast.<status>(title, { description })`, KHÔNG render
 * như component. Cần một `<ToastProvider />` mount 1 lần ở layout (app: `InnerLayout`);
 * story tự mount nó để demo. Lỗi CẦN người xử lý bắt buộc → dùng `Callout`/inline, không toast.
 */
const meta: Meta = {
    title: "Core/Overlays/Toast",
}

export default meta

type Story = StoryObj

// Phosphor status glyphs (size-6) passed as the `indicator` — the SAME icon family
// as Callout/Alert, never HeroUI toast's own internal icon fallback. This is the
// reference the app's toasts should follow (per-status Phosphor + status colour).
const fire = {
    success: () =>
        toast.success("Đã lưu tiến độ", {
            description: "Bài học được đồng bộ tự động.",
            indicator: <CheckCircleIcon className="size-6 text-success-soft-foreground" />,
        }),
    danger: () =>
        toast.danger("Nộp bài thất bại", {
            description: "Không kết nối được GitHub. Thử lại.",
            indicator: <XCircleIcon className="size-6 text-danger-soft-foreground" />,
        }),
    warning: () =>
        toast.warning("Sắp hết hạn nộp bài", {
            description: "Milestone đóng sau 2 ngày nữa.",
            indicator: <WarningIcon className="size-6 text-warning-soft-foreground" />,
        }),
    info: () =>
        toast.info("Có bản cập nhật khoá học", {
            description: "3 bài học mới trong lộ trình.",
            indicator: <InfoIcon className="size-6 text-accent-soft-foreground" />,
        }),
}

/** Bấm từng nút để bắn toast theo status — mỗi status là 1 sắc thái (thành công/lỗi/cảnh báo/thông tin). */
export const Default: Story = {
    parameters: {
        usage: "Thông báo transient: `toast.<status>(title, { description })`. status = success/danger/warning/info. Cần `<ToastProvider/>` mount ở layout.",
    },
    render: () => (
        <>
            <ToastProvider />
            <div className="flex flex-wrap gap-3">
                <Button size="sm" variant="secondary" onPress={fire.success}>
                    success
                </Button>
                <Button size="sm" variant="secondary" onPress={fire.danger}>
                    danger
                </Button>
                <Button size="sm" variant="secondary" onPress={fire.warning}>
                    warning
                </Button>
                <Button size="sm" variant="secondary" onPress={fire.info}>
                    info
                </Button>
            </div>
        </>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(await canvas.findByRole("button", { name: "success" }))
        await waitFor(() => expect(screen.getByText("Đã lưu tiến độ")).toBeInTheDocument())
    },
}
