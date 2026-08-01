import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { ChoiceRadioGroup } from "@sb-components/composites/form/ChoiceRadioGroup/ChoiceRadioGroup"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ChoiceRadio` — the house atom this composite rebuilds once per `options`
 * entry (`composites/form/ChoiceRadioGroup/ChoiceRadioGroup.tsx`). `ChoiceRadio`
 * itself takes no name-prop of its own (ATOM-10), so the composite badges the
 * wrapping `<span>` around each one instead — the same technique `AvatarGroup`
 * uses for `Avatar` — which is what lets this dep link to `ChoiceRadio`'s own
 * story instead of staying an unlinked internal slot (2026-07-31, ATOM-8 pass:
 * this used to be a known gap with `annotate` dropped entirely — see git
 * history on this file before that date for the old note).
 *
 * `Label` — the internal `FieldFrame`'s real heading (heroui's own `Label`,
 * rendered directly), only present when `groupLabel` is passed. Tier `heroui`,
 * no `storyId` (§ two-law pass, 2026-07-28) — `FieldFrame` itself has no story of
 * its own to jump to, but the library component underneath still deserves to
 * show up rather than being silently dropped. `Skeleton` is the same heroui
 * `Skeleton` `ChoiceRadio`'s own `isSkeleton` branch renders directly, so it
 * gets the same treatment (2026-07-28 orphan-part pass).
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "ChoiceRadio": { tier: "atom", role: "each option renders as one ChoiceRadio row", storyId: "atoms-forms-choice-choiceradio--default" },
    "Label": { tier: "heroui", role: "group heading above the rows" },
    "Skeleton": { tier: "heroui", role: "loading placeholder mirroring the stacked option rows" },
}

/**
 * COMPOSITE — `ChoiceRadioGroup`: a pick-one group, built from `options` DATA (wraps
 * HeroUI RadioGroup + loops `ChoiceRadio` for each option).
 *
 * Moved out of `atoms/forms/Choice/Choice.tsx` 2026-07-31 (ATOM-8 — rebuilding one
 * `ChoiceRadio` per entry is the composite signal, not the atom one). Same shape,
 * same states; only the tree and the `annotate` wiring changed.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). The full leaf set for props WITH a visual: picked
 * or not (`Default`/`Selected`, driven by `value`) · `groupLabel` (`WithLabel`) ·
 * `hint` (`WithHint`) · `isRequired` (`Required`) · `isDisabled` (`Disabled`) ·
 * `errorMessage` (`Error`) · `isSkeleton` (`Loading`). `options`/`onValueChange`/
 * `ariaLabel`/`skeletonRows`/`classNames` get no leaf of their own.
 *
 * ⛔ DON'T repeat the state of EACH ROW (`ChoiceRadio`'s own Disabled/Loading —
 * §12f): locking a single option or skeleton-ing one lone row belongs in the
 * `ChoiceRadio` story.
 *
 * ✍️ Text shown on the panel (`leaf`/`reason`/`why`/`code`) and demo labels in the
 * render frame are written in ENGLISH; JSDoc/comments are ENGLISH too.
 */
const meta: Meta<typeof ChoiceRadioGroup> = {
    title: "Composites/Form/ChoiceRadioGroup",
    component: ChoiceRadioGroup,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ChoiceRadioGroup>

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
                    name="ChoiceRadioGroup"
                    tier="composite"
                    annotate={ANNOTATE}
                    leaf="No prop turned on"
                    reason="The one radio-group composite in the system, wrapping HeroUI RadioGroup. It rebuilds one ChoiceRadio per entry from options, data, not JSX children, so a caller can never mismatch a row's shape with the rest."
                    states={[
                        {
                            name: "value = \"\", groupLabel not set",
                            why: "Three rows render with none of them selected and no heading above the group. This is the bare control with nothing else turned on, so a caller can see exactly what the group needs to work with just options and a value.",
                            code: "<ChoiceRadioGroup value={value} onValueChange={setValue} options={OPTIONS} ariaLabel=\"Skill level\" />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <ChoiceRadioGroup value={value} onValueChange={setValue} options={OPTIONS} ariaLabel="Skill level" />
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

/** Leaf — one option already picked (value matches options[].value). */
export const Selected: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("intermediate")
            return (
                <BlockAnatomy
                    name="ChoiceRadioGroup"
                    tier="composite"
                    annotate={ANNOTATE}
                    leaf="Selected"
                    reason="value is controlled, the caller owns which option is picked and hands it back through onValueChange, so the group never drifts from the form state around it."
                    states={[
                        {
                            name: "value = \"intermediate\"",
                            why: "Exactly the Intermediate row's dot fills while the other two stay empty, because the group enforces mutual exclusion rather than each row tracking its neighbours. Reading value back out of the group is how a form knows which option the reader actually picked.",
                            code: "<ChoiceRadioGroup value=\"intermediate\" onValueChange={setValue} options={OPTIONS} ariaLabel=\"Skill level\" />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <ChoiceRadioGroup value={value} onValueChange={setValue} options={OPTIONS} ariaLabel="Skill level" />
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

/** Leaf for prop `groupLabel` — a heading ABOVE the group (maps to the FieldFrame label). */
export const WithLabel: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="ChoiceRadioGroup"
                    tier="composite"
                    annotate={ANNOTATE}
                    leaf="Prop `groupLabel`"
                    reason="A group of options usually needs one line saying what they are options for, groupLabel is that line, sitting above every row. Without it the group still needs an accessible name, which is what ariaLabel supplies instead, the two props are not the same thing."
                    states={[
                        {
                            name: "groupLabel = \"Current skill level\"",
                            why: "A heading line appears above the three rows, on top of the same bare composition as Default. The heading gives the reader a plain-language answer to what these options are for, before they even scan the rows.",
                            code: "<ChoiceRadioGroup value={value} onValueChange={setValue} options={OPTIONS} groupLabel=\"Current skill level\" />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <ChoiceRadioGroup
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        groupLabel="Current skill level"
                                       
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

/** Leaf for prop `hint` — a secondary description line below the heading, via FieldFrame. */
export const WithHint: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="ChoiceRadioGroup"
                    tier="composite"
                    annotate={ANNOTATE}
                    leaf="Prop `hint`"
                    reason="A choice with a downstream effect earns a full sentence, not just a heading, hint stays visible below the label no matter which option the reader ends up picking."
                    states={[
                        {
                            name: "groupLabel set, hint set",
                            why: "A muted sentence sits beneath the heading and above the rows, requiring groupLabel to already be present since a hint with no heading above it would read as floating text. The sentence explains the consequence of the choice before the reader commits to a row.",
                            code: "<ChoiceRadioGroup value={value} onValueChange={setValue} options={OPTIONS} groupLabel=\"Skill level\" hint=\"Used to personalize your learning path.\" />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <ChoiceRadioGroup
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        groupLabel="Current skill level"
                                        hint="Used to personalize your learning path."
                                       
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

/** Leaf for prop `isRequired` — a `*` mark attached to the heading. */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="ChoiceRadioGroup"
                    tier="composite"
                    annotate={ANNOTATE}
                    leaf="Prop `isRequired`"
                    reason="Some questions cannot be skipped, the asterisk on the heading flags that before the reader tries to move on to the next step."
                    states={[
                        {
                            name: "groupLabel set, isRequired = true",
                            why: "A red asterisk rides right after the heading text, and nothing else in the composition changes from the WithLabel leaf. The mark only shows because it rides on groupLabel, so a required group still needs a heading for the mark to attach to.",
                            code: "<ChoiceRadioGroup value={value} onValueChange={setValue} options={OPTIONS} groupLabel=\"Skill level\" isRequired />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <ChoiceRadioGroup
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        groupLabel="Current skill level"
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

/** Leaf for prop `isDisabled` — locks the WHOLE group. */
export const Disabled: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChoiceRadioGroup"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `isDisabled`"
                reason="A whole question can be off the table, a step the reader has not unlocked yet, or a field pre-filled and locked by policy."
                states={[
                    {
                        name: "isDisabled = true, value = \"beginner\"",
                        why: "Every dot and label dims together and the pointer is blocked on all three rows at once, because isDisabled forwards to the whole group rather than one row at a time. The picked option, beginner, stays visibly selected even while the group cannot be changed.",
                        code: "<ChoiceRadioGroup isDisabled value=\"beginner\" onValueChange={setValue} options={OPTIONS} ariaLabel=\"Skill level\" />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <ChoiceRadioGroup
                                    value="beginner"
                                    onValueChange={() => {}}
                                    options={OPTIONS}
                                    ariaLabel="Skill level"
                                    isDisabled
                                   
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
                    name="ChoiceRadioGroup"
                    tier="composite"
                    annotate={ANNOTATE}
                    leaf="Prop `errorMessage`"
                    reason="A required choice left blank is easy to miss on a long form, the red border and the line beneath the group stop the eye at the exact question that still needs an answer."
                    states={[
                        {
                            name: "errorMessage set",
                            why: "The whole group's border turns to the danger colour and a red line with the message text appears under the rows. Setting errorMessage alone is enough to flip the group invalid, there is no separate isInvalid flag to remember alongside it.",
                            code: "<ChoiceRadioGroup value={value} onValueChange={setValue} options={OPTIONS} groupLabel=\"Skill level\" errorMessage=\"Please choose a skill level.\" />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <ChoiceRadioGroup
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        groupLabel="Current skill level"
                                        errorMessage="Please choose your current skill level."
                                       
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

/** Leaf for prop `isSkeleton` — COMPOSITE-10: the composite only decides row count, `ChoiceRadio` draws each shimmer. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChoiceRadioGroup"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the shape owns its resting state — the composite only decides how many rows shimmer; each row draws its own dot + label bar through ChoiceRadio's own isSkeleton branch, not a shape the group hand-rolls."
                states={[
                    {
                        name: "isSkeleton = true, options.length = 3",
                        why: "Three shimmer rows render, each a dot plus a label bar, because the row count follows options.length by default. Matching the real row count means the group does not jump once the real rows land, unless a caller overrides it with skeletonRows.",
                        code: "<ChoiceRadioGroup value=\"\" onValueChange={setValue} options={OPTIONS} isSkeleton />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <ChoiceRadioGroup value="" onValueChange={() => {}} options={OPTIONS} isSkeleton />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
