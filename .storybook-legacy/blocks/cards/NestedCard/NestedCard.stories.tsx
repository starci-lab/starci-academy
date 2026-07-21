import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { StackIcon } from "@phosphor-icons/react"
import { NestedCard } from "@/components/blocks/cards/NestedCard"
import { Gallery, Variant } from "../../../../story-kit"
import { relatedSections } from "./components"

const meta: Meta<typeof NestedCard> = {
    title: "Legacy/Blocks/Cards/NestedCard",
    component: NestedCard,
    args: {
        title: "Related lessons",
        icon: <StackIcon aria-hidden focusable="false" className="size-4 shrink-0" />,
        bordered: true,
    },
}
export default meta
type Story = StoryObj<typeof NestedCard>

/**
 * Toàn bộ ma trận `bordered` của NestedCard: trong chat/modal/page card (surface-in-surface,
 * `bordered`) và trực tiếp trên `bg-background` (không `bordered`, card tự làm surface của
 * chính nó). Dùng để tra khi nào bật `bordered`.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Trong surface (bordered)"
                hint="Trong chat — panel `bg-surface`, tool-result dưới một bubble → `bordered` (surface-in-surface, không chồng fill). Chỉ bỏ `bordered` khi render trực tiếp trên `bg-background` (xem 'Trên background')."
            >
                <div className="flex flex-col overflow-hidden rounded-2xl border border-default bg-surface">
                    <div className="flex flex-col gap-2 p-3">
                        <div className="max-w-[85%] rounded-2xl bg-surface-secondary px-3 py-2">
                            <Typography type="body-sm">
                                It's usually when you see data repeated across many rows, or a column that depends on a non-primary-key column.
                            </Typography>
                        </div>
                        <div className="max-w-[85%]">
                            <NestedCard title="Related lessons" bordered>{relatedSections}</NestedCard>
                        </div>
                    </div>
                </div>
            </Variant>
            <Variant
                label="Trên background (không bordered)"
                hint="Hiếm — render trực tiếp trên `bg-background`, không có surface cha nào. Bỏ `bordered` → `bg-surface shadow-surface`. Mọi nơi trong chat/modal/page card đều dùng `bordered`."
            >
                <NestedCard title="Related lessons" bordered={false}>{relatedSections}</NestedCard>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận `bordered` của NestedCard: trong chat/modal/page card (surface-in-surface, " +
            "`bordered`) và trực tiếp trên `bg-background` (không `bordered`, card tự làm surface của chính " +
            "nó). Dùng để tra khi nào bật `bordered`.",
    },
}
