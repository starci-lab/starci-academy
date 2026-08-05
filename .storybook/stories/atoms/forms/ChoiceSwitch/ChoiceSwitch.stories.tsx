import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { ChoiceSwitch } from "@sb-components/atoms/forms"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Switch`/`Label` — HeroUI's own components (imported `Switch as HeroSwitch` and `Label
 * as HeroLabel`, rendered directly), so they enter the tree as tier `heroui` with no
 * `storyId`. `Skeleton` is the same HeroUI `Skeleton` this atom's `isSkeleton` branch
 * renders directly, so it gets the same treatment.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Switch": { tier: "heroui", role: "toggle track + thumb" },
    "Label": { tier: "heroui", role: "label beside the track" },
    "Skeleton": { tier: "heroui", role: "loading placeholder mirroring the track + label" },
}

/**
 * ATOM — `ChoiceSwitch`: a boolean track, label sits INLINE next to the track (wraps HeroUI Switch).
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). The full set of leaf props WITH A DISTINCT SHAPE: `isSelected`
 * (`Default`/`Selected`) · `size` (`Sizes`) · `hint` (`WithHint`) · `isRequired` (`Required`) ·
 * `isDisabled` (`Disabled`) · `errorMessage` (`Error`) · `isSkeleton` (`Loading`).
 * `label`/`onValueChange`/`className` produce no distinct shape, so they get
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
 * frame, as well as all JSDoc/comments, are written in ENGLISH.
 */
const meta: Meta<typeof ChoiceSwitch> = {
    title: "Atoms/Forms/ChoiceSwitch",
    component: ChoiceSwitch,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ChoiceSwitch>

/** BARE leaf — no prop turned on: off, no hint, no error. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(false)
            return (
                <BlockAnatomy
                    name="ChoiceSwitch"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="No prop turned on"
                    reason="The one switch atom in the system, wrapping HeroUI Switch. This leaf is the baseline: off, no hint, no error."
                    states={[
                        {
                            name: "isSelected = false, no hint, no error",
                            why: "The track sits off and the label reads as a plain sibling beside it. Switch has no content slot of its own to own the label, so this bare pairing is the resting shape of the whole atom.",
                            code: "<ChoiceSwitch isSelected={value} onValueChange={setValue} label=\"Dark mode\" />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <ChoiceSwitch isSelected={value} onValueChange={setValue} label="Dark mode" />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isSelected` — the shape when on (false = the Default leaf above). */
export const Selected: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(true)
            return (
                <BlockAnatomy
                    name="ChoiceSwitch"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `isSelected`"
                    reason="isSelected is controlled: the caller owns the value and hands it back through onValueChange, so the track never drifts from the setting it represents."
                    states={[
                        {
                            name: "isSelected = true",
                            why: "The thumb slides across and fills the track, while nothing else in the row moves. This is the shape isSelected = false above becomes once the caller flips the value it owns.",
                            code: "<ChoiceSwitch isSelected onValueChange={setValue} label=\"Dark mode\" />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <ChoiceSwitch isSelected={value} onValueChange={setValue} label="Dark mode" />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf prop `size` — three SCALE steps of the track, an axis independent of `isSelected` (§12d). */
export const Sizes: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(true)
            return (
                <BlockAnatomy
                    name="ChoiceSwitch"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `size`"
                    reason="size is scale only, it never changes what the switch means. Use it to match the switch to the row it sits in (a dense settings list vs. a spacious one)."
                    states={[
                        {
                            name: "size = sm",
                            why: "The track and thumb render at the smallest scale while the label keeps its normal text size. This scale fits a dense settings list where many rows of switches share one screen.",
                            code: "<ChoiceSwitch size=\"sm\" isSelected onValueChange={setValue} label=\"Dark mode\" />",
                            render: (
                                <ChoiceSwitch size="sm" isSelected={value} onValueChange={setValue} label="Dark mode (sm)" />
                            ),
                        },
                        {
                            name: "size = md (default)",
                            why: "The track and thumb render at the default scale, the size ChoiceSwitch takes whenever size is left unset. This is the resting scale for an ordinary settings row with no density pressure.",
                            code: "<ChoiceSwitch isSelected onValueChange={setValue} label=\"Dark mode\" />   // size defaults to md",
                            render: (
                                <ChoiceSwitch size="md" isSelected={value} onValueChange={setValue} label="Dark mode (md)" />
                            ),
                        },
                        {
                            name: "size = lg",
                            why: "The track and thumb render at the largest scale while the label keeps its normal text size. This scale suits a spacious page or a touch target that needs to stand out.",
                            code: "<ChoiceSwitch size=\"lg\" isSelected onValueChange={setValue} label=\"Dark mode\" />",
                            render: (
                                <ChoiceSwitch size="lg" isSelected={value} onValueChange={setValue} label="Dark mode (lg)" />
                            ),
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf prop `hint` — a secondary description line below the label, via the internal FieldFrame scaffold. */
export const WithHint: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(true)
            return (
                <BlockAnatomy
                    name="ChoiceSwitch"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `hint`"
                    reason="A switch with a side effect worth knowing gets a sentence, not just a label; hint stays visible below the row whether the switch is on or off."
                    states={[
                        {
                            name: "hint set",
                            why: "A description line grows below the row, routed through the internal FieldFrame scaffold so the atom stays a single call. The sentence stays visible whether the switch is on or off, because the side effect it names is true either way.",
                            code: "<ChoiceSwitch isSelected={value} onValueChange={setValue} label=\"Dark mode\" hint=\"Eases eye strain at night.\" />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <ChoiceSwitch
                                        isSelected={value}
                                        onValueChange={setValue}
                                        label="Dark mode"
                                        hint="Eases eye strain when using the app at night."
                                       
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isRequired` — a `*` mark attached to the inline label. */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(false)
            return (
                <BlockAnatomy
                    name="ChoiceSwitch"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `isRequired`"
                    reason="Some toggles gate the rest of a form, so the asterisk on the inline label flags that before the reader tries to move on."
                    states={[
                        {
                            name: "isRequired = true",
                            why: "A `*` mark rides on the same inline label as the track, since this control has no separate FieldFrame heading of its own to carry it. The mark flags a toggle the form will not accept left off, before the reader tries to move on.",
                            code: "<ChoiceSwitch isSelected={value} onValueChange={setValue} label=\"Enable two-factor authentication\" isRequired />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <ChoiceSwitch
                                        isSelected={value}
                                        onValueChange={setValue}
                                        label="Enable two-factor authentication"
                                        isRequired
                                       
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isDisabled` — locks the track, dims the color. */
export const Disabled: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChoiceSwitch"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isDisabled`"
                reason="Not allowed yet: a plan tier doesn't cover the setting, or a step upstream isn't done. The track stays visible so the reader knows the option exists."
                states={[
                    {
                        name: "isDisabled = true",
                        why: "Both track and label dim together and press is blocked, forwarded straight to HeroUI's own disabled handling. The track stays visible rather than disappearing, so the reader still knows the option exists even though it is out of reach right now.",
                        code: "<ChoiceSwitch isDisabled isSelected onValueChange={setValue} label=\"Autosave\" />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <ChoiceSwitch isSelected onValueChange={() => {}} label="Autosave" isDisabled />
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
                    name="ChoiceSwitch"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `errorMessage`"
                    reason="A safety toggle left off is easy to miss on a settings page, so the red border and the line beneath it stop the eye at the exact row that needs attention."
                    states={[
                        {
                            name: "errorMessage set",
                            why: "The track border turns invalid and a red line grows beneath it, stopping the eye at the exact row that needs attention. Setting errorMessage flips the control invalid on its own, so there is no separate isInvalid to remember alongside it.",
                            code: "<ChoiceSwitch isSelected={value} onValueChange={setValue} label=\"Security alerts\" errorMessage=\"Turn this on to get alerted.\" />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <ChoiceSwitch
                                        isSelected={value}
                                        onValueChange={setValue}
                                        label="Security alerts"
                                        errorMessage="Turn this on to get alerted about suspicious activity."
                                       
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isSkeleton` — CO-LOCATED shimmer (§12c), all THREE sizes (track pill + label bar). */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChoiceSwitch"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the shape owns its resting state, so the switch draws its own shimmer; there is no shared skeleton component to keep in sync."
                states={[
                    {
                        name: "isSkeleton = true, size = sm",
                        why: "A shimmer track and a shimmer label bar stand at the smallest scale instead of the real switch. The shimmer tracks the sm scale, so a dense row of switches does not jump once the real content lands.",
                        code: "<ChoiceSwitch size=\"sm\" isSkeleton label=\"Dark mode\" />",
                        render: (
                            <ChoiceSwitch size="sm" isSelected={false} onValueChange={() => {}} label="Dark mode" isSkeleton />
                        ),
                    },
                    {
                        name: "isSkeleton = true, size = md (default)",
                        why: "A shimmer track and a shimmer label bar stand at the default scale instead of the real switch. The shimmer tracks the md scale, so an ordinary switch row does not jump once the real content lands.",
                        code: "<ChoiceSwitch isSkeleton label=\"Dark mode\" />   // size defaults to md",
                        render: (
                            <ChoiceSwitch size="md" isSelected={false} onValueChange={() => {}} label="Dark mode" isSkeleton />
                        ),
                    },
                    {
                        name: "isSkeleton = true, size = lg",
                        why: "A shimmer track and a shimmer label bar stand at the largest scale instead of the real switch. The shimmer tracks the lg scale, so a spacious switch row does not jump once the real content lands.",
                        code: "<ChoiceSwitch size=\"lg\" isSkeleton label=\"Dark mode\" />",
                        render: (
                            <ChoiceSwitch size="lg" isSelected={false} onValueChange={() => {}} label="Dark mode" isSkeleton />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
