import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"

import { MarkdownContent } from "./index"

const meta: Meta<typeof MarkdownContent> = {
    title: "Core/Rendering/Markdown",
    component: MarkdownContent,
}

export default meta

type Story = StoryObj<typeof MarkdownContent>

/** Markdown mẫu: heading · đoạn · danh sách · inline code · quote · bảng — để soi thang typography. */
const sample = `## Hàm bất đồng bộ

Một hàm \`async\` luôn trả về **Promise**. Dùng \`await\` để chờ giá trị resolve.

- Tuần tự: \`await a()\` rồi \`await b()\`
- Song song: \`Promise.all([a(), b()])\`

> Đừng \`await\` trong vòng lặp nếu các lượt độc lập — gom vào \`Promise.all\`.

| Cách | Khi dùng |
|---|---|
| tuần tự | lượt sau cần kết quả lượt trước |
| song song | các lượt độc lập |
`

/** Scale COMPACT (mặc định): 14px, nhịp dòng chặt — cho card, chat, flashcard, modal. */
export const Default: Story = {
    parameters: { usage: "Scale compact (mặc định): body nhỏ, nhịp dòng chặt — cho card/chat/flashcard/modal." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Compact (mặc định)</Label>
                <Typography type="body-sm" color="muted">
                    Scale compact: body nhỏ, nhịp dòng chặt — cho card, chat, flashcard, modal.
                </Typography>
            </div>
            <div className="max-w-2xl">
                <MarkdownContent markdown={sample} />
            </div>
        </div>
    ),
}

/** `reading` — thang bài đọc: 16px body, nhịp dòng thoáng, heading ladder mạnh hơn, cho bài học full. */
export const Reading: Story = {
    parameters: { usage: "reading: thang bài đọc 16px, nhịp thoáng, heading ladder mạnh — cho bài học full." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Reading (bài đọc)</Label>
                <Typography type="body-sm" color="muted">
                    Thang bài đọc: 16px body, nhịp dòng thoáng, heading ladder mạnh hơn — cho bài học full.
                </Typography>
            </div>
            <div className="max-w-2xl">
                <MarkdownContent markdown={sample} reading />
            </div>
        </div>
    ),
}

/** Markdown 1 dòng: in đậm inline + `code` inline + `:muted[…]` inline — không xuống dòng, không heading/list/bảng. */
const inlineSample = "Kết quả trả về là **200 OK** kèm `Content-Type: application/json`, còn :muted[header Authorization] là tuỳ chọn."

/** Chuỗi markdown ngắn, 1 dòng — dùng cho ô chú thích, badge mô tả, hàng bảng… không cần block-level. */
export const Inline: Story = {
    parameters: { usage: "Markdown 1 dòng (in đậm/code/:muted[] inline) — dùng cho chú thích ngắn, badge, ô trong bảng." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Inline 1 dòng</Label>
                <Typography type="body-sm" color="muted">
                    Markdown 1 dòng (in đậm / code / :muted[] inline) — cho chú thích ngắn, badge, ô trong bảng.
                </Typography>
            </div>
            <div className="max-w-md">
                <MarkdownContent markdown={inlineSample} />
            </div>
        </div>
    ),
}
