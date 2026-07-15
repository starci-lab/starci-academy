import type { Meta, StoryObj } from "@storybook/nextjs"
import { useEffect } from "react"
import { Label, Typography } from "@heroui/react"
import { TopLoader } from "./index"

const meta: Meta<typeof TopLoader> = {
    title: "Core/Layout/TopLoader",
    component: TopLoader,
}
export default meta
type Story = StoryObj<typeof TopLoader>

/** Kích hoạt một điều hướng giả (pushState) ngay sau khi mount, để minh hoạ
 *  thanh loader đang chạy thay vì đứng yên vô hình. */
const TriggerNavigation = () => {
    useEffect(() => {
        window.history.pushState({}, "", window.location.href)
    }, [])
    return <TopLoader />
}

/** Ép `prefers-reduced-motion: reduce` rồi kích hoạt điều hướng giả, để minh
 *  hoạ nhánh không hiệu ứng trickle. */
const TriggerReducedMotion = () => {
    useEffect(() => {
        const original = window.matchMedia
        window.matchMedia = (query: string) =>
            ({
                ...original(query),
                matches: query.includes("prefers-reduced-motion"),
            }) as MediaQueryList
        window.history.pushState({}, "", window.location.href)
        return () => {
            window.matchMedia = original
        }
    }, [])
    return <TopLoader />
}

/** Dùng cho điều hướng GIỮA các trang, khi nội dung cũ vẫn còn đó đọc được — chỉ một sợi chỉ ở mép trên báo "đang tải", không che gì cả. Lần nạp đầu tiên (cold load, chưa có gì trên màn) thì ngược lại: dùng AppSplash che trọn màn. Gắn đúng một lần ở gốc layout; nó tự nghe điều hướng chứ không nhận prop nào. */
export const Default: Story = {
    parameters: { usage: "Dùng cho điều hướng GIỮA các trang, khi nội dung cũ vẫn còn đó đọc được — chỉ một sợi chỉ ở mép trên báo \"đang tải\", không che gì cả. Lần nạp đầu tiên (cold load, chưa có gì trên màn) thì ngược lại: dùng AppSplash che trọn màn. Gắn đúng một lần ở gốc layout; nó tự nghe điều hướng chứ không nhận prop nào." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Đứng yên</Label>
                <Typography type="body-sm" color="muted">
                    trạng thái thường trực khi không có điều hướng nào đang chạy: thanh không render gì. Mép trên trống là ĐÚNG — block chỉ xuất hiện đúng lúc chờ route, còn lại không chiếm một pixel nào.
                </Typography>
            </div>
            <TopLoader />
        </div>
    ),
}

/** Dùng để soi nhánh đang chạy: thanh bò dần tới 90% rồi dừng chờ, vì không ai biết route mất bao lâu — nó báo "đang chạy", không hứa còn bao nhiêu phần trăm. */
export const Navigating: Story = {
    parameters: { usage: "Dùng để soi nhánh đang chạy: thanh bò dần tới 90% rồi dừng chờ, vì không ai biết route mất bao lâu — nó báo \"đang chạy\", không hứa còn bao nhiêu phần trăm." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Đang điều hướng</Label>
                <Typography type="body-sm" color="muted">
                    trạng thái sau khi người dùng bấm một liên kết: story tự bắn một điều hướng giả lúc mount để thanh chạy thật. Nhìn mép trên của khung xem trước, không phải chỗ này.
                </Typography>
            </div>
            <TriggerNavigation />
        </div>
    ),
}

/** Dùng để soi nhánh giảm chuyển động: thanh bỏ hẳn phần bò mượt, nhảy thẳng tới một mức rồi đứng — vẫn báo được là đang tải mà không có gì trườn trong tầm mắt ngoại vi. */
export const ReducedMotion: Story = {
    parameters: { usage: "Dùng để soi nhánh giảm chuyển động: thanh bỏ hẳn phần bò mượt, nhảy thẳng tới một mức rồi đứng — vẫn báo được là đang tải mà không có gì trườn trong tầm mắt ngoại vi." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Giảm chuyển động</Label>
                <Typography type="body-sm" color="muted">
                    trạng thái khi thiết bị bật prefers-reduced-motion: khác nhánh trên ở chỗ thanh đứng im một mức thay vì bò. Story ép cờ này rồi mới bắn điều hướng giả, nên không cần đổi cài đặt hệ điều hành để xem.
                </Typography>
            </div>
            <TriggerReducedMotion />
        </div>
    ),
}
