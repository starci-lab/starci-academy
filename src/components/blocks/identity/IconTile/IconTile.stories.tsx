import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import {
    BookOpenIcon,
    CheckCircleIcon,
    RocketLaunchIcon,
    WarningIcon,
} from "@phosphor-icons/react"
import { IconTile } from "./index"

const meta: Meta<typeof IconTile> = {
    title: "Core/Identity/IconTile",
    component: IconTile,
}
export default meta
type Story = StoryObj<typeof IconTile>

/**
 * Chỉ dùng khi leading của row/card đại diện MỘT ĐỐI TƯỢNG có danh tính — một bài, một khoá,
 * một dự án: thứ người dùng gọi tên được, bấm vào là mở ra. Ở vị trí đó dùng IconTile, KHÔNG icon
 * SVG trơ nhỏ — icon trơ đọc ra là MARKER PHỤ (chỉ dấu trạng thái, độ khó, loại nội dung), không đủ
 * khối để làm avatar, đặt vào leading là hạ đối tượng xuống hàng chú thích. Ngược lại: chỉ dấu đi
 * kèm text thì để icon trơ, đừng bọc tile. Nếu chính TẤM ẢNH là nội dung — bìa 16:9 trong card khoá
 * học — dùng CoverImage, không phải tile vuông.
 */
export const Default: Story = {
    parameters: { usage: "Chỉ dùng khi leading của row/card đại diện MỘT ĐỐI TƯỢNG có danh tính — một bài, một khoá, "
        + "một dự án: thứ người dùng gọi tên được, bấm vào là mở ra. Ở vị trí đó dùng `IconTile`, KHÔNG icon SVG trơ "
        + "nhỏ — icon trơ đọc ra là MARKER PHỤ (chỉ dấu trạng thái, độ khó, loại nội dung), không đủ khối để làm "
        + "avatar, đặt vào leading là hạ đối tượng xuống hàng chú thích. Ngược lại: chỉ dấu đi kèm text thì để icon "
        + "trơ, đừng bọc tile (tile sẽ tranh vai với đối tượng thật của row). Nếu chính TẤM ẢNH là nội dung — bìa "
        + "16:9 trong card khoá học — dùng `CoverImage`, không phải tile vuông." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Mặc định</Label>
                <Typography type="body-sm" color="muted">
                    Chỉ có icon, chưa có ảnh bìa: dạng gặp nhiều nhất, vì phần lớn bài và thử thách không có
                    asset riêng.
                </Typography>
            </div>
            <IconTile icon={<BookOpenIcon />} />
        </div>
    ),
}

/** Chọn tông theo TRẠNG THÁI của thứ tile đại diện, không theo màu cho đẹp. */
export const Tones: Story = {
    parameters: { usage: "Chọn tông theo TRẠNG THÁI của thứ tile đại diện, không theo màu cho đẹp." },
    render: () => (
        <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Accent</Label>
                    <Typography type="body-sm" color="muted">
                        Thứ đang được đẩy tới: mục đang học dở, thứ vừa mở khoá. Tối đa một tile accent trong
                        một tầm mắt, nhiều cái cùng accent thì không cái nào nổi.
                    </Typography>
                </div>
                <IconTile icon={<RocketLaunchIcon />} tone="accent" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Success</Label>
                    <Typography type="body-sm" color="muted">
                        Đối tượng đã xong hẳn và không cần làm gì thêm: bài đã hoàn thành, thử thách đã đạt.
                    </Typography>
                </div>
                <IconTile icon={<CheckCircleIcon />} tone="success" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Warning</Label>
                    <Typography type="body-sm" color="muted">
                        Còn việc phải làm và có mốc thời gian thật: sắp hết hạn, đang chờ nộp lại. Không dùng
                        cho thứ chỉ đơn giản là chưa bắt đầu.
                    </Typography>
                </div>
                <IconTile icon={<WarningIcon />} tone="warning" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Danger</Label>
                    <Typography type="body-sm" color="muted">
                        Đã hỏng hoặc đã trượt, cần người dùng xử lý: bài nộp lỗi, phiên hết hạn không cứu
                        được.
                    </Typography>
                </div>
                <IconTile icon={<WarningIcon />} tone="danger" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Neutral</Label>
                    <Typography type="body-sm" color="muted">
                        Mặc định khi đối tượng không mang trạng thái nào: mục trong danh sách để duyệt. Phân
                        vân thì chọn cái này, đừng tô màu cho có.
                    </Typography>
                </div>
                <IconTile icon={<BookOpenIcon />} tone="neutral" />
            </div>
        </div>
    ),
}

/** Chọn size theo mật độ khu vực đặt tile, không theo độ quan trọng của đối tượng. */
export const Sizes: Story = {
    parameters: { usage: "Chọn size theo mật độ khu vực đặt tile, không theo độ quan trọng của đối tượng." },
    render: () => (
        <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Nhỏ (sm)</Label>
                    <Typography type="body-sm" color="muted">
                        Cỡ cho leading của row trong danh sách dày — mặc định nên lấy khi tile đứng đầu một
                        hàng.
                    </Typography>
                </div>
                <IconTile icon={<BookOpenIcon />} size="sm" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Vừa (md)</Label>
                    <Typography type="body-sm" color="muted">
                        Cỡ cho card đứng riêng, nơi mỗi đối tượng có khung của mình chứ không xếp sát nhau.
                    </Typography>
                </div>
                <IconTile icon={<BookOpenIcon />} size="md" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Lớn (lg)</Label>
                    <Typography type="body-sm" color="muted">
                        Cỡ cho khối nổi bật đầu trang, nơi đối tượng là nhân vật chính của cả bề mặt. Trong
                        danh sách thì đừng dùng, nó sẽ đè lên chính tiêu đề của row.
                    </Typography>
                </div>
                <IconTile icon={<BookOpenIcon />} size="lg" />
            </div>
        </div>
    ),
}

/** Hai trạng thái của ảnh bìa — có asset thật và URL hỏng — cùng lý do vì sao `icon` luôn phải truyền. */
export const CoverImage: Story = {
    parameters: { usage: "Hai trạng thái của ảnh bìa — có asset thật và URL hỏng — cùng lý do vì sao `icon` luôn phải truyền. Luôn truyền `icon` kể cả khi đã có `src`: ảnh lấp đầy tile, còn URL hỏng hoặc chưa đồng bộ thì tile tự rơi về icon thay vì hiện icon ảnh vỡ." },
    render: () => (
        <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Có ảnh bìa</Label>
                    <Typography type="body-sm" color="muted">
                        Truyền src khi khoá học hoặc dự án đã có asset thật; ảnh lấp đầy tile và thay chỗ
                        icon.
                    </Typography>
                </div>
                <IconTile
                    icon={<BookOpenIcon />}
                    src="https://picsum.photos/seed/starci-course/128/128"
                    alt="Lộ trình Fullstack Mastery"
                    size="lg"
                />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Ảnh lỗi, rơi về icon</Label>
                    <Typography type="body-sm" color="muted">
                        Không phải lựa chọn mà là thứ tự xảy ra khi URL hỏng hoặc CDN chưa đồng bộ. Đây là lý
                        do luôn truyền icon kèm src: bỏ icon thì chỗ này thành ô ảnh vỡ.
                    </Typography>
                </div>
                <IconTile
                    icon={<BookOpenIcon />}
                    src="https://invalid.starci.example/not-found.jpg"
                    alt="Ảnh bìa không tải được"
                    size="lg"
                    tone="neutral"
                />
            </div>
        </div>
    ),
}
