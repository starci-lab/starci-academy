import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { SelfHostGpuMark } from "./SelfHostGpuMark"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof SelfHostGpuMark> = {
    title: "Block/Grading/SelfHostGpuMark",
    component: SelfHostGpuMark,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SelfHostGpuMark>

const ANATOMY = {
    primitives: [
        { name: "Tooltip", role: "hover/focus mở giải thích self-host (HeroUI base)" },
        { name: "CpuIcon", role: "icon GPU accent, đánh dấu model chạy trên hạ tầng nội bộ" },
    ],
    reason:
        "Một dấu hiệu leaf: icon GPU + tooltip đứng cạnh tên model trong dropdown chấm bài để phân biệt model self-host (RTX 5060) với model gọi API bên ngoài. Chi tiết nằm trong tooltip nên dòng không phải gánh thêm chip — chỉ một icon nhỏ.",
}

export const Standalone: Story = {
    render: () => blockShell(<SelfHostGpuMark />, ANATOMY),
}

export const BesideModelName: Story = {
    render: () =>
        blockShell(
            <div className="flex items-center gap-2">
                <Typography type="body-sm">Qwen2.5-Coder 7B</Typography>
                <SelfHostGpuMark />
            </div>,
            ANATOMY,
        ),
}
