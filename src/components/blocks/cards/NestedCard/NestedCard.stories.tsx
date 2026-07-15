import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { ArrowRightIcon, StackIcon } from "@phosphor-icons/react"
import { NestedCard, NestedCardSection } from "./index"

const meta: Meta<typeof NestedCard> = {
    title: "Core/Card/NestedCard",
    component: NestedCard,
}
export default meta
type Story = StoryObj<typeof NestedCard>

/** Link kiểu "Đọc →" cho action mỗi section — cùng tông accent như ChatToolResult. */
const ActionLink = ({ children }: { children: string }) => (
    <span className="flex items-center gap-1 text-sm font-medium text-accent-soft-foreground">
        {children}
        <ArrowRightIcon aria-hidden focusable="false" className="size-4" />
    </span>
)

/**
 * Surface-in-surface như panel chat: card ngoài `border` + heading `text-sm text-muted`,
 * body là NestedCardSection (mỗi section sub-card bordered — shadow vô hình trên surface).
 */
export const Default: Story = {
    parameters: {
        usage: "Surface-in-surface: card ngoài border-only + heading `text-sm text-muted` (icon + nhãn + count). Body = NestedCardSection — mỗi section là sub-card bordered (không shadow). Dùng cho panel gom nhóm (tool chat, bài liên quan). Danh sách phẳng không sub-header → CheckListCard / SurfaceListCard.",
    },
    render: () => (
        <div className="flex w-[32rem] flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Surface-in-surface</Label>
                <Typography type="body-sm" color="muted">
                    Giống panel trong chat: border ngoài, heading mờ, section con có viền riêng.
                </Typography>
            </div>
            {/* Parent surface — giống nền chat — để thấy nested border (không phải shadow) */}
            <div className="rounded-3xl bg-surface-secondary p-4">
                <NestedCard
                    title="Bài liên quan"
                    icon={<StackIcon aria-hidden focusable="false" className="size-4 shrink-0" />}
                    trailing={<Typography type="body-sm" color="muted">2</Typography>}
                >
                    <NestedCardSection
                        eyebrow="Cơ sở dữ liệu quan hệ"
                        title="Chuẩn hoá dữ liệu và các dạng chuẩn"
                        action={<ActionLink>Đọc</ActionLink>}
                    >
                        <Typography type="body-sm" color="muted">
                            Chuẩn hoá tách dữ liệu thành nhiều bảng để giảm trùng lặp và bất thường khi cập nhật.
                        </Typography>
                    </NestedCardSection>
                    <NestedCardSection
                        eyebrow="Bộ thẻ ôn cơ sở dữ liệu"
                        title="Khi nào nên khử chuẩn hoá để tối ưu đọc?"
                        action={<ActionLink>Ôn</ActionLink>}
                    />
                </NestedCard>
            </div>
        </div>
    ),
}
