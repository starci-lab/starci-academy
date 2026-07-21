import type { Meta, StoryObj } from "@storybook/nextjs"
import { MarkdownContent } from "./MarkdownContent"

const meta: Meta<typeof MarkdownContent> = {
    title: "Primitives/Rendering/MarkdownContent",
    component: MarkdownContent,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof MarkdownContent>

/** heading · paragraph · list · inline code · quote · table — to inspect the typography scale. */
const sample = `## Asynchronous functions

An \`async\` function always returns a **Promise**. Use \`await\` to wait for the value to resolve.

- Sequential: \`await a()\` then \`await b()\`
- Parallel: \`Promise.all([a(), b()])\`

> Don't \`await\` inside a loop when the iterations are independent — gather them into \`Promise.all\`.

| Approach | When to use |
|---|---|
| sequential | the next iteration needs the previous result |
| parallel | the iterations are independent |
`

/** One-line markdown: inline bold + inline code + inline \`:muted[…]\` — no block structure. */
const inlineSample = "The response returns **200 OK** with `Content-Type: application/json`, while the :muted[Authorization header] is optional."

/** A fenced code block → Shiki syntax highlighting via CodeToHtml. */
const codeSample = `Đây là một hàm TypeScript:

\`\`\`ts
export async function fetchUser(id: string): Promise<User> {
    const res = await fetch(\`/api/users/\${id}\`)
    if (!res.ok) throw new Error("not found")
    return res.json()
}
\`\`\`
`

/** A \`\`\`mermaid fence → rendered to SVG by MermaidDiagram (click to zoom). */
const mermaidSample = `Luồng một request điển hình:

\`\`\`mermaid
graph LR
  Client --> Gateway
  Gateway --> Service
  Service --> DB[(PostgreSQL)]
  Service --> Cache[(Redis)]
\`\`\`
`

/** \`::::accordion\` / \`:::panel{title}\` → a HeroUI collapsible accordion. */
const accordionSample = `::::accordion
:::panel{title="Bước 1 — Cài đặt"}
- Chạy \`npm install\`
- Kiểm tra Node phiên bản 20+
:::
:::panel{title="Bước 2 — Cấu hình"}
- Sao chép \`.env.example\` thành \`.env\`
- Điền \`DATABASE_URL\`
:::
::::
`

/** \`:::muted\` arc labels + body → boxed collapsible sections when \`arcSections\` is on. */
const arcSample = `:::muted
Trả lời thẳng
:::
Một index B-Tree tăng tốc đọc nhưng làm chậm ghi.

:::muted
Cơ chế
:::
Mỗi lần INSERT/UPDATE phải cập nhật cây, nên ghi tốn thêm chi phí.

:::muted
Trade-off
:::
Đánh index cột hay lọc; tránh index cột ít dùng.
`

/** Compact scale (default): small type, tight lines — cards, chat, flashcards, modals. */
export const Compact: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-2xl">
                <MarkdownContent markdown={sample} />
            </div>
        </div>
    ),
}

/** Reading scale (`reading`): 16px body, looser rhythm, stronger headings — full lesson articles. */
export const Reading: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-2xl">
                <MarkdownContent markdown={sample} reading />
            </div>
        </div>
    ),
}

/** Inline one-liner: inline bold / code / `:muted[…]` — annotations, badges, table cells. */
export const Inline: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <MarkdownContent markdown={inlineSample} />
            </div>
        </div>
    ),
}

/** Fenced code → Shiki highlight (CodeToHtml). Highlighting is lazy — visible here on the canvas. */
export const CodeBlock: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-2xl">
                <MarkdownContent markdown={codeSample} reading />
            </div>
        </div>
    ),
}

/** `codeElevated`: the code well renders as a RAISED card (shadow, no border) for the bare canvas. */
export const CodeElevated: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-2xl">
                <MarkdownContent markdown={codeSample} codeElevated />
            </div>
        </div>
    ),
}

/** A `mermaid` fence → SVG diagram (MermaidDiagram); click opens the full-screen preview. */
export const Mermaid: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-2xl">
                <MarkdownContent markdown={mermaidSample} reading />
            </div>
        </div>
    ),
}

/** `::::accordion` / `:::panel{title}` directives → a HeroUI collapsible accordion. */
export const Accordion: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-2xl">
                <MarkdownContent markdown={accordionSample} reading />
            </div>
        </div>
    ),
}

/** `arcSections`: `:::muted` labels + body boxed into collapsible Interview-Arc sections. */
export const ArcSections: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <MarkdownContent markdown={arcSample} arcSections />
            </div>
        </div>
    ),
}

/** `plain`: inline decoration (bold/italic/code/links) stripped to raw text; block structure kept. */
export const Plain: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-2xl">
                <MarkdownContent markdown={sample} plain />
            </div>
        </div>
    ),
}
