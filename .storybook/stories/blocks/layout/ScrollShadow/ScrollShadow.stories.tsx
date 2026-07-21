import type { Meta, StoryObj } from "@storybook/nextjs"
import { ScrollShadow, Typography } from "@heroui/react"

import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import { Gallery, Variant } from "../../../../story-kit"
import { HorizontalDragDemo } from "./components"

/**
 * `ScrollShadow` (HeroUI) — a scroll area with a FADE at the edge to signal "there's more content that way".
 * Wrap it around overflowing content inside a SIZE-CONSTRAINED frame: vertically use
 * `max-h-* overflow-y-auto`, horizontally use `orientation="horizontal" overflow-x-auto`.
 * Use it when a hard-cut edge makes users think the list has ended; `hideScrollBar` hides
 * the scrollbar so the fade is the only affordance. Don't nest it inside another scroll
 * area (e.g. Modal `scroll="inside"`) — two overlapping scrollers produce two scrollbars.
 */
const meta: Meta<typeof ScrollShadow> = {
    title: "Primitives/Utility/ScrollShadow",
    component: ScrollShadow,
}
export default meta
type Story = StoryObj<typeof ScrollShadow>

/**
 * Hai hướng cuộn của ScrollShadow: dọc trong một khung `LabeledCard` bo gọn danh
 * sách dài, và ngang kéo-thả cho một dải chip rộng hơn khung chứa. Dùng để tra
 * cách phối `offset`/`hideScrollBar` và khi nào cần `LabeledCard flushContent`
 * hay `motion.div` kéo bằng tay.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Cuộn dọc"
                hint="Cuộn dọc trong một khối có tiêu đề → bọc `LabeledCard flushContent` (xoá padding gốc `p-3` của `.card` + `CardContent`) rồi `ScrollShadow` `max-h-* overflow-y-auto`. Divider full-bleed nhờ `SurfaceListCardRow` (`after:left-0 after:w-full`) — chỉ đặt `p-0` ở Content thì divider vẫn bị inset vì Card gốc còn padding. `offset` (ví dụ 8) tắt fade ngay khi cuộn tới đầu/cuối."
            >
                <div className="max-w-sm">
                    <LabeledCard label="Transaction history" flushContent>
                        <ScrollShadow
                            hideScrollBar
                            offset={8}
                            className="max-h-64 overflow-y-auto"
                        >
                            {Array.from({ length: 16 }).map((_, index) => (
                                <SurfaceListCardRow
                                    key={index}
                                    title={`Transaction #${1000 + index}`}
                                    meta={
                                        <Typography type="body-sm" color="muted">
                                            1.200.000đ
                                        </Typography>
                                    }
                                />
                            ))}
                        </ScrollShadow>
                    </LabeledCard>
                </div>
            </Variant>
            <Variant
                label="Cuộn ngang"
                hint="`orientation=&quot;horizontal&quot;` + `overflow-x-auto` cho một dải item rộng hơn khung chứa — fade bên trái/phải. Mỗi item trong dải là `Button variant=&quot;tertiary&quot; size=&quot;sm&quot;`. Bọc trong `motion.div` + `onPan` map delta.x → `scrollLeft`. Con trỏ tay: `cursor-grab` / `cursor-grabbing` lúc `onPan`. `offset={8}` tắt fade khi cuộn tới mép."
            >
                <HorizontalDragDemo />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Hai hướng cuộn của ScrollShadow: dọc trong `LabeledCard` bo danh sách dài (fade trên/dưới), " +
            "và ngang kéo-thả một dải chip rộng hơn khung chứa (fade trái/phải). Dùng để tra cách phối " +
            "`ScrollShadow` với `offset`/`hideScrollBar`, và khi nào cần `LabeledCard flushContent` " +
            "hay `motion.div` kéo bằng tay.",
    },
}
