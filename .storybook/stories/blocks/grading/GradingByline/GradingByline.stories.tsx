import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip, Typography } from "@heroui/react"
import { ModelByline, VerdictIcon } from "./GradingByline"
import { AiModelCategory } from "../../chips/AiCategoryChip/AiCategoryChip"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof ModelByline> = {
    title: "Design/Grading/GradingByline",
    component: ModelByline,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ModelByline>

const ANATOMY = {
    primitives: [
        { name: "AiCategoryChip", role: "chip hạng (tier) đứng sau tên model đã chấm" },
        { name: "SparkleIcon", role: "icon accent mở dòng attribution (HeroUI/phosphor)" },
        { name: "VerdictIcon", role: "glyph đạt/không đạt dùng lại ở chip kết quả + dòng lịch sử" },
    ],
    reason:
        "Gom hai mảnh attribution chấm bài dùng lại khắp result card / drawer / dòng lịch sử: ModelByline (sparkle + tên model plain-text + AiCategoryChip theo hạng) và VerdictIcon (đạt/không đạt). Quy tắc 'text rồi chip bên cạnh' được gói sẵn để mọi surface hiển thị model đã chấm nhất quán, không tự ghép lại chip-cạnh-chip.",
}

export const VerdictPass: Story = {
    render: () =>
        blockShell(
            <span className="flex items-center gap-2">
                <VerdictIcon pass />
                <Typography type="body-sm">Đạt</Typography>
            </span>,
            ANATOMY,
        ),
}

export const VerdictFail: Story = {
    render: () =>
        blockShell(
            <span className="flex items-center gap-2">
                <VerdictIcon pass={false} />
                <Typography type="body-sm">Không đạt</Typography>
            </span>,
            ANATOMY,
        ),
}

export const VerdictInChipPass: Story = {
    render: () =>
        blockShell(
            <Chip color="success" variant="soft" size="sm">
                <VerdictIcon pass />
                <Chip.Label>Đạt</Chip.Label>
            </Chip>,
            ANATOMY,
        ),
}

export const VerdictInChipFail: Story = {
    render: () =>
        blockShell(
            <Chip color="danger" variant="soft" size="sm">
                <VerdictIcon pass={false} />
                <Chip.Label>Không đạt</Chip.Label>
            </Chip>,
            ANATOMY,
        ),
}

export const BylineWithLabel: Story = {
    render: () =>
        blockShell(
            <div className="flex flex-wrap items-center gap-2">
                <ModelByline model="qwen2.5-coder-32b" category={AiModelCategory.Balanced} withLabel />
            </div>,
            ANATOMY,
        ),
}

export const BylineNoLabel: Story = {
    render: () =>
        blockShell(
            <div className="flex flex-wrap items-center gap-2">
                <ModelByline model="claude-sonnet-4-5" category={AiModelCategory.Frontier} />
            </div>,
            ANATOMY,
        ),
}

export const BylineNoTierChip: Story = {
    render: () =>
        blockShell(
            <div className="flex flex-wrap items-center gap-2">
                <ModelByline model="llama-3.1-8b-instruct" />
            </div>,
            ANATOMY,
        ),
}

export const BylineEmpty: Story = {
    render: () =>
        blockShell(
            <div className="flex min-h-6 items-center gap-2 rounded-lg border border-dashed border-default px-3">
                <Typography type="body-xs" color="muted">
                    (không render gì — model=null)
                </Typography>
                <ModelByline model={null} category={AiModelCategory.Economy} withLabel />
            </div>,
            ANATOMY,
        ),
}
