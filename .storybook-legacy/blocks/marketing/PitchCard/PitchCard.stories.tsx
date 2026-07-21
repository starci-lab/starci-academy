import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import {
    ChatCircleDotsIcon,
    GraduationCapIcon,
    RocketLaunchIcon,
    ShieldCheckIcon,
    TargetIcon,
} from "@phosphor-icons/react"
import { PitchCard } from "@/components/blocks/marketing/PitchCard"
import { Gallery, Variant, VariantRow } from "../../../../story-kit"

const meta: Meta<typeof PitchCard> = {
    title: "Legacy/Blocks/Marketing/PitchCard",
    component: PitchCard,
}

export default meta

type Story = StoryObj<typeof PitchCard>

/**
 * Toàn bộ state của PitchCard trong một gallery: có/không footer, 5 tone của
 * IconTile, và tiêu đề/nội dung dài phải chảy tràn trong khung hẹp.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dùng gallery này để so trực tiếp cách PitchCard trình bày một luận điểm bán hàng — icon tinted, tiêu đề đậm, nội dung chứng minh — có hoặc không có hành động ở footer, và cách chọn tone theo ngữ cảnh của beat trên landing page.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Không footer"
                hint="Dùng khi luận điểm chỉ cần nêu và giải thích, không có surface cụ thể để dẫn người đọc tới — ví dụ một beat trong phần phương pháp học."
            >
                <div className="max-w-sm">
                    <PitchCard
                        icon={<RocketLaunchIcon />}
                        title="Học đi cùng dự án thật"
                        body="Mỗi module đều gắn với một sản phẩm cầm được, không phải bài tập lý thuyết rời rạc."
                    />
                </div>
            </Variant>
            <Variant
                label="Có footer"
                hint="Dùng khi luận điểm có một surface cụ thể để dẫn tới — footer nhận Link/Button điều hướng sang trang liên quan."
            >
                <div className="max-w-sm">
                    <PitchCard
                        icon={<GraduationCapIcon />}
                        tone="success"
                        title="Chấm bài bằng AI, có phản hồi ngay"
                        body="Nộp bài xong là có nhận xét chi tiết trong vài phút, không phải chờ giảng viên rảnh tay."
                        footer={<Button size="sm">Xem lộ trình</Button>}
                    />
                </div>
            </Variant>
            <VariantRow
                label="5 tone"
                hint="Chọn tone theo Ý NGHĨA của luận điểm, không phải theo màu cho đẹp: accent cho luận điểm chủ lực, success cho kết quả đạt được, warning cho rủi ro cần tránh, danger cho hậu quả nếu bỏ qua, neutral khi không mang trạng thái riêng."
            >
                <div className="w-64">
                    <PitchCard
                        icon={<TargetIcon />}
                        tone="accent"
                        title="Trọng tâm là năng lực thật"
                        body="Không học để thi, học để làm được việc trong công ty thật."
                    />
                </div>
                <div className="w-64">
                    <PitchCard
                        icon={<GraduationCapIcon />}
                        tone="success"
                        title="98% học viên hoàn thành khóa"
                        body="Tỷ lệ hoàn thành cao nhờ lộ trình chia nhỏ theo tuần, không bỏ dở giữa đường."
                    />
                </div>
                <div className="w-64">
                    <PitchCard
                        icon={<ShieldCheckIcon />}
                        tone="warning"
                        title="Kỹ năng cũ mất giá rất nhanh"
                        body="Công nghệ đổi mỗi năm, không cập nhật liên tục là tụt lại phía sau thị trường."
                    />
                </div>
                <div className="w-64">
                    <PitchCard
                        icon={<ChatCircleDotsIcon />}
                        tone="danger"
                        title="Học một mình dễ bỏ giữa đường"
                        body="Không ai đốc thúc, không ai chấm bài — phần lớn khóa tự học online bị bỏ ngang sau tuần đầu."
                    />
                </div>
                <div className="w-64">
                    <PitchCard
                        icon={<RocketLaunchIcon />}
                        tone="neutral"
                        title="Lộ trình 6 tháng"
                        body="Từ nền tảng tới dự án tốt nghiệp, chia đều theo tuần, không dồn ép giai đoạn cuối."
                    />
                </div>
            </VariantRow>
            <Variant
                label="Tiêu đề và nội dung dài"
                hint="Kiểm tra card không vỡ layout khi tiêu đề/nội dung dài hơn mức thường gặp trong một khung hẹp — body co giãn theo chiều cao card nhờ flex-1."
            >
                <div className="max-w-[280px]">
                    <PitchCard
                        icon={<TargetIcon />}
                        tone="accent"
                        title="Lộ trình được thiết kế riêng cho người vừa học vừa đi làm full-time"
                        body="Từng module được chia thành các buổi ngắn 45-60 phút, học viên tự sắp lịch quanh giờ làm việc mà không bị dồn bài vào cuối tuần, kèm mentor theo dõi tiến độ hàng tuần."
                        footer={<Button size="sm" variant="secondary">Tìm hiểu thêm</Button>}
                    />
                </div>
            </Variant>
        </Gallery>
    ),
}
