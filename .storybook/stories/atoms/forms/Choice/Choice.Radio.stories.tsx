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
 * DI TRÚ SANG API `states[]` (thầy chốt 2026-07-27, canon §8): mỗi leaf ở đây vốn
 * đã chỉ dựng MỘT bản render, nên mỗi leaf giờ có ĐÚNG một phần tử `states` — chỉ
 * đổi chỗ chứa `why`/`code`/`render`, không đổi hình.
 *
 * ✍️ Text shown on the panel (`leaf`/`reason`/`why`/`code`) and demo labels inside
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
                    states={[
                        {
                            name: "row value does not match the group's value",
                            why: "The dot renders empty and the label sits beside it exactly as HeroUI Radio.Content lays it out, with no fill inside the control. Selection lives entirely on the group's value rather than on this row, so unselected is simply what a row looks like before its value is chosen.",
                            code: "<Choice.Radio value=\"starter\" label=\"Starter plan\" />",
                            render: (
                                <div className="w-72">
                                    <HeroRadioGroup aria-label="Plan" value={value} onChange={setValue} className="flex flex-col gap-2">
                                        <Choice.Radio value="starter" label="Starter plan" showAnatomy />
                                    </HeroRadioGroup>
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
                    reason="Selection lives on the group's value rather than on this row, which is what keeps a set of radios mutually exclusive without each row tracking the others."
                    states={[
                        {
                            name: "row value matches the group's value",
                            why: "The dot switches to filled while every other node in the tree stays exactly the same shape as the unselected state. The group's value now equals this row's value, which is what keeps a set of radios mutually exclusive without each row tracking the others itself.",
                            code: "<Choice.Radio value=\"starter\" label=\"Starter plan\" />",
                            render: (
                                <div className="w-72">
                                    <HeroRadioGroup aria-label="Plan" value={value} onChange={setValue} className="flex flex-col gap-2">
                                        <Choice.Radio value="starter" label="Starter plan" showAnatomy />
                                    </HeroRadioGroup>
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

/** Leaf prop `isDisabled` — locks ONE row individually (locking the whole group is a RadioGroup state). */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Choice.Radio"
                tier="atom"
                leaf="Prop `isDisabled`"
                reason="One option can be off the table without locking the whole group, such as a plan tier that's sold out or a slot already taken."
                states={[
                    {
                        name: "isDisabled = true",
                        why: "The row dims and stops responding to pointer or keyboard input, while the dot and label nodes keep the same shape as an enabled row. This lets one option go off the table, such as a sold-out plan tier, without locking every other option in the group.",
                        code: "<Choice.Radio value=\"starter\" label=\"Starter plan\" isDisabled />",
                        render: (
                            <div className="w-72">
                                <HeroRadioGroup aria-label="Plan" value="starter" onChange={() => {}} className="flex flex-col gap-2">
                                    <Choice.Radio value="starter" label="Starter plan" isDisabled showAnatomy />
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
        <div className="p-8">
            <BlockAnatomy
                name="Choice.Radio"
                tier="atom"
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the shape owns its resting state, so the row draws its own shimmer with no shared skeleton component to keep in sync."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The dot and label are replaced by two shimmer bars sized to their resting footprint, drawn by the row itself rather than a shared skeleton component. A group's own Loading leaf just stacks several of these rows, so nothing here depends on a radio-context.",
                        code: "<Choice.Radio value=\"\" label=\"\" isSkeleton />",
                        render: (
                            <div className="w-72">
                                <Choice.Radio value="" label="" isSkeleton showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
