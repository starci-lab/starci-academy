import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Label, Typography } from "@heroui/react"
import { PressableCard } from "@/components/blocks/cards/PressableCard"
import { NavTileContent, OptionCardContent, LinkCardPrototype } from "./components"

const meta: Meta<typeof PressableCard> = {
    title: "Core/Card/PressableCard",
    component: PressableCard,
}

export default meta

type Story = StoryObj<typeof PressableCard>

/** Use for a pressable navigation tile (enter a path, open a course) — pressing switches screen immediately, it's not a selection. */
export const Default: Story = {
    parameters: {
        usage: "Use for a pressable navigation tile (enter a path, open a course) — pressing switches screen immediately, it's not a selection.",
    },
    args: {
        onPress: () => {},
        children: <NavTileContent />,
    },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Default</Label>
                <Typography type="body-sm" color="muted">
                    The whole card has a SINGLE press target, with no child buttons inside. The text in children is the card's readable name, so no label is needed — only pass label when the card has no text at all (an icon-only tile).
                </Typography>
            </div>
            <PressableCard {...args} />
        </div>
    ),
}

/** PROTOTYPE link-card (awaiting a final look before baking into PressableCard): the whole card = a `router.push` target, hover underlines the label, no background fill, no trailing CTA. */
export const LinkCard: Story = {
    parameters: {
        usage: "PROTOTYPE link-card (not yet baked into the component) — the whole card is ONE navigation target, pressing runs router.push to another page; hovering over the card underlines the title (it is fundamentally a link), NO background fill, NO trailing Read/Review CTA. Once the look is settled, title/subtitle/hover=\"underline\" props will be added to PressableCard.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <Label>Link card (underline on hover)</Label>
                <Typography type="body-sm" color="muted">
                    Use when the whole card exists only to navigate to another page (an article, a path) — hovering over the card underlines the title to make clear it is a link, no separate CTA button needed.
                </Typography>
            </div>
            <div className="flex max-w-md flex-col gap-3">
                <LinkCardPrototype title="Why do learners drop out of courses?" subtitle="12.4k reads" />
                <LinkCardPrototype title="The path to becoming a Senior Backend engineer" subtitle="9.1k reads" />
            </div>
        </div>
    ),
}

/**
 * A navigation card BUT with its own buttons inside (e.g. a course-progress card: pressing the card = open
 * the course, the "Continue" button = jump into the exact lesson in progress, the "…" button = menu). Pass via
 * `actions` + `label` → the card switches to the **stretched-link** pattern: the whole card is a transparent
 * overlay covering it (press-whole-card), and the 2 buttons sit ABOVE the overlay (source-order + z-10) so they
 * press independently. Do NOT nest a `<button>` inside a `<button>`/`<a>` (invalid HTML + broken focus order + the
 * reason the card grew TALL when stuffing 2 buttons into children the old way). Ref Inclusive Components /
 * Adrian Roselli.
 */
export const WithActions: Story = {
    name: "With actions (2 buttons inside)",
    parameters: {
        usage: "A pressable card with its own buttons inside (a progress card: pressing the card opens the course, the Continue button jumps into the unfinished lesson). Use `actions` + `label` → stretched-link: an overlay covers the whole card + buttons sit above it (z-10), pressing independently, NO nested interactive, no growing tall.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With its own buttons</Label>
                <Typography type="body-sm" color="muted">
                    Choose this state when the card needs a SECOND press target that acts independently of the press-whole-card — the Continue button jumps straight into the unfinished lesson, while pressing the card opens the course page. If the button just repeats the card's own target, drop it and let the card do it.
                </Typography>
            </div>
            <PressableCard
                onPress={() => {}}
                label="Open the Fullstack Mastery path"
                actions={(
                    <>
                        <Button size="sm" variant="secondary" onPress={() => {}}>
                            Continue
                        </Button>
                        <Button size="sm" variant="tertiary" isIconOnly aria-label="More options" onPress={() => {}}>
                            ⋯
                        </Button>
                    </>
                )}
            >
                <NavTileContent />
            </PressableCard>
        </div>
    ),
}

/** Use when the choice is temporarily unavailable (the plan is out of slots) — still shown so the user knows it exists, but pressing is blocked + hover is off. */
export const Disabled: Story = {
    parameters: {
        usage: "Use when the choice is temporarily unavailable (the plan is out of slots) — still shown so the user knows it exists, but pressing is blocked + hover is off.",
    },
    args: {
        isDisabled: true,
        onPress: () => {},
        children: <OptionCardContent label="12-month plan (out of slots)" price="3,490,000đ" />,
    },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Unavailable</Label>
                <Typography type="body-sm" color="muted">
                    This state is only for an action card with onPress; a card navigating via href can't be turned off with isDisabled — you must remove the href. The card is still fully readable, only dimmed, so the reason it can't be pressed must live in the children's text (here, "out of slots") — don't leave the eye to guess it from the dimming.
                </Typography>
            </div>
            <PressableCard {...args} />
        </div>
    ),
}
