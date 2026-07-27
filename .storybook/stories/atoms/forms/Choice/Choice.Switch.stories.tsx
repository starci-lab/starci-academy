import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Choice } from "@sb-components/atoms/forms/Choice/Choice"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Choice.Switch`: a boolean track, label sits INLINE next to the track (wraps HeroUI Switch).
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). The full set of leaf props WITH A DISTINCT SHAPE: `isSelected`
 * (`Default`/`Selected`) · `size` (`Sizes`) · `hint` (`WithHint`) · `isRequired` (`Required`) ·
 * `isDisabled` (`Disabled`) · `errorMessage` (`Error`) · `isSkeleton` (`Loading`).
 * `label`/`onValueChange`/`className`/`showAnatomy` produce no distinct shape, so they get
 * no leaf.
 *
 * ⚠️ The previous version was MISSING the `Sizes` leaf entirely, even though the `size` prop
 * has three clearly distinct shapes (sm/md/lg) — added here. The `Loading` leaf must also
 * render all three sizes (§12g: "an isSkeleton leaf must render the skeleton at ALL 3
 * sizes"), not just one default track.
 *
 * ⭐ DEPS: this atom wraps HeroUI Switch directly — it doesn't rebuild any other atom that
 * has its own story, so it has NO `annotate` prop (§12g: "a leaf atom that wraps HeroUI
 * directly ⇒ deps are EMPTY"). `Control`/`Label` are Switch's own internal slots;
 * `Description`/`Error` are slots of `FieldFrame` (an internal scaffold with no story of
 * its own).
 *
 * ✍️ Text shown on the panel (`leaf`/`reason`/`note`/`code`) and demo labels in the render
 * frame are written in ENGLISH; JSDoc/comments stay in Vietnamese.
 */
const meta: Meta<typeof Choice.Switch> = {
    title: "Atoms/Forms/Choice/Choice.Switch",
    component: Choice.Switch,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Choice.Switch>

/** The FULL `size` union — missing a value means that value grows into a stray leaf elsewhere. */
const SIZES = ["sm", "md", "lg"] as const

/** BARE leaf — no prop turned on: off, no hint, no error. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(false)
            return (
                <BlockAnatomy
                    name="Choice.Switch"
                    tier="atom"
                    leaf="No prop turned on"
                    reason="The one switch atom in the system, wrapping HeroUI Switch. This leaf is the baseline: off, no hint, no error."
                    note="The label sits beside the track as a sibling — Switch has no content slot to own it."
                    code={"<Choice.Switch isSelected={value} onValueChange={setValue} label=\"Dark mode\" />"}
                >
                    <div className="w-72">
                        <Choice.Switch isSelected={value} onValueChange={setValue} label="Dark mode" showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isSelected` — the shape when on (false = the Default leaf above). */
export const Selected: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(true)
            return (
                <BlockAnatomy
                    name="Choice.Switch"
                    tier="atom"
                    leaf="Prop `isSelected`"
                    reason="isSelected is controlled — the caller owns the value and hands it back through onValueChange, so the track never drifts from the setting it represents."
                    note="On slides the thumb across and fills the track; nothing else in the row moves."
                    code={"<Choice.Switch isSelected onValueChange={setValue} label=\"Dark mode\" />"}
                >
                    <div className="w-72">
                        <Choice.Switch isSelected={value} onValueChange={setValue} label="Dark mode" showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `size` — three SCALE steps of the track, an axis independent of `isSelected` (§12d). */
export const Sizes: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(true)
            return (
                <BlockAnatomy
                    name="Choice.Switch"
                    tier="atom"
                    leaf="Prop `size`"
                    reason="size is scale only — it never changes what the switch means. Use it to match the switch to the row it sits in (a dense settings list vs. a spacious one)."
                    note="The label stays one text size across all three — only the track and thumb scale."
                    code={`<Choice.Switch size="sm" isSelected onValueChange={setValue} label="Dark mode" />
<Choice.Switch size="md" isSelected onValueChange={setValue} label="Dark mode" />   // default
<Choice.Switch size="lg" isSelected onValueChange={setValue} label="Dark mode" />`}
                >
                    <div className="flex flex-col items-start gap-4">
                        {SIZES.map((size, index) => (
                            <Choice.Switch key={size} size={size} isSelected={value} onValueChange={setValue} label={`Dark mode (${size})`} showAnatomy={index === 0} />
                        ))}
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `hint` — a secondary description line below the label, via the internal FieldFrame scaffold. */
export const WithHint: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(true)
            return (
                <BlockAnatomy
                    name="Choice.Switch"
                    tier="atom"
                    leaf="Prop `hint`"
                    reason="A switch with a side effect worth knowing gets a sentence, not just a label — hint stays visible below the row whether the switch is on or off."
                    note="Routed through FieldFrame internally — the atom stays a single call, no separate Field wrapper at the call site."
                    code={"<Choice.Switch isSelected={value} onValueChange={setValue} label=\"Dark mode\" hint=\"Eases eye strain at night.\" />"}
                >
                    <div className="w-72">
                        <Choice.Switch
                            isSelected={value}
                            onValueChange={setValue}
                            label="Dark mode"
                            hint="Eases eye strain when using the app at night."
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
                    name="Choice.Switch"
                    tier="atom"
                    leaf="Prop `isRequired`"
                    reason="Some toggles gate the rest of a form — the asterisk on the inline label flags that before the reader tries to move on."
                    note="The mark rides on the same label as the track, not on a separate FieldFrame heading — this control has no heading of its own."
                    code={"<Choice.Switch isSelected={value} onValueChange={setValue} label=\"Enable two-factor authentication\" isRequired />"}
                >
                    <div className="w-72">
                        <Choice.Switch
                            isSelected={value}
                            onValueChange={setValue}
                            label="Enable two-factor authentication"
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

/** Leaf prop `isDisabled` — locks the track, dims the color. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Choice.Switch"
                tier="atom"
                leaf="Prop `isDisabled`"
                reason="Not allowed yet — a plan tier doesn't cover the setting, or a step upstream isn't done. The track stays visible so the reader knows the option exists."
                note="Forwarded straight to HeroUI: press is blocked and both track and label dim."
                code={"<Choice.Switch isDisabled isSelected onValueChange={setValue} label=\"Autosave\" />"}
            >
                <div className="w-72">
                    <Choice.Switch isSelected onValueChange={() => {}} label="Autosave" isDisabled showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `errorMessage` — inline label + error-bordered track + red error line, via FieldFrame. */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(false)
            return (
                <BlockAnatomy
                    name="Choice.Switch"
                    tier="atom"
                    leaf="Prop `errorMessage`"
                    reason="A safety toggle left off is easy to miss on a settings page — the red border and the line beneath it stop the eye at the exact row that needs attention."
                    note="Setting errorMessage flips the control invalid on its own; there's no separate isInvalid to remember."
                    code={"<Choice.Switch isSelected={value} onValueChange={setValue} label=\"Security alerts\" errorMessage=\"Turn this on to get alerted.\" />"}
                >
                    <div className="w-72">
                        <Choice.Switch
                            isSelected={value}
                            onValueChange={setValue}
                            label="Security alerts"
                            errorMessage="Turn this on to get alerted about suspicious activity."
                            showAnatomy
                        />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isSkeleton` — CO-LOCATED shimmer (§12c), all THREE sizes (track pill + label bar). */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Choice.Switch"
                tier="atom"
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the shape owns its resting state, so the switch draws its own shimmer — no shared skeleton component to keep in sync."
                note="The shimmer tracks size (sm/md/lg), so a row of switches doesn't jump when the real content lands."
                code={`<Choice.Switch size="sm" isSkeleton label="Dark mode" />
<Choice.Switch isSkeleton label="Dark mode" />
<Choice.Switch size="lg" isSkeleton label="Dark mode" />`}
            >
                <div className="flex flex-col items-start gap-4">
                    {SIZES.map((size, index) => (
                        <Choice.Switch key={size} size={size} isSelected={false} onValueChange={() => {}} label="Dark mode" isSkeleton showAnatomy={index === 0} />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}
