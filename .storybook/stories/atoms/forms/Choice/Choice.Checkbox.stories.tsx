import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Choice } from "@sb-components/atoms/forms/Choice/Choice"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Choice.Checkbox`: boolean tick box, label sits INLINE next to the box
 * (wraps HeroUI Checkbox).
 *
 * 📐 **1 PROP = 1 LEAF** (§12g — ATOM TIER law). Leaf set for props WITH their own
 * shape: `isSelected` (`Default`/`Checked`) · `hint` (`WithHint`) · `isRequired`
 * (`Required`) · `isDisabled` (`Disabled`) · `errorMessage` (`Error`) · `isSkeleton`
 * (`Loading`). `label`/`onValueChange`/`className`/`showAnatomy` don't produce a
 * shape of their own, so they get no leaf.
 *
 * ⭐ DEPS: this atom wraps HeroUI Checkbox directly — it doesn't build on top of
 * any other atom that has its own story, so it has NO `annotate` prop (§12g: "a
 * leaf atom that wraps HeroUI directly ⇒ deps is EMPTY, drop the prop entirely").
 * `Control`/`Label` in the DOM are Checkbox's own internal slots; `Description`/
 * `Error` are slots of `FieldFrame` (an internal scaffold with no story of its
 * own) — none of them have a home to jump to.
 *
 * ⚠️ The States tab is REMOVED (teacher's call, 2026-07-26, second pass). Panel
 * keeps Deps · Code — this file has no Deps, so the panel is Code only.
 *
 * ✍️ Text shown in the panel (`leaf`/`reason`/`note`/`code`) and the demo labels
 * inside the render frame are written in ENGLISH; JSDoc/comments stay Vietnamese.
 *
 * MIGRATED TO `states` (2026-07-27): every leaf below has exactly one shape, so
 * each carries a single `states[]` entry.
 */
const meta: Meta<typeof Choice.Checkbox> = {
    title: "Atoms/Forms/Choice/Choice.Checkbox",
    component: Choice.Checkbox,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Choice.Checkbox>

/** Bare leaf — no prop turned on: unticked, no hint, no error. Migrated to `states` 2026-07-27. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(false)
            return (
                <BlockAnatomy
                    name="Choice.Checkbox"
                    tier="atom"
                    leaf="No prop turned on"
                    reason="The one checkbox atom in the system, wrapping HeroUI Checkbox. This leaf is the baseline: unticked, no hint, no error."
                    states={[
                        {
                            name: "isSelected = false (unticked)",
                            why: "The box renders empty and the label sits inline beside it — `Checkbox.Content` owns the label, there is no separate `FieldFrame` label. This is the baseline every other leaf below differs from by exactly one prop.",
                            code: "<Choice.Checkbox isSelected={value} onValueChange={setValue} label=\"Receive email updates\" />",
                            render: (
                                <div className="w-72">
                                    <Choice.Checkbox isSelected={value} onValueChange={setValue} label="Receive email updates" showAnatomy />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isSelected` — the shape when ticked (false = the Default leaf above). Migrated to `states` 2026-07-27. */
export const Checked: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(true)
            return (
                <BlockAnatomy
                    name="Choice.Checkbox"
                    tier="atom"
                    leaf="Prop `isSelected`"
                    states={[
                        {
                            name: "isSelected = true (ticked)",
                            why: "The box fills and the tick icon swaps in; nothing else in the row moves. `isSelected` is controlled, so the caller owns the value and hands it back through `onValueChange`, which keeps the box from ever drifting out of sync with the form state around it.",
                            code: "<Choice.Checkbox isSelected onValueChange={setValue} label=\"Receive email updates\" />",
                            render: (
                                <div className="w-72">
                                    <Choice.Checkbox isSelected={value} onValueChange={setValue} label="Receive email updates" showAnatomy />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `hint` — a secondary description line under the label, via the internal FieldFrame scaffold. Migrated to `states` 2026-07-27. */
export const WithHint: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(false)
            return (
                <BlockAnatomy
                    name="Choice.Checkbox"
                    tier="atom"
                    leaf="Prop `hint`"
                    states={[
                        {
                            name: "hint set",
                            why: "A muted sentence appears below the row, routed through the internal `FieldFrame` scaffold rather than a separate wrapper at the call site. A checkbox with a real consequence needs more than a label, so the hint stays visible at all times instead of hiding behind a tooltip.",
                            code: "<Choice.Checkbox isSelected={value} onValueChange={setValue} label=\"Receive email updates\" hint=\"You can turn this off anytime in Settings.\" />",
                            render: (
                                <div className="w-72">
                                    <Choice.Checkbox
                                        isSelected={value}
                                        onValueChange={setValue}
                                        label="Receive email updates"
                                        hint="You can turn this off anytime in Settings."
                                        showAnatomy
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isRequired` — a `*` mark attached to the inline label. Migrated to `states` 2026-07-27. */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(false)
            return (
                <BlockAnatomy
                    name="Choice.Checkbox"
                    tier="atom"
                    leaf="Prop `isRequired`"
                    states={[
                        {
                            name: "isRequired = true",
                            why: "A `*` mark attaches to the end of the inline label; the label carries it since this control has no separate heading of its own. Some agreements aren't optional, so the asterisk has to say so before the form is ever submitted.",
                            code: "<Choice.Checkbox isSelected={value} onValueChange={setValue} label=\"Agree to the Terms of Service\" isRequired />",
                            render: (
                                <div className="w-72">
                                    <Choice.Checkbox
                                        isSelected={value}
                                        onValueChange={setValue}
                                        label="Agree to the Terms of Service"
                                        isRequired
                                        showAnatomy
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isDisabled` — locks the control, faded color. Migrated to `states` 2026-07-27. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Choice.Checkbox"
                tier="atom"
                leaf="Prop `isDisabled`"
                states={[
                    {
                        name: "isDisabled = true, isSelected = true",
                        why: "Both the box and its label dim and stop responding to press, forwarded straight to HeroUI's own disabled handling. The box has to stay visible so the reader still knows the option exists, even though a step upstream isn't done yet or policy has locked it.",
                        code: "<Choice.Checkbox isDisabled isSelected onValueChange={setValue} label=\"Agree to the Terms of Service\" />",
                        render: (
                            <div className="w-72">
                                <Choice.Checkbox
                                    isSelected
                                    onValueChange={() => {}}
                                    label="Agree to the Terms of Service"
                                    isDisabled
                                    showAnatomy
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `errorMessage` — inline label + error border + red error line, via FieldFrame. Migrated to `states` 2026-07-27. */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(false)
            return (
                <BlockAnatomy
                    name="Choice.Checkbox"
                    tier="atom"
                    leaf="Prop `errorMessage`"
                    states={[
                        {
                            name: "errorMessage set",
                            why: "The control flips to its invalid style and a red line appears beneath it — setting `errorMessage` alone does this, with no separate `isInvalid` to remember. A blank required checkbox is easy to miss on a long form, so the red border and the line under it stop the eye at the exact row that needs attention.",
                            code: "<Choice.Checkbox isSelected={value} onValueChange={setValue} label=\"Agree to the Terms of Service\" errorMessage=\"You must agree to continue.\" />",
                            render: (
                                <div className="w-72">
                                    <Choice.Checkbox
                                        isSelected={value}
                                        onValueChange={setValue}
                                        label="Agree to the Terms of Service"
                                        errorMessage="You must agree to continue."
                                        showAnatomy
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isSkeleton` — CO-LOCATED shimmer (§12c): square box + label bar. Migrated to `states` 2026-07-27. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Choice.Checkbox"
                tier="atom"
                leaf="Prop `isSkeleton`"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The whole row is replaced by a shimmer box plus a shimmer label bar sized to match the live row, instead of any real checkbox control. Whoever owns the shape owns its resting state, so the checkbox draws its own shimmer rather than the caller assembling one from a shared skeleton component.",
                        code: "<Choice.Checkbox isSkeleton />",
                        render: (
                            <div className="w-72">
                                <Choice.Checkbox isSelected={false} onValueChange={() => {}} label="" isSkeleton showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
