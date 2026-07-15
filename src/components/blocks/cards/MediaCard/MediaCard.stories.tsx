import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Chip, Typography } from "@heroui/react"
import { MediaCard } from "./index"

const meta: Meta<typeof MediaCard> = {
    title: "Blocks/Card/MediaCard",
    component: MediaCard,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof MediaCard>

/** Dùng làm thẻ khóa học/bài học chuẩn trong lưới: có ảnh cover, tiêu đề, meta và CTA ở dưới. */
export const Default: Story = {
    parameters: { usage: "Dùng làm thẻ khóa học/bài học chuẩn trong lưới: có ảnh cover, tiêu đề, meta và CTA ở dưới." },
    render: () => (
        <div style={{ width: 320 }}>
            <MediaCard
                cover={
                    <img
                        src="https://placehold.co/640x360"
                        alt="Ảnh bìa khóa học"
                        className="aspect-video w-full object-cover"
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

/** Dùng để so sánh hai cách làm cả thẻ có thể nhấn: `href` điều hướng bằng liên kết, còn `onPress` xử lý tương tác tùy biến — cả hai đều render giống thẻ mặc định nhưng biến toàn bộ thẻ thành một vùng nhấn. */
export const Interactive: Story = {
    parameters: { usage: "Dùng để so sánh hai cách làm cả thẻ có thể nhấn: href điều hướng bằng liên kết, còn onPress xử lý tương tác tùy biến (mở modal, chọn item). Cả hai đều biến toàn bộ thẻ thành một vùng nhấn duy nhất." },
    render: () => (
        <div className="flex flex-wrap items-start gap-6">
            <div className="flex flex-col gap-2" style={{ width: 320 }}>
                <Typography type="body-sm" color="muted">href — điều hướng bằng liên kết</Typography>
                <MediaCard
                    href="/courses/system-design-mastery"
                    cover={
                        <img
                            src="https://placehold.co/640x360"
                            alt="Ảnh bìa khóa học"
                            className="aspect-video w-full object-cover"
                        />
                    }
                    title="System Design Mastery"
                    meta={<Chip size="sm">Nâng cao</Chip>}
                    description="Thiết kế hệ thống quy mô lớn: cân bằng tải, sharding, caching và các đánh đổi thực tế."
                />
            </div>
            <div className="flex flex-col gap-2" style={{ width: 320 }}>
                <Typography type="body-sm" color="muted">onPress — xử lý tương tác tùy biến</Typography>
                <MediaCard
                    onPress={() => {}}
                    title="Thử thách: Xây dựng API giỏ hàng"
                    meta={<Chip size="sm" variant="soft">Thử thách</Chip>}
                    description="Triển khai API thêm/xóa/sửa sản phẩm trong giỏ hàng, có kiểm tra tồn kho và tính giá."
                    footer={<Typography type="body-sm" color="muted">Nhấn để bắt đầu</Typography>}
                />
            </div>
        </div>
    ),
}

/** Dùng cho thẻ tối giản chỉ có tiêu đề, ví dụ danh sách bài viết chưa có ảnh minh họa. */
export const TitleOnly: Story = {
    parameters: { usage: "Dùng cho thẻ tối giản chỉ có tiêu đề, ví dụ danh sách bài viết chưa có ảnh minh họa." },
    render: () => (
        <div style={{ width: 320 }}>
            <MediaCard title="5 sai lầm thường gặp khi thiết kế database quan hệ" />
        </div>
    ),
}

/** Dùng để kiểm tra thẻ vẫn giữ bố cục gọn gàng khi tiêu đề và mô tả quá dài, nhờ line-clamp. */
export const LongContent: Story = {
    parameters: { usage: "Dùng để kiểm tra thẻ vẫn giữ bố cục gọn gàng khi tiêu đề và mô tả quá dài, nhờ line-clamp." },
    render: () => (
        <div style={{ width: 320 }}>
            <MediaCard
                title="Khóa học DevOps Mastery: Từ Docker, Kubernetes đến CI/CD và giám sát hệ thống quy mô production"
                meta={
                    <>
                        <Chip size="sm">DevOps</Chip>
                        <Chip size="sm" variant="soft">40 giờ</Chip>
                    </>
                }
                description="Khóa học bao phủ toàn bộ vòng đời triển khai: đóng gói container, điều phối cụm Kubernetes, xây dựng pipeline CI/CD tự động, và thiết lập giám sát/cảnh báo cho hệ thống production quy mô lớn với hàng triệu người dùng."
                footer={<Button size="sm">Ghi danh ngay</Button>}
            />
        </div>
    ),
}
