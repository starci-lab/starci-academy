import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"

import { CodeToHtml } from "@/components/blocks/rendering/MarkdownContent/CodeToHtml"
import { TS_SAMPLE, JS_SAMPLE, BASH_SAMPLE } from "./components"

const meta: Meta<typeof CodeToHtml> = {
    title: "Primitives/Rendering/CodeToHtml",
    component: CodeToHtml,
}

export default meta

type Story = StoryObj<typeof CodeToHtml>

/** A TypeScript code block syntax-highlighted by Shiki, light theme — for snippets inside lessons/flashcards. */
export const TypeScript: Story = {
    parameters: { usage: "Renders a syntax-highlighted TypeScript code block — for use in lesson/flashcard content." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>TypeScript (light theme)</Label>
                <Typography type="body-sm" color="muted">
                    A TS code block syntax-highlighted by Shiki, light theme — for snippets inside lessons/flashcards.
                </Typography>
            </div>
            <div className="max-w-xl">
                <CodeToHtml code={TS_SAMPLE} language="ts" theme="material-theme-lighter" />
            </div>
        </div>
    ),
}

/** A JavaScript code block, dark theme — exercises Shiki's dark-mode branch. */
export const JavaScriptDark: Story = {
    parameters: { usage: "Renders a JavaScript code block in a dark theme — for use when the page is in dark mode." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>JavaScript (dark theme)</Label>
                <Typography type="body-sm" color="muted">
                    A JS code block in a dark theme — exercises Shiki's dark-mode branch, for use when the page is in dark mode.
                </Typography>
            </div>
            <div className="max-w-xl">
                <CodeToHtml code={JS_SAMPLE} language="js" theme="material-theme-darker" />
            </div>
        </div>
    ),
}

/** A shell/bash command block — for setup instructions and project run commands. */
export const Bash: Story = {
    parameters: { usage: "Renders a shell/bash command block — for setup instructions or project run commands." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Shell / Bash</Label>
                <Typography type="body-sm" color="muted">
                    A shell/bash command block — for setup instructions or project run commands.
                </Typography>
            </div>
            <div className="max-w-xl">
                <CodeToHtml code={BASH_SAMPLE} language="bash" theme="material-theme-lighter" />
            </div>
        </div>
    ),
}
