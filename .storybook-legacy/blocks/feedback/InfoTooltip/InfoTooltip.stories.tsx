import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import { InfoTooltip } from "@/components/blocks/feedback/InfoTooltip"
import { Gallery, Variant } from "../../../../story-kit"

/**
 * `InfoTooltip` — the ONLY way to attach a one-line explanation to a tricky term (rank,
 * tier, streak, KPI…). Shows on HOVER/FOCUS, with STATIC read-once content. Do NOT use it
 * for a click-to-open-panel affordance (→ `Popover`) — hover isn't reachable on touch.
 */
const meta: Meta<typeof InfoTooltip> = {
    title: "Legacy/Overlays/InfoTooltip",
    component: InfoTooltip,
}

export default meta

type Story = StoryObj<typeof InfoTooltip>

/**
 * Toàn bộ hình dạng nội dung và hướng anchor của InfoTooltip: title+description, chỉ
 * description, content tự compose (nhiều dòng/giá trị nổi bật), và 4 hướng anchor
 * (top/bottom/left/right). Dùng để tra khi nào dùng title+description, khi nào chỉ cần
 * description, khi nào phải tự compose content, và chọn placement theo không gian quanh
 * trigger.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Title + description"
                hint="Giải thích một thuật ngữ khó hiểu (streak/rank/tier) ngay tại chỗ — title là thuật ngữ, description là một câu dễ hiểu."
            >
                <InfoTooltip
                    title="Streak"
                    description="Consecutive days studied without a break; miss one day and it resets to 0."
                >
                    <span className="cursor-help underline decoration-dotted">Day streak</span>
                </InfoTooltip>
            </Variant>
            <Variant
                label="Chỉ description"
                hint="Khi thuật ngữ đã đủ rõ nghĩa, chỉ cần một câu mô tả — bỏ title để tooltip gọn hơn."
            >
                <InfoTooltip description="Ranked by total XP for the week, refreshed every Monday.">
                    <span className="cursor-help underline decoration-dotted">Weekly leaderboard</span>
                </InfoTooltip>
            </Variant>
            <Variant
                label="Content tự compose"
                hint="Khi cần một thân tooltip nhiều dòng, có giá trị nổi bật — truyền `content` và tự compose thay vì dùng title/description."
            >
                <InfoTooltip
                    content={
                        <div className="flex flex-col gap-1">
                            <Typography type="body-sm">
                                Task points
                            </Typography>
                            <div className="flex items-center justify-between gap-4">
                                <Typography type="body-xs" color="muted">Coding exercise</Typography>
                                <Typography type="body-xs">+10</Typography>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <Typography type="body-xs" color="muted">Mock interview</Typography>
                                <Typography type="body-xs">+25</Typography>
                            </div>
                        </div>
                    }
                >
                    <span className="cursor-help underline decoration-dotted">Task points</span>
                </InfoTooltip>
            </Variant>
            <Variant
                label="Placement: top (mặc định)"
                hint="Mặc định — dùng khi trigger nằm gần cạnh dưới màn hình, còn khoảng trống phía trên."
            >
                <InfoTooltip placement="top" title="Top" description="Tooltip anchored to the top.">
                    <span className="cursor-help underline decoration-dotted">Top</span>
                </InfoTooltip>
            </Variant>
            <Variant
                label="Placement: bottom"
                hint="Dùng khi trigger nằm gần cạnh trên (header/đầu trang), còn khoảng trống phía dưới."
            >
                <InfoTooltip placement="bottom" title="Bottom" description="Tooltip anchored to the bottom.">
                    <span className="cursor-help underline decoration-dotted">Bottom</span>
                </InfoTooltip>
            </Variant>
            <Variant
                label="Placement: left"
                hint="Dùng khi trigger nằm gần cạnh phải, còn khoảng trống bên trái."
            >
                <InfoTooltip placement="left" title="Left" description="Tooltip anchored to the left.">
                    <span className="cursor-help underline decoration-dotted">Left</span>
                </InfoTooltip>
            </Variant>
            <Variant
                label="Placement: right"
                hint="Dùng khi trigger nằm gần cạnh trái, còn khoảng trống bên phải."
            >
                <InfoTooltip placement="right" title="Right" description="Tooltip anchored to the right.">
                    <span className="cursor-help underline decoration-dotted">Right</span>
                </InfoTooltip>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ hình dạng nội dung và hướng anchor của InfoTooltip: title+description, chỉ description, " +
            "content tự compose, và 4 hướng anchor (top/bottom/left/right). Dùng để tra khi nào dùng " +
            "title+description, khi nào chỉ cần description, khi nào phải tự compose content, và chọn " +
            "placement theo không gian quanh trigger.",
    },
}

/**
 * Kiểm tra hành vi hover: tooltip phải hiện ra khi hover/focus vào trigger. Chỉ dùng cho
 * cách dùng hover-để-xem — không dùng cho hành vi bấm-để-mở (đó là việc của `Popover`).
 */
export const HoverReveal: Story = {
    args: {
        title: "Streak",
        description: "Consecutive days studied without a break; miss one day and it resets to 0.",
        children: <span className="cursor-help underline decoration-dotted">Day streak</span>,
    },
    parameters: {
        usage:
            "Giải thích một thuật ngữ khó hiểu (streak/rank/tier) ngay tại chỗ — hiện khi hover/focus. " +
            "Không dùng cho hành vi bấm-để-mở (→ Popover).",
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.hover(canvas.getByText("Day streak"))
        await waitFor(() =>
            expect(
                screen.getByText("Consecutive days studied without a break; miss one day and it resets to 0."),
            ).toBeInTheDocument(),
        )
    },
}
