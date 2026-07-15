import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { ClockCounterClockwiseIcon } from "@phosphor-icons/react"
import { ContinueCard } from "./index"

const meta: Meta<typeof ContinueCard> = {
    title: "Block/Card/ContinueCard",
    component: ContinueCard,
}
export default meta
type Story = StoryObj<typeof ContinueCard>

/** Dùng khi thẻ là MỘT trong N thứ đáng học tiếp, xếp thành lưới — thay vì variant="hero" (chỉ khi nó là thứ duy nhất đang dở trên bề mặt). CTA là SeeMoreLink thật ("Tiếp tục →"): hover + click chỉ trên link, không bọc cả thẻ — cùng công thức với LabeledCard "Xem thêm". Không viền accent vì N thẻ cùng accent thì không thẻ nào nổi. */
export const Item: Story = {
    parameters: { usage: "Dùng khi thẻ là MỘT trong N thứ đáng học tiếp, xếp thành lưới — thay vì variant=\"hero\" (chỉ khi nó là thứ duy nhất đang dở trên bề mặt). CTA là SeeMoreLink thật (\"Tiếp tục →\"): hover + click chỉ trên link, không bọc cả thẻ — cùng công thức với LabeledCard \"Xem thêm\". Không viền accent vì N thẻ cùng accent thì không thẻ nào nổi. Không truyền value nên không có thanh tiến độ — đúng cho thứ chưa từng bắt đầu." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Mặc định</Label>
                <Typography type="body-sm" color="muted">
                    Phụ đề gánh loại nội dung (bài đọc, thử thách) để phân biệt các thẻ đứng cạnh nhau trong cùng lưới. Điều hướng bằng href trên CTA khi thẻ chỉ dẫn tới một địa chỉ có sẵn.
                </Typography>
            </div>
            <div className="grid w-[42rem] gap-3 sm:grid-cols-2">
                <ContinueCard
                    variant="item"
                    title="Xây dựng API RESTful với NestJS"
                    subtitle="Bài đọc"
                    ctaLabel="Tiếp tục"
                    href="/courses/nestjs-api/lessons/5"
                />
                <ContinueCard
                    variant="item"
                    title="Thiết kế hệ thống: Rate Limiter phân tán"
                    subtitle="Thử thách"
                    ctaLabel="Tiếp tục"
                    href="/courses/system-design/challenges/rate-limiter"
                />
            </div>
        </div>
    ),
}

/** Dùng khi thẻ là THỨ DUY NHẤT đang dở trên bề mặt, cần kéo người học quay lại — thay vì variant="item" (khi có N thứ để chọn). CTA thành nút chip xuống hàng riêng để đủ sức nặng, icon chìm xuống nền, viền accent vì nó là thứ được nhấn. */
export const Hero: Story = {
    parameters: { usage: "Dùng khi thẻ là THỨ DUY NHẤT đang dở trên bề mặt, cần kéo người học quay lại — thay vì variant=\"item\" (khi có N thứ để chọn). CTA thành nút chip xuống hàng riêng để đủ sức nặng, icon chìm xuống nền làm watermark, viền accent vì nó là thứ được nhấn." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Không gấp</Label>
                <Typography type="body-sm" color="muted">
                    Trạng thái nền của hero: phụ đề giữ tông chìm vì nó chỉ nói vị trí trong phiên, không có mốc thời gian nào để cảnh báo. Dùng onPress khi CTA mở lại phiên tại chỗ chứ không đi tới một địa chỉ cố định.
                </Typography>
            </div>
            <div className="w-96">
                <ContinueCard
                    variant="hero"
                    icon={<ClockCounterClockwiseIcon weight="fill" />}
                    title="Ôn thẻ đến hạn"
                    subtitle="Thẻ 3 / 20"
                    ctaLabel="Ôn ngay"
                    onPress={() => {}}
                />
            </div>
        </div>
    ),
}

/** Dùng khi phiên dở có mốc thời gian THẬT do máy chủ áp đặt và có tiến độ đo được: truyền value để hiện thanh tiến độ (bỏ trống nếu không có dữ liệu thật, đừng truyền 0 cho đủ prop), bật urgent để phụ đề chuyển tông cảnh báo. Không dùng urgent cho đếm ngược bịa ra. */
export const HeroUrgent: Story = {
    parameters: { usage: "Dùng khi phiên dở có mốc thời gian THẬT do máy chủ áp đặt và có tiến độ đo được: truyền value để hiện thanh tiến độ (bỏ trống nếu không có dữ liệu thật, đừng truyền 0 cho đủ prop), bật urgent để phụ đề chuyển tông cảnh báo. Không dùng urgent cho đếm ngược bịa ra." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Gấp, có tiến độ</Label>
                <Typography type="body-sm" color="muted">
                    Bật urgent khi phụ đề chứa một mốc thời gian thật do máy chủ áp đặt, phụ đề chuyển tông cảnh báo. Truyền value cùng max khi có tiến độ đo được để hiện thanh; bỏ trống nếu chưa có dữ liệu thật.
                </Typography>
            </div>
            <div className="w-96">
                <ContinueCard
                    variant="hero"
                    title="Phỏng vấn thử: Thiết kế Rate Limiter"
                    subtitle="Câu 5 / 8 · Middle · còn 12 phút"
                    urgent
                    value={5}
                    max={8}
                    ctaLabel="Tiếp tục"
                    onPress={() => {}}
                />
            </div>
        </div>
    ),
}
