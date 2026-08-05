import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { ChoiceCheckbox, ChoiceRadio, ChoiceSwitch } from "@sb-components/atoms/forms/Choice/Choice"
import { RadioGroup as HeroRadioGroup } from "@heroui/react"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * Transitional barrel story for the `Choice.*` namespace. Member atoms are
 * storied beside their own folders; this leaf proves the barrel still resolves.
 */
const meta: Meta = {
    title: "Atoms/Forms/Choice",
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj

export const Barrel: Story = {
    render: () => {
        const Demo = () => {
            const [checked, setChecked] = useState(false)
            const [on, setOn] = useState(false)
            const [picked, setPicked] = useState("a")
            return (
                <BlockAnatomy
                    name="Choice"
                    tier="atom"
                    leaf="Barrel re-exports"
                    reason="Public members live in sibling folders. This leaf only proves the transitional Choice barrel still hands out ChoiceCheckbox, ChoiceRadio, and ChoiceSwitch."
                    states={[
                        {
                            name: "imported from Choice/Choice",
                            why: "Callers that still import the namespace path must keep working until every importer moves.",
                            code: `import { ChoiceCheckbox, ChoiceRadio, ChoiceSwitch } from "@sb-components/atoms/forms/Choice/Choice"`,
                            render: (
                                <div data-tier="fixture" className="flex w-72 flex-col gap-4">
                                    <ChoiceCheckbox isSelected={checked} onValueChange={setChecked} label="Email updates" />
                                    <HeroRadioGroup value={picked} onChange={setPicked}>
                                        <ChoiceRadio value="a" label="Option A" />
                                        <ChoiceRadio value="b" label="Option B" />
                                    </HeroRadioGroup>
                                    <ChoiceSwitch isSelected={on} onValueChange={setOn} label="Dark mode" />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return (
            <div data-tier="fixture" className="p-8">
                <Demo />
            </div>
        )
    },
}
