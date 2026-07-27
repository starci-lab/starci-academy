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
                    states={[
                        {
                            name: "no label, hint, or error passed",
                            why: "Only the search field renders: a magnifier leading icon inside `FieldFrame`, no label row above it and no hint or error line below it. This is the bare control, the shape every other leaf below adds one thing on top of.",
                            code: "<Input.Search value={v} onValueChange={setV} />",
                            render: (
                                <div className="w-72">
                                    <Input.Search value={value} onValueChange={setValue} ariaLabel="Search" showAnatomy />
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
                    states={[
                        {
                            name: "placeholder set, value empty",
                            why: "The ghost text sits inside the empty field and disappears the moment a first character is typed. It only shows while the field holds no value, so it never competes with real input.",
                            code: "<Input.Search placeholder=\"Search courses…\" value={v} onValueChange={setV} />",
                            render: (
                                <div className="w-72">
                                    <Input.Search placeholder="Search courses…" value={value} onValueChange={setValue} showAnatomy />
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
                    states={[
                        {
                            name: "label and hint set",
                            why: "A label row grows above the field and a muted hint line grows below it, on top of the same bare field from `Default`. Naming the field and explaining what to type in it are two separate slots that a caller can add independently.",
                            code: "<Input.Search label=\"Search courses\" hint=\"By name or skill\" value={v} onValueChange={setV} />",
                            render: (
                                <div className="w-72">
                                    <Input.Search label="Search courses" hint="By name or skill" value={value} onValueChange={setValue} placeholder="Search courses…" showAnatomy />
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
                    states={[
                        {
                            name: "isRequired = true",
                            why: "A `*` mark appears right after the label text, nothing else in the field changes. It's the one visual cue that tells the learner this search is not optional before they can move on.",
                            code: "<Input.Search label=\"Search courses\" isRequired value={v} onValueChange={setV} />",
                            render: (
                                <div className="w-72">
                                    <Input.Search label="Search courses" isRequired value={value} onValueChange={setValue} placeholder="Search courses…" showAnatomy />
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
                    states={[
                        {
                            name: "value = \"React\"",
                            why: "A trailing clear (×) button grows in the field once `value` holds text, next to the label from `WithLabel`. HeroUI's `SearchField` only offers a way to blank the field back out when there's something to blank.",
                            code: "<Input.Search label=\"Search courses\" value=\"React\" onValueChange={setV} />",
                            render: (
                                <div className="w-72">
                                    <Input.Search label="Search courses" value={value} onValueChange={setValue} placeholder="Search courses…" showAnatomy />
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
                    states={[
                        {
                            name: "isDisabled = true",
                            why: "The whole field locks and the label dims along with it, no node is added or removed. This is the state a search bar takes while whatever it filters hasn't finished loading yet.",
                            code: "<Input.Search label=\"Search courses\" value=\"React\" isDisabled onValueChange={setV} />",
                            render: (
                                <div className="w-72">
                                    <Input.Search label="Search courses" value={value} onValueChange={setValue} isDisabled placeholder="Search courses…" showAnatomy />
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
                    states={[
                        {
                            name: "isInvalid = true, errorMessage not set",
                            why: "The field's border turns red and nothing else changes, no message line grows below it. `isInvalid` alone only marks the control as wrong; it takes a separate `errorMessage` (the next leaf) to say why.",
                            code: "<Input.Search label=\"Search courses\" isInvalid value={v} onValueChange={setV} />",
                            render: (
                                <div className="w-72">
                                    <Input.Search label="Search courses" isInvalid value={value} onValueChange={setValue} placeholder="Search courses…" showAnatomy />
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
                    states={[
                        {
                            name: "errorMessage = \"Invalid search term\"",
                            why: "The same red border from `Invalid` shows, plus a red message line grows below the field carrying the actual text. Setting `errorMessage` implies `isInvalid` on its own, so a caller never has to pass both.",
                            code: "<Input.Search label=\"Search courses\" errorMessage=\"Invalid search term\" value={v} onValueChange={setV} />",
                            render: (
                                <div className="w-72">
                                    <Input.Search label="Search courses" errorMessage="Invalid search term" value={value} onValueChange={setValue} placeholder="Search courses…" showAnatomy />
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

/** Loading — label skeleton mirrored above the field-box skeleton. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Input.Search"
                tier="atom"
                leaf="Loading"
                states={[
                    {
                        name: "isSkeleton = true, label set",
                        why: "The field box and the label both switch to shimmer bars in the same layout the loaded control will occupy. Mirroring the label too, instead of only the box, keeps the row height from jumping once the real label text arrives.",
                        code: "<Input.Search label=\"Search courses\" isSkeleton />",
                        render: (
                            <div className="w-72">
                                <Input.Search label="Search courses" value="" onValueChange={() => {}} isSkeleton showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
