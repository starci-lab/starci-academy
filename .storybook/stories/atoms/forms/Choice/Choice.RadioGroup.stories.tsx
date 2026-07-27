import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Choice } from "@sb-components/atoms/forms/Choice/Choice"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Choice.RadioGroup`: a pick-one group, built from `options` DATA (wraps
 * HeroUI RadioGroup + loops `Choice.Radio` for each option).
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). The full leaf set for props WITH a visual: picked
 * or not (`Default`/`Selected`, driven by `value`) · `groupLabel` (`WithLabel`) ·
 * `hint` (`WithHint`) · `isRequired` (`Required`) · `isDisabled` (`Disabled`) ·
 * `errorMessage` (`Error`) · `isSkeleton` (`Loading`). `options`/`onValueChange`/
 * `ariaLabel`/`skeletonRows`/`className`/`showAnatomy` get no leaf of their own.
 *
 * ⛔ DON'T repeat the state of EACH ROW (`Choice.Radio`'s own Disabled/Loading —
 * §12f): locking a single option or skeleton-ing one lone row belongs in the
 * `Choice.Radio` story.
 *
 * ⚠️⭐ DEPS — a known GAP, not yet wired up (read carefully before re-adding
 * `annotate`): `Choice.RadioGroup` CALLS the real `ChoiceRadio` function to build
 * each row (see `Choice.tsx`), but that component has NO `anatPart`-style prop to
 * rename the `data-anat-part` it emits (unlike `ButtonBase`/`AvatarGroup`, which DO
 * have this wire — see `ButtonGroup.tsx` passing `anatPart="Button.Base"` down to
 * each `ButtonBase`). So each option row only emits `Control`/`Label` — two
 * INTERNAL slots with the exact same names used in the `Choice.Radio` story
 * itself — the DOM has no node named `"Radio"`/`"Choice.Radio"` to anchor a
 * `storyId` to. Attaching `storyId` to `Control`/`Label` here would be WRONG: in
 * the other three `Choice.*` files those same two keys are slots (unlinked), so
 * giving one RadioGroup its own link would be inconsistent and SILENTLY wrong if
 * someone misreads it as "Control = the whole Radio row". So `annotate` is dropped
 * entirely here — DON'T make up a key — see this pass's `issues` to wire up
 * `anatPart` in `Choice.tsx` before adding it back.
 *
 * ✍️ Text shown on the panel (`leaf`/`reason`/`why`/`code`) and demo labels in the
 * render frame are written in ENGLISH; JSDoc/comments stay in Vietnamese.
 *
 * 2026-07-27: di trú toàn bộ leaf sang API `states[]` (§8/§4a).
 */
const meta: Meta<typeof Choice.RadioGroup> = {
    title: "Atoms/Forms/Choice/Choice.RadioGroup",
    component: Choice.RadioGroup,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Choice.RadioGroup>

const OPTIONS = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
]

/** Bare leaf — a group of 3 options, none picked yet, no heading. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="Choice.RadioGroup"
                    tier="atom"
                    leaf="No prop turned on"
                    reason="The one radio-group atom in the system, wrapping HeroUI RadioGroup. It rebuilds one Choice.Radio per entry from options, data, not JSX children, so a caller can never mismatch a row's shape with the rest."
                    states={[
                        {
                            name: "value = \"\", groupLabel not set",
                            why: "Three rows render with none of them selected and no heading above the group. This is the bare control with nothing else turned on, so a caller can see exactly what the group needs to work with just options and a value.",
                            code: "<Choice.RadioGroup value={value} onValueChange={setValue} options={OPTIONS} ariaLabel=\"Skill level\" />",
                            render: (
                                <div className="w-72">
                                    <Choice.RadioGroup value={value} onValueChange={setValue} options={OPTIONS} ariaLabel="Skill level" showAnatomy />
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

/** Leaf — one option already picked (value matches options[].value). */
export const Selected: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("intermediate")
            return (
                <BlockAnatomy
                    name="Choice.RadioGroup"
                    tier="atom"
                    leaf="Selected"
                    reason="value is controlled, the caller owns which option is picked and hands it back through onValueChange, so the group never drifts from the form state around it."
                    states={[
                        {
                            name: "value = \"intermediate\"",
                            why: "Exactly the Intermediate row's dot fills while the other two stay empty, because the group enforces mutual exclusion rather than each row tracking its neighbours. Reading value back out of the group is how a form knows which option the reader actually picked.",
                            code: "<Choice.RadioGroup value=\"intermediate\" onValueChange={setValue} options={OPTIONS} ariaLabel=\"Skill level\" />",
                            render: (
                                <div className="w-72">
                                    <Choice.RadioGroup value={value} onValueChange={setValue} options={OPTIONS} ariaLabel="Skill level" showAnatomy />
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

/** Leaf for prop `groupLabel` — a heading ABOVE the group (maps to the FieldFrame label). */
export const WithLabel: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="Choice.RadioGroup"
                    tier="atom"
                    leaf="Prop `groupLabel`"
                    reason="A group of options usually needs one line saying what they are options for, groupLabel is that line, sitting above every row. Without it the group still needs an accessible name, which is what ariaLabel supplies instead, the two props are not the same thing."
                    states={[
                        {
                            name: "groupLabel = \"Current skill level\"",
                            why: "A heading line appears above the three rows, on top of the same bare composition as Default. The heading gives the reader a plain-language answer to what these options are for, before they even scan the rows.",
                            code: "<Choice.RadioGroup value={value} onValueChange={setValue} options={OPTIONS} groupLabel=\"Current skill level\" />",
                            render: (
                                <div className="w-72">
                                    <Choice.RadioGroup
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        groupLabel="Current skill level"
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

/** Leaf for prop `hint` — a secondary description line below the heading, via FieldFrame. */
export const WithHint: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="Choice.RadioGroup"
                    tier="atom"
                    leaf="Prop `hint`"
                    reason="A choice with a downstream effect earns a full sentence, not just a heading, hint stays visible below the label no matter which option the reader ends up picking."
                    states={[
                        {
                            name: "groupLabel set, hint set",
                            why: "A muted sentence sits beneath the heading and above the rows, requiring groupLabel to already be present since a hint with no heading above it would read as floating text. The sentence explains the consequence of the choice before the reader commits to a row.",
                            code: "<Choice.RadioGroup value={value} onValueChange={setValue} options={OPTIONS} groupLabel=\"Skill level\" hint=\"Used to personalize your learning path.\" />",
                            render: (
                                <div className="w-72">
                                    <Choice.RadioGroup
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        groupLabel="Current skill level"
                                        hint="Used to personalize your learning path."
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

/** Leaf for prop `isRequired` — a `*` mark attached to the heading. */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="Choice.RadioGroup"
                    tier="atom"
                    leaf="Prop `isRequired`"
                    reason="Some questions cannot be skipped, the asterisk on the heading flags that before the reader tries to move on to the next step."
                    states={[
                        {
                            name: "groupLabel set, isRequired = true",
                            why: "A red asterisk rides right after the heading text, and nothing else in the composition changes from the WithLabel leaf. The mark only shows because it rides on groupLabel, so a required group still needs a heading for the mark to attach to.",
                            code: "<Choice.RadioGroup value={value} onValueChange={setValue} options={OPTIONS} groupLabel=\"Skill level\" isRequired />",
                            render: (
                                <div className="w-72">
                                    <Choice.RadioGroup
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        groupLabel="Current skill level"
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

/** Leaf for prop `isDisabled` — locks the WHOLE group. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Choice.RadioGroup"
                tier="atom"
                leaf="Prop `isDisabled`"
                reason="A whole question can be off the table, a step the reader has not unlocked yet, or a field pre-filled and locked by policy."
                states={[
                    {
                        name: "isDisabled = true, value = \"beginner\"",
                        why: "Every dot and label dims together and the pointer is blocked on all three rows at once, because isDisabled forwards to the whole group rather than one row at a time. The picked option, beginner, stays visibly selected even while the group cannot be changed.",
                        code: "<Choice.RadioGroup isDisabled value=\"beginner\" onValueChange={setValue} options={OPTIONS} ariaLabel=\"Skill level\" />",
                        render: (
                            <div className="w-72">
                                <Choice.RadioGroup
                                    value="beginner"
                                    onValueChange={() => {}}
                                    options={OPTIONS}
                                    ariaLabel="Skill level"
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

/** Leaf for prop `errorMessage` — heading + error border on the whole group + a red error line, via FieldFrame. */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="Choice.RadioGroup"
                    tier="atom"
                    leaf="Prop `errorMessage`"
                    reason="A required choice left blank is easy to miss on a long form, the red border and the line beneath the group stop the eye at the exact question that still needs an answer."
                    states={[
                        {
                            name: "errorMessage set",
                            why: "The whole group's border turns to the danger colour and a red line with the message text appears under the rows. Setting errorMessage alone is enough to flip the group invalid, there is no separate isInvalid flag to remember alongside it.",
                            code: "<Choice.RadioGroup value={value} onValueChange={setValue} options={OPTIONS} groupLabel=\"Skill level\" errorMessage=\"Please choose a skill level.\" />",
                            render: (
                                <div className="w-72">
                                    <Choice.RadioGroup
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        groupLabel="Current skill level"
                                        errorMessage="Please choose your current skill level."
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

/** Leaf for prop `isSkeleton` — a CO-LOCATED shimmer (§12c): a stack of dot + label bar. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Choice.RadioGroup"
                tier="atom"
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the shape owns its resting state, so the group draws its own shimmer, no shared skeleton component to keep in sync by hand."
                states={[
                    {
                        name: "isSkeleton = true, options.length = 3",
                        why: "Three shimmer rows render, each a dot plus a label bar, because the row count follows options.length by default. Matching the real row count means the group does not jump once the real rows land, unless a caller overrides it with skeletonRows.",
                        code: "<Choice.RadioGroup value=\"\" onValueChange={setValue} options={OPTIONS} isSkeleton />",
                        render: (
                            <div className="w-72">
                                <Choice.RadioGroup value="" onValueChange={() => {}} options={OPTIONS} isSkeleton showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
