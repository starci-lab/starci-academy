import type { Meta, StoryObj } from "@storybook/nextjs"

import { CodeToHtml } from "@/components/blocks/rendering/MarkdownContent/CodeToHtml"
import { TS_SAMPLE, JS_SAMPLE, BASH_SAMPLE } from "./components"
import { Gallery, Variant } from "../../../../../story-kit"

const meta: Meta<typeof CodeToHtml> = {
    title: "Primitives/Rendering/CodeToHtml",
    component: CodeToHtml,
}

export default meta

type Story = StoryObj<typeof CodeToHtml>

/**
 * Toàn bộ ma trận của CodeToHtml: theme sáng/tối theo ngôn ngữ (TypeScript, JavaScript,
 * Bash) và hai cách đặt `elevated` (well lõm trên card vs thẻ nổi trên canvas trắng).
 * Dùng để tra khi nào chọn theme nào và khi nào cần bật `elevated`.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="TypeScript (theme sáng)"
                hint="Khối code TypeScript được Shiki tô màu cú pháp, theme sáng — dùng cho snippet trong bài học/flashcard."
            >
                <div className="max-w-xl">
                    <CodeToHtml code={TS_SAMPLE} language="ts" theme="material-theme-lighter" />
                </div>
            </Variant>
            <Variant
                label="JavaScript (theme tối)"
                hint="Khối code JavaScript ở theme tối — nhánh dark-mode của Shiki, dùng khi trang đang ở chế độ tối."
            >
                <div className="max-w-xl">
                    <CodeToHtml code={JS_SAMPLE} language="js" theme="material-theme-darker" />
                </div>
            </Variant>
            <Variant
                label="Shell / Bash"
                hint="Khối lệnh shell/bash — dùng cho hướng dẫn cài đặt hoặc lệnh chạy project."
            >
                <div className="max-w-xl">
                    <CodeToHtml code={BASH_SAMPLE} language="bash" theme="material-theme-lighter" />
                </div>
            </Variant>
            <Variant
                label="Mặc định — well lõm (trên card bg-surface)"
                hint="`elevated={false}` (mặc định): khối `bg-background` lõm VÀO nền surface xung quanh — dáng bài học/card. Đặt trên nền `bg-surface` thì độ tương phản mới đúng."
            >
                <div className="rounded-2xl border border-default bg-surface p-4">
                    <CodeToHtml code={BASH_SAMPLE} language="bash" theme="material-theme-lighter" />
                </div>
            </Variant>
            <Variant
                label="Elevated — thẻ nổi (trên canvas bg-background)"
                hint="`elevated`: khối `bg-surface` + shadow nổi LÊN khỏi canvas — dùng khi render markdown trực tiếp trên trang (panel trái của Playground)."
            >
                <div className="rounded-2xl bg-background p-4">
                    <CodeToHtml code={BASH_SAMPLE} language="bash" theme="material-theme-lighter" elevated />
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận của CodeToHtml: theme sáng/tối theo ngôn ngữ (TypeScript, JavaScript, Bash) và " +
            "hai cách đặt `elevated` (well lõm trên card vs thẻ nổi trên canvas trắng). Dùng để tra khi nào " +
            "chọn theme nào và khi nào cần bật `elevated`.",
    },
}
