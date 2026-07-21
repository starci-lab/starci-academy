import type { Meta, StoryObj } from "@storybook/nextjs"
import { CheckCircleIcon, ClockIcon, PackageIcon, XCircleIcon } from "@phosphor-icons/react"
import { EnumChip } from "@/components/blocks/chips/EnumChip"
import type { EnumChipEntry } from "@/components/blocks/chips/EnumChip"
import { Gallery, Variant, VariantRow } from "../../../../story-kit"

const meta: Meta<typeof EnumChip> = {
    title: "Legacy/Blocks/Chip/EnumChip",
    component: EnumChip,
}

export default meta
type Story = StoryObj<typeof EnumChip>

/** Trạng thái đơn hàng dùng làm enum mẫu cho toàn bộ gallery dưới đây. */
type OrderStatus = "pending" | "paid" | "shipped" | "cancelled" | "refunded"

/** Map cơ bản: mỗi trạng thái trỏ một màu + label, không icon, không tooltip. */
const ORDER_STATUS_MAP: Record<OrderStatus, EnumChipEntry> = {
    pending: {
        label: "Chờ xác nhận",
    },
    paid: {
        color: "success",
        label: "Đã thanh toán",
    },
    shipped: {
        color: "accent",
        label: "Đang giao",
    },
    cancelled: {
        color: "danger",
        label: "Đã hủy",
    },
    refunded: {
        color: "warning",
        label: "Hoàn tiền",
    },
}

/** Cùng map trên nhưng mỗi entry thêm một icon dẫn đầu do caller tự chọn. */
const ORDER_STATUS_ICON_MAP: Record<OrderStatus, EnumChipEntry> = {
    pending: {
        label: "Chờ xác nhận",
        icon: <ClockIcon className="size-3.5" />,
    },
    paid: {
        color: "success",
        label: "Đã thanh toán",
        icon: <CheckCircleIcon className="size-3.5" />,
    },
    shipped: {
        color: "accent",
        label: "Đang giao",
        icon: <PackageIcon className="size-3.5" />,
    },
    cancelled: {
        color: "danger",
        label: "Đã hủy",
        icon: <XCircleIcon className="size-3.5" />,
    },
    refunded: {
        color: "warning",
        label: "Hoàn tiền",
    },
}

/** Chỉ trạng thái "Hoàn tiền" có tooltip — label ngắn không đủ giải thích chính sách hoàn tiền. */
const ORDER_STATUS_TOOLTIP_MAP: Record<OrderStatus, EnumChipEntry> = {
    ...ORDER_STATUS_MAP,
    refunded: {
        color: "warning",
        label: "Hoàn tiền",
        tooltip: "Tiền được hoàn về ví trong 3-5 ngày làm việc kể từ khi đơn bị hủy",
    },
}

/**
 * Toàn bộ state của EnumChip trong một gallery: map màu theo enum, icon dẫn đầu
 * tự chọn kích thước, và tooltip khi label ngắn không đủ giải thích. Không có
 * state loading/error/disabled/selected — EnumChip chỉ render một `value` tra
 * trong `map`, không tự quản state; và không stateful (không có onChange) nên
 * không cần bản `Controlled`.
 */
export const AllVariants: Story = {
    parameters: {
        usage:
            "Xem toàn bộ cách EnumChip biến một map enum→màu/label thành chip: chọn màu theo Ý NGHĨA thật của trạng thái (không theo vị trí trong enum, để hai domain khác nhau không lệch màu nhau), thêm icon khi cần nhận diện nhanh bằng mắt, và thêm tooltip khi label ngắn (như \"Hoàn tiền\") cần một câu giải thích thêm lúc hover. Giá trị enum không có trong map sẽ throw ở render — dùng Partial<Record> khi domain cố ý bỏ qua vài giá trị (như HostPlatformChip bỏ qua `Other`).",
    },
    render: () => (
        <Gallery>
            <VariantRow
                label="Map màu cơ bản (không icon, không tooltip)"
                hint="Mỗi enum value tra ra một entry trong map — color/label thuộc về entry, không thuộc vị trí trong enum. Đây là cách dùng tối thiểu: domain nào chỉ cần phân biệt trạng thái bằng màu + chữ thì dừng ở đây."
            >
                <EnumChip<OrderStatus> value="pending" map={ORDER_STATUS_MAP} />
                <EnumChip<OrderStatus> value="paid" map={ORDER_STATUS_MAP} />
                <EnumChip<OrderStatus> value="shipped" map={ORDER_STATUS_MAP} />
                <EnumChip<OrderStatus> value="cancelled" map={ORDER_STATUS_MAP} />
                <EnumChip<OrderStatus> value="refunded" map={ORDER_STATUS_MAP} />
            </VariantRow>
            <VariantRow
                label="Có icon dẫn đầu"
                hint="entry.icon do CALLER tự chọn kích thước (EnumChip không ép size-4/size-5 như StatusChip) — mỗi domain có thể cần icon khác cỡ. Trạng thái 'Hoàn tiền' ở đây bỏ icon để minh hoạ: icon là optional, không phải mọi entry đều cần."
            >
                <EnumChip<OrderStatus> value="pending" map={ORDER_STATUS_ICON_MAP} />
                <EnumChip<OrderStatus> value="paid" map={ORDER_STATUS_ICON_MAP} />
                <EnumChip<OrderStatus> value="shipped" map={ORDER_STATUS_ICON_MAP} />
                <EnumChip<OrderStatus> value="cancelled" map={ORDER_STATUS_ICON_MAP} />
                <EnumChip<OrderStatus> value="refunded" map={ORDER_STATUS_ICON_MAP} />
            </VariantRow>
            <Variant
                label="Có tooltip"
                hint="entry.tooltip khác null thì EnumChip tự bọc chip trong Tooltip — dùng khi label ngắn không đủ giải thích, ví dụ 'Hoàn tiền' cần nói rõ tiền về đâu và bao lâu."
            >
                <EnumChip<OrderStatus> value="refunded" map={ORDER_STATUS_TOOLTIP_MAP} />
            </Variant>
        </Gallery>
    ),
}
