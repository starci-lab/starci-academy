import type { Meta, StoryObj } from "@storybook/nextjs"
import { DeadlineCallout } from "@/components/blocks/stats/DeadlineCallout"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof DeadlineCallout> = {
    title: "Blocks/Stats/DeadlineCallout",
    component: DeadlineCallout,
    // NEW — pending review ("Chờ duyệt")
    tags: ["news"],
}
export default meta
type Story = StoryObj<typeof DeadlineCallout>

/**
 * Toàn bộ ma trận trạng thái của DeadlineCallout: bản đầy đủ (panel + forecast
 * 7 ngày có spike + caption chốt hành động) và bản chỉ có panel khi chưa đủ dữ
 * liệu dự báo. Dùng để tra khi nào bỏ forecast/caption thay vì render dòng rỗng.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Đầy đủ — panel + forecast + caption"
                hint="Dùng cho khu vực khẩn cấp luôn kèm đếm ngược (ví dụ „sắp quên” trong stats ôn flashcard) — dòng forecast cho thấy tải 7 ngày tới, Thứ 6 là ngày dồn cục (fill màu danger) nên người học thấy trước khi bị dồn; caption chốt hành động cần làm."
            >
                <DeadlineCallout
                    count={12}
                    title="12 thẻ sẽ tuột khỏi trí nhớ trước Thứ 5"
                    hint="Ôn ngay hôm nay để giữ — để qua ngưỡng là phải học lại từ đầu."
                    forecast={[
                        { label: "T4", ratio: 0.3 },
                        { label: "T5", ratio: 0.45 },
                        { label: "T6", ratio: 1, spike: true },
                        { label: "T7", ratio: 0.38 },
                        { label: "CN", ratio: 0.22 },
                        { label: "T2", ratio: 0.3 },
                        { label: "T3", ratio: 0.18 },
                    ]}
                    caption="Thứ 6 dồn 34 thẻ — làm bớt 15 hôm nay để san phẳng."
                />
            </Variant>
            <Variant
                label="Chỉ có panel — chưa có forecast"
                hint="Chưa đủ lịch sử ôn để dự báo 7 ngày tới — bỏ luôn cả forecast và caption thay vì render dòng rỗng; panel (đếm + câu + hint) vẫn là một callout hoàn chỉnh, tự đứng được một mình."
            >
                <DeadlineCallout
                    count={3}
                    title="3 thẻ sẽ tuột khỏi trí nhớ trước Thứ 3"
                    hint="Ôn ngay hôm nay để giữ."
                />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của DeadlineCallout: bản đầy đủ (panel + forecast 7 ngày có ngày " +
            "spike dồn cục + caption chốt hành động) dùng cho khu vực khẩn cấp luôn kèm đếm ngược (ví dụ " +
            "\"sắp quên\" trong stats ôn flashcard); và bản chỉ có panel khi chưa đủ dữ liệu dự báo — bỏ cả " +
            "forecast và caption thay vì render dòng rỗng. Cho một dòng trạng thái phẳng không đếm ngược, " +
            "dùng Callout thay vì DeadlineCallout.",
    },
}
