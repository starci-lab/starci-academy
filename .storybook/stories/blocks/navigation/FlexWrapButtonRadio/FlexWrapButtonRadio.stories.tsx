import type { Meta, StoryObj } from "@storybook/nextjs"
import { DotsThreeVerticalIcon, TrashIcon } from "@phosphor-icons/react"
import { Button, Label, Typography } from "@heroui/react"
import { FlexWrapButtonRadio } from "@/components/blocks/navigation/FlexWrapButtonRadio"
import { ATTEMPT_ITEMS, Controlled, DIFFICULTY_ITEMS, TIER_ITEMS } from "./components"

const meta: Meta<typeof FlexWrapButtonRadio> = {
    title: "Blocks/Navigation/FlexWrapButtonRadio",
    component: FlexWrapButtonRadio,
    parameters: {
        docs: {
            description: {
                component:
                    "Single-select toggle-button group laid out as a flex-wrap row of independent HeroUI Buttons (secondary/ghost) with no own surface. With `itemAction`, each item becomes one connected ButtonGroup (`[select | 🗑 | ⋮]`) with full-height dividers.",
            },
        },
    },
}

export default meta
type Story = StoryObj<typeof FlexWrapButtonRadio>

/**
 * Pick 1-of-N when the options are short, compact and need to wrap onto the next line — each option is a REAL `<Button>`:
 * UNIFORM height (Button bakes in a height per size) and each option can carry a secondary button on the same row (`itemAction`: delete,
 * "⋮" menu). Because nesting a `<Button>` inside a `Radio` label breaks nested-interactive, this version drops `RadioGroup`
 * and uses `role="group"` + per-button `aria-pressed` (trading away the real radio's arrow-key roving). If the card is LARGE
 * with icon + description + badge and needs a fixed column grid → use `SelectableCardGroup`. If a few options always fit on one
 * row and never wrap → use `TabsCard` (`variant="primary"`). By default it's a cluster OUTSIDE a card (a detached filter/toolbar): an unselected
 * option is `ghost` hollow, taking the page or parent card as its surface — no dedicated border/background per choice.
 */
export const Default: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Select-button cluster</Label>
                <Typography type="body-sm" color="muted">
                    Pick 1-of-N when options are short and need to wrap onto the next line — each option is a real Button, with no dedicated surface.
                </Typography>
            </div>
            <Controlled items={DIFFICULTY_ITEMS} initialValue="medium" ariaLabel="Select difficulty" />
        </div>
    ),
    parameters: {
        usage: "Pick 1-of-N when the options are short, compact and need to wrap onto the next line — each option is a REAL `<Button>`: "
            + "UNIFORM height (Button bakes in a height per size) and each option can carry a secondary button on the same row "
            + "(`itemAction`: delete, \"⋮\" menu). Because nesting a `<Button>` inside a `Radio` label breaks nested-interactive, "
            + "this version drops `RadioGroup` and uses `role=\"group\"` + per-button `aria-pressed` (trading away the real radio's "
            + "arrow-key roving). If the card is LARGE with icon + description + badge and needs a fixed column grid → use "
            + "`SelectableCardGroup`. If a few options always fit on one row and never wrap → use "
            + "`TabsCard` (`variant=\"primary\"`). By default it's a cluster OUTSIDE a card (a detached filter/toolbar): an unselected option is `ghost` "
            + "hollow, taking the page or parent card as its surface — no dedicated border/background per choice.",
    },
}

/** Use when a group has one option that's NOT YET UNLOCKED (a locked plan/tier) — the item still shows but can't be pressed, and isn't hidden from the list. */
export const WithDisabledItem: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With locked item</Label>
                <Typography type="body-sm" color="muted">
                    When a group has an option that isn't unlocked (a locked plan / tier) — the item still shows but can't be pressed, and isn't hidden from the list.
                </Typography>
            </div>
            <Controlled items={TIER_ITEMS} initialValue="economy" ariaLabel="Select plan" />
        </div>
    ),
    parameters: {
        usage: "Use when a group has one option that's NOT YET UNLOCKED (a locked plan/tier) — the item still shows but can't be pressed, and isn't hidden from the list.",
    },
}

/** Use `trailing` when you need to attach one secondary button ON THE SAME ROW as the choices (e.g. a "+N" button to expand overflow), which isn't a real choice. */
export const WithTrailing: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With trailing button</Label>
                <Typography type="body-sm" color="muted">
                    Use trailing when you need one secondary button on the same row as the choices (e.g. +N to expand overflow), which isn't a real choice.
                </Typography>
            </div>
            <Controlled
                items={DIFFICULTY_ITEMS.slice(0, 3)}
                initialValue="easy"
                ariaLabel="Select difficulty"
                trailing={
                    <Button size="sm" variant="ghost">
                        +2
                    </Button>
                }
            />
        </div>
    ),
    parameters: {
        usage: "Use `trailing` when you need to attach one secondary button ON THE SAME ROW as the choices (e.g. a \"+N\" button to expand overflow), which isn't a real choice.",
    },
}

/** Use `itemAction` when each choice needs its OWN accompanying action (e.g. a delete button + "⋮" menu) — the whole cluster connects into one button group, and the actions don't change the current selection. */
export const WithItemAction: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Each item has its own action</Label>
                <Typography type="body-sm" color="muted">
                    Use itemAction when each choice needs its own accompanying action (delete, menu) — the whole cluster connects into one button group.
                </Typography>
            </div>
            <Controlled
                items={ATTEMPT_ITEMS}
                initialValue="attempt-1"
                ariaLabel="Select attempt"
                itemAction={(item) => [
                    <Button key="delete" size="sm" variant="tertiary" isIconOnly aria-label={`Delete ${item.value}`}>
                        <TrashIcon className="size-4" />
                    </Button>,
                    <Button key="more" size="sm" variant="tertiary" isIconOnly aria-label={`More options for ${item.value}`}>
                        <DotsThreeVerticalIcon className="size-4" />
                    </Button>,
                ]}
            />
        </div>
    ),
    parameters: {
        usage: "Use `itemAction` when each choice needs its OWN accompanying action (e.g. a delete button + \"⋮\" menu) — the whole cluster connects into one button group, and the actions don't change the current selection.",
    },
}
