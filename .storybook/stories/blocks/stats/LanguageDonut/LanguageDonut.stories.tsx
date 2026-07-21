import type { Meta, StoryObj } from "@storybook/nextjs"
import { LanguageDonut } from "@/components/blocks/stats/LanguageDonut"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof LanguageDonut> = {
    title: "Features/Progress/LanguageDonut",
    component: LanguageDonut,
}
export default meta
type Story = StoryObj<typeof LanguageDonut>

/**
 * Toàn bộ biến thể kích thước của LanguageDonut: cỡ mặc định cho nhiều ngôn ngữ, và cỡ compact
 * (size/thickness nhỏ) khi nhồi vào khối hẹp. Donut chia theo màu ngôn ngữ (dùng chung màu với chip
 * ngôn ngữ ở mọi nơi khác), tổng số ở tâm, kèm legend đếm + tỉ lệ % từng ngôn ngữ.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Nhiều ngôn ngữ (cỡ mặc định)"
                hint="Tóm tắt tỉ lệ ngôn ngữ kiểu GitHub — vòng donut chia theo màu brand của ngôn ngữ, tổng số ở tâm, legend liệt kê số lượng + phần trăm từng ngôn ngữ. Dùng khi có đủ không gian hiển thị (trang thống kê, hồ sơ)."
            >
                <LanguageDonut
                    ariaLabel="Phân bố bài giải theo ngôn ngữ"
                    unitLabel="bài giải"
                    items={[
                        { key: "typescript", value: 128 },
                        { key: "python", value: 64 },
                        { key: "java", value: 31 },
                        { key: "go", value: 18 },
                        { key: "csharp", value: 9 },
                    ]}
                />
            </Variant>
            <Variant
                label="Compact (size/thickness nhỏ)"
                hint="Giảm size/thickness khi donut phải nhồi vào khối hẹp (widget hồ sơ, góc card) — vòng donut nhỏ lại nhưng tổng số và legend vẫn đọc được."
            >
                <LanguageDonut
                    size={96}
                    thickness={6}
                    ariaLabel="Phân bố bài giải theo ngôn ngữ (compact)"
                    unitLabel="bài giải"
                    items={[
                        { key: "typescript", value: 42 },
                        { key: "go", value: 15 },
                    ]}
                />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ biến thể kích thước của LanguageDonut: cỡ mặc định cho nhiều ngôn ngữ, và cỡ compact " +
            "(size/thickness nhỏ) khi nhồi vào khối hẹp. Donut chia theo màu ngôn ngữ (dùng chung màu với chip " +
            "ngôn ngữ ở mọi nơi khác), tổng số ở tâm, kèm legend đếm + tỉ lệ % từng ngôn ngữ.",
    },
}
