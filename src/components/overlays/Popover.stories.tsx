import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Popover, Typography } from "@heroui/react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

/**
 * `Popover` — panel nổi NEO vào trigger, mở bằng CLICK/TAP (không phải hover). Dùng
 * cho nội dung "xem-rồi-quay-lại" cần đọc kỹ / tương tác: breakdown giá, mini-menu,
 * mini-form. KHÔNG cho 1 câu giải thích thuật ngữ (→ `InfoTooltip`) hay bước CHẶN
 * cần quyết/nhập (→ Modal). Trigger phải là 1 phần tử focus được (`Button`/`<button>`).
 */
const meta: Meta<typeof Popover> = {
    title: "Overlays/Popover",
    component: Popover,
}

export default meta

type Story = StoryObj<typeof Popover>

/** Dùng khi cần panel thông tin neo vào 1 nút, mở bằng bấm/chạm — chạy cả mobile (khác hover-Tooltip). */
export const Default: Story = {
    parameters: {
        usage: "Panel neo vào 1 nút, mở bằng bấm/chạm (không hover) — dùng cho breakdown, mini-menu, mini-form. Đóng khi bấm ra ngoài / Esc. Chạy cả mobile.",
    },
    render: () => (
        <Popover>
            <Popover.Trigger>
                <Button size="sm" variant="secondary">
                    Chi tiết
                </Button>
            </Popover.Trigger>
            <Popover.Content className="max-w-xs">
                <div className="flex flex-col gap-1 p-3">
                    <Typography type="body-xs" color="muted">
                        Thông tin thêm
                    </Typography>
                    <Typography type="body-sm">
                        Panel đóng khi bấm ra ngoài hoặc nhấn Esc.
                    </Typography>
                </div>
            </Popover.Content>
        </Popover>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(await canvas.findByRole("button", { name: "Chi tiết" }))
        await waitFor(() =>
            expect(screen.getByText("Panel đóng khi bấm ra ngoài hoặc nhấn Esc.")).toBeInTheDocument(),
        )
    },
}

/** Dùng cho panel giàu nội dung (tiêu đề + các dòng số) — vẫn là một Popover click/tap, nội dung `gap-3`, dòng chốt tách `border-t`. */
export const RichContent: Story = {
    parameters: {
        usage: "Panel nhiều dòng (breakdown/tóm tắt): label `text-sm text-muted`, nội dung `gap-3`, dòng chốt tách `border-t` — vẫn mở bằng bấm/chạm.",
    },
    render: () => (
        <Popover>
            <Popover.Trigger>
                <Button size="sm" variant="secondary">
                    Chi tiết giá
                </Button>
            </Popover.Trigger>
            <Popover.Content className="max-w-xs">
                <div className="flex flex-col gap-1 p-3">
                    <Typography type="body-xs" color="muted">
                        Chi tiết giá
                    </Typography>
                    <div className="flex items-center justify-between gap-3">
                        <Typography type="body-sm">Giá gốc</Typography>
                        <Typography type="body-sm">1.990.000₫</Typography>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <Typography type="body-sm" color="muted">Ưu đãi Early-bird</Typography>
                        <Typography type="body-sm" className="text-success-soft-foreground">−400.000₫</Typography>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-default pt-1">
                        <Typography type="body-sm" weight="semibold">Bạn trả</Typography>
                        <Typography type="body-sm" weight="semibold">1.590.000₫</Typography>
                    </div>
                </div>
            </Popover.Content>
        </Popover>
    ),
}
