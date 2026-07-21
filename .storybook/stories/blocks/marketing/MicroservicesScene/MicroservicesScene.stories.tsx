import type { Meta, StoryObj } from "@storybook/nextjs"

import { MicroservicesScene } from "@/components/blocks/marketing/MicroservicesScene"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof MicroservicesScene> = {
    title: "Blocks/Marketing/MicroservicesScene",
    component: MicroservicesScene,
}

export default meta

type Story = StoryObj<typeof MicroservicesScene>

/**
 * Toàn bộ state của MicroservicesScene trong một gallery: không có caption,
 * caption ngắn điển hình, và caption dài phải xuống dòng dưới minh hoạ.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dùng gallery này để so trực tiếp cách MicroservicesScene hiển thị khi thiếu caption và khi caption dài ngắn khác nhau trên trang landing System Design/DevOps.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Không có caption"
                hint="Khi feature chỉ cần minh hoạ trực quan, không kèm câu giải thích — prop caption là optional nên có thể bỏ trống."
            >
                <MicroservicesScene />
            </Variant>
            <Variant
                label="Caption ngắn"
                hint="Trường hợp phổ biến nhất — một câu ngắn nêu bài học rút ra từ điểm nghẽn single-node DB trong minh hoạ."
            >
                <MicroservicesScene caption="Một node database duy nhất là điểm nghẽn của toàn hệ thống." />
            </Variant>
            <Variant
                label="Caption dài (wrap)"
                hint="Caption dài nhiều dòng — kiểm tra Typography căn giữa và padding ngang không vỡ layout khi khung hẹp."
            >
                <div className="max-w-[420px]">
                    <MicroservicesScene caption="Ba pod chạy song song phía sau service, nhưng cả ba đều ghi vào cùng một Postgres một node — khi lưu lượng tăng, node này nghẽn trước, kéo sập cả cụm dù các pod vẫn khoẻ." />
                </div>
            </Variant>
        </Gallery>
    ),
}
