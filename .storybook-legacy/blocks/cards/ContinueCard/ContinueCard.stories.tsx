import type { Meta, StoryObj } from "@storybook/nextjs"
import { ClockCounterClockwiseIcon } from "@phosphor-icons/react"
import { ContinueCard } from "@/components/blocks/cards/ContinueCard"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof ContinueCard> = {
    title: "Features/Learn/ContinueCard",
    component: ContinueCard,
}
export default meta
type Story = StoryObj<typeof ContinueCard>

/**
 * Toàn bộ ma trận biến thể của ContinueCard: variant="item" (một trong N thứ có
 * thể tiếp tục, xếp lưới, CTA là SeeMoreLink thật) và variant="hero" ở hai mức
 * cấp bách (không gấp / gấp có tiến độ thật). Dùng để tra khi nào chọn item so
 * với hero, và khi nào bật urgent + value.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Item"
                hint="Dùng khi card là MỘT trong N thứ đáng tiếp tục, xếp trong lưới — thay vì variant=&quot;hero&quot; (chỉ khi đây là thứ duy nhất chưa hoàn thành trên surface). CTA là SeeMoreLink thật (&quot;Tiếp tục →&quot;): hover và click chỉ nằm trên link, không phải cả card — cùng công thức với &quot;Xem thêm&quot; của LabeledCard. Không viền accent, vì nhiều card cùng viền thì không card nào nổi bật. Không truyền value nên không có thanh tiến độ — đúng cho thứ chưa từng bắt đầu."
            >
                <div className="grid w-[42rem] gap-3 @app-sm:grid-cols-2">
                    <ContinueCard
                        variant="item"
                        title="Building a RESTful API with NestJS"
                        subtitle="Reading"
                        ctaLabel="Continue"
                        href="/courses/nestjs-api/lessons/5"
                    />
                    <ContinueCard
                        variant="item"
                        title="System design: Distributed rate limiter"
                        subtitle="Challenge"
                        ctaLabel="Continue"
                        href="/courses/system-design/challenges/rate-limiter"
                    />
                </div>
            </Variant>
            <Variant
                label="Hero — không gấp"
                hint="Dùng khi card là thứ DUY NHẤT chưa hoàn thành trên surface, cần kéo học viên trở lại — thay vì variant=&quot;item&quot; (khi có N thứ để chọn). CTA thành chip button trên dòng riêng cho đủ trọng lượng, icon chìm xuống nền, bọc trong HighlightCard viền sáng quét (card.md §3j) vì đây là thứ được nhấn mạnh. Subtitle giữ tông muted vì chỉ nói vị trí trong phiên, không có deadline cần cảnh báo."
            >
                <div className="w-96">
                    <ContinueCard
                        variant="hero"
                        icon={<ClockCounterClockwiseIcon weight="fill" />}
                        title="Review due cards"
                        subtitle="Card 3 / 20"
                        ctaLabel="Review now"
                        onPress={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="Hero — gấp, có tiến độ"
                hint="Bật urgent khi phiên chưa hoàn thành có deadline THẬT do server áp, và subtitle chuyển sang tông cảnh báo. Truyền value kèm max khi có tiến độ đo được thật để hiện thanh tiến độ; đừng bật urgent cho một đồng hồ đếm ngược bịa ra."
            >
                <div className="w-96">
                    <ContinueCard
                        variant="hero"
                        title="Mock interview: Design a rate limiter"
                        subtitle="Question 5 / 8 · Middle · 12 minutes left"
                        urgent
                        value={5}
                        max={8}
                        ctaLabel="Continue"
                        onPress={() => {}}
                    />
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận biến thể của ContinueCard: variant=\"item\" (một trong N thứ có thể tiếp tục, " +
            "xếp lưới, CTA là SeeMoreLink thật, không viền accent, không icon) và variant=\"hero\" ở hai mức " +
            "cấp bách — không gấp (subtitle muted, không tiến độ) và gấp có tiến độ thật (urgent + value/max, " +
            "CTA chip trong HighlightCard). Dùng để tra khi nào chọn item so với hero, và khi nào bật urgent.",
    },
}
