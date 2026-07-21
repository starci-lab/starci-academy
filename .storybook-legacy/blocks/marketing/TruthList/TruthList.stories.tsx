import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { TruthList } from "@/components/blocks/marketing/TruthList"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof TruthList> = {
    title: "Legacy/Blocks/Marketing/TruthList",
    component: TruthList,
}

export default meta

type Story = StoryObj<typeof TruthList>

const typicalTruths = [
    {
        truth: "Học xong khoá online là làm được việc ngay.",
        fix: "→ Mỗi module đóng bằng một sản phẩm chạy thật, review bởi mentor — không chỉ video xem xong là qua.",
    },
    {
        truth: "Chứng chỉ đẹp là đủ để nhà tuyển dụng gật đầu.",
        fix: "→ Portfolio là repo Git thật kèm log commit, không phải PDF in ra treo tường.",
    },
    {
        truth: "AI sẽ thay hết lập trình viên trong vài năm tới.",
        fix: "→ AI thay người không biết đọc lỗi. Chương trình dạy debug và đọc log trước khi dạy prompt.",
    },
    {
        truth: "Càng nhiều ngôn ngữ biết, càng dễ có việc.",
        fix: "→ Tuyển dụng chấm chiều sâu một stack, không chấm số lượng logo trên CV.",
    },
]

/**
 * Toàn bộ state của TruthList trong một gallery: rỗng, một sự thật, danh sách
 * điển hình có/không byline, và nội dung dài phải wrap trên khung hẹp.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dùng gallery này để so cách TruthList xử lý số lượng sự thật khác nhau và khi có/không có byline chốt cuối, trước khi ghép vào SectionCard trên landing page.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Rỗng"
                hint="Khi mảng items trống — kiểm tra khung accordion không vỡ layout và không hiện byline khi không truyền."
            >
                <TruthList items={[]} />
            </Variant>
            <Variant
                label="Một sự thật"
                hint="Khi phần chỉ cần nêu đúng một sự thật cốt lõi, không cần cả danh sách dài."
            >
                <TruthList
                    items={[
                        {
                            truth: "Bootcamp 3 tháng biến người mới thành senior.",
                            fix: "→ Senior cần va vấp thật qua nhiều dự án, khoá học chỉ rút ngắn đường đi chứ không rút ngắn số năm.",
                        },
                    ]}
                />
            </Variant>
            <Variant
                label="Danh sách điển hình, có byline"
                hint="Trường hợp phổ biến nhất trên landing: 4 sự thật kèm chữ ký người nói, để tăng độ tin của tuyên bố."
            >
                <TruthList
                    items={typicalTruths}
                    byline={
                        <Typography type="body-sm" color="muted">
                            Thầy Long — Founder, StarCi Academy
                        </Typography>
                    }
                />
            </Variant>
            <Variant
                label="Không byline"
                hint="Khi tuyên bố tự nó đã đủ nặng, không cần gắn tên người nói ở cuối."
            >
                <TruthList items={typicalTruths} />
            </Variant>
            <Variant
                label="Nội dung dài (wrap)"
                hint="Sự thật và câu trả lời dài trên khung hẹp — kiểm tra Typography xuống dòng, không đẩy vỡ accordion."
            >
                <div className="max-w-[360px]">
                    <TruthList
                        items={[
                            {
                                truth: "Chỉ cần giỏi thuật toán là qua được mọi vòng phỏng vấn hệ thống lớn ở công ty product.",
                                fix: "→ Vòng system design chấm khả năng đánh đổi giữa chi phí, độ trễ và độ tin cậy — không có sẵn trong leetcode, phải luyện riêng qua case thật.",
                            },
                        ]}
                    />
                </div>
            </Variant>
        </Gallery>
    ),
}
