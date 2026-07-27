import type { Meta, StoryObj } from "@storybook/nextjs"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * VIEWER — `MarkdownContent`: paint an authored markdown document faithfully.
 *
 * ⭐ WHY A VIEWER (§4b). Every other composite KNOWS its shape before it renders
 * — a card has a label and rows, a header has a title and meta. This one CANNOT:
 * the shape is decided by the PAYLOAD. That is the whole membership test for the
 * `viewers` group.
 *
 * ⚠️ SCOPE OF THIS PORT: the standard document grammar plus the accordion
 * directive. The legacy renderer's heavy widgets — Mermaid, layout widgets, live
 * React previews, code-preview tabs — are NOT ported. Each is a viewer in its own
 * right with its own runtime, and half-porting one leaves a body that looks
 * finished and renders wrong, which every gate here would pass.
 *
 * ⚠️ THE ONLY PLACE HAND-WRITTEN SPACING IS CORRECT. A viewer cannot reach for
 * frames: it never sees its children as nodes, only as whatever the parser hands
 * back. Same exemption §13z gives the atom tier, for the same reason — there is
 * no seam to own when the tree is not yours.
 *
 * 📐 LEAF by STRUCTURE (§14d.2): the two MEASURES are leaves, because the whole
 * rhythm changes. Which grammar a document happens to use is payload ⇒ states.
 */
const meta: Meta<typeof MarkdownContent> = {
    title: "Composites/Viewers/MarkdownContent",
    component: MarkdownContent,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof MarkdownContent>

const PROSE = `## Vì sao image phình

Mỗi lệnh trong \`Dockerfile\` đẻ ra một **layer**, và layer thì *cộng dồn* — xoá file ở
layer sau không lấy lại chỗ đã chiếm ở layer trước.

- \`COPY . .\` trước \`npm ci\` làm cache vỡ mỗi lần sửa code
- toolchain nằm lại trong image chạy thật
- file tạm bị xoá ở lệnh sau vẫn còn nguyên trong layer trước

> Đọc kỹ thứ tự lệnh trước khi tối ưu bất cứ thứ gì khác.

Xem thêm [tài liệu chính thức](https://docs.docker.com/build/cache/).`

const CODE = `Sắp lại thứ tự để cache còn dùng được:

\`\`\`dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
\`\`\`

Chỉ \`package*.json\` đổi mới phải cài lại phụ thuộc.`

const TABLE = `| Cách làm | Image | Thời gian build lại |
|---|---|---|
| COPY . . trước npm ci | 1.2 GB | 4 phút |
| Tách lớp phụ thuộc | 1.2 GB | 40 giây |
| Multi-stage | 40 MB | 45 giây |`

const ACCORDION = `::::accordion

:::panel{title="Vì sao không dùng \`latest\`?"}
Tag \`latest\` trỏ đi chỗ khác sau mỗi lần push, nên hai lần deploy cùng một commit
có thể chạy hai image khác nhau.
:::

:::panel{title="Khi nào nên squash layer?"}
Gần như không bao giờ. Squash phá cache và đổi lại rất ít dung lượng.
:::

::::`

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "MarkdownContent": { tier: "composite", role: "the document itself: the viewer repeats whatever the payload contains and owns only the rhythm it is repeated at", storyId: "composites-viewers-markdowncontent--reading" },
    "Accordion": { tier: "atom", role: "the collapsible panels an `::::accordion` directive turns into, owning the trigger row and the reveal", storyId: "atoms-navigation-accordion-accordion--default" },
    "SnippetIcon": { tier: "atom", role: "the copy control on a fenced code block, owning its own copied confirmation", storyId: "atoms-display-snippeticon-snippeticon--default" },
}

/** LEAF — `reading`: the lesson body, bigger type and a generous rhythm. */
export const Reading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="MarkdownContent"
                tier="composite"
                leaf="Measure `reading`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "prose document",
                        why: "Headings, paragraphs, a list, a quote, emphasis, inline code and a link — the grammar most lessons are written in. The viewer decides none of this: it repeats the document and only owns how much room each part gets.",
                        code: "<MarkdownContent source={lessonBody} />",
                        render: <MarkdownContent anatPart="MarkdownContent" showAnatomy source={PROSE} />,
                    },
                    {
                        name: "fenced code block",
                        why: "A fenced block gets its own box, its language named in the corner, and a copy control — because the reader's next move with code is almost always to take it. The block scrolls sideways inside its own box rather than making the article scroll.",
                        code: "<MarkdownContent source={lessonWithCode} />",
                        render: <MarkdownContent source={CODE} />,
                    },
                    {
                        name: "table",
                        why: "A document's table is as wide as its widest row, and that width is not the viewer's to decide, so it scrolls INSIDE its own box. Letting it push the article sideways would make every line of prose on the page scroll too.",
                        code: "<MarkdownContent source={comparisonTable} />",
                        render: <MarkdownContent source={TABLE} />,
                    },
                    {
                        name: "accordion directive",
                        why: "The `::::accordion` / `:::panel` syntax already in written lessons becomes real collapsible panels. The parser hands back children while the `Accordion` atom takes data, so the viewer reads each panel's title off its props — the one place that bridge can happen, since nothing upstream ever sees these as panels.",
                        code: "<MarkdownContent source={lessonWithAccordion} />",
                        render: <MarkdownContent source={ACCORDION} />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — `compact`: the document is a passenger inside another surface. */
export const Compact: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="MarkdownContent"
                tier="composite"
                leaf="Measure `compact`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "measure = compact",
                        why: "Every step of the rhythm tightens for markdown quoted inside another surface, such as a chat answer or a card. The document is a passenger there rather than the page, and reading-page spacing would make the surface around it look broken.",
                        code: "<MarkdownContent source={answer} measure=\"compact\" />",
                        render: <MarkdownContent anatPart="MarkdownContent" showAnatomy source={PROSE} measure="compact" />,
                    },
                ]}
            />
        </div>
    ),
}
