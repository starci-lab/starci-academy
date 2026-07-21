import type { Meta, StoryObj } from "@storybook/nextjs"
import { SegmentBar } from "@/components/blocks/stats/SegmentBar"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof SegmentBar> = {
    title: "Blocks/Stats/SegmentBar",
    component: SegmentBar,
}
export default meta
type Story = StoryObj<typeof SegmentBar>

/**
 * Toàn bộ ma trận trạng thái của SegmentBar: phân bố theo tỉ lệ (không mốc so
 * sánh), tiến độ trên tổng cố định (max), ẩn chú giải, nhiều nhóm (kiểm tràn
 * dòng), bậc thang inline (mỗi dải tự in nhãn + %), và chưa có dữ liệu (toàn 0).
 * Dùng để tra khi nào chọn max, khi nào ẩn legend, và bar có vỡ layout không
 * khi rỗng hay khi có nhiều nhóm.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Phân bố theo tỉ lệ"
                hint="Không có mốc tổng riêng để so sánh (ví dụ số câu đúng theo từng mức độ) — các dải luôn lấp đầy 100% thanh, vì đó chính là toàn bộ dữ liệu."
            >
                <div className="w-80">
                    <SegmentBar
                        ariaLabel="Distribution of answers by difficulty"
                        segments={[
                            { key: "easy", label: "Easy", value: 12 },
                            { key: "medium", label: "Medium", value: 20 },
                            { key: "hard", label: "Hard", value: 8 },
                        ]}
                    />
                </div>
            </Variant>
            <Variant
                label="Tiến độ trên tổng cố định"
                hint="Cần thể hiện tiến độ thật trên một tổng cố định (ví dụ số bài học đã hoàn thành trên tổng số bài của khoá) — truyền max để phần trống phản ánh đúng phần chưa tới."
            >
                <div className="w-80">
                    <SegmentBar
                        ariaLabel="Lesson completion progress"
                        max={50}
                        segments={[
                            { key: "done", label: "Completed", value: 18, color: "var(--success)" },
                            { key: "in-progress", label: "In progress", value: 5, color: "var(--warning)" },
                        ]}
                    />
                </div>
            </Variant>
            <Variant
                label="Ẩn chú giải"
                hint="Thanh chỉ đóng vai trang trí/tóm tắt nhanh bên trong một block đã có legend riêng — bật hideLegend để không lặp lại nhãn + số đếm phía dưới."
            >
                <div className="w-80">
                    <SegmentBar
                        hideLegend
                        ariaLabel="Ratio of correct and incorrect answers"
                        segments={[
                            { key: "correct", label: "Correct", value: 34, color: "var(--success)" },
                            { key: "incorrect", label: "Incorrect", value: 6, color: "var(--danger)" },
                        ]}
                    />
                </div>
            </Variant>
            <Variant
                label="Nhiều nhóm"
                hint="Có nhiều nhóm dữ liệu (ví dụ điểm theo từng kỹ năng) — kiểm tra legend xuống dòng gọn gàng thay vì tràn ra ngoài block."
            >
                <div className="w-80">
                    <SegmentBar
                        ariaLabel="Distribution of assessed skills"
                        segments={[
                            { key: "frontend", label: "Frontend", value: 9 },
                            { key: "backend", label: "Backend", value: 14 },
                            { key: "database", label: "Database", value: 6 },
                            { key: "devops", label: "DevOps", value: 4 },
                            { key: "testing", label: "Testing", value: 7 },
                        ]}
                    />
                </div>
            </Variant>
            <Variant
                label="Bậc thang inline"
                hint="Chờ duyệt — dùng cho kiểu phân tách theo bậc thang mà mỗi dải phải đọc được riêng lẻ: mỗi dải tự in nhãn + tỉ lệ (%) trên một strip dày hơn, kèm một câu chốt (caption) bên dưới."
            >
                <div className="w-80">
                    <SegmentBar
                        inlineLabels
                        ariaLabel="Card maturity breakdown"
                        caption="Only 8% of cards have matured (retained over a long gap) — that's the real progress, not the raw card count seen."
                        segments={[
                            { key: "non", label: "Non", value: 52, color: "var(--default)" },
                            { key: "maturing", label: "Maturing", value: 40, color: "var(--warning)" },
                            { key: "mature", label: "Mature", value: 8, color: "var(--success)" },
                        ]}
                    />
                </div>
            </Variant>
            <Variant
                label="Chưa có dữ liệu"
                hint="Chưa có dữ liệu thật (mọi nhóm đều bằng 0) — xác nhận thanh không vỡ layout mà hiện một track rỗng thay vì lỗi chia cho 0."
            >
                <div className="w-80">
                    <SegmentBar
                        ariaLabel="No assessment data yet"
                        segments={[
                            { key: "easy", label: "Easy", value: 0 },
                            { key: "medium", label: "Medium", value: 0 },
                            { key: "hard", label: "Hard", value: 0 },
                        ]}
                    />
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của SegmentBar: phân bố theo tỉ lệ (không mốc so sánh), " +
            "tiến độ trên tổng cố định (max), ẩn chú giải, nhiều nhóm (kiểm tràn dòng), bậc thang " +
            "inline (mỗi dải tự in nhãn + %, chờ duyệt), và chưa có dữ liệu (toàn 0). Dùng để tra " +
            "khi nào chọn max, khi nào ẩn legend, và bar có vỡ layout không khi rỗng hay khi có " +
            "nhiều nhóm.",
    },
}
