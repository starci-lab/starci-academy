import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { InputText } from "@sb-components/atoms/forms/Input/Input"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Input/InputText", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

/**
 * LEAF ATOM — `InputText` wraps HeroUI `TextField`/`Input` directly plus its own
 * internal `FieldFrame` (§11a: label/description/error count as part of the atom,
 * there is no separate Field atom). No component here has a story of its own to
 * jump to, so `annotate` carries no `storyId` entries — but the heroui `Input` it
 * renders, and `FieldFrame`'s own heroui `Label`/`Skeleton`, still deserve tier
 * `heroui` so the two-law panel doesn't silently drop them (2026-07-28).
 * `Description`/`Error` stay unannotated — plain `<p>` tags, not a real component.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Input": { tier: "heroui", role: "single-line text field" },
    "Label": { tier: "heroui", role: "field label line" },
    "Skeleton": { tier: "heroui", role: "loading placeholder" },
}

/** Default — bare field: empty box, no label/hint/error/placeholder. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="InputText"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Default"
                    states={[
                        {
                            name: "no label, no hint, no error, no placeholder",
                            why: "The field renders as an empty box: no label above it, no hint or error line below it, and no placeholder ghost text inside it. This is the baseline every other leaf below adds exactly one prop to.",
                            code: "<InputText value={v} onValueChange={setV} />",
                            render: <div className="w-72"><InputText value={value} onValueChange={setValue} ariaLabel="Course name" showAnatomy /></div>,
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/**
 * Leaf prop `placeholder` — dimmed ghost text while `value` is empty. Distinct pixels
 * from `Default` above: same bare box, but a grey hint word sits inside it.
 */
export const Placeholder: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="InputText"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `placeholder`"
                    states={[
                        {
                            name: "placeholder set, value = \"\"",
                            why: "A dimmed ghost word sits inside the otherwise bare box, visible only while `value` is empty. The moment a real character is typed the ghost text disappears, since its only job is to hint at the expected content before anything is typed.",
                            code: "<InputText placeholder=\"Course name\" value={v} onValueChange={setV} />",
                            render: <div className="w-72"><InputText placeholder="Course name" value={value} onValueChange={setValue} ariaLabel="Course name" showAnatomy /></div>,
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** WithLabel — label on top, hint below it. */
export const WithLabel: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="InputText"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="WithLabel"
                    states={[
                        {
                            name: "label + hint set",
                            why: "A label appears above the field and a hint line appears below it, while the box itself is unchanged from Default. The label names the field for screen readers and sighted users alike, and the hint spells out a constraint the placeholder alone could not carry, since it stays visible even once the field is filled.",
                            code: "<InputText label=\"Course name\" hint=\"Shown on the course card\" value={v} onValueChange={setV} />",
                            render: <div className="w-72"><InputText label="Course name" hint="Shown on the course card" value={value} onValueChange={setValue} placeholder="Course name" showAnatomy /></div>,
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Required — label with the `*` mark. */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="InputText"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Required"
                    states={[
                        {
                            name: "isRequired = true",
                            why: "A `*` mark appears right after the label text, with nothing else in the field changing. It tells the learner this field cannot be left blank before they ever try to submit the form.",
                            code: "<InputText label=\"Course name\" isRequired value={v} onValueChange={setV} />",
                            render: <div className="w-72"><InputText label="Course name" isRequired value={value} onValueChange={setValue} placeholder="Course name" showAnatomy /></div>,
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Filled — a real value with a label. */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("Fullstack Mastery")
            return (
                <BlockAnatomy
                    name="InputText"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Filled"
                    states={[
                        {
                            name: "value = \"Fullstack Mastery\"",
                            why: "The box now shows real text instead of standing empty, and since a value is present the placeholder never gets a chance to show. This is the shape the field settles into once the learner, or an edit form pre-filling from saved data, has actually typed something.",
                            code: "<InputText label=\"Course name\" value=\"Fullstack Mastery\" onValueChange={setV} />",
                            render: <div className="w-72"><InputText label="Course name" value={value} onValueChange={setValue} showAnatomy /></div>,
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Disabled — control locked, label dimmed. */
export const Disabled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("Fullstack Mastery")
            return (
                <BlockAnatomy
                    name="InputText"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Disabled"
                    states={[
                        {
                            name: "isDisabled = true",
                            why: "The whole field dims and stops accepting focus or typing, while the label and its existing value stay visible but muted. Use it when the field's value is fixed by something else in the form, so editing it here would be misleading.",
                            code: "<InputText label=\"Course name\" value=\"Fullstack Mastery\" isDisabled onValueChange={setV} />",
                            render: <div className="w-72"><InputText label="Course name" value={value} onValueChange={setValue} isDisabled showAnatomy /></div>,
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
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
                    name="InputText"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `isInvalid`"
                    states={[
                        {
                            name: "isInvalid = true, no errorMessage",
                            why: "The border turns red while no error line appears underneath it, because `isInvalid` alone carries no message to print. Compare it against `Error` next: that leaf adds `errorMessage`, which is the only thing that grows a red text line below the same red border.",
                            code: "<InputText label=\"Course name\" isInvalid value={v} onValueChange={setV} placeholder=\"Course name\" />",
                            render: <div className="w-72"><InputText label="Course name" isInvalid value={value} onValueChange={setValue} placeholder="Course name" showAnatomy /></div>,
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Error — label + errorMessage → label, red error line, and error border all show. */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="InputText"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Error"
                    states={[
                        {
                            name: "errorMessage set",
                            why: "The border turns red exactly as in `Invalid`, and now a red message line also appears below the field explaining what is wrong. Printing the actual reason, not just a red border, is what lets the learner fix the problem without guessing.",
                            code: "<InputText label=\"Course name\" errorMessage=\"Name is required\" value={v} onValueChange={setV} />",
                            render: <div className="w-72"><InputText label="Course name" errorMessage="Name is required" value={value} onValueChange={setValue} placeholder="Course name" showAnatomy /></div>,
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Loading — label skeleton mirrored above the field-box skeleton. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="InputText"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Loading"
                states={[
                    {
                        name: "isSkeleton = true, label set",
                        why: "A shimmering bar mirrors the label's position above a shimmering box, standing in for both before any data has arrived. Mirroring the label's own position, rather than skipping it, is what keeps the field from jumping once the real label and value land.",
                        code: "<InputText label=\"Course name\" isSkeleton />",
                        render: <div className="w-72"><InputText label="Course name" value="" onValueChange={() => {}} isSkeleton showAnatomy /></div>,
                    },
                ]}
            />
        </div>
    ),
}
