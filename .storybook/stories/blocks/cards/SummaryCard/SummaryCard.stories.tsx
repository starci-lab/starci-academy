import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    BookOpenIcon,
    FireIcon,
    TrophyIcon,
} from "@phosphor-icons/react"
import { SummaryCard } from "@/components/blocks/cards/SummaryCard"
import { Gallery, Variant, VariantRow } from "../../../../story-kit"

const meta: Meta<typeof SummaryCard> = {
    title: "Blocks/Cards/SummaryCard",
    component: SummaryCard,
}

export default meta

type Story = StoryObj<typeof SummaryCard>

/**
 * Toàn bộ state của `SummaryCard` trong một gallery: có hint / không hint /
 * nội dung dài tràn dòng / một hàng nhiều thẻ như khi dùng thật trong tổng
 * quan hồ sơ. Component là presentational, không có state rỗng/loading/error/
 * disabled riêng (không expose `isDisabled` qua props) nên không dựng các
 * state đó ở đây.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dùng để phủ toàn bộ state thật của SummaryCard trong một màn — so sánh cạnh nhau khi chỉnh spacing/typography.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Có hint"
                hint="Dùng khi cần thêm 1 dòng chú giải ngắn dưới label — ví dụ mốc thời gian gần nhất, để người dùng hiểu số liệu mà không cần bấm vào."
            >
                <div className="max-w-xs">
                    <SummaryCard
                        icon={<BookOpenIcon className="size-6" aria-hidden focusable="false" />}
                        value="12"
                        label="Khóa đã hoàn thành"
                        hint="Gần nhất: 15/07/2026"
                        onPress={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="Không có hint"
                hint="Dùng khi số liệu + label đã tự giải thích được, không cần thêm dòng chú giải (ví dụ streak ngày học liên tiếp)."
            >
                <div className="max-w-xs">
                    <SummaryCard
                        icon={<FireIcon className="size-6" aria-hidden focusable="false" />}
                        value="7"
                        label="Ngày học liên tiếp"
                        onPress={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="Nội dung dài (tràn dòng)"
                hint="Kiểm tra khi label hoặc hint dài hơn bình thường — thẻ phải giữ chiều rộng cố định và xuống dòng, không phá layout hay cắt chữ."
            >
                <div className="max-w-xs">
                    <SummaryCard
                        icon={<TrophyIcon className="size-6" aria-hidden focusable="false" />}
                        value="4.8/5"
                        label="Điểm trung bình các bài chấm phỏng vấn thử"
                        hint="Tính trên toàn bộ lượt chấm trong 3 tháng gần nhất"
                        onPress={() => {}}
                    />
                </div>
            </Variant>
            <VariantRow
                label="Một hàng nhiều thẻ (dùng thật trong tổng quan hồ sơ)"
                hint="Cách dùng thật: 3 thẻ metric xếp cạnh nhau trong màn tổng quan, mỗi thẻ dẫn sâu vào 1 tab riêng khi bấm."
            >
                <div className="w-56">
                    <SummaryCard
                        icon={<BookOpenIcon className="size-6" aria-hidden focusable="false" />}
                        value="12"
                        label="Khóa đã hoàn thành"
                        hint="Gần nhất: 15/07/2026"
                        onPress={() => {}}
                    />
                </div>
                <div className="w-56">
                    <SummaryCard
                        icon={<FireIcon className="size-6" aria-hidden focusable="false" />}
                        value="7"
                        label="Ngày học liên tiếp"
                        onPress={() => {}}
                    />
                </div>
                <div className="w-56">
                    <SummaryCard
                        icon={<TrophyIcon className="size-6" aria-hidden focusable="false" />}
                        value="4.8/5"
                        label="Điểm trung bình bài chấm"
                        onPress={() => {}}
                    />
                </div>
            </VariantRow>
        </Gallery>
    ),
}
