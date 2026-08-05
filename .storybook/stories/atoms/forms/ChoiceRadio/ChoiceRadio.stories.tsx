import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { RadioGroup as HeroRadioGroup } from "@heroui/react"
import { ChoiceRadio } from "@sb-components/atoms/forms"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Radio.Content`/`Radio.Control` — HeroUI's own compound parts (imported `Radio as
 * HeroRadio` and rendered directly), so they enter the tree as tier `heroui` with no
 * `storyId`. `Skeleton` is the same HeroUI `Skeleton` the `isSkeleton` branch renders
 * directly, so it gets the same treatment.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Radio.Content": { tier: "heroui", role: "row wrapping the dot + label" },
    "Radio.Control": { tier: "heroui", role: "dot + fill glyph" },
    "Skeleton": { tier: "heroui", role: "loading placeholder mirroring the dot + label" },
}

/**
 * ATOM — `ChoiceRadio`: ONE option row, label sits INLINE beside the dot (wraps HeroUI Radio).
 *
 * ⚠️ STATE SCOPE: `ChoiceRadio` does NOT live standalone — it must sit inside a
 * radio-context. Helper text (`hint`) · error (`errorMessage`) · required
 * (`isRequired`) belong to the GROUP, so those states live in the `ChoiceRadioGroup`
 * story — NOT repeated here. This story only keeps states that come FROM the option
 * row itself.
 *
 * 📐 **1 PROP = 1 LEAF**. The leaf set covers every prop with a VISUAL shape
 * on this component: selected or not (`Default`/`Selected`, driven by the group's
 * `value` matching) · `isDisabled` (`Disabled`) · `isSkeleton` (`Loading`).
 * `value`/`label`/`className` get no leaf of their own (`value`/`label`
 * are required data, not an on/off state).
 *
 * ⚠️ HARNESS: `ChoiceRadioGroup` only accepts `options` DATA (no `children`), so to
 * inspect ONE option row it's wrapped in a bare HeroUI `RadioGroup` — this is
 * scaffolding for the story to have a radio-context, NOT how it's used in the app.
 *
 * ⭐ DEPS: this atom wraps HeroUI Radio directly — it doesn't build on any other atom
 * with its own story, so it has NO `annotate` prop (a leaf atom that wraps HeroUI
 * directly ⇒ deps is EMPTY). `Control`/`Label` in the DOM are internal slots
 * of this option row itself.
 *
 * ✍️ Text shown on the panel (`leaf`/`reason`/`why`/`code`), demo labels inside
 * the render frame, and all JSDoc/comments are written in ENGLISH.
 */
const meta: Meta<typeof ChoiceRadio> = {
    title: "Atoms/Forms/ChoiceRadio",
    component: ChoiceRadio,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ChoiceRadio>

/** Bare leaf — an unselected option (wrapped in a radio-context so it runs). */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="ChoiceRadio"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="No prop turned on"
                    reason="One radio option row, wrapping HeroUI Radio. It must live inside a radio-context — the app uses ChoiceRadioGroup with options; this bare HeroRadioGroup is scaffolding for this story only."
                    states={[
                        {
                            name: "row value does not match the group's value",
                            why: "The dot renders empty and the label sits beside it exactly as HeroUI Radio.Content lays it out, with no fill inside the control. Selection lives entirely on the group's value rather than on this row, so unselected is simply what a row looks like before its value is chosen.",
                            code: "<ChoiceRadio value=\"starter\" label=\"Starter plan\" />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <HeroRadioGroup aria-label="Plan" value={value} onChange={setValue} className="flex flex-col gap-2">
                                        <ChoiceRadio value="starter" label="Starter plan" />
                                    </HeroRadioGroup>
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

/** Leaf — a selected option (the group's value matches the row's value; the row does NOT hold its own selection state). */
export const Selected: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("starter")
            return (
                <BlockAnatomy
                    name="ChoiceRadio"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Selected"
                    reason="Selection lives on the group's value rather than on this row, which is what keeps a set of radios mutually exclusive without each row tracking the others."
                    states={[
                        {
                            name: "row value matches the group's value",
                            why: "The dot switches to filled while every other node in the tree stays exactly the same shape as the unselected state. The group's value now equals this row's value, which is what keeps a set of radios mutually exclusive without each row tracking the others itself.",
                            code: "<ChoiceRadio value=\"starter\" label=\"Starter plan\" />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <HeroRadioGroup aria-label="Plan" value={value} onChange={setValue} className="flex flex-col gap-2">
                                        <ChoiceRadio value="starter" label="Starter plan" />
                                    </HeroRadioGroup>
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

/** Leaf prop `isDisabled` — locks ONE row individually (locking the whole group is a RadioGroup state). */
export const Disabled: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChoiceRadio"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isDisabled`"
                reason="One option can be off the table without locking the whole group, such as a plan tier that's sold out or a slot already taken."
                states={[
                    {
                        name: "isDisabled = true",
                        why: "The row dims and stops responding to pointer or keyboard input, while the dot and label nodes keep the same shape as an enabled row. This lets one option go off the table, such as a sold-out plan tier, without locking every other option in the group.",
                        code: "<ChoiceRadio value=\"starter\" label=\"Starter plan\" isDisabled />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <HeroRadioGroup aria-label="Plan" value="starter" onChange={() => {}} className="flex flex-col gap-2">
                                    <ChoiceRadio value="starter" label="Starter plan" isDisabled />
                                </HeroRadioGroup>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `isSkeleton` — CO-LOCATED shimmer (§12c): dot + label bar. No radio-context needed. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChoiceRadio"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the shape owns its resting state, so the row draws its own shimmer with no shared skeleton component to keep in sync."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The dot and label are replaced by two shimmer bars sized to their resting footprint, drawn by the row itself rather than a shared skeleton component. A group's own Loading leaf just stacks several of these rows, so nothing here depends on a radio-context.",
                        code: "<ChoiceRadio value=\"\" label=\"\" isSkeleton />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <ChoiceRadio value="" label="" isSkeleton />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
