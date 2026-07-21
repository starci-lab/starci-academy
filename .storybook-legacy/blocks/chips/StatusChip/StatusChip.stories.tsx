import type { Meta, StoryObj } from "@storybook/nextjs"
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react"

import { StatusChip } from "@/components/blocks/chips/StatusChip"
import { Gallery, Variant, VariantRow } from "../../../../story-kit"
import { TONES } from "./components"

const meta: Meta<typeof StatusChip> = {
    title: "Legacy/Blocks/Chips/StatusChip",
    component: StatusChip,
    args: {
        children: "Active",
    },
}

export default meta

type Story = StoryObj<typeof StatusChip>

/**
 * Toàn bộ ma trận trạng thái của StatusChip: tone neutral mặc định, 4 tone
 * semantic (success/warning/danger/accent), 2 chip có icon dẫn đầu (chỉ dành
 * cho 2 trạng thái xác định success/error), và chip có nút xoá (removable).
 * Dùng để tra chọn tone theo Ý NGHĨA thật của trạng thái, khi nào được gắn
 * icon, và khi nào dùng onCancel thay icon.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Neutral (mặc định)"
                hint="Dùng cho trạng thái chưa xác định / chưa xử lý — một bản nháp, một mục đang chờ nhập liệu — tone trung tính không gây chú ý."
            >
                <StatusChip tone="neutral">Draft</StatusChip>
            </Variant>
            {TONES.map(({ tone, name, label, desc }) => (
                <Variant key={tone} label={name} hint={desc}>
                    <StatusChip tone={tone}>{label}</StatusChip>
                </Variant>
            ))}
            <Variant
                label="Success + icon"
                hint="Một kết quả thành công hoặc đã xác minh — dùng CheckCircleIcon với tone success, icon dẫn đầu và tĩnh."
            >
                <StatusChip tone="success" icon={<CheckCircleIcon />}>
                    Verified
                </StatusChip>
            </Variant>
            <Variant
                label="Error + icon"
                hint="Một kết quả lỗi hoặc thất bại — dùng XCircleIcon với tone danger, icon dẫn đầu và tĩnh."
            >
                <StatusChip tone="danger" icon={<XCircleIcon />}>
                    Processing error
                </StatusChip>
            </Variant>
            <VariantRow
                label="Có nút xoá (removable)"
                hint="Prop onCancel render một nút X phía sau = ElementCloseButton (bọc HeroUI CloseButton; trong suốt lúc nghỉ + tint theo tone lúc hover, giống Callout). Chip có nút X thì KHÔNG có icon dẫn đầu — một chip chỉ mang icon trạng thái HOẶC nút xoá, không cả hai."
            >
                <StatusChip tone="accent" onCancel={() => {}} cancelLabel="Remove React filter">
                    React
                </StatusChip>
                <StatusChip tone="accent" onCancel={() => {}} cancelLabel="Remove TypeScript filter">
                    TypeScript
                </StatusChip>
                <StatusChip tone="neutral" onCancel={() => {}} cancelLabel="Remove Junior filter">
                    Junior
                </StatusChip>
            </VariantRow>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của StatusChip: tone neutral mặc định cho trạng thái chưa xác định " +
            "(bản nháp, chờ xử lý); 4 tone semantic chọn theo Ý NGHĨA thật của trạng thái trong app — success = " +
            "hoàn thành, warning = sắp đến hạn / cần chú ý, danger = huỷ / lỗi, accent = nổi bật / mới — không " +
            "theo thẩm mỹ; icon dẫn đầu CHỈ dành cho 2 trạng thái xác định (success = CheckCircleIcon tone " +
            "success, error = XCircleIcon tone danger), icon tĩnh, các tone khác không gắn icon; và chip có " +
            "nút xoá qua onCancel (render ElementCloseButton phía sau) — một chip chỉ mang icon trạng thái HOẶC " +
            "nút xoá, không cả hai.",
    },
}
