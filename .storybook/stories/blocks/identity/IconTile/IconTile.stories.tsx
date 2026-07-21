import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    BookOpenIcon,
    CheckCircleIcon,
    RocketLaunchIcon,
    WarningIcon,
} from "@phosphor-icons/react"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof IconTile> = {
    title: "Blocks/Identity/IconTile",
    component: IconTile,
}
export default meta
type Story = StoryObj<typeof IconTile>

/**
 * Toàn bộ ma trận trạng thái của IconTile: mặc định chỉ-icon, 5 tone theo status
 * (accent/success/warning/danger/neutral), 3 size theo mật độ khu vực (sm/md/lg),
 * và 2 trạng thái cover-image (ảnh thật, ảnh lỗi fallback về icon). Chỉ dùng IconTile
 * khi leading của một row/card đại diện cho MỘT OBJECT có định danh — một bài học,
 * một khoá học, một dự án: thứ người dùng có thể gọi tên và bấm mở. Một icon trần đi
 * kèm chữ thì vẫn để trần, đừng bọc vào tile (icon trần đọc như một CUE PHỤ — trạng
 * thái, độ khó, loại nội dung — không đủ khối lượng để làm avatar; đặt nó ở leading
 * sẽ hạ cấp object thành caption). Nếu chính ẢNH mới là nội dung — cover 16:9 của một
 * course card — dùng CoverImage, không dùng tile vuông.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Mặc định (chỉ icon)"
                hint="Chỉ icon, không có cover image: hình thái phổ biến nhất, vì đa số bài học và challenge không có asset riêng."
            >
                <IconTile icon={<BookOpenIcon />} />
            </Variant>
            <Variant
                label="Tone accent"
                hint="Thứ đang được đẩy lên: item đang làm, thứ vừa mở khoá. Mỗi eyeful tối đa một tile accent — nhiều accent cùng lúc thì không cái nào nổi bật nữa."
            >
                <IconTile icon={<RocketLaunchIcon />} tone="accent" />
            </Variant>
            <Variant
                label="Tone success"
                hint="Object đã xong hoàn toàn, không cần thêm gì nữa: một bài học đã hoàn thành, một challenge đã pass."
            >
                <IconTile icon={<CheckCircleIcon />} tone="success" />
            </Variant>
            <Variant
                label="Tone warning"
                hint="Còn việc chưa xong và có deadline thật: sắp hết hạn, đang chờ nộp lại. Đừng dùng cho thứ đơn giản là chưa bắt đầu."
            >
                <IconTile icon={<WarningIcon />} tone="warning" />
            </Variant>
            <Variant
                label="Tone danger"
                hint="Bị hỏng hoặc thất bại, cần người dùng hành động: một bài nộp fail, một session hết hạn không khôi phục được."
            >
                <IconTile icon={<WarningIcon />} tone="danger" />
            </Variant>
            <Variant
                label="Tone neutral"
                hint="Mặc định khi object không mang status nào: một item trong danh sách để lướt qua. Khi không chắc, chọn cái này — đừng thêm màu chỉ vì cho đẹp."
            >
                <IconTile icon={<BookOpenIcon />} tone="neutral" />
            </Variant>
            <Variant
                label="Size sm"
                hint="Size cho leading của một row trong danh sách dày đặc — lựa chọn mặc định khi tile đứng đầu một row."
            >
                <IconTile icon={<BookOpenIcon />} size="sm" />
            </Variant>
            <Variant
                label="Size md"
                hint="Size cho một card độc lập, nơi mỗi object có khung riêng của nó thay vì đứng chen với cái kế bên."
            >
                <IconTile icon={<BookOpenIcon />} size="md" />
            </Variant>
            <Variant
                label="Size lg"
                hint="Size cho hero block ở đầu trang, nơi object là điểm dẫn của cả surface. Đừng dùng trong danh sách — nó sẽ lấn title của row."
            >
                <IconTile icon={<BookOpenIcon />} size="lg" />
            </Variant>
            <Variant
                label="Có cover image"
                hint="Truyền src khi khoá học hoặc dự án có asset thật; ảnh lấp đầy tile và thay chỗ icon."
            >
                <IconTile
                    icon={<BookOpenIcon />}
                    src="https://picsum.photos/seed/starci-course/128/128"
                    alt="Fullstack Mastery track"
                    size="lg"
                />
            </Variant>
            <Variant
                label="Ảnh lỗi, fallback về icon"
                hint="Không phải một lựa chọn mà là điều xảy ra khi URL bị hỏng hoặc CDN chưa sync xong. Đây là lý do luôn phải truyền icon kèm src: bỏ icon thì ô này sẽ thành ô ảnh vỡ."
            >
                <IconTile
                    icon={<BookOpenIcon />}
                    src="https://invalid.starci.example/not-found.jpg"
                    alt="Cover image failed to load"
                    size="lg"
                    tone="neutral"
                />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Chỉ dùng IconTile khi leading của một row/card đại diện cho MỘT OBJECT có định danh — một bài " +
            "học, một khoá học, một dự án: thứ người dùng có thể gọi tên và bấm mở. Đừng dùng cho một icon " +
            "trần nhỏ đi kèm chữ — icon trần đọc như một CUE PHỤ (status, độ khó, loại nội dung), không đủ " +
            "khối lượng để làm avatar; đặt nó ở leading sẽ hạ cấp object thành caption. Nếu chính ẢNH mới là " +
            "nội dung — cover 16:9 của một course card — dùng `CoverImage`, không dùng tile vuông. Luôn " +
            "truyền `icon` kể cả khi đã set `src`: ảnh lấp đầy tile, nhưng nếu URL hỏng hoặc chưa sync thì " +
            "tile fallback về icon thay vì hiện glyph ảnh vỡ.",
    },
}
