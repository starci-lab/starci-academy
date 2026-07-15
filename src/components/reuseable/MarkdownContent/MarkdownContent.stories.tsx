import type { Meta, StoryObj } from "@storybook/nextjs"

import { MarkdownContent } from "./index"

const meta: Meta<typeof MarkdownContent> = {
    title: "Reuseable/MarkdownContent",
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
        <div className="max-w-2xl">
            <MarkdownContent markdown={sample} />
        </div>
    ),
}

/** `reading` — thang bài đọc: 16px body, nhịp dòng thoáng, heading ladder mạnh hơn, cho bài học full. */
export const Reading: Story = {
    parameters: { usage: "reading: thang bài đọc 16px, nhịp thoáng, heading ladder mạnh — cho bài học full." },
    render: () => (
        <div className="max-w-2xl">
            <MarkdownContent markdown={sample} reading />
        </div>
    ),
}
