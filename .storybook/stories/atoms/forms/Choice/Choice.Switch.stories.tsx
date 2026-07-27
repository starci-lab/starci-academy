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
                    states={[
                        {
                            name: "isSelected = false, no hint, no error",
                            why: "The track sits off and the label reads as a plain sibling beside it. Switch has no content slot of its own to own the label, so this bare pairing is the resting shape of the whole atom.",
                            code: "<Choice.Switch isSelected={value} onValueChange={setValue} label=\"Dark mode\" />",
                            render: (
                                <div className="w-72">
                                    <Choice.Switch isSelected={value} onValueChange={setValue} label="Dark mode" showAnatomy />
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
                    reason="isSelected is controlled: the caller owns the value and hands it back through onValueChange, so the track never drifts from the setting it represents."
                    states={[
                        {
                            name: "isSelected = true",
                            why: "The thumb slides across and fills the track, while nothing else in the row moves. This is the shape isSelected = false above becomes once the caller flips the value it owns.",
                            code: "<Choice.Switch isSelected onValueChange={setValue} label=\"Dark mode\" />",
                            render: (
                                <div className="w-72">
                                    <Choice.Switch isSelected={value} onValueChange={setValue} label="Dark mode" showAnatomy />
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
                    reason="size is scale only, it never changes what the switch means. Use it to match the switch to the row it sits in (a dense settings list vs. a spacious one)."
                    states={[
                        {
                            name: "size = sm | md | lg (full union)",
                            why: "Three tracks render at increasing scale while the label stays one text size across all three. Only the track and thumb grow, so size is purely a fit decision for the row the switch sits in, not a meaning change.",
                            code: `<Choice.Switch size="sm" isSelected onValueChange={setValue} label="Dark mode" />
<Choice.Switch size="md" isSelected onValueChange={setValue} label="Dark mode" />   // default
<Choice.Switch size="lg" isSelected onValueChange={setValue} label="Dark mode" />`,
                            render: (
                                <div className="flex flex-col items-start gap-4">
                                    {SIZES.map((size, index) => (
                                        <Choice.Switch key={size} size={size} isSelected={value} onValueChange={setValue} label={`Dark mode (${size})`} showAnatomy={index === 0} />
                                    ))}
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
                    reason="A switch with a side effect worth knowing gets a sentence, not just a label; hint stays visible below the row whether the switch is on or off."
                    states={[
                        {
                            name: "hint set",
                            why: "A description line grows below the row, routed through the internal FieldFrame scaffold so the atom stays a single call. The sentence stays visible whether the switch is on or off, because the side effect it names is true either way.",
                            code: "<Choice.Switch isSelected={value} onValueChange={setValue} label=\"Dark mode\" hint=\"Eases eye strain at night.\" />",
                            render: (
                                <div className="w-72">
                                    <Choice.Switch
                                        isSelected={value}
                                        onValueChange={setValue}
                                        label="Dark mode"
                                        hint="Eases eye strain when using the app at night."
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
                    reason="Some toggles gate the rest of a form, so the asterisk on the inline label flags that before the reader tries to move on."
                    states={[
                        {
                            name: "isRequired = true",
                            why: "A `*` mark rides on the same inline label as the track, since this control has no separate FieldFrame heading of its own to carry it. The mark flags a toggle the form will not accept left off, before the reader tries to move on.",
                            code: "<Choice.Switch isSelected={value} onValueChange={setValue} label=\"Enable two-factor authentication\" isRequired />",
                            render: (
                                <div className="w-72">
                                    <Choice.Switch
                                        isSelected={value}
                                        onValueChange={setValue}
                                        label="Enable two-factor authentication"
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

/** Leaf prop `isDisabled` — locks the track, dims the color. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Choice.Switch"
                tier="atom"
                leaf="Prop `isDisabled`"
                reason="Not allowed yet: a plan tier doesn't cover the setting, or a step upstream isn't done. The track stays visible so the reader knows the option exists."
                states={[
                    {
                        name: "isDisabled = true",
                        why: "Both track and label dim together and press is blocked, forwarded straight to HeroUI's own disabled handling. The track stays visible rather than disappearing, so the reader still knows the option exists even though it is out of reach right now.",
                        code: "<Choice.Switch isDisabled isSelected onValueChange={setValue} label=\"Autosave\" />",
                        render: (
                            <div className="w-72">
                                <Choice.Switch isSelected onValueChange={() => {}} label="Autosave" isDisabled showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
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
                    reason="A safety toggle left off is easy to miss on a settings page, so the red border and the line beneath it stop the eye at the exact row that needs attention."
                    states={[
                        {
                            name: "errorMessage set",
                            why: "The track border turns invalid and a red line grows beneath it, stopping the eye at the exact row that needs attention. Setting errorMessage flips the control invalid on its own, so there is no separate isInvalid to remember alongside it.",
                            code: "<Choice.Switch isSelected={value} onValueChange={setValue} label=\"Security alerts\" errorMessage=\"Turn this on to get alerted.\" />",
                            render: (
                                <div className="w-72">
                                    <Choice.Switch
                                        isSelected={value}
                                        onValueChange={setValue}
                                        label="Security alerts"
                                        errorMessage="Turn this on to get alerted about suspicious activity."
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

/** Leaf prop `isSkeleton` — CO-LOCATED shimmer (§12c), all THREE sizes (track pill + label bar). */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Choice.Switch"
                tier="atom"
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the shape owns its resting state, so the switch draws its own shimmer; there is no shared skeleton component to keep in sync."
                states={[
                    {
                        name: "isSkeleton = true, size = sm | md | lg (full union)",
                        why: "A shimmer track and a shimmer label bar stand at each size instead of the real switch. The shimmer tracks size, so a row of switches does not jump once the real content lands and replaces it.",
                        code: `<Choice.Switch size="sm" isSkeleton label="Dark mode" />
<Choice.Switch isSkeleton label="Dark mode" />
<Choice.Switch size="lg" isSkeleton label="Dark mode" />`,
                        render: (
                            <div className="flex flex-col items-start gap-4">
                                {SIZES.map((size, index) => (
                                    <Choice.Switch key={size} size={size} isSelected={false} onValueChange={() => {}} label="Dark mode" isSkeleton showAnatomy={index === 0} />
                                ))}
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
