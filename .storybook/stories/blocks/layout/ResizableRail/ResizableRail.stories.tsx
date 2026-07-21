import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Label, Typography } from "@heroui/react"

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

/** Use to inspect the moving-bounds branch: when the caller NARROWS `maxWidth`, an already-wider rail must snap back to the new bound on its own. */
export const ShrinkingMaxWidth: Story = {
    parameters: {
        usage: "Use to inspect the moving-bounds branch. A caller may compute `maxWidth` from live measurements (the chat rail caps itself so the reading column never drops under its `lg` breakpoint), so the bound moves while the rail is mounted. Drag wide, then press the button: the rail must snap back to the new bound WITHOUT waiting for the next drag. The persisted width is deliberately left alone — it is the reader's preference, and a temporarily small window must not overwrite it.",
    },
    render: () => {
        const [maxWidth, setMaxWidth] = useState(560)
        return (
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Bounds that move under the rail</Label>
                    <Typography type="body-sm" color="muted">
                        drag the rail out to its full {maxWidth}px, then shrink the cap. The rail re-clamps itself; it must not sit at an illegal width until the reader drags again.
                    </Typography>
                    <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onPress={() => setMaxWidth(560)}>
                            maxWidth 560
                        </Button>
                        <Button size="sm" variant="secondary" onPress={() => setMaxWidth(360)}>
                            maxWidth 360
                        </Button>
                    </div>
                </div>
                <PracticeShellDemo
                    storageKey="storybook.practice.rail.bounds.width"
                    heightClassName="h-[32rem]"
                    maxWidth={maxWidth}
                />
            </div>
        )
    },
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
