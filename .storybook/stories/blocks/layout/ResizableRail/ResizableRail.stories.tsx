import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Label, Typography } from "@heroui/react"

import { ResizableRail } from "@/components/blocks/layout/ResizableRail"
import { Gallery, Variant } from "../../../../story-kit"
import { PracticeShellDemo } from "./components"

const meta: Meta<typeof ResizableRail> = {
    title: "Layout/ResizableRail",
    component: ResizableRail,
}
export default meta
type Story = StoryObj<typeof ResizableRail>

/**
 * Toàn bộ trạng thái tĩnh của ResizableRail: mặc định (search + topic ListBox
 * kiểu PracticeRail) và nội dung tràn phải cuộn trong rail. Dùng để tra khi
 * nào chọn block này thay vì một div cố định, và xác nhận nội dung dài không
 * đẩy khung shell cao lên.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Mặc định"
                hint="Dùng khi độ rộng rail là thứ NGƯỜI ĐỌC nên tự quyết, không phải mình quyết thay họ — mục lục có tên bài học độ dài khác nhau, người muốn rộng để đọc hết, người muốn hẹp để dành đất cho nội dung chính. Với rail độ rộng cố định thì đừng dùng block này, một div thường là đủ. Độ rộng người đọc kéo được nhớ theo storageKey, nên hai rail khác nhau phải có key khác nhau. Thân rail = search + topic ListBox kiểu PracticeRail (không có mode tabs)."
            >
                <PracticeShellDemo
                    storageKey="storybook.practice.rail.width"
                    heightClassName="h-[32rem]"
                />
            </Variant>
            <Variant
                label="Nội dung tràn, cuộn trong rail"
                hint="Dùng để soi nhánh overflow: mục lục cao hơn khung shell phải cuộn BÊN TRONG rail (ScrollShadow), không đẩy shell cao thêm hay tràn ra ngoài. Kéo rộng/hẹp trong lúc đang cuộn vẫn phải mượt."
            >
                <PracticeShellDemo
                    storageKey="storybook.practice.rail.scroll.v2.width"
                    heightClassName="h-80"
                    defaultWidth={360}
                />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ trạng thái tĩnh của ResizableRail: mặc định (search + topic ListBox kiểu PracticeRail, " +
            "không có mode tabs) và nội dung tràn phải cuộn trong rail (ScrollShadow, shell giữ nguyên chiều " +
            "cao). Độ rộng người đọc kéo được nhớ theo storageKey — hai rail khác nhau phải dùng key khác nhau.",
    },
}

/**
 * Use to inspect the moving-bounds branch: when the caller NARROWS `maxWidth`,
 * an already-wider rail must snap back to the new bound on its own, without
 * waiting for the next drag. The persisted width is left alone — it is the
 * reader's preference, and a temporarily small window must not overwrite it.
 */
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
