import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input } from "@sb-components/atoms/forms/Input/Input"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Input/Input.Textarea", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

/**
 * ATOM LÁ — `Input.Textarea` bọc thẳng HeroUI `TextField`/`TextArea` + `FieldFrame`
 * nội bộ (§11a). Cùng lý do với `Input.Text`: mọi part (`Label`/`Description`/
 * `Field`/`Error`/`Skeleton`) là KHE nội bộ, không phải story riêng ⇒ KHÔNG có deps
 * ⇒ bỏ hẳn prop `annotate`.
 */

/** Default — bare multi-line field (rows=3): empty box, no label/hint/error/placeholder. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="Input.Textarea"
                    tier="atom"
                    leaf="Default"
                    note="Bare — no label, hint, error, or placeholder ghost text."
                    code={"<Input.Textarea value={v} onValueChange={setV} rows={3} />"}
                >
                    <div className="w-72">
                        <Input.Textarea value={value} onValueChange={setValue} rows={3} ariaLabel="Notes" showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
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
                    name="Input.Textarea"
                    tier="atom"
                    leaf="Prop `placeholder`"
                    note="Ghost text only shows while value is empty; it disappears the moment real text lands."
                    code={"<Input.Textarea placeholder=\"Lesson notes…\" value={v} onValueChange={setV} rows={3} />"}
                >
                    <div className="w-72">
                        <Input.Textarea placeholder="Lesson notes…" value={value} onValueChange={setValue} rows={3} ariaLabel="Notes" showAnatomy />
                    </div>
                </BlockAnatomy>
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
                    name="Input.Textarea"
                    tier="atom"
                    leaf="WithLabel"
                    note="label + hint."
                    code={"<Input.Textarea label=\"Notes\" hint=\"Only visible to you\" value={v} onValueChange={setV} rows={3} />"}
                >
                    <div className="w-72">
                        <Input.Textarea label="Notes" hint="Only visible to you" value={value} onValueChange={setValue} rows={3} placeholder="Lesson notes…" showAnatomy />
                    </div>
                </BlockAnatomy>
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
                    name="Input.Textarea"
                    tier="atom"
                    leaf="Required"
                    note="isRequired → * mark after the label."
                    code={"<Input.Textarea label=\"Notes\" isRequired value={v} onValueChange={setV} rows={3} />"}
                >
                    <div className="w-72">
                        <Input.Textarea label="Notes" isRequired value={value} onValueChange={setValue} rows={3} placeholder="Lesson notes…" showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Filled — multi-line content with a label. */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("This session covers loops and arrays again — remember to finish the end-of-chapter exercise.")
            return (
                <BlockAnatomy
                    name="Input.Textarea"
                    tier="atom"
                    leaf="Filled"
                    note="value holds multi-line content."
                    code={"<Input.Textarea label=\"Notes\" value=\"This session covers…\" onValueChange={setV} rows={3} />"}
                >
                    <div className="w-72">
                        <Input.Textarea label="Notes" value={value} onValueChange={setValue} rows={3} showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Disabled — control locked, label dimmed. */
export const Disabled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("This session covers loops and arrays again.")
            return (
                <BlockAnatomy
                    name="Input.Textarea"
                    tier="atom"
                    leaf="Disabled"
                    note="isDisabled → locked + dimmed."
                    code={"<Input.Textarea label=\"Notes\" value=\"This session…\" isDisabled onValueChange={setV} rows={3} />"}
                >
                    <div className="w-72">
                        <Input.Textarea label="Notes" value={value} onValueChange={setValue} rows={3} isDisabled showAnatomy />
                    </div>
                </BlockAnatomy>
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
                    name="Input.Textarea"
                    tier="atom"
                    leaf="Prop `isInvalid`"
                    note="isInvalid alone only reddens the border — no errorMessage means no line underneath. Compare with Error below."
                    code={"<Input.Textarea label=\"Notes\" isInvalid value={v} onValueChange={setV} rows={3} placeholder=\"Lesson notes…\" />"}
                >
                    <div className="w-72">
                        <Input.Textarea label="Notes" isInvalid value={value} onValueChange={setValue} rows={3} placeholder="Lesson notes…" showAnatomy />
                    </div>
                </BlockAnatomy>
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
                    name="Input.Textarea"
                    tier="atom"
                    leaf="Error"
                    note="label + errorMessage → label, red line, border."
                    code={"<Input.Textarea label=\"Notes\" errorMessage=\"Notes cannot be empty\" value={v} onValueChange={setV} rows={3} />"}
                >
                    <div className="w-72">
                        <Input.Textarea label="Notes" errorMessage="Notes cannot be empty" value={value} onValueChange={setValue} rows={3} placeholder="Lesson notes…" showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Loading — label skeleton mirrored above the taller field-box skeleton. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Input.Textarea"
                tier="atom"
                leaf="Loading"
                note="isSkeleton + label → label mirrored above the tall box."
                code={"<Input.Textarea label=\"Notes\" isSkeleton />"}
            >
                <div className="w-72">
                    <Input.Textarea label="Notes" value="" onValueChange={() => {}} isSkeleton showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
