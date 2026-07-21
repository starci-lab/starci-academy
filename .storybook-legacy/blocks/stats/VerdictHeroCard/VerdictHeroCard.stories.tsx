import type { Meta, StoryObj } from "@storybook/nextjs"
import { VerdictHeroCard } from "@/components/blocks/stats/VerdictHeroCard"
import { Gallery, Variant } from "../../../../story-kit"
import { PrimaryAction, REVIEW_HEALTH_SPLITS } from "./components"

const meta: Meta<typeof VerdictHeroCard> = {
    title: "Legacy/Blocks/Stats/VerdictHeroCard",
    component: VerdictHeroCard,
    // NEW — pending review ("Chờ duyệt")
    tags: ["news"],
}
export default meta
type Story = StoryObj<typeof VerdictHeroCard>

/**
 * Toàn bộ ma trận trạng thái của VerdictHeroCard: shape đầy đủ (meter + split +
 * action), shape rút gọn không có split, và 3 band (danger/warning/success) theo
 * Ý NGHĨA của verdict — không theo trang trí. Dùng để tra khi nào bỏ `splits`,
 * và band nào ứng với tình huống nào.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Full — meter + splits + action"
                hint="Dùng cho hero 'phán xử' đầy đủ: giá trị + verdict + sub + meter có mốc target + split 2-up + hành động chính. Danger band: giá trị, viền trái và fill của meter cùng đọc là một tín hiệu xấu, còn split cho thấy con số này thực ra là hai câu chuyện khác nhau (thẻ cũ vẫn ổn, thẻ mới thì không)."
            >
                <div className="max-w-md">
                    <VerdictHeroCard
                        value={39}
                        unit="%"
                        band="danger"
                        verdict="Bạn đang quá tải — nạp thẻ mới nhanh hơn tốc độ ghi nhớ."
                        sub="Tỷ lệ nhớ 39% (mốc lành mạnh ~85%). Vấn đề KHÔNG phải quên cái đã học — mà là nạp quá nhanh."
                        meter={{ value: 39, max: 100, target: 85 }}
                        splits={REVIEW_HEALTH_SPLITS}
                        action={<PrimaryAction>Giảm thẻ mới · ôn kỹ thẻ cũ trước →</PrimaryAction>}
                    />
                </div>
            </Variant>
            <Variant
                label="Meter only — không có split"
                hint={"Bỏ `splits` khi con số không có breakdown 2-up tự nhiên — ví dụ điểm sẵn sàng phỏng vấn (một xu hướng, không phải hai nhóm nhỏ). Vẫn giữ meter + target vì pass-bar vẫn là bằng chứng chính. Warning band: gần chạm target nhưng chưa tới — sub-line mang bằng chứng xu hướng thay cho split."}
            >
                <div className="max-w-md">
                    <VerdictHeroCard
                        value={64}
                        unit="/100"
                        band="warning"
                        verdict={"Gần chạm mốc \"đạt\" — còn ~1 phiên mạnh nữa."}
                        sub="Pass-bar 70. 3 phiên gần nhất: 58 → 61 → 64 (đang tăng đều)."
                        meter={{ value: 64, max: 100, target: 70 }}
                        action={<PrimaryAction>Luyện 1 phiên nữa →</PrimaryAction>}
                    />
                </div>
            </Variant>
            <Variant
                label="Band: Danger"
                hint="Chọn `band` theo Ý NGHĨA của verdict, không theo trang trí — danger là khi con số báo hiệu một vấn đề thật, học viên cần hành động ngay."
            >
                <div className="max-w-md">
                    <VerdictHeroCard
                        value={39}
                        unit="%"
                        band="danger"
                        verdict="Bạn đang quá tải — nạp thẻ mới nhanh hơn tốc độ ghi nhớ."
                        meter={{ value: 39, max: 100, target: 85 }}
                    />
                </div>
            </Variant>
            <Variant
                label="Band: Warning"
                hint="Warning là khi tiến độ có thật nhưng chưa vượt qua target."
            >
                <div className="max-w-md">
                    <VerdictHeroCard
                        value={61}
                        unit="%"
                        band="warning"
                        verdict="Phủ được 61% khái niệm — còn 6/17 chủ đề chưa đụng tới."
                        meter={{ value: 61, max: 100, target: 80 }}
                    />
                </div>
            </Variant>
            <Variant
                label="Band: Success"
                hint="Success là khi target đã đạt — verdict nên nói thẳng điều đó, không chỉ hiện một con số."
            >
                <div className="max-w-md">
                    <VerdictHeroCard
                        value={88}
                        unit="%"
                        band="success"
                        verdict="Đã vượt mốc 85% — trí nhớ của bạn đang khoẻ."
                        meter={{ value: 88, max: 100, target: 85 }}
                    />
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của VerdictHeroCard: shape đầy đủ (meter + split + action), " +
            "shape rút gọn không có split, và 3 band (danger/warning/success) theo Ý NGHĨA của verdict — " +
            "không theo trang trí. Dùng để tra khi nào bỏ `splits`, và band nào ứng với tình huống nào.",
    },
}
