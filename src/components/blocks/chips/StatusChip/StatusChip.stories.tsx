import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react"

import { StatusChip } from "./index"
import type { StatusChipProps } from "./index"

const meta: Meta<typeof StatusChip> = {
    title: "Block/Chip/StatusChip",
    component: StatusChip,
    args: {
        children: "Đang hoạt động",
    },
}

export default meta

type Story = StoryObj<typeof StatusChip>

/**
 * Dùng cho trạng thái "chưa xác định/chưa xử lý" — bản nháp, item chờ nhập liệu — tông trung tính không gây chú ý.
 */
export const Default: Story = {
    parameters: {
        usage:
            "Dùng cho trạng thái \"chưa xác định/chưa xử lý\" — bản nháp, item chờ nhập liệu — tông trung tính không gây chú ý.",
    },
    args: {
        tone: "neutral",
        children: "Nháp",
    },
}

const TONES: {
    tone: NonNullable<StatusChipProps["tone"]>
    name: string
    label: string
    desc: string
}[] = [
    {
        tone: "success",
        name: "Success",
        label: "Đã hoàn thành",
        desc: "Trạng thái đã xong, thành công — item đã hoàn tất hoặc đã xác minh, kết quả tích cực.",
    },
    {
        tone: "warning",
        name: "Warning",
        label: "Sắp hết hạn",
        desc: "Trạng thái cần chú ý, sắp hết hạn — nhắc người dùng xử lý trước khi trễ, chưa phải lỗi.",
    },
    {
        tone: "danger",
        name: "Danger",
        label: "Đã huỷ",
        desc: "Trạng thái đã huỷ hoặc lỗi — kết quả tiêu cực, không thể tiếp tục.",
    },
    {
        tone: "accent",
        name: "Accent",
        label: "Nổi bật",
        desc: "Trạng thái nổi bật hoặc mới — muốn kéo chú ý mà không mang nghĩa cảnh báo hay thành công.",
    },
]

/**
 * Chọn tone theo Ý NGHĨA trạng thái thật trong app: success = đã xong, warning = sắp hết hạn/cần chú ý, danger = đã huỷ/lỗi, accent = nổi bật/mới — không chọn theo thẩm mỹ.
 */
export const Tones: Story = {
    parameters: {
        usage:
            "Chọn tone theo Ý NGHĨA trạng thái thật trong app: success = đã xong, warning = sắp hết hạn/cần chú ý, danger = đã huỷ/lỗi, accent = nổi bật/mới — không chọn theo thẩm mỹ.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            {TONES.map(({ tone, name, label, desc }) => (
                <div key={tone} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <Label>{name}</Label>
                        <Typography type="body-sm" color="muted">
                            {desc}
                        </Typography>
                    </div>
                    <StatusChip tone={tone}>{label}</StatusChip>
                </div>
            ))}
        </div>
    ),
}

/**
 * Chip CÓ icon = CHỈ cho 2 status DỨT KHOÁT, icon LEADING (đầu), tĩnh:
 * - thành công / đã xác minh → `CheckCircleIcon` (circle-check) THẬT của Phosphor + tone `success`.
 * - lỗi / thất bại → `XCircleIcon` (circle-x) + tone `danger`.
 * KHÔNG bare `CheckIcon`/`XIcon`, KHÔNG hand-roll SVG (icon.md §2 — dấu đạt/lỗi = circle).
 * Các tone khác (neutral/warning/accent) KHÔNG icon. Component tự ép icon size-4.
 */
export const WithIcon: Story = {
    parameters: {
        usage:
            "Chip có icon chỉ cho 2 status dứt khoát: thành công = `CheckCircleIcon` (circle-check, tone success), lỗi = `XCircleIcon` (circle-x, tone danger). Icon leading, tĩnh. Tone khác không icon.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Thành công</Label>
                    <Typography type="body-sm" color="muted">
                        Kết quả thành công hoặc đã xác minh — dùng CheckCircleIcon với tone success, icon leading tĩnh.
                    </Typography>
                </div>
                <StatusChip tone="success" icon={<CheckCircleIcon />}>
                    Đã xác minh
                </StatusChip>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Lỗi</Label>
                    <Typography type="body-sm" color="muted">
                        Kết quả lỗi hoặc thất bại — dùng XCircleIcon với tone danger, icon leading tĩnh.
                    </Typography>
                </div>
                <StatusChip tone="danger" icon={<XCircleIcon />}>
                    Lỗi xử lý
                </StatusChip>
            </div>
        </div>
    ),
}

/**
 * Chip GỠ ĐƯỢC (filter/tag): prop `onCancel` → nút X TRAILING (cuối) bấm để gỡ/huỷ chip.
 * Nút X = block chung **`ElementCloseButton`** (wrap HeroUI `CloseButton`): trong-suốt
 * lúc-nghỉ + hover tô nền theo TONE của chip — CÙNG một cách với dismiss của `Callout`
 * (không còn mỗi chỗ style hover một kiểu). Luật: chip có X-gỡ thì **KHÔNG có icon status
 * leading** — 1 chip mang HOẶC status icon HOẶC X-gỡ, không cả hai (truyền cả `icon` lẫn
 * `onCancel` thì icon bị bỏ).
 */
export const Removable: Story = {
    parameters: {
        usage:
            "Chip gỡ được: `onCancel` render nút X trailing = `ElementCloseButton` (block chung, wrap HeroUI `CloseButton`; trong-suốt lúc nghỉ + hover tint theo tone chip, giống Callout). Chip có X-gỡ thì KHÔNG icon leading (mang HOẶC status icon HOẶC X-gỡ).",
    },
    render: () => (
        <div className="flex flex-wrap items-start gap-2">
            <StatusChip tone="accent" onCancel={() => {}} cancelLabel="Gỡ bộ lọc React">
                React
            </StatusChip>
            <StatusChip tone="accent" onCancel={() => {}} cancelLabel="Gỡ bộ lọc TypeScript">
                TypeScript
            </StatusChip>
            <StatusChip tone="neutral" onCancel={() => {}} cancelLabel="Gỡ bộ lọc Junior">
                Junior
            </StatusChip>
        </div>
    ),
}
