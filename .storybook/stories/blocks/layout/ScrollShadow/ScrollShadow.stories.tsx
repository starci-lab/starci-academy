import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, ScrollShadow, Typography } from "@heroui/react"

import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
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
    title: "Core/Layout/ScrollShadow",
    component: ScrollShadow,
}
export default meta
type Story = StoryObj<typeof ScrollShadow>

/**
 * Vertical: wrapped in a `LabeledCard` (label outside + card holding the list). ScrollShadow
 * sits `flushContent` inside the card with `max-h-*` — fade at top/bottom.
 */
export const Vertical: Story = {
    parameters: {
        usage: "Vertical scroll inside a titled section → wrap `LabeledCard flushContent` (zeroes out the base `p-3` on `.card` + `CardContent`) + `ScrollShadow` `max-h-* overflow-y-auto`. Full-bleed divider via `SurfaceListCardRow` (`after:left-0 after:w-full`). With only `p-0` on Content the divider stays inset because the base Card still has padding. `offset` (e.g. 8) fades out right at the start/end.",
    },
    render: () => (
        <div className="flex max-w-sm flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Vertical scroll</Label>
                <Typography type="body-sm" color="muted">
                    LabeledCard flushContent — full-bleed divider flush to the edge. `offset={8}`: scroll to the very start/end and the fade turns off.
                </Typography>
            </div>
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
    ),
}

/**
 * Horizontal: `orientation="horizontal"` + framer-motion `onPan` maps delta.x →
 * `scrollLeft`. Hand cursor: `grab` / `grabbing` while panning.
 */
export const Horizontal: Story = {
    parameters: {
        usage: "`orientation=\"horizontal\"` + `overflow-x-auto` for a row of items wider than the frame — fade on left/right. Each item in the row is a `Button variant=\"tertiary\" size=\"sm\"`. Wrapped in `motion.div` + `onPan` → `scrollLeft`. Hand cursor: `cursor-grab` / `cursor-grabbing` during `onPan`. `offset={8}` fades out when scrolled to the edge.",
    },
    render: () => <HorizontalDragDemo />,
}
