import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { SnippetIcon } from "@sb-components/atoms/display/SnippetIcon/SnippetIcon"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `SnippetIcon.Base`: nút copy-một-chạm DUY NHẤT của hệ.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g — luật tầng ATOM). Xét hết prop sau lượt sửa chặng 1:
 * `copyString` là BẮT BUỘC nhưng KHÔNG sinh hình khác nhau — mọi giá trị đều ra đúng
 * một glyph copy, chỉ khác nội dung được ghi vào clipboard, nên không có leaf riêng.
 * `className` là cửa hậu class, không leaf. Còn lại đúng MỘT prop có hình:
 *
 * - `isCopied` — ghim glyph ✓ từ bên ngoài (§12f). TRƯỚC lượt sửa này, hình ✓ chỉ
 *   sinh từ `useState`/`setTimeout` NỘI BỘ nên không story tĩnh nào ghim được — bản
 *   cũ phải lách bằng `play()` giả bấm chuột (xem file cũ, không port cách đó).
 *
 * Vậy bộ leaf: `Default` (bare, idle) + `Copied` (prop `isCopied`, hai state cạnh
 * nhau). Atom giờ có `showAnatomy`/`anatPart` nên cả hai leaf đều badge được — trước
 * đây là atom DUY NHẤT trong hệ chưa có anatomy.
 */

/** Hướng dẫn hiện đầu trang autodocs. Chữ trên UI viết TIẾNG ANH. */
const SNIPPET_ICON_DOC = `
## One glyph, one job

A single leading affordance that sits next to the value it copies — a CLI
command, an API key, a short URL. Click it and the value is written to the
clipboard; the glyph swaps to a checkmark for a moment to confirm the write,
then returns to the copy icon on its own.

Place it inline with the text being copied, not inside a multi-line code
block — a block that long needs its own confirmation toast instead.

There is no size or tone axis here: every call site renders the exact same
shape, so the affordance stays recognizable wherever it shows up.

## Pinning the checkmark

The checkmark only ever appears for 350ms after a real click, which a static
page can't demonstrate on its own. Pass \`isCopied\` to pin either state from
the outside — leave it unset and the atom keeps managing it internally.
`

const meta: Meta<typeof SnippetIcon.Base> = {
    title: "Atoms/Display/SnippetIcon/SnippetIcon.Base",
    component: SnippetIcon.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: { description: { component: SNIPPET_ICON_DOC } },
    },
}

export default meta

type Story = StoryObj<typeof SnippetIcon.Base>

/** Leaf TRẦN — glyph copy lúc nghỉ, chưa bật `isCopied`. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SnippetIcon.Base"
                tier="atom"
                leaf="Bare icon"
                reason="The one copy affordance in the system. It sits next to the value it copies and needs nothing else to work — no size, no tone, no icon choice."
                note="copyString does not change the shape, only the clipboard payload — that is why it has no leaf of its own."
                code={"<SnippetIcon.Base copyString=\"npm install @starciacademy/playground-agent\" />"}
            >
                <div className="flex max-w-md items-center justify-between gap-3 rounded-lg border border-default bg-muted px-3 py-2">
                    <Typography type="body-sm" className="font-mono">
                        npm install @starciacademy/playground-agent
                    </Typography>
                    <SnippetIcon.Base
                        copyString="npm install @starciacademy/playground-agent"
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `isCopied` — glyph ✓ ghim từ ngoài, cạnh glyph copy idle. */
export const Copied: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SnippetIcon.Base"
                tier="atom"
                leaf="Prop `isCopied`"
                reason="A real click swaps the glyph to a checkmark for 350ms on its own — but a static page can never land on that exact millisecond, so isCopied pins either frame for anyone building or reviewing this state."
                note="Leave isCopied unset and the atom manages the swap itself via internal state (unchanged behaviour). Pass true and it stays pinned to the checkmark regardless of internal state."
                code={`<SnippetIcon.Base copyString="npm install pkg" />
<SnippetIcon.Base copyString="npm install pkg" isCopied />`}
            >
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex max-w-md items-center justify-between gap-3 rounded-lg border border-default bg-muted px-3 py-2">
                        <Typography type="body-sm" className="font-mono">
                            sk-live-51H8x2KJ9mQwErTyUiOp
                        </Typography>
                        <SnippetIcon.Base
                            copyString="sk-live-51H8x2KJ9mQwErTyUiOp"
                            showAnatomy
                        />
                    </div>
                    <div className="flex max-w-md items-center justify-between gap-3 rounded-lg border border-default bg-muted px-3 py-2">
                        <Typography type="body-sm" className="font-mono">
                            git clone https://github.com/StarCi-Academy/rag-from-scratch
                        </Typography>
                        <SnippetIcon.Base
                            copyString="git clone https://github.com/StarCi-Academy/rag-from-scratch"
                            isCopied
                        />
                    </div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}
