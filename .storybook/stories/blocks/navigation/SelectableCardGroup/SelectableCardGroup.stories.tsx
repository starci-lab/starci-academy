import { Label, Typography } from "@heroui/react"
import type { Meta, StoryObj } from "@storybook/nextjs"

import { SelectableCardGroup } from "@/components/blocks/navigation/SelectableCardGroup"
import { ControlledGroup, LANGUAGE_ITEMS, PLAN_ITEMS } from "./components"

const meta: Meta<typeof SelectableCardGroup> = {
    title: "Blocks/Navigation/SelectableCardGroup",
}

export default meta

type Story = StoryObj<typeof meta>

/**
 * Use when picking 1-of-N where each option is RICH (icon + description + badge) and the selection must STAY,
 * readable as "the one I chose" — this is a real radio (billing cycle, service plan). If pressing it leaves
 * NOTHING behind and the card just runs one action then stops (open a page, submit for grading) →
 * GroupPressableCard. If each choice is just a short one-line label → TabsCard (primary pill). If the choices
 * are small, many, and need to wrap onto the next line → FlexWrapButtonRadio.
 */
export const Default: Story = {
    parameters: {
        usage:
            "Use when picking 1-of-N where each option is RICH (icon + description + badge) and the selection must STAY, readable " +
            "as \"the one I chose\" — this is a real radio (billing cycle, service plan). If pressing it leaves NOTHING behind " +
            "and the card just runs one action then stops (open a page, submit for grading) → GroupPressableCard. If each choice " +
            "is just a short one-line label → TabsCard (primary pill). If the choices are small, many, and need to wrap onto the next line → " +
            "FlexWrapButtonRadio.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Pick a rich option</Label>
                <Typography type="body-sm" color="muted">
                    Pick 1-of-N when each option is rich (icon + description + badge) and the selection must stay readable — a real radio.
                </Typography>
            </div>
            <ControlledGroup
                items={PLAN_ITEMS}
                initialValue="monthly"
                ariaLabel="Select billing cycle"
                columns={2}
            />
        </div>
    ),
}

/**
 * Choose the column count by context: 1 column for a narrow block/sidebar, 3 columns when listing
 * many options side by side (for example choosing a programming language).
 */
export const Columns: Story = {
    name: "Columns (1 / 3)",
    parameters: {
        usage: "Choose the column count by context: 1 column for a narrow block/sidebar, 3 columns when listing many options side by side (for example choosing a programming language).",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>1 column</Label>
                    <Typography type="body-sm" color="muted">
                        For a narrow block or sidebar, when the choices must stack in a single column.
                    </Typography>
                </div>
                <ControlledGroup
                    items={PLAN_ITEMS}
                    initialValue="quarterly"
                    ariaLabel="Select billing cycle"
                    columns={1}
                />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>3 columns</Label>
                    <Typography type="body-sm" color="muted">
                        For listing many options side by side on a wide block, for example choosing a programming language.
                    </Typography>
                </div>
                <ControlledGroup
                    items={LANGUAGE_ITEMS}
                    initialValue="ts"
                    ariaLabel="Select language"
                    columns={3}
                    width="640px"
                />
            </div>
        </div>
    ),
}

/**
 * Use when the choices need an identifying icon (language, technology) and one option is
 * not yet available — the disabled card still shows to signal "coming soon" instead of being hidden.
 */
export const WithIconAndDisabled: Story = {
    parameters: {
        usage: "Use when the choices need an identifying icon (language, technology) and one option is not yet available — the disabled card still shows to signal \"coming soon\" instead of being hidden.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With icons + locked item</Label>
                <Typography type="body-sm" color="muted">
                    When the choices need an identifying icon (language, technology) and one option isn't available yet — the disabled card still shows to signal coming soon.
                </Typography>
            </div>
            <ControlledGroup
                items={LANGUAGE_ITEMS}
                initialValue="java"
                ariaLabel="Select language"
                columns={2}
            />
        </div>
    ),
}
