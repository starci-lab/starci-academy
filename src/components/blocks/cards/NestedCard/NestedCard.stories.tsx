import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { StackIcon } from "@phosphor-icons/react"
import { NestedCard, NestedCardSection } from "./index"

const meta: Meta<typeof NestedCard> = {
    title: "Core/Card/NestedCard",
    component: NestedCard,
    args: {
        title: "Bài liên quan",
        icon: <StackIcon aria-hidden focusable="false" className="size-4 shrink-0" />,
        bordered: true,
    },
}
export default meta
type Story = StoryObj<typeof NestedCard>

const relatedSections = (
    <>
        <NestedCardSection
            eyebrow="Cơ sở dữ liệu quan hệ"
            title="Chuẩn hoá dữ liệu và các dạng chuẩn"
        >
            <Typography type="body-sm" color="muted">
                Chuẩn hoá tách dữ liệu thành nhiều bảng để giảm trùng lặp và bất thường khi cập nhật.
            </Typography>
        </NestedCardSection>
        <NestedCardSection
            eyebrow="Bộ thẻ ôn cơ sở dữ liệu"
            title="Khi nào nên khử chuẩn hoá để tối ưu đọc?"
        />
    </>
)

/**
 * ChatPanel tool-result: dưới bubble, trên panel `bg-surface`
 * → surface-in-surface (`bordered`).
 */
export const SurfaceInSurface: Story = {
    args: { bordered: true },
    parameters: {
        usage: "Trong chat — panel `bg-surface`, tool-result dưới bubble → `bordered` (surface-in-surface, không chồng fill). Chỉ khi render trực tiếp trên `bg-background` mới omit `bordered` (xem OnBackground).",
    },
    render: (args) => (
        <div className="flex w-[32rem] flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Trong chat</Label>
                <Typography type="body-sm" color="muted">
                    Panel `bg-surface` — NestedCard `bordered`, không chồng fill.
                </Typography>
            </div>
            <div className="flex flex-col overflow-hidden rounded-2xl border border-default bg-surface">
                <div className="flex flex-col gap-2 p-4">
                    <div className="max-w-[85%] rounded-2xl bg-surface-secondary px-3 py-2">
                        <Typography type="body-sm">
                            Thường là khi bạn thấy dữ liệu bị lặp lại nhiều dòng hoặc một cột phụ thuộc vào cột không phải khoá chính.
                        </Typography>
                    </div>
                    <div className="max-w-[85%]">
                        <NestedCard {...args}>{relatedSections}</NestedCard>
                    </div>
                </div>
            </div>
        </div>
    ),
}

/** Trên `bg-background` (không parent surface): card tự là surface. */
export const OnBackground: Story = {
    args: { bordered: false },
    parameters: {
        usage: "Hiếm — render trực tiếp trên `bg-background`, không parent surface nào. Omit `bordered` → `bg-surface shadow-surface`. Mọi chỗ trong chat/modal/page card đều dùng `bordered`.",
    },
    render: (args) => (
        <div className="flex w-[32rem] flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Trên nền trang</Label>
                <Typography type="body-sm" color="muted">
                    Không lồng surface — bản thân NestedCard là card `bg-surface`.
                </Typography>
            </div>
            <NestedCard {...args}>{relatedSections}</NestedCard>
        </div>
    ),
}
