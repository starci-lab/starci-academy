import type { Meta, StoryObj } from "@storybook/nextjs"

import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { Gallery, Variant } from "../../../../story-kit"
import { sample, inlineSample } from "./components"

const meta: Meta<typeof MarkdownContent> = {
    title: "Blocks/Rendering/MarkdownContent",
    component: MarkdownContent
}

export default meta

type Story = StoryObj<typeof MarkdownContent>

/**
 * Toàn bộ ma trận scale của MarkdownContent: compact (mặc định), reading, và
 * inline một dòng. Dùng để tra khu vực nào (card/chat/flashcard/modal, bài
 * học đầy đủ, hay annotation/badge/ô bảng) thì nên chọn scale nào.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Compact (mặc định)"
                hint="Scale gọn: cỡ chữ nhỏ, dòng sát nhau — dùng cho card, chat, flashcard, modal."
            >
                <div className="max-w-2xl">
                    <MarkdownContent markdown={sample} />
                </div>
            </Variant>
            <Variant
                label="Reading"
                hint="reading: scale đọc 16px, dòng thoáng hơn, heading rõ nét hơn — dùng cho bài học đầy đủ."
            >
                <div className="max-w-2xl">
                    <MarkdownContent markdown={sample} reading />
                </div>
            </Variant>
            <Variant
                label="Inline một dòng"
                hint="Markdown một dòng (bold/code/:muted[] inline) — dùng cho annotation ngắn, badge, ô bảng, không cần block-level."
            >
                <div className="max-w-md">
                    <MarkdownContent markdown={inlineSample} />
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận scale của MarkdownContent: compact (mặc định) cho card/chat/flashcard/modal, " +
            "reading cho bài học đầy đủ, và inline một dòng cho annotation/badge/ô bảng."
    }
}
