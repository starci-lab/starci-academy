import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { LanguageDonut } from "@/components/blocks/stats/LanguageDonut"

const meta: Meta<typeof LanguageDonut> = {
    title: "Features/Progress/LanguageDonut",
    component: LanguageDonut,
}
export default meta
type Story = StoryObj<typeof LanguageDonut>

/**
 * Use to summarize "what languages this dev codes in" GitHub-style — a donut split by language (brand
 * colors), the total in the center, plus a legend with the count + percentage for each language. Colors come
 * from the shared map, so they stay in sync with the language chip everywhere. The block handles its own look;
 * the caller only passes items + a unit label.
 */
export const Default: Story = {
    parameters: {
        usage:
            "Use to summarize what languages this dev codes in GitHub-style — a donut split by language (brand " +
            "colors), the total in the center, plus a legend with the count + percentage for each language. " +
            "Colors come from the shared map, so they stay in sync with the language chip everywhere. The block " +
            "handles its own look; the caller only passes items + a unit label.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Multiple languages</Label>
                <Typography type="body-sm" color="muted">
                    Use to summarize the ratio of languages a dev has used — the ring is split by brand color,
                    the total in the center, and a legend with the count and percentage for each language.
                </Typography>
            </div>
            <LanguageDonut
                ariaLabel="Distribution of solutions by language"
                unitLabel="solutions"
                items={[
                    { key: "typescript", value: 128 },
                    { key: "python", value: 64 },
                    { key: "java", value: 31 },
                    { key: "go", value: 18 },
                    { key: "csharp", value: 9 },
                ]}
            />
        </div>
    ),
}

/** Use a small `size`/`thickness` when the donut is embedded in a narrow block (profile widget, card corner) — the ring shrinks but the total + legend stay readable. */
export const Compact: Story = {
    parameters: {
        usage: "Use a small size/thickness when the donut is embedded in a narrow block (profile widget, card corner) — the ring shrinks but the total + legend stay readable.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Compact</Label>
                <Typography type="body-sm" color="muted">
                    Use a small size/thickness when embedding the donut in a narrow block (profile widget, card
                    corner) — the ring shrinks but the total and legend stay readable.
                </Typography>
            </div>
            <LanguageDonut
                size={96}
                thickness={6}
                ariaLabel="Distribution of solutions by language (compact)"
                unitLabel="solutions"
                items={[
                    { key: "typescript", value: 42 },
                    { key: "go", value: 15 },
                ]}
            />
        </div>
    ),
}
