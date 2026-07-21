import type { Meta, StoryObj } from "@storybook/nextjs"

import { SelectableCardGroup } from "@/components/blocks/navigation/SelectableCardGroup"
import { Gallery, Variant } from "../../../../story-kit"
import { ControlledGroup, LANGUAGE_ITEMS, PLAN_ITEMS } from "./components"

const meta: Meta<typeof SelectableCardGroup> = {
    title: "Legacy/Blocks/Navigation/SelectableCardGroup",
    component: SelectableCardGroup,
}

export default meta

type Story = StoryObj<typeof SelectableCardGroup>

/**
 * Toàn bộ ma trận trạng thái của SelectableCardGroup: option giàu thông tin (icon +
 * mô tả + badge), số cột 1 và 3, và card có icon nhận diện kèm một lựa chọn bị khoá.
 * Dùng để tra khi nào chọn SelectableCardGroup thay các block chọn khác, và chọn
 * số cột theo bề rộng khu vực hiển thị.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Pick a rich option"
                hint="Pick 1-of-N when each option is rich (icon + description + badge) and the selection must stay readable — a real radio (billing cycle, service plan)."
            >
                <ControlledGroup
                    items={PLAN_ITEMS}
                    initialValue="monthly"
                    ariaLabel="Select billing cycle"
                    columns={2}
                />
            </Variant>
            <Variant
                label="1 column"
                hint="For a narrow block or sidebar, when the choices must stack in a single column."
            >
                <ControlledGroup
                    items={PLAN_ITEMS}
                    initialValue="quarterly"
                    ariaLabel="Select billing cycle"
                    columns={1}
                />
            </Variant>
            <Variant
                label="3 columns"
                hint="For listing many options side by side on a wide block, for example choosing a programming language."
            >
                <ControlledGroup
                    items={LANGUAGE_ITEMS}
                    initialValue="ts"
                    ariaLabel="Select language"
                    columns={3}
                    width="640px"
                />
            </Variant>
            <Variant
                label="With icons + locked item"
                hint="Use when the choices need an identifying icon (language, technology) and one option is not yet available — the disabled card still shows to signal coming soon instead of being hidden."
            >
                <ControlledGroup
                    items={LANGUAGE_ITEMS}
                    initialValue="java"
                    ariaLabel="Select language"
                    columns={2}
                />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Use when picking 1-of-N where each option is RICH (icon + description + badge) and the selection must STAY, readable " +
            "as \"the one I chose\" — this is a real radio (billing cycle, service plan). If pressing it leaves NOTHING behind " +
            "and the card just runs one action then stops (open a page, submit for grading) → GroupPressableCard. If each choice " +
            "is just a short one-line label → TabsCard (primary pill). If the choices are small, many, and need to wrap onto the next line → " +
            "FlexWrapButtonRadio. Choose the column count by context: 1 column for a narrow block/sidebar, 3 columns when listing " +
            "many options side by side (for example choosing a programming language).",
    },
}
