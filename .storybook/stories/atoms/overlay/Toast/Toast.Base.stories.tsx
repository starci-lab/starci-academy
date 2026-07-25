import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button as HeroButton } from "@heroui/react"
import { Toast } from "@sb-components/atoms/overlay/Toast/Toast"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Toast.Base> = {
    title: "Atoms/Overlay/Toast/Toast.Base",
    component: Toast.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Toast.Base>

// Toast KHÔNG portal (bọc Alert render inline) → mọi part được badge on-render.
const BASE_PARTS: Array<AnatomyNode> = [
    { name: "Icon", tier: "atom", role: "chỉ báo status (Alert.Indicator) — icon gravity theo `status`" },
    { name: "Content", tier: "atom", role: "cụm text (Alert.Content)" },
    { name: "Title", tier: "atom", role: "dòng tiêu đề (Alert.Title) — prop `title`" },
    { name: "Description", tier: "atom", role: "dòng phụ (Alert.Description) — prop `description`" },
]
const ACTION_PARTS: Array<AnatomyNode> = [
    { name: "Icon", tier: "atom", role: "chỉ báo status (Alert.Indicator) — icon gravity theo `status`" },
    { name: "Content", tier: "atom", role: "cụm text (Alert.Content)" },
    { name: "Title", tier: "atom", role: "dòng tiêu đề (Alert.Title) — prop `title`" },
    { name: "Description", tier: "atom", role: "dòng phụ (Alert.Description) — prop `description`" },
    { name: "Action", tier: "atom", role: "hành động phụ (prop `action`) — đặt trước ×" },
    { name: "Close", tier: "atom", role: "nút × (prop `onClose`) — gravity Xmark, tone muted" },
]

/** Success — chấm/lưu thành công. */
export const Success: Story = {
    render: () => (
        <div className="max-w-md p-8">
            <BlockAnatomy
                name="Toast.Base"
                tier="atom"
                leaf="Success"
                parts={BASE_PARTS}
                reason="Atom toast/notification DUY NHẤT bọc HeroUI Alert; atom map status→tone + tự chọn icon (đúng valence), consumer chỉ truyền title/description."
                note="status=success → tint success + CircleCheck (gravity). Toast 100% prop dữ liệu — không có children."
                code={"<Toast.Base status=\"success\" title=\"Đã lưu\" description=\"Bài nộp đã được ghi nhận.\" />"}
            >
                <Toast.Base status="success" title="Đã lưu bài nộp" description="Kết quả chấm sẽ có sau ít phút." showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Warning — cảnh báo nhẹ (vẫn tiếp tục được). */
export const Warning: Story = {
    render: () => (
        <div className="max-w-md p-8">
            <BlockAnatomy
                name="Toast.Base"
                tier="atom"
                leaf="Warning"
                parts={BASE_PARTS}
                note="status=warning → tint warning + TriangleExclamation."
                code={"<Toast.Base status=\"warning\" title=\"Sắp hết hạn\" description=\"Đề đóng sau 10 phút.\" />"}
            >
                <Toast.Base status="warning" title="Sắp hết thời gian" description="Đề sẽ tự nộp sau 10 phút nữa." showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Danger — lỗi/thất bại. */
export const Danger: Story = {
    render: () => (
        <div className="max-w-md p-8">
            <BlockAnatomy
                name="Toast.Base"
                tier="atom"
                leaf="Danger"
                parts={BASE_PARTS}
                note="status=danger → tint danger + CircleXmark."
                code={"<Toast.Base status=\"danger\" title=\"Nộp thất bại\" description=\"Kiểm tra kết nối rồi thử lại.\" />"}
            >
                <Toast.Base status="danger" title="Nộp bài thất bại" description="Không kết nối được máy chủ. Thử lại sau." showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Info — thông tin trung tính (tint accent). */
export const Info: Story = {
    render: () => (
        <div className="max-w-md p-8">
            <BlockAnatomy
                name="Toast.Base"
                tier="atom"
                leaf="Info"
                parts={BASE_PARTS}
                note="status=info → tint accent + CircleInfo (info fold về accent)."
                code={"<Toast.Base status=\"info\" title=\"Có bản cập nhật\" description=\"Nội dung khoá vừa được làm mới.\" />"}
            >
                <Toast.Base status="info" title="Nội dung vừa cập nhật" description="Bài học có phiên bản mới, tải lại để xem." showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** WithAction — kèm nút hành động + nút đóng ×. */
export const WithAction: Story = {
    render: () => (
        <div className="max-w-md p-8">
            <BlockAnatomy
                name="Toast.Base"
                tier="atom"
                leaf="WithAction"
                parts={ACTION_PARTS}
                note="`action` (nút) đặt trước ×; `onClose` bật × (gravity Xmark). `action` là NỘI DUNG ReactNode — được giữ, khác với children."
                code={"<Toast.Base status=\"info\" title=\"Đã xoá thẻ\" action={<Button>Hoàn tác</Button>} onClose={fn} />"}
            >
                <Toast.Base
                    status="info"
                    title="Đã xoá thẻ ghi nhớ"
                    action={
                        <HeroButton size="sm" variant="tertiary">
                            Hoàn tác
                        </HeroButton>
                    }
                    onClose={() => {}}
                    closeLabel="Đóng thông báo"
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}
