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
 */
const meta: Meta<typeof Choice.Checkbox> = {
    title: "Atoms/Forms/Choice/Choice.Checkbox",
    component: Choice.Checkbox,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Choice.Checkbox>

/** Bare leaf — no prop turned on: unticked, no hint, no error. */
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
                    note="The label sits beside the box — Checkbox.Content owns it, not a separate FieldFrame label."
                    code={"<Choice.Checkbox isSelected={value} onValueChange={setValue} label=\"Receive email updates\" />"}
                >
                    <div className="w-72">
                        <Choice.Checkbox isSelected={value} onValueChange={setValue} label="Receive email updates" showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isSelected` — the shape when ticked (false = the Default leaf above). */
export const Checked: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(true)
            return (
                <BlockAnatomy
                    name="Choice.Checkbox"
                    tier="atom"
                    leaf="Prop `isSelected`"
                    reason="isSelected is controlled — the caller owns the value and hands it back through onValueChange, so the box never drifts from the form state around it."
                    note="Ticked fills the box and swaps the icon; nothing else in the row moves."
                    code={"<Choice.Checkbox isSelected onValueChange={setValue} label=\"Receive email updates\" />"}
                >
                    <div className="w-72">
                        <Choice.Checkbox isSelected={value} onValueChange={setValue} label="Receive email updates" showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `hint` — a secondary description line under the label, via the internal FieldFrame scaffold. */
export const WithHint: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(false)
            return (
                <BlockAnatomy
                    name="Choice.Checkbox"
                    tier="atom"
                    leaf="Prop `hint`"
                    reason="A checkbox with a consequence needs a sentence, not just a label — hint is that sentence, always visible below the row."
                    note="Routed through FieldFrame internally — the atom stays a single call, no separate Field wrapper at the call site."
                    code={"<Choice.Checkbox isSelected={value} onValueChange={setValue} label=\"Receive email updates\" hint=\"You can turn this off anytime in Settings.\" />"}
                >
                    <div className="w-72">
                        <Choice.Checkbox
                            isSelected={value}
                            onValueChange={setValue}
                            label="Receive email updates"
                            hint="You can turn this off anytime in Settings."
                            showAnatomy
                        />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isRequired` — a `*` mark attached to the inline label. */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(false)
            return (
                <BlockAnatomy
                    name="Choice.Checkbox"
                    tier="atom"
                    leaf="Prop `isRequired`"
                    reason="Some agreements aren't optional — the asterisk on the inline label says so before the form is even submitted."
                    note="The mark rides on the same label as the box, not on a separate FieldFrame heading — this control has no heading of its own."
                    code={"<Choice.Checkbox isSelected={value} onValueChange={setValue} label=\"Agree to the Terms of Service\" isRequired />"}
                >
                    <div className="w-72">
                        <Choice.Checkbox
                            isSelected={value}
                            onValueChange={setValue}
                            label="Agree to the Terms of Service"
                            isRequired
                            showAnatomy
                        />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isDisabled` — locks the control, faded color. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Choice.Checkbox"
                tier="atom"
                leaf="Prop `isDisabled`"
                reason="Not allowed yet — a step upstream isn't done, or the setting is locked by policy. The box stays visible so the reader knows the option exists."
                note="Forwarded straight to HeroUI: press is blocked and both box and label dim."
                code={"<Choice.Checkbox isDisabled isSelected onValueChange={setValue} label=\"Agree to the Terms of Service\" />"}
            >
                <div className="w-72">
                    <Choice.Checkbox
                        isSelected
                        onValueChange={() => {}}
                        label="Agree to the Terms of Service"
                        isDisabled
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `errorMessage` — inline label + error border + red error line, via FieldFrame. */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(false)
            return (
                <BlockAnatomy
                    name="Choice.Checkbox"
                    tier="atom"
                    leaf="Prop `errorMessage`"
                    reason="A blank required checkbox is easy to miss on a long form — the red border and the line beneath it stop the eye at the exact row that needs attention."
                    note="Setting errorMessage flips the control invalid on its own; there's no separate isInvalid to remember."
                    code={"<Choice.Checkbox isSelected={value} onValueChange={setValue} label=\"Agree to the Terms of Service\" errorMessage=\"You must agree to continue.\" />"}
                >
                    <div className="w-72">
                        <Choice.Checkbox
                            isSelected={value}
                            onValueChange={setValue}
                            label="Agree to the Terms of Service"
                            errorMessage="You must agree to continue."
                            showAnatomy
                        />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isSkeleton` — CO-LOCATED shimmer (§12c): square box + label bar. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Choice.Checkbox"
                tier="atom"
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the shape owns its resting state, so the checkbox draws its own shimmer — no shared skeleton component to keep in sync."
                note="The shimmer mirrors box + label width so the row doesn't jump when the real content lands."
                code={"<Choice.Checkbox isSkeleton />"}
            >
                <div className="w-72">
                    <Choice.Checkbox isSelected={false} onValueChange={() => {}} label="" isSkeleton showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
