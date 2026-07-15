import type { Meta, StoryObj } from "@storybook/nextjs"
import { LanguageDonut } from "./index"

const meta: Meta<typeof LanguageDonut> = {
    title: "Blocks/LanguageDonut",
    component: LanguageDonut,
}
export default meta
type Story = StoryObj<typeof LanguageDonut>

/** Dùng ở trang thống kê cá nhân để cho học viên thấy tỉ trọng ngôn ngữ đã dùng khi làm bài. */
export const Default: Story = {
    parameters: { usage: "Dùng ở trang thống kê cá nhân để cho học viên thấy tỉ trọng ngôn ngữ đã dùng khi làm bài." },
    render: () => (
        <LanguageDonut
            items={[
                { key: "typescript", value: 42 },
                { key: "python", value: 27 },
                { key: "javascript", value: 15 },
                { key: "go", value: 8 },
            ]}
            unitLabel="bài đã giải"
            ariaLabel="Biểu đồ tỉ trọng ngôn ngữ đã dùng để giải bài"
        />
    ),
}

/** Thu nhỏ donut khi đặt trong một thẻ (card) hẹp hoặc cạnh các số liệu khác. */
export const NhoGon: Story = {
    parameters: { usage: "Thu nhỏ donut khi đặt trong một thẻ (card) hẹp hoặc cạnh các số liệu khác." },
    render: () => (
        <LanguageDonut
            items={[
                { key: "csharp", value: 18 },
                { key: "cpp", value: 6 },
            ]}
            unitLabel="bài"
            ariaLabel="Biểu đồ tỉ trọng ngôn ngữ đã dùng để giải bài"
            size={80}
            thickness={6}
        />
    ),
}

/** Khi học viên chỉ mới làm bài bằng đúng một ngôn ngữ, donut vẫn hiển thị trọn vòng cho ngôn ngữ đó. */
export const MotNgonNgu: Story = {
    parameters: { usage: "Khi học viên chỉ mới làm bài bằng đúng một ngôn ngữ, donut vẫn hiển thị trọn vòng cho ngôn ngữ đó." },
    render: () => (
        <LanguageDonut
            items={[{ key: "javascript", value: 12 }]}
            unitLabel="bài đã giải"
            ariaLabel="Biểu đồ tỉ trọng ngôn ngữ đã dùng để giải bài"
        />
    ),
}

/** Với học viên đã thử qua nhiều ngôn ngữ, legend liệt kê đủ từng dòng kèm số lượng và phần trăm. */
export const NhieuNgonNgu: Story = {
    parameters: { usage: "Với học viên đã thử qua nhiều ngôn ngữ, legend liệt kê đủ từng dòng kèm số lượng và phần trăm." },
    render: () => (
        <LanguageDonut
            items={[
                { key: "typescript", value: 30 },
                { key: "python", value: 22 },
                { key: "javascript", value: 14 },
                { key: "go", value: 11 },
                { key: "csharp", value: 9 },
                { key: "cpp", value: 5 },
            ]}
            unitLabel="bài đã giải"
            ariaLabel="Biểu đồ tỉ trọng ngôn ngữ đã dùng để giải bài"
            size={160}
        />
    ),
}
