import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { SelfHostGpuMark } from "@/components/blocks/grading/SelfHostGpuMark"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof SelfHostGpuMark> = {
    title: "Blocks/Grading/SelfHostGpuMark",
    component: SelfHostGpuMark,
}
export default meta
type Story = StoryObj<typeof SelfHostGpuMark>

/**
 * SelfHostGpuMark chỉ có một hình hài — icon GPU kèm tooltip, không có
 * variant/tone/size. Gallery này phủ hai bối cảnh render THẬT của nó: đứng
 * độc lập, và ghép cạnh tên model trong một dòng danh sách (nơi block này
 * thực sự được dùng, trong dropdown chọn model chấm bài).
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Gắn SelfHostGpuMark ngay sau tên model self-host trên hạ tầng của StarCi (ví dụ RTX 5060), để phân biệt với model gọi qua API bên ngoài. Chi tiết nằm trong tooltip khi hover/focus vào icon, không cần thêm chip phụ trên dòng.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Đứng độc lập"
                hint="Icon trần, dùng khi chỉ cần đánh dấu self-host mà không kèm theo tên model."
            >
                <SelfHostGpuMark />
            </Variant>
            <Variant
                label="Ghép cạnh tên model"
                hint="Bối cảnh dùng thật nhất — trong dropdown chọn model chấm bài, đặt ngay sau tên model self-host trên GPU nội bộ."
            >
                <div className="flex items-center gap-2">
                    <Typography type="body-sm">Qwen2.5-Coder 7B</Typography>
                    <SelfHostGpuMark />
                </div>
            </Variant>
        </Gallery>
    ),
}
