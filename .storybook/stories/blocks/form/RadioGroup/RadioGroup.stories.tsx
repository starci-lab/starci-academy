import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Radio, RadioGroup, Typography } from "@heroui/react"
import { OPTIONS } from "./components"

/**
 * `RadioGroup` + `Radio` (HeroUI) — pick EXACTLY ONE of a few mutually exclusive options
 * (unlike Checkbox: multiple). Correct structure: `Radio > Radio.Content` (a horizontal
 * row `inline-flex items-center gap-3`) containing `Radio.Control > Radio.Indicator` + a
 * plain-text label (do NOT wrap it in `Typography` — react-aria treats `Typography` as
 * `Text` and requires a `slot`). The group stacks vertically with `gap-2`. Few options
 * (2–5) → RadioGroup; many → Select. Always set a default.
 */
const meta: Meta<typeof RadioGroup> = {
    title: "Core/Form/RadioGroup",
    component: RadioGroup,
}
export default meta
type Story = StoryObj<typeof RadioGroup>

/** Vertical list gap-2; each row = circle + horizontal label (Control sits inside Content). */
export const Vertical: Story = {
    parameters: {
        usage: "Pick exactly one of a few mutually exclusive options. The group stacks vertically `gap-2`; each `Radio.Content` is a horizontal row (control + label). Correct HeroUI structure: `Control` sits INSIDE `Content` — leaving Control/Content as siblings under `Radio` makes `.radio` (`flex-col`) stack them vertically. Always set `defaultValue`.",
    },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Pick one (vertical)</Label>
                <Typography type="body-sm" color="muted">
                    The group stacks vertically gap-2; each option is a button + label on one horizontal row.
                </Typography>
            </div>
            <RadioGroup aria-label="Notification frequency" defaultValue="daily" className="flex flex-col gap-2">
                {OPTIONS.map((opt) => (
                    <Radio key={opt.value} value={opt.value}>
                        <Radio.Content>
                            <Radio.Control>
                                <Radio.Indicator />
                            </Radio.Control>
                            {opt.label}
                        </Radio.Content>
                    </Radio>
                ))}
            </RadioGroup>
        </div>
    ),
}

/** With a locked item: `isDisabled` on one `Radio` — still visible but not selectable. */
export const WithDisabledOption: Story = {
    parameters: {
        usage: "An option exists but isn't open to this user yet → `isDisabled` on that `Radio` (dimmed, not selectable) instead of hiding it — so they know the option exists.",
    },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With a locked option</Label>
                <Typography type="body-sm" color="muted">
                    The locked option stays visible (dimmed) so the user knows it exists.
                </Typography>
            </div>
            <RadioGroup aria-label="Notification plan" defaultValue="free" className="flex flex-col gap-2">
                <Radio value="free">
                    <Radio.Content>
                        <Radio.Control>
                            <Radio.Indicator />
                        </Radio.Control>
                        Basic (free)
                    </Radio.Content>
                </Radio>
                <Radio value="pro" isDisabled>
                    <Radio.Content>
                        <Radio.Control>
                            <Radio.Indicator />
                        </Radio.Control>
                        Advanced (Pro plan only)
                    </Radio.Content>
                </Radio>
            </RadioGroup>
        </div>
    ),
}
