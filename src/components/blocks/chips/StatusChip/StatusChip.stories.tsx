import type { Meta, StoryObj } from "@storybook/nextjs"
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react"

import { StatusChip } from "./index"
import type { StatusChipProps } from "./index"

const meta: Meta<typeof StatusChip> = {
    title: "Blocks/Chip/StatusChip",
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

const TONES: { tone: NonNullable<StatusChipProps["tone"]>; label: string }[] = [
    { tone: "success", label: "Đã hoàn thành" },
    { tone: "warning", label: "Sắp hết hạn" },
    { tone: "danger", label: "Đã huỷ" },
    { tone: "accent", label: "Nổi bật" },
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
        <div className="flex flex-col gap-4">
            {TONES.map(({ tone, label }) => (
                <StatusChip key={tone} tone={tone}>
                    {label}
                </StatusChip>
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
        <div className="flex flex-col items-start gap-3">
            <StatusChip tone="success" icon={<CheckCircleIcon />}>
                Đã xác minh
            </StatusChip>
            <StatusChip tone="danger" icon={<XCircleIcon />}>
                Lỗi xử lý
            </StatusChip>
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
