import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Label, Typography } from "@heroui/react"
import { Callout, type CalloutStatus, STATUS_ACTION_CLASS } from "@/components/blocks/feedback/Callout"
import { TONE_CONTENT, ACTION_EXAMPLES } from "./components"

/**
 * A tinted, flat note for use **inside a card / surface** — wraps HeroUI `Alert` +
 * `CloseButton` with a status-driven soft tint so it doesn't read as a card-in-card.
 */
const meta: Meta<typeof Callout> = {
    title: "Primitives/Feedback/Callout",
    component: Callout,
    args: {
        title: "Lesson saved",
        description: "Your progress syncs automatically after each completion.",
    },
}

export default meta
type Story = StoryObj<typeof Callout>

/** Use for a neutral in-card notice (draft saved, system note) — without any warning or success tone. */
export const Default: Story = {
    args: {
        status: "default",
    },
    parameters: {
        usage: "Use for a neutral in-card notice (draft saved, system note) — without any warning or success tone.",
    },
}

/** Use to signal a soft state INSIDE a card (submission OK / due soon / connection error / update available…) — without creating a card-in-card. */
export const Tones: Story = {
    render: () => (
        <div className="flex flex-col gap-6">
            {(Object.keys(TONE_CONTENT) as CalloutStatus[]).map((status) => (
                <div key={status} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <Label>{TONE_CONTENT[status].label}</Label>
                        <Typography type="body-sm" color="muted">{TONE_CONTENT[status].when}</Typography>
                    </div>
                    <Callout
                        status={status}
                        title={TONE_CONTENT[status].title}
                        description={TONE_CONTENT[status].description}
                    />
                </div>
            ))}
        </div>
    ),
    parameters: {
        usage: "Use to signal a soft state INSIDE a card (submission OK / due soon / connection error / update available…) — without creating a card-in-card.",
    },
}

/**
 * Use when you want the user to TRY a new feature right away (with an action button)
 * instead of just reading and moving on. The action is always `variant="secondary"` +
 * `STATUS_ACTION_CLASS` (NOT the default HeroUI `secondary` — its near-white `--default`
 * background blends into the callout tint). `STATUS_ACTION_CLASS` = a SOLID `bg-<status>`
 * background (not `/10` like the callout tint) + `text-<status>-foreground` — clearly set
 * apart from the callout's light background while staying in the same color family as each
 * callout's tone, without forcing a solid accent on every tone.
 */
export const WithAction: Story = {
    render: () => (
        <div className="flex flex-col gap-6">
            {ACTION_EXAMPLES.map((example) => (
                <div key={example.status} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <Label>{example.label}</Label>
                        <Typography type="body-sm" color="muted">{example.when}</Typography>
                    </div>
                    <Callout
                        status={example.status}
                        title={example.title}
                        description={example.description}
                        icon={example.icon}
                        action={(
                            <Button size="sm" variant="secondary" className={STATUS_ACTION_CLASS[example.status]}>
                                {example.actionLabel}
                            </Button>
                        )}
                    />
                </div>
            ))}
        </div>
    ),
    parameters: {
        usage: "Use when you want the user to TRY a new feature right away (with an action button) instead of just reading and moving on. Action `variant=\"secondary\"` + a solid `bg-<status>` background specific to each tone (not `/10` like the callout tint) — clearly set apart from the callout's light background while staying in the same color, without forcing a solid accent on every tone.",
    },
}

/** Use for a warning the user can dismiss after reading (spotty connection) — not for errors that must be handled. */
export const Closable: Story = {
    args: {
        status: "warning",
        title: "Unstable connection",
        description: "Some features may run slower than usual.",
        onClose: () => {},
        closeAriaLabel: "Dismiss notice",
    },
    parameters: {
        usage: "Use for a warning the user can dismiss after reading (spotty connection) — not for errors that must be handled.",
    },
}

/** Use when the message is already clear in one short line (draft saved) — avoid an extra description that adds clutter. */
export const TitleOnly: Story = {
    args: {
        status: "default",
        title: "Draft saved",
        description: undefined,
    },
    parameters: {
        usage: "Use when the message is already clear in one short line (draft saved) — avoid an extra description that adds clutter.",
    },
}
