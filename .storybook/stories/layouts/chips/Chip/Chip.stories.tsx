import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip } from "@sb-components/layouts/chips/Chip/Chip"
import type { EnumChipEntry } from "@sb-components/layouts/chips/EnumChip/EnumChip"

/**
 * `Chip.*` — compound namespace gom các chip PRIMITIVE cùng tier vào một root
 * (kiểu `Skeleton.*`). Base pill HeroUI dùng alias `HeroChip`; chip DESIGN
 * (Difficulty/AiCategory/Language) KHÔNG nằm ở đây. Mỗi member vẫn có story
 * RIÊNG (Primitives/Chips/<Name>) — story này là INDEX của cả họ.
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
            <Row member="Chip.Status">
                <Chip.Status tone="success" text="Đã đọc" />
                <Chip.Status tone="warning" text="Đang chờ" />
            </Row>
            {/* `Chip.Dot` đã LÊN ATOM (thầy chốt 2026-07-25) — xem
                `Atoms/Chips/Chip/Chip.Dot`. Khác tier nên không nằm trong index này. */}
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
            <Row member="Chip.Tags">
                <Chip.Tags tags={["nestjs", "react"]} />
            </Row>
        </div>
    ),
}
