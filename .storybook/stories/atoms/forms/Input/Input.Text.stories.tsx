import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input } from "@sb-components/atoms/forms/Input/Input"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Input/Input.Text", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

/**
 * ATOM LÁ — `Input.Text` bọc thẳng HeroUI `TextField`/`Input` + `FieldFrame` nội bộ
 * (§11a: nhãn/mô tả/lỗi tính vào atom, không tách Field primitive). Mọi part nó phát
 * ra (`Label`/`Description`/`Field`/`Error`/`Skeleton`) là KHE nội bộ, không phải
 * component có story riêng ⇒ KHÔNG có deps ⇒ bỏ hẳn prop `annotate` (thầy chốt
 * 2026-07-26 lần 2).
 */

/** Default — bare field: empty box, no label/hint/error/placeholder. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="Input.Text"
                    tier="atom"
                    leaf="Default"
                    note="Bare — no label, hint, error, or placeholder ghost text."
                    code={"<Input.Text value={v} onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Text value={value} onValueChange={setValue} ariaLabel="Course name" showAnatomy />
                    </div>
                </BlockAnatomy>
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
                    name="Input.Text"
                    tier="atom"
                    leaf="Prop `placeholder`"
                    note="Ghost text only shows while value is empty; it disappears the moment real text lands."
                    code={"<Input.Text placeholder=\"Course name\" value={v} onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Text placeholder="Course name" value={value} onValueChange={setValue} ariaLabel="Course name" showAnatomy />
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
                    name="Input.Text"
                    tier="atom"
                    leaf="WithLabel"
                    note="label + hint."
                    code={"<Input.Text label=\"Course name\" hint=\"Shown on the course card\" value={v} onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Text label="Course name" hint="Shown on the course card" value={value} onValueChange={setValue} placeholder="Course name" showAnatomy />
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
                    name="Input.Text"
                    tier="atom"
                    leaf="Required"
                    note="isRequired → * mark after the label."
                    code={"<Input.Text label=\"Course name\" isRequired value={v} onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Text label="Course name" isRequired value={value} onValueChange={setValue} placeholder="Course name" showAnatomy />
                    </div>
                </BlockAnatomy>
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
                    name="Input.Text"
                    tier="atom"
                    leaf="Filled"
                    note="value holds text."
                    code={"<Input.Text label=\"Course name\" value=\"Fullstack Mastery\" onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Text label="Course name" value={value} onValueChange={setValue} showAnatomy />
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
            const [value, setValue] = useState("Fullstack Mastery")
            return (
                <BlockAnatomy
                    name="Input.Text"
                    tier="atom"
                    leaf="Disabled"
                    note="isDisabled → locked + dimmed."
                    code={"<Input.Text label=\"Course name\" value=\"Fullstack Mastery\" isDisabled onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Text label="Course name" value={value} onValueChange={setValue} isDisabled showAnatomy />
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
                    name="Input.Text"
                    tier="atom"
                    leaf="Prop `isInvalid`"
                    note="isInvalid alone only reddens the border — no errorMessage means no line underneath. Compare with Error below."
                    code={"<Input.Text label=\"Course name\" isInvalid value={v} onValueChange={setV} placeholder=\"Course name\" />"}
                >
                    <div className="w-72">
                        <Input.Text label="Course name" isInvalid value={value} onValueChange={setValue} placeholder="Course name" showAnatomy />
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
                    name="Input.Text"
                    tier="atom"
                    leaf="Error"
                    note="label + errorMessage → label, red line, border."
                    code={"<Input.Text label=\"Course name\" errorMessage=\"Name is required\" value={v} onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Text label="Course name" errorMessage="Name is required" value={value} onValueChange={setValue} placeholder="Course name" showAnatomy />
                    </div>
                </BlockAnatomy>
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
                name="Input.Text"
                tier="atom"
                leaf="Loading"
                note="isSkeleton + label → label mirrored above the box."
                code={"<Input.Text label=\"Course name\" isSkeleton />"}
            >
                <div className="w-72">
                    <Input.Text label="Course name" value="" onValueChange={() => {}} isSkeleton showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
