import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input } from "@sb-components/atoms/forms/Input/Input"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Input/Input.Search", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

/**
 * ATOM LÁ — `Input.Search` bọc thẳng HeroUI `SearchField` (leading icon + clear sẵn)
 * + `FieldFrame` nội bộ (§11a). Cùng lý do với các member khác: mọi part
 * (`Label`/`Description`/`Field`/`Error`/`Skeleton`) là KHE nội bộ, không phải story
 * riêng ⇒ KHÔNG có deps ⇒ bỏ hẳn prop `annotate`.
 *
 * ⭐ 2026-07-26 (§12g): leaf `Invalid` tách khỏi `Error` — `isInvalid` một mình chỉ
 * đổi viền (không dòng chữ), `errorMessage` mới kéo theo viền + dòng đỏ. Hai prop
 * khác pixel nhau nên phải là hai leaf khác nhau (§12g.1: đổi pixel = có leaf).
 */

/** Default — bare field, magnifier icon + clear button once there is text. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="Input.Search"
                    tier="atom"
                    leaf="Default"
                    note="Bare — no label, hint, or error."
                    code={"<Input.Search value={v} onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Search value={value} onValueChange={setValue} ariaLabel="Search" showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/**
 * Leaf prop `placeholder` — chữ mờ chỉ hiện khi ô rỗng. Trước 2026-07-26 nó bị nhét
 * vào leaf `Default` nên prop có hình mà không có leaf nào sở hữu (§12g).
 */
export const Placeholder: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="Input.Search"
                    tier="atom"
                    leaf="Prop `placeholder`"
                    note="Ghost text only shows while the field is empty; typing the first character hides it."
                    code={"<Input.Search placeholder=\"Search courses…\" value={v} onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Search placeholder="Search courses…" value={value} onValueChange={setValue} showAnatomy />
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
                    name="Input.Search"
                    tier="atom"
                    leaf="WithLabel"
                    note="label + hint."
                    code={"<Input.Search label=\"Search courses\" hint=\"By name or skill\" value={v} onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Search label="Search courses" hint="By name or skill" value={value} onValueChange={setValue} placeholder="Search courses…" showAnatomy />
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
                    name="Input.Search"
                    tier="atom"
                    leaf="Required"
                    note="isRequired → * mark after the label."
                    code={"<Input.Search label=\"Search courses\" isRequired value={v} onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Search label="Search courses" isRequired value={value} onValueChange={setValue} placeholder="Search courses…" showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Filled — value holds text → the clear (×) button shows, with a label. */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("React")
            return (
                <BlockAnatomy
                    name="Input.Search"
                    tier="atom"
                    leaf="Filled"
                    note="value holds text → the clear (×) button shows."
                    code={"<Input.Search label=\"Search courses\" value=\"React\" onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Search label="Search courses" value={value} onValueChange={setValue} placeholder="Search courses…" showAnatomy />
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
            const [value, setValue] = useState("React")
            return (
                <BlockAnatomy
                    name="Input.Search"
                    tier="atom"
                    leaf="Disabled"
                    note="isDisabled → locked + dimmed."
                    code={"<Input.Search label=\"Search courses\" value=\"React\" isDisabled onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Search label="Search courses" value={value} onValueChange={setValue} isDisabled placeholder="Search courses…" showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/**
 * Invalid — prop `isInvalid` ALONE: border turns red, no error line below.
 * Compare against `Error` next — that leaf adds `errorMessage`, which is the only
 * thing that grows the red text line; the border here is already the same red.
 */
export const Invalid: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("!!!")
            return (
                <BlockAnatomy
                    name="Input.Search"
                    tier="atom"
                    leaf="Invalid"
                    note="isInvalid → red border only. No errorMessage set → no red line, label stays normal."
                    code={"<Input.Search label=\"Search courses\" isInvalid value={v} onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Search label="Search courses" isInvalid value={value} onValueChange={setValue} placeholder="Search courses…" showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Error — prop `errorMessage`: same red border as `Invalid`, PLUS the red message line. */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("!!!")
            return (
                <BlockAnatomy
                    name="Input.Search"
                    tier="atom"
                    leaf="Error"
                    note="errorMessage → red border (same as isInvalid) + red message line below."
                    code={"<Input.Search label=\"Search courses\" errorMessage=\"Invalid search term\" value={v} onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Search label="Search courses" errorMessage="Invalid search term" value={value} onValueChange={setValue} placeholder="Search courses…" showAnatomy />
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
                name="Input.Search"
                tier="atom"
                leaf="Loading"
                note="isSkeleton + label → label mirrored above the box."
                code={"<Input.Search label=\"Search courses\" isSkeleton />"}
            >
                <div className="w-72">
                    <Input.Search label="Search courses" value="" onValueChange={() => {}} isSkeleton showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
