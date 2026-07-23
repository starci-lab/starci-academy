import type { Meta, StoryObj } from "@storybook/nextjs"
import { LanguageChip } from "./LanguageChip"

const meta: Meta<typeof LanguageChip> = {
    title: "Design/Chip/LanguageChip",
    component: LanguageChip,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof LanguageChip>

/**
 * Branded: the language key is in the linguist table — the dot uses that language's
 * exact hex (Go → cyan, JavaScript → yellow, Rust → burnt-orange), NOT a semantic
 * token. Keys with a display override (csharp, cpp, php) render as C#, C++, PHP.
 */
export const BrandColors: Story = {
    render: () => (
        <div className="flex flex-col gap-2 p-8">
            <LanguageChip language="typescript" />
            <LanguageChip language="javascript" />
            <LanguageChip language="python" />
            <LanguageChip language="java" />
            <LanguageChip language="go" />
            <LanguageChip language="csharp" />
            <LanguageChip language="cpp" />
            <LanguageChip language="c" />
            <LanguageChip language="rust" />
            <LanguageChip language="kotlin" />
            <LanguageChip language="php" />
            <LanguageChip language="ruby" />
            <LanguageChip language="swift" />
            <LanguageChip language="dart" />
        </div>
    ),
}

/**
 * Unknown: the key isn't in the linguist table — the chip still renders with a
 * neutral grey dot (never breaks or drops the dot), so a raw server value is safe.
 */
export const Unknown: Story = {
    render: () => (
        <div className="p-8">
            <LanguageChip language="cobol" />
        </div>
    ),
}

/**
 * Loading: skeleton mirror (dot + label bar) matching the real chip's footprint,
 * so resolving the language doesn't shift layout.
 */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <LanguageChip language="typescript" isSkeleton />
        </div>
    ),
}
