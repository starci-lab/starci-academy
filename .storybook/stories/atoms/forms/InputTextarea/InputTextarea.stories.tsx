import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { InputTextarea } from "@sb-components/atoms/forms"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/InputTextarea", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

/**
 * LEAF ATOM — `InputTextarea` wraps HeroUI `TextField`/`TextArea` + an internal `FieldFrame`.
 * No component here has its own story ⇒ `annotate` carries no `storyId` — but the HeroUI
 * `TextArea` plus `FieldFrame`'s `Label`/`Skeleton` get tier `heroui` so the two-law panel
 * doesn't silently skip them. `Description`/`Error` are left undeclared — bare `<p>` tags.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "TextArea": { tier: "heroui", role: "multi-line text field" },
    "Label": { tier: "heroui", role: "field label line" },
    "Skeleton": { tier: "heroui", role: "loading placeholder" },
}

/** Default — bare multi-line field (rows=3): empty box, no label/hint/error/placeholder. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="InputTextarea"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Default"
                    states={[
                        {
                            name: "value = \"\", no label/hint/placeholder",
                            why: "The field renders as a bare empty box with no label above it and no hint or error line below it. This is the raw multi-line control for a spot where the surrounding layout already explains what the field is for.",
                            code: "<InputTextarea value={v} onValueChange={setV} rows={3} />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <InputTextarea value={value} onValueChange={setValue} rows={3} ariaLabel="Notes" />
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

/**
 * Leaf prop `placeholder` — dimmed ghost text while `value` is empty. Distinct pixels
 * from `Default` above: same bare box, but a grey hint sentence sits inside it.
 */
export const Placeholder: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="InputTextarea"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `placeholder`"
                    states={[
                        {
                            name: "value = \"\", placeholder = \"Lesson notes…\"",
                            why: "A muted ghost sentence sits inside the otherwise empty box, giving a content hint without pre-filling the field. It disappears the instant the value stops being empty, so it never gets mistaken for real text.",
                            code: "<InputTextarea placeholder=\"Lesson notes…\" value={v} onValueChange={setV} rows={3} />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <InputTextarea placeholder="Lesson notes…" value={value} onValueChange={setValue} rows={3} ariaLabel="Notes" />
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

/** WithLabel — label on top, hint below it. */
export const WithLabel: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="InputTextarea"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="WithLabel"
                    states={[
                        {
                            name: "label and hint set, value = \"\"",
                            why: "A label appears above the box and a hint line appears beneath it, while the placeholder ghost text still shows inside the empty field. The three lines together tell the writer what to enter and why, before they have typed anything.",
                            code: "<InputTextarea label=\"Notes\" hint=\"Only visible to you\" value={v} onValueChange={setV} rows={3} />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <InputTextarea label="Notes" hint="Only visible to you" value={value} onValueChange={setValue} rows={3} placeholder="Lesson notes…" />
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

/** Required — label with the `*` mark. */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="InputTextarea"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Required"
                    states={[
                        {
                            name: "isRequired = true",
                            why: "The label gains a trailing asterisk mark while every other part of the field stays the same as the plain labelled case. The mark is the only signal that this field cannot be submitted empty.",
                            code: "<InputTextarea label=\"Notes\" isRequired value={v} onValueChange={setV} rows={3} />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <InputTextarea label="Notes" isRequired value={value} onValueChange={setValue} rows={3} placeholder="Lesson notes…" />
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

/** Filled — multi-line content with a label. */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("This session covers loops and arrays again — remember to finish the end-of-chapter exercise.")
            return (
                <BlockAnatomy
                    name="InputTextarea"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Filled"
                    states={[
                        {
                            name: "value = multi-line real text",
                            why: "The box fills with the learner's actual multi-line note instead of the empty box, and since the value is non-empty the placeholder never appears. This is the field's steady resting look once someone has already written something in it.",
                            code: "<InputTextarea label=\"Notes\" value=\"This session covers…\" onValueChange={setV} rows={3} />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <InputTextarea label="Notes" value={value} onValueChange={setValue} rows={3} />
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

/** Disabled — control locked, label dimmed. */
export const Disabled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("This session covers loops and arrays again.")
            return (
                <BlockAnatomy
                    name="InputTextarea"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Disabled"
                    states={[
                        {
                            name: "isDisabled = true, value set",
                            why: "The control locks against further typing and both the label and the text inside dim to the disabled tone. The field still shows its content, it simply refuses new input.",
                            code: "<InputTextarea label=\"Notes\" value=\"This session…\" isDisabled onValueChange={setV} rows={3} />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <InputTextarea label="Notes" value={value} onValueChange={setValue} rows={3} isDisabled />
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

/**
 * Leaf prop `isInvalid` — red border WITHOUT an error line (`errorMessage` unset).
 * Different pixels than `Error` below: same red border, but no text underneath.
 */
export const Invalid: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="InputTextarea"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `isInvalid`"
                    states={[
                        {
                            name: "isInvalid = true, errorMessage = undefined",
                            why: "Only the field's border reddens, since `isInvalid` carries no companion `errorMessage` to print underneath it. Compare with the Error state below, where the same red border comes with a written reason.",
                            code: "<InputTextarea label=\"Notes\" isInvalid value={v} onValueChange={setV} rows={3} placeholder=\"Lesson notes…\" />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <InputTextarea label="Notes" isInvalid value={value} onValueChange={setValue} rows={3} placeholder="Lesson notes…" />
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

/** Error — label + errorMessage → label, red error line, and error border all show. */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="InputTextarea"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Error"
                    states={[
                        {
                            name: "errorMessage set",
                            why: "A red message line appears under the field and the border turns red at the same time, both driven by the same `errorMessage` string. The label above stays neutral, so only the field itself reports the problem.",
                            code: "<InputTextarea label=\"Notes\" errorMessage=\"Notes cannot be empty\" value={v} onValueChange={setV} rows={3} />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <InputTextarea label="Notes" errorMessage="Notes cannot be empty" value={value} onValueChange={setValue} rows={3} placeholder="Lesson notes…" />
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

/** Loading — label skeleton mirrored above the taller field-box skeleton. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="InputTextarea"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Loading"
                states={[
                    {
                        name: "isSkeleton = true, label set",
                        why: "The label mirrors into a shimmer bar sitting above a taller shimmer box matching the multi-line field's height. Nothing about the eventual label or field size shifts the layout once the real data arrives.",
                        code: "<InputTextarea label=\"Notes\" isSkeleton />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <InputTextarea label="Notes" value="" onValueChange={() => {}} isSkeleton />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
