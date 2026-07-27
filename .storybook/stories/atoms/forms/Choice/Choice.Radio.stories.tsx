import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { RadioGroup as HeroRadioGroup } from "@heroui/react"
import { Choice } from "@sb-components/atoms/forms/Choice/Choice"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Choice.Radio`: ONE option row, label sits INLINE beside the dot (wraps HeroUI Radio).
 *
 * ⚠️ STATE SCOPE (confirmed by the mentor 2026-07-25): `Choice.Radio` does NOT live
 * standalone — it must sit inside a radio-context. Helper text (`hint`) · error
 * (`errorMessage`) · required (`isRequired`) belong to the GROUP, so those states
 * live in the `Choice.RadioGroup` story — NOT repeated here (§12f). This story only
 * keeps states that come FROM the option row itself.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). The leaf set covers every prop with a VISUAL shape
 * on this component: selected or not (`Default`/`Selected`, driven by the group's
 * `value` matching) · `isDisabled` (`Disabled`) · `isSkeleton` (`Loading`).
 * `value`/`label`/`className`/`showAnatomy` get no leaf of their own (`value`/`label`
 * are required data, not an on/off state).
 *
 * ⚠️ HARNESS: `Choice.RadioGroup` only accepts `options` DATA (no `children`), so to
 * inspect ONE option row it's wrapped in a bare HeroUI `RadioGroup` — this is
 * scaffolding for the story to have a radio-context, NOT how it's used in the app.
 *
 * ⭐ DEPS: this atom wraps HeroUI Radio directly — it doesn't build on any other atom
 * with its own story, so it has NO `annotate` prop (§12g: "a leaf atom that wraps
 * HeroUI directly ⇒ deps is EMPTY"). `Control`/`Label` in the DOM are internal slots
 * of this option row itself.
 *
 * ✍️ Text shown on the panel (`leaf`/`reason`/`note`/`code`) and demo labels inside
 * the render frame are written in ENGLISH; JSDoc/comments stay in Vietnamese.
 */
const meta: Meta<typeof Choice.Radio> = {
    title: "Atoms/Forms/Choice/Choice.Radio",
    component: Choice.Radio,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Choice.Radio>

/** Bare leaf — an unselected option (wrapped in a radio-context so it runs). */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="Choice.Radio"
                    tier="atom"
                    leaf="No prop turned on"
                    reason="One radio option row, wrapping HeroUI Radio. It must live inside a radio-context — the app uses Choice.RadioGroup with options; this bare HeroRadioGroup is scaffolding for this story only."
                    note="The label sits beside the dot — Radio.Content owns it."
                    code={"<Choice.Radio value=\"starter\" label=\"Starter plan\" />"}
                >
                    <div className="w-72">
                        <HeroRadioGroup aria-label="Plan" value={value} onChange={setValue} className="flex flex-col gap-2">
                            <Choice.Radio value="starter" label="Starter plan" showAnatomy />
                        </HeroRadioGroup>
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf — a selected option (the group's value matches the row's value; the row does NOT hold its own selection state). */
export const Selected: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("starter")
            return (
                <BlockAnatomy
                    name="Choice.Radio"
                    tier="atom"
                    leaf="Selected"
                    reason="Selection lives on the group's value, not on this row — that's what keeps a set of radios mutually exclusive without each row tracking the others."
                    note="The dot fills when the group's value matches this row's value; nothing else changes."
                    code={"<Choice.Radio value=\"starter\" label=\"Starter plan\" />"}
                >
                    <div className="w-72">
                        <HeroRadioGroup aria-label="Plan" value={value} onChange={setValue} className="flex flex-col gap-2">
                            <Choice.Radio value="starter" label="Starter plan" showAnatomy />
                        </HeroRadioGroup>
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isDisabled` — locks ONE row individually (locking the whole group is a RadioGroup state). */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Choice.Radio"
                tier="atom"
                leaf="Prop `isDisabled`"
                reason="One option can be off the table without locking the whole group — a plan tier that's sold out, a slot already taken."
                note="Only this row dims and blocks the pointer; the rest of the group stays interactive."
                code={"<Choice.Radio value=\"starter\" label=\"Starter plan\" isDisabled />"}
            >
                <div className="w-72">
                    <HeroRadioGroup aria-label="Plan" value="starter" onChange={() => {}} className="flex flex-col gap-2">
                        <Choice.Radio value="starter" label="Starter plan" isDisabled showAnatomy />
                    </HeroRadioGroup>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `isSkeleton` — CO-LOCATED shimmer (§12c): dot + label bar. No radio-context needed. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Choice.Radio"
                tier="atom"
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the shape owns its resting state, so the row draws its own shimmer — no shared skeleton component to keep in sync."
                note="The shimmer mirrors dot + label width; a group's Loading leaf just stacks several of these."
                code={"<Choice.Radio value=\"\" label=\"\" isSkeleton />"}
            >
                <div className="w-72">
                    <Choice.Radio value="" label="" isSkeleton showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
