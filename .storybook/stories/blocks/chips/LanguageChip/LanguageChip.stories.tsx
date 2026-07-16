import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { LanguageChip } from "@/components/blocks/chips/LanguageChip"

const meta: Meta<typeof LanguageChip> = {
    title: "Core/Chip/LanguageChip",
    component: LanguageChip,
}
export default meta
type Story = StoryObj<typeof LanguageChip>

/** All 14 GitHub-linguist brand colors side by side, plus the unknown-language case — this is the ONLY chip that escapes the 5 semantic colors, so look here before coloring a language yourself elsewhere. */
export const AllLanguages: Story = {
    parameters: { usage: "Reference table of 14 GitHub-linguist brand colors (source: `getLanguageColor`) + the unknown-language case. Use it to indicate the language of a submission/repo: the dot carries the color, the text stays `body-xs` muted — NOT a pill. This is a DELIBERATE exception to the \"tokens only, no hex\" rule: brand colors from outside the app (like the GitHub logo), not part of the semantic palette. Same color source as `LanguageDonut`, so the two always match." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Languages with a brand color</Label>
                    <Typography type="body-sm" color="muted">
                        When the language key is in the linguist table. The dot uses that language's exact hex, so the colors here do NOT go through semantic tokens: Go comes out cyan, Javascript amber, Rust burnt orange. Keys with their own display name (csharp, cpp, php) turn into C#, C++, PHP automatically.
                    </Typography>
                </div>
                <div className="flex flex-col gap-2">
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
            </div>
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Unknown language</Label>
                    <Typography type="body-sm" color="muted">
                        When the key is not in the linguist table. The chip still renders with a neutral gray dot instead of breaking or dropping the dot, so pass the server value straight through without pre-filtering.
                    </Typography>
                </div>
                <LanguageChip language="cobol" />
            </div>
        </div>
    ),
}
