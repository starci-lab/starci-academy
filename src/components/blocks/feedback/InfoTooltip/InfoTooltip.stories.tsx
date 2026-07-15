import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import { InfoTooltip } from "./index"

/**
 * `InfoTooltip` — cách DUY NHẤT gắn 1 câu giải thích cho thuật ngữ khó (rank, tier,
 * streak, KPI…). Hiện khi HOVER/FOCUS, nội dung TĨNH đọc-rồi-thôi. KHÔNG dùng cho
 * affordance bấm-để-mở panel (→ `Popover`) — hover không vào được trên touch.
 */
const meta: Meta<typeof InfoTooltip> = {
    title: "Core/Overlays/InfoTooltip",
    component: InfoTooltip,
}

export default meta

type Story = StoryObj<typeof InfoTooltip>

/** Dùng khi cần giải thích 1 thuật ngữ khó ngay tại chỗ (title = thuật ngữ, description = 1 câu dễ hiểu). */
export const Default: Story = {
    args: {
        title: "Streak",
        description: "Số ngày học liên tiếp không gián đoạn; nghỉ 1 ngày là reset về 0.",
        children: <span className="cursor-help underline decoration-dotted">Chuỗi ngày</span>,
    },
    parameters: {
        usage: "Giải thích thuật ngữ khó (streak/rank/tier) tại chỗ — hover/focus hiện. KHÔNG cho affordance bấm (→ Popover).",
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.hover(canvas.getByText("Chuỗi ngày"))
        await waitFor(() =>
            expect(
                screen.getByText("Số ngày học liên tiếp không gián đoạn; nghỉ 1 ngày là reset về 0."),
            ).toBeInTheDocument(),
        )
    },
}

/** Dùng khi thuật ngữ đã tự rõ, chỉ cần 1 dòng mô tả — bỏ title cho gọn. */
export const DescriptionOnly: Story = {
    args: {
        description: "Xếp hạng theo tổng XP trong tuần, làm mới mỗi thứ Hai.",
        children: <span className="cursor-help underline decoration-dotted">Bảng xếp hạng tuần</span>,
    },
    parameters: {
        usage: "Khi thuật ngữ đã tự rõ, chỉ cần 1 dòng mô tả — bỏ title cho gọn.",
    },
}

/** Dùng khi cần body giàu hơn (nhiều dòng, giá trị nổi) — truyền `content` tự compose thay cho title/description. */
export const Composed: Story = {
    args: {
        children: <span className="cursor-help underline decoration-dotted">Điểm nhiệm vụ</span>,
        content: (
            <div className="flex flex-col gap-1">
                <Typography type="body-sm">
                    Điểm nhiệm vụ
                </Typography>
                <div className="flex items-center justify-between gap-4">
                    <Typography type="body-xs" color="muted">Bài tập code</Typography>
                    <Typography type="body-xs">+10</Typography>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <Typography type="body-xs" color="muted">Phỏng vấn thử</Typography>
                    <Typography type="body-xs">+25</Typography>
                </div>
            </div>
        ),
    },
    parameters: {
        usage: "Khi cần body giàu hơn (nhiều dòng, giá trị nổi) — truyền `content` tự compose thay title/description.",
    },
}

/** Chọn hướng neo theo chỗ trống quanh trigger để tooltip không tràn mép màn hình. */
export const Placements: Story = {
    parameters: {
        usage: "4 hướng neo (top/bottom/left/right) — chọn theo chỗ trống quanh trigger để tooltip không tràn mép.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Top</Label>
                    <Typography type="body-sm" color="muted">
                        Mặc định — trigger nằm gần mép dưới màn hình, còn khoảng trống phía trên.
                    </Typography>
                </div>
                <InfoTooltip
                    placement="top"
                    title="Top"
                    description="Tooltip neo hướng top."
                >
                    <span className="cursor-help underline decoration-dotted">Top</span>
                </InfoTooltip>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Bottom</Label>
                    <Typography type="body-sm" color="muted">
                        Trigger nằm sát mép trên (header/đầu trang), còn khoảng trống phía dưới.
                    </Typography>
                </div>
                <InfoTooltip
                    placement="bottom"
                    title="Bottom"
                    description="Tooltip neo hướng bottom."
                >
                    <span className="cursor-help underline decoration-dotted">Bottom</span>
                </InfoTooltip>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Left</Label>
                    <Typography type="body-sm" color="muted">
                        Trigger nằm sát mép phải, còn khoảng trống bên trái.
                    </Typography>
                </div>
                <InfoTooltip
                    placement="left"
                    title="Left"
                    description="Tooltip neo hướng left."
                >
                    <span className="cursor-help underline decoration-dotted">Left</span>
                </InfoTooltip>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Right</Label>
                    <Typography type="body-sm" color="muted">
                        Trigger nằm sát mép trái, còn khoảng trống bên phải.
                    </Typography>
                </div>
                <InfoTooltip
                    placement="right"
                    title="Right"
                    description="Tooltip neo hướng right."
                >
                    <span className="cursor-help underline decoration-dotted">Right</span>
                </InfoTooltip>
            </div>
        </div>
    ),
}
