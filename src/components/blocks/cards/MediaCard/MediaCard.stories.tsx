import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Chip, Label, Typography } from "@heroui/react"
import { MediaCard } from "./index"

const meta: Meta<typeof MediaCard> = {
    title: "Core/Card/MediaCard",
    component: MediaCard,
}
export default meta
type Story = StoryObj<typeof MediaCard>

/** Thẻ nội dung một-hình-dạng cho lưới khóa học/bài học/blog: ảnh bìa 16:9 full-bleed trên cùng, rồi tiêu đề, meta, tóm tắt và CTA. */
export const Default: Story = {
    parameters: {
        usage:
            "Thẻ nội dung MỘT hình dạng dùng chung cho mọi lưới entity (khóa học, bài học, thử thách, blog): " +
            "cover 16:9 full-bleed trên cùng (sát mép card, Card p-0) rồi tiêu đề, meta, tóm tắt, CTA trong body p-3. " +
            "Không truyền cover → fallback placeholder 16:9. Slot chữ nào không có dữ liệu thì bỏ trống. " +
            "Thẻ KHÔNG tự nhận press: cần bấm cả thẻ thì truyền `href`/`onPress`, còn không thì footer phải tự mang nút. " +
            "Mô tả cắt còn 2 dòng (line-clamp) nên chiều cao thẻ không phình theo dữ liệu.",
    },
    render: () => (
        <div className="flex flex-col gap-3" style={{ width: 320 }}>
            <div className="flex flex-col gap-2">
                <Label>Thẻ nội dung</Label>
                <Typography type="body-sm" color="muted">
                    Chọn khi entity có ảnh bìa và cần đọc thành một khối trong lưới. Ảnh 16:9 full card trên cùng, phần chữ
                    xếp dưới theo một nhịp cố định (p-3).
                </Typography>
            </div>
            <MediaCard
                cover={
                    <img
                        src="https://placehold.co/640x360"
                        alt="Ảnh bìa khóa học"
                        className="size-full object-cover"
                    />
                }
                title="Lộ trình Fullstack Mastery"
                meta={
                    <>
                        <Chip size="sm">Fullstack</Chip>
                        <Chip size="sm" variant="soft">Trung cấp</Chip>
                    </>
                }
                description="Xây dựng nền tảng vững chắc từ frontend đến backend qua các dự án thực chiến, có chấm điểm bằng AI."
                footer={<Button size="sm">Xem khóa học</Button>}
            />
        </div>
    ),
}

/** Không truyền cover — MediaCard tự fallback placeholder 16:9 full-bleed. */
export const FallbackCover: Story = {
    parameters: {
        usage:
            "Dùng khi entity chưa có ảnh bìa: bỏ `cover`, thẻ tự render placeholder 16:9 full-bleed " +
            "để lưới vẫn đều hàng thay vì để trống slot media.",
    },
    render: () => (
        <div className="flex flex-col gap-3" style={{ width: 320 }}>
            <div className="flex flex-col gap-2">
                <Label>Không có ảnh — fallback 16:9</Label>
                <Typography type="body-sm" color="muted">
                    Không truyền cover. MediaCard tự điền placeholder 16:9 sát mép card.
                </Typography>
            </div>
            <MediaCard
                title="Lộ trình Fullstack Mastery"
                meta={
                    <>
                        <Chip size="sm">Fullstack</Chip>
                        <Chip size="sm" variant="soft">Trung cấp</Chip>
                    </>
                }
                description="Xây dựng nền tảng vững chắc từ frontend đến backend qua các dự án thực chiến, có chấm điểm bằng AI."
                footer={<Button size="sm">Xem khóa học</Button>}
            />
        </div>
    ),
}
