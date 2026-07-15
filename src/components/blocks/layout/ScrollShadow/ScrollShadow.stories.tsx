import type { Meta, StoryObj } from "@storybook/nextjs"
import { useCallback, useRef, useState } from "react"
import { Button, Label, ScrollShadow, Typography, cn } from "@heroui/react"
import { motion, type PanInfo } from "framer-motion"

import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"

/**
 * `ScrollShadow` (HeroUI) — vùng cuộn có DẢI MỜ ở mép để báo "còn nội dung phía đó".
 * Bọc quanh nội dung tràn trong một khung ĐÃ GIỚI HẠN kích thước: dọc thì
 * `max-h-* overflow-y-auto`, ngang thì `orientation="horizontal" overflow-x-auto`.
 * Dùng khi mép cắt cứng khiến người dùng tưởng đã hết danh sách; `hideScrollBar` để
 * ẩn thanh cuộn, để dải mờ làm affordance duy nhất. Đừng lồng trong một vùng cuộn
 * khác (vd Modal `scroll="inside"`) — hai scroller chồng nhau ra hai thanh cuộn.
 */
const meta: Meta<typeof ScrollShadow> = {
    title: "Core/Layout/ScrollShadow",
    component: ScrollShadow,
}
export default meta
type Story = StoryObj<typeof ScrollShadow>

/**
 * Vertical: bọc trong `LabeledCard` (label ngoài + card chứa list). ScrollShadow
 * ngồi `flushContent` trong card với `max-h-*` — dải mờ trên/dưới.
 */
export const Vertical: Story = {
    parameters: {
        usage: "Cuộn dọc trong section có tiêu đề → bọc `LabeledCard flushContent` (zero luôn `p-4` gốc `.card` + `CardContent`) + `ScrollShadow` `max-h-* overflow-y-auto`. Divider full-bleed bằng `SurfaceListCardRow` (`after:left-0 after:w-full`). Chỉ `p-0` trên Content thì divider vẫn inset vì Card gốc còn padding. `offset` (vd 8) để mờ tắt sát đầu/cuối.",
    },
    render: () => (
        <div className="flex max-w-sm flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Cuộn dọc</Label>
                <Typography type="body-sm" color="muted">
                    LabeledCard flushContent — divider full-bleed sát mép. `offset={8}`: kéo sát đầu/cuối thì mờ tắt.
                </Typography>
            </div>
            <LabeledCard label="Lịch sử giao dịch" flushContent>
                <ScrollShadow
                    hideScrollBar
                    offset={8}
                    className="max-h-64 overflow-y-auto"
                >
                    {Array.from({ length: 16 }).map((_, index) => (
                        <SurfaceListCardRow
                            key={index}
                            title={`Giao dịch #${1000 + index}`}
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
    ),
}

/**
 * Horizontal drag: map pan delta → scrollLeft (Windows / ẩn scrollbar vẫn kéo được).
 * Cursor: `grab` sẵn sàng kéo, `grabbing` khi đang onPan.
 */
const HorizontalDragDemo = () => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isPanning, setIsPanning] = useState(false)

    const onPan = useCallback((_event: PointerEvent, info: PanInfo) => {
        const element = scrollRef.current
        if (!element) {
            return
        }
        element.scrollLeft -= info.delta.x
    }, [])

    return (
        <div className="flex max-w-sm flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Cuộn ngang</Label>
                <Typography type="body-sm" color="muted">
                    Một hàng chip rộng hơn khung — dải mờ trái/phải. Con trỏ bàn tay (`cursor-grab` / `cursor-grabbing` khi onPan).
                </Typography>
            </div>
            <ScrollShadow
                ref={scrollRef}
                orientation="horizontal"
                hideScrollBar
                offset={8}
                className="overflow-x-auto"
            >
                <motion.div
                    className={cn(
                        "flex w-max select-none gap-2 px-0.5 py-1",
                        isPanning ? "cursor-grabbing" : "cursor-grab",
                    )}
                    onPanStart={() => setIsPanning(true)}
                    onPan={onPan}
                    onPanEnd={() => setIsPanning(false)}
                >
                    {["Tất cả", "Frontend", "Backend", "DevOps", "System Design", "AI/LLM", "Mobile", "Cloud"].map((tag) => (
                        <Button key={tag} variant="tertiary" size="sm" className="shrink-0">
                            {tag}
                        </Button>
                    ))}
                </motion.div>
            </ScrollShadow>
        </div>
    )
}

/**
 * Horizontal: `orientation="horizontal"` + framer-motion `onPan` map delta.x →
 * `scrollLeft`. Cursor bàn tay: `grab` / `grabbing` khi đang pan.
 */
export const Horizontal: Story = {
    parameters: {
        usage: "`orientation=\"horizontal\"` + `overflow-x-auto` cho một hàng phần tử rộng hơn khung — dải mờ trái/phải. Item trong hàng là `Button variant=\"tertiary\" size=\"sm\"`. Bọc trong `motion.div` + `onPan` → `scrollLeft`. Cursor bàn tay: `cursor-grab` / `cursor-grabbing` khi `onPan`. `offset={8}` để mờ tắt khi kéo sát mép.",
    },
    render: () => <HorizontalDragDemo />,
}
