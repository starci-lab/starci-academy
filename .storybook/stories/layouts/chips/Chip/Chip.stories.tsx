import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip } from "@sb-components/layouts/chips/Chip/Chip"
import type { EnumChipEntry } from "@sb-components/layouts/chips/EnumChip/EnumChip"

/**
 * `Chip.*` — compound namespace gom các chip PRIMITIVE cùng tier vào một root
 * (kiểu `Skeleton.*`). Base pill HeroUI dùng alias `HeroChip`; chip DESIGN
 * (Difficulty/AiCategory/Language) KHÔNG nằm ở đây. Mỗi member vẫn có story
 * RIÊNG (Primitives/Chips/<Name>) — story này là INDEX của cả họ.
 *
 * ⚠️ 2026-07-26: hai hàng `Chip.Status` và `Chip.Tags` đã rời index này. Chip trạng
 * thái giờ là `Chip.Base tone=…` và hàng tag là `Chip.Group`, cả hai thuộc tầng
 * ATOM — xem `Atoms/Chips/Chip`. Index này chỉ giữ chip đúng tier của nó.
 */
const meta: Meta = {
    title: "Layouts/Chips/Chip",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj

type OrderStatus = "pending" | "paid"
const ORDER_STATUS_MAP: Record<OrderStatus, EnumChipEntry> = {
    pending: { label: "Chờ xác nhận" },
    paid: { color: "success", label: "Đã thanh toán" },
}

/** One labelled row = one `Chip.<Member>` so the namespace reads as a family index. */
const Row = ({ member, children }: { member: string; children: ReactNode }) => (
    <div className="flex items-center gap-3">
        <code className="w-40 shrink-0 font-mono text-xs text-muted">{member}</code>
        <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
)

/** Gallery — mỗi member của `Chip.*` một hàng, nhãn = tên truy cập compound. */
export const Gallery: Story = {
    render: () => (
        <div className="flex flex-col gap-3 p-8">
            {/* `Chip.Status` (2026-07-26) và chip chấm (2026-07-25) đều đã LÊN ATOM, và ở
                đó chúng gộp thành MỘT viên: `Chip.Base tone=…` / `Chip.Base dotClassName=…`.
                Khác tier nên không nằm trong index này — xem `Atoms/Chips/Chip`. */}
            <Row member="Chip.Enum">
                <Chip.Enum<OrderStatus> value="paid" map={ORDER_STATUS_MAP} />
                <Chip.Enum<OrderStatus> value="pending" map={ORDER_STATUS_MAP} />
            </Row>
            <Row member="Chip.Highlight">
                <Chip.Highlight value={24} label="Module" />
            </Row>
            {/* `Chip.HostPlatform` đã BỎ (2026-07-25): `HostPlatformChip` là tier
                DESIGN (_designs/chips), xem `Design/Chips/HostPlatformChip`. */}
            <Row member="Chip.Removable">
                <Chip.Removable label="Acme Corp" />
            </Row>
            {/* `Chip.Tags` đã thành `Chip.Group` ở tầng ATOM (2026-07-26): hàng tag có
                HÀNH VI thật (đếm · cắt tại maxVisible · chip `+N` mở tooltip) nên nó
                không bị xoá như `StatusChip`, chỉ chuyển nhà. Xem `Atoms/Chips/Chip`. */}
        </div>
    ),
}
