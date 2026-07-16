import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"

import { ResizableRail } from "@/components/blocks/layout/ResizableRail"
import { PracticeShellDemo } from "./components"

const meta: Meta<typeof ResizableRail> = {
    title: "Layout/ResizableRail",
    component: ResizableRail,
}
export default meta
type Story = StoryObj<typeof ResizableRail>

/** Use when the rail width is something THE READER should decide, not you on their behalf — a table of contents has lessons with names of varying length; some want it wide to read in full, others want it narrow to give room to the main content. For a fixed-width rail, don't use this block; a plain div is enough. The width the reader drags is remembered by storageKey, so two different rails must have different keys. */
export const Default: Story = {
    parameters: {
        usage: "Use when the rail width is something THE READER should decide, not you on their behalf — a table of contents has lessons with names of varying length; some want it wide to read in full, others want it narrow to give room to the main content. For a fixed-width rail, don't use this block; a plain div is enough. The width the reader drags is remembered by `storageKey`, so two different rails must have different keys. The rail body = search + topic ListBox like `PracticeRail` (no tabs mode).",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Draggable rail</Label>
                <Typography type="body-sm" color="muted">
                    the `/practice` shell: search + topic list in a `ResizableRail`, `PageHeader` pane on the right. Drag the handle on the right edge; reload the story and the width you dragged is still there.
                </Typography>
            </div>
            <PracticeShellDemo
                storageKey="storybook.practice.rail.width"
                heightClassName="h-[32rem]"
            />
        </div>
    ),
}

/** Use to inspect the overflow branch: a table of contents taller than the shell must scroll INSIDE the rail, never push the shell taller or spill outside. */
export const ScrollableContent: Story = {
    parameters: {
        usage: "Use to inspect the overflow branch: a topic list taller than the shell must scroll INSIDE the rail (`ScrollShadow`), never push the shell taller or spill outside.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Overflowing content, scrolls in the rail</Label>
                <Typography type="body-sm" color="muted">
                    the shell is shorter than the topic list — it scrolls in `ScrollShadow` while the shell height stays fixed. Dragging wider/narrower while scrolling must still be smooth.
                </Typography>
            </div>
            <PracticeShellDemo
                storageKey="storybook.practice.rail.scroll.v2.width"
                heightClassName="h-80"
                defaultWidth={360}
            />
        </div>
    ),
}
