import type { Meta, StoryObj } from "@storybook/nextjs"
import { Score } from "@/components/blocks/stats/Score"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof Score> = {
    title: "Blocks/Stat/Score",
    component: Score,
}

export default meta

type Story = StoryObj<typeof Score>

/**
 * Toàn bộ tone của Score: màu KHÔNG phải prop truyền tay mà tự suy ra từ
 * `current / max` so với `threshold` (mặc định 0.7) — dưới nửa threshold là
 * danger, từ nửa đến dưới threshold là warning, đạt threshold là success.
 * Gallery này dựng đủ 3 tone bằng đúng công thức đó, cộng state biên (max
 * không hợp lệ luôn rơi về danger) và một threshold khác mặc định để thấy
 * cùng một điểm số có thể đổi tone khi tiêu chí đổi. Score không có state
 * loading/empty/error/disabled/selected — nó chỉ render một con số đã có,
 * và không stateful (không onChange) nên không cần bản `Controlled`.
 */
export const AllVariants: Story = {
    parameters: {
        usage:
            "Dùng Score để hiển thị điểm số dạng current/max với màu mang ý nghĩa đạt/chưa đạt, ví dụ điểm bài kiểm tra hay điểm chấm challenge. Không tự chọn tone — tone luôn tự suy từ current/max so với threshold, nên chỉ cần truyền đúng current/max/threshold là màu sẽ đúng ngữ cảnh.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Danger — dưới nửa threshold"
                hint="Ratio 3/10 = 0.3, threshold mặc định 0.7 nên nửa threshold là 0.35 — ratio còn thấp hơn nửa, rơi về danger. Dùng khi điểm số báo hiệu rớt rõ ràng."
            >
                <Score current={3} max={10} />
            </Variant>
            <Variant
                label="Warning — từ nửa đến dưới threshold"
                hint="Ratio 5/10 = 0.5, nằm giữa nửa threshold (0.35) và threshold (0.7) — cận đạt, cần cải thiện. Dùng khi điểm số nằm ở vùng chưa chắc qua."
            >
                <Score current={5} max={10} />
            </Variant>
            <Variant
                label="Success — đạt hoặc vượt threshold"
                hint="Ratio 8/10 = 0.8, đã vượt threshold mặc định 0.7 — đạt yêu cầu. Dùng khi điểm số đủ để coi là pass."
            >
                <Score current={8} max={10} />
            </Variant>
            <Variant
                label="Threshold tuỳ chỉnh đổi tone của cùng một điểm"
                hint="Cùng ratio 0.8 nhưng threshold nâng lên 0.9 (ví dụ đề thi khó, chuẩn đạt cao hơn) — 0.8 giờ rơi vào vùng warning thay vì success. Dùng khi tiêu chí đạt của từng bài/khoá khác nhau, không cố định 0.7."
            >
                <Score current={8} max={10} threshold={0.9} />
            </Variant>
            <Variant
                label="Số thập phân, làm tròn tối đa 2 chữ số"
                hint="current/max không cần là số nguyên — format.number tự làm tròn tối đa 2 chữ số, ví dụ điểm chấm AI dạng thang 8.75/10."
            >
                <Score current={8.756} max={10} />
            </Variant>
            <Variant
                label="max không hợp lệ — phòng thủ về danger"
                hint="max &lt;= 0 (hoặc current/max không phải số hữu hạn) không tính được ratio nên Score chủ động rơi về danger thay vì crash hoặc hiện màu sai."
            >
                <Score current={5} max={0} />
            </Variant>
        </Gallery>
    ),
}
