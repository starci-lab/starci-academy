import type { Meta, StoryObj } from "@storybook/nextjs"
import { Icon } from "@iconify/react"
import { BadgeImage } from "@/components/blocks/identity/BadgeImage"
import { Gallery, Variant, VariantRow } from "../../../../story-kit"

const meta: Meta<typeof BadgeImage> = {
    title: "Blocks/Identity/BadgeImage",
    component: BadgeImage,
}

export default meta

type Story = StoryObj<typeof BadgeImage>

/**
 * Toàn bộ trạng thái của BadgeImage trong một gallery: ảnh thật đã upload lên
 * MinIO, đường dẫn chưa có ảnh (rơi về fallback), các cỡ hay dùng, và fallback
 * tuỳ biến theo nơi gọi. `failed` là state nội bộ của component (bật khi `onError`
 * bắn ra), không phải prop điều khiển được từ ngoài, nên không cần wrapper
 * `Controlled` cho block này.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dùng BadgeImage bất cứ khi nào một huy hiệu/rank cần lấy art thật từ MinIO nhưng "
            + "đội design chưa chắc đã upload xong: component tự rơi về fallback khi object 404, "
            + "nên UI không bao giờ lộ ảnh vỡ trong lúc chờ hoạ sĩ vẽ dần từng bộ.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Đã có ảnh thật trên MinIO"
                hint="Khi hoạ sĩ đã upload đúng objectKey, ảnh hiển thị trực tiếp từ MinIO — dùng cho huy hiệu league/rank đã có art chính thức."
            >
                <BadgeImage
                    objectKey="badges/league/gold.png"
                    alt="Huy hiệu Vàng"
                    size={40}
                    fallback={(
                        <Icon
                            icon="fluent-emoji-flat:trophy"
                            width={40}
                            height={40}
                            aria-label="Huy hiệu Vàng"
                        />
                    )}
                />
            </Variant>
            <Variant
                label="Chưa upload — tự rơi về fallback"
                hint="objectKey trỏ tới asset chưa tồn tại (hoặc CDN chưa sync): ảnh 404, onError bật, và fallback thay chỗ ngay lập tức, không có khoảng broken-image nào lộ ra."
            >
                <BadgeImage
                    objectKey="badges/league/not-uploaded-yet.png"
                    alt="Huy hiệu Kim Cương"
                    size={40}
                    fallback={(
                        <Icon
                            icon="fluent-emoji-flat:gem-stone"
                            width={40}
                            height={40}
                            aria-label="Huy hiệu Kim Cương"
                        />
                    )}
                />
            </Variant>
            <VariantRow
                label="Kích thước"
                hint="Chọn size theo nơi đặt: 16 cho hàng danh sách dày, 24 là mặc định, 48 cho khối hero ở trang hồ sơ."
            >
                <BadgeImage
                    objectKey="badges/league/not-uploaded-yet.png"
                    alt="Cỡ nhỏ, hàng danh sách"
                    size={16}
                    fallback={(
                        <Icon icon="fluent-emoji-flat:medal" width={16} height={16} aria-label="Cỡ nhỏ" />
                    )}
                />
                <BadgeImage
                    objectKey="badges/league/not-uploaded-yet.png"
                    alt="Cỡ mặc định"
                    size={24}
                    fallback={(
                        <Icon icon="fluent-emoji-flat:medal" width={24} height={24} aria-label="Cỡ mặc định" />
                    )}
                />
                <BadgeImage
                    objectKey="badges/league/not-uploaded-yet.png"
                    alt="Cỡ lớn, khối hero"
                    size={48}
                    fallback={(
                        <Icon icon="fluent-emoji-flat:medal" width={48} height={48} aria-label="Cỡ lớn" />
                    )}
                />
            </VariantRow>
            <Variant
                label="Fallback tuỳ biến theo nơi gọi"
                hint="fallback nhận bất kỳ ReactNode: nơi gọi có thể truyền icon hệ thống, initials, hay hình linh vật xám mờ khi badge chưa mở khoá — miễn là truyền cùng size để không lệch layout khi ảnh thật thế chỗ."
            >
                <BadgeImage
                    objectKey="mascots/fox/not-uploaded-yet.png"
                    alt="Linh vật Cáo, chưa mở khoá"
                    size={40}
                    className="opacity-40 grayscale"
                    fallback={(
                        <Icon
                            icon="fluent-emoji-flat:locked"
                            width={40}
                            height={40}
                            aria-label="Linh vật Cáo, chưa mở khoá"
                        />
                    )}
                />
            </Variant>
        </Gallery>
    ),
}
