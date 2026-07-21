import type { Meta, StoryObj } from "@storybook/nextjs"
import { QRCode } from "@/components/blocks/media/QRCode"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof QRCode> = {
    title: "Blocks/Media/QRCode",
    component: QRCode,
}
export default meta
type Story = StoryObj<typeof QRCode>

/** Phủ các biến thể thật của QRCode: có/không icon giữa mã, và các cỡ nhỏ/vừa/lớn dùng trong app (thẻ mời, poster, banner). */
export const AllVariants: Story = {
    parameters: {
        usage: "Dùng để đối chiếu cạnh nhau mọi biến thể QRCode trước khi ráp vào màn hình thật — icon giữa mã và các cỡ hay dùng.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Mặc định (không icon)"
                hint="Dùng khi chỉ cần quét link đơn thuần, không cần gắn thương hiệu ở giữa mã, ví dụ mã QR cho link mời vào lớp học."
            >
                <QRCode size={160} data="https://starci.vn/join/lop-fullstack-k12" />
            </Variant>
            <Variant
                label="Có icon giữa mã"
                hint="Dùng khi muốn gắn logo/avatar nhận diện ở tâm mã QR, ví dụ mã QR trên thẻ chứng nhận hoặc poster sự kiện của StarCi."
            >
                <QRCode
                    size={160}
                    data="https://starci.vn/certificate/cert-2026-0721"
                    icon={
                        <img
                            alt=""
                            width={28}
                            height={28}
                            src="https://picsum.photos/seed/starci-logo/28/28"
                            className="rounded-full"
                        />
                    }
                />
            </Variant>
            <Variant
                label="Cỡ nhỏ (96px)"
                hint="Dùng trong không gian hẹp như hàng danh sách hoặc thẻ nhỏ, ví dụ mã QR đính kèm trong email xác nhận thanh toán."
            >
                <QRCode size={96} data="https://starci.vn/payment/inv-88213" />
            </Variant>
            <Variant
                label="Cỡ lớn (240px)"
                hint="Dùng cho banner hoặc poster in ấn cần quét từ xa, ví dụ mã QR trưng bày tại sự kiện offline của StarCi."
            >
                <QRCode size={240} data="https://starci.vn/event/offline-meetup-2026" />
            </Variant>
        </Gallery>
    ),
}
