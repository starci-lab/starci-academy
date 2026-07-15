import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { LanguageDonut } from "./index"

const meta: Meta<typeof LanguageDonut> = {
    title: "Core/Stat/LanguageDonut",
    component: LanguageDonut,
}
export default meta
type Story = StoryObj<typeof LanguageDonut>

/**
 * Dùng để tóm tắt "dev này code bằng ngôn ngữ gì" kiểu GitHub — vòng donut chia theo ngôn ngữ (màu thương
 * hiệu), tổng ở giữa, kèm chú thích số + tỉ lệ từng ngôn ngữ. Màu lấy từ map dùng chung nên đồng bộ với
 * language chip ở mọi nơi. Block tự lo look; caller chỉ truyền items + nhãn đơn vị.
 */
export const Default: Story = {
    parameters: {
        usage:
            "Dùng để tóm tắt dev này code bằng ngôn ngữ gì kiểu GitHub — vòng donut chia theo ngôn ngữ (màu " +
            "thương hiệu), tổng ở giữa, kèm chú thích số + tỉ lệ từng ngôn ngữ. Màu lấy từ map dùng chung nên " +
            "đồng bộ với language chip ở mọi nơi. Block tự lo look; caller chỉ truyền items + nhãn đơn vị.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Nhiều ngôn ngữ</Label>
                <Typography type="body-sm" color="muted">
                    Dùng khi cần tóm tắt tỉ lệ ngôn ngữ dev đã dùng — vòng chia màu thương hiệu, tổng ở giữa,
                    legend kèm số và phần trăm từng ngôn ngữ.
                </Typography>
            </div>
            <LanguageDonut
                ariaLabel="Phân bố bài giải theo ngôn ngữ"
                unitLabel="bài"
                items={[
                    { key: "typescript", value: 128 },
                    { key: "python", value: 64 },
                    { key: "java", value: 31 },
                    { key: "go", value: 18 },
                    { key: "csharp", value: 9 },
                ]}
            />
        </div>
    ),
}

/** Dùng `size`/`thickness` nhỏ khi donut nhúng vào khối hẹp (widget hồ sơ, góc card) — vòng gọn lại nhưng tổng + chú thích vẫn đọc được. */
export const Compact: Story = {
    parameters: {
        usage: "Dùng size/thickness nhỏ khi donut nhúng vào khối hẹp (widget hồ sơ, góc card) — vòng gọn lại nhưng tổng + chú thích vẫn đọc được.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Thu gọn</Label>
                <Typography type="body-sm" color="muted">
                    Dùng size/thickness nhỏ khi nhúng donut vào khối hẹp (widget hồ sơ, góc card) — vòng gọn lại
                    nhưng tổng và chú thích vẫn đọc được.
                </Typography>
            </div>
            <LanguageDonut
                size={96}
                thickness={6}
                ariaLabel="Phân bố bài giải theo ngôn ngữ (thu gọn)"
                unitLabel="bài"
                items={[
                    { key: "typescript", value: 42 },
                    { key: "go", value: 15 },
                ]}
            />
        </div>
    ),
}
