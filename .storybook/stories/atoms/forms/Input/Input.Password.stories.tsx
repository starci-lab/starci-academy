import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input } from "@sb-components/atoms/forms/Input/Input"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Input/Input.Password", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

/**
 * LEAF ATOM — `Input.Password` wraps HeroUI `TextField`/`Input` (type="password")
 * plus a show/hide button (Phosphor `EyeIcon`/`EyeSlashIcon`) and its own internal
 * `FieldFrame` (§11a). The toggle is an INTERNAL button owned by the atom itself (not
 * a `Button.Base` with its own story), so every part (`Label`/`Description`/`Field`/
 * `Toggle`/`Error`/`Skeleton`) stays an internal slot, meaning NO deps, so the
 * `annotate` prop is dropped entirely.
 *
 * ⭐ 2026-07-26 (§12g): leaf `Invalid` split off from `Error`, since `isInvalid` alone
 * only changes the border (no text line), while `errorMessage` adds the border AND the
 * red line. The two props produce different pixels, so they must be two different
 * leaves (§12g.1: a pixel change earns a leaf).
 *
 * ⭐ The show/hide button (`reveal`) is INTERNAL `useState`, no prop can pin the
 * "revealed" state from outside, so no leaf can be built for it without touching the
 * component (forbidden in this pass), noted as an issue instead of a leaf.
 */

/** Default — bare masked field + the show/hide eye button. No prop turned on (§12g). */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("password123")
            return (
                <BlockAnatomy
                    name="Input.Password"
                    tier="atom"
                    leaf="Default"
                    states={[
                        {
                            name: "no label, no hint, no error",
                            why: "The field renders as a masked box (dots instead of characters) with only the show/hide eye button beside it, no label, hint, or error line. This is the baseline every other leaf below adds exactly one prop to.",
                            code: "<Input.Password value={v} onValueChange={setV} />",
                            render: <div className="w-72"><Input.Password value={value} onValueChange={setValue} ariaLabel="Password" showAnatomy /></div>,
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/**
 * Leaf prop `placeholder` — ghost text only shows while the field is empty, so this
 * leaf must set `value=""`. Before 2026-07-26 `placeholder` was folded into the
 * `Default` leaf, whose field already held a password, so the ghost text NEVER showed,
 * a prop with a real shape that no leaf actually exposed (§12g).
 */
export const Placeholder: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="Input.Password"
                    tier="atom"
                    leaf="Prop `placeholder`"
                    states={[
                        {
                            name: "placeholder set, value = \"\"",
                            why: "Ghost text sits inside the masked box only while the field is empty, and typing the first character hides it immediately. Because `Default` above already holds a value, this leaf is the only one where the placeholder actually has a chance to show.",
                            code: "<Input.Password placeholder=\"Password\" value={v} onValueChange={setV} />",
                            render: <div className="w-72"><Input.Password placeholder="Password" value={value} onValueChange={setValue} ariaLabel="Password" showAnatomy /></div>,
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
                    name="Input.Password"
                    tier="atom"
                    leaf="WithLabel"
                    states={[
                        {
                            name: "label + hint set",
                            why: "A label appears above the masked field and a hint line appears below it, with the box and eye button unchanged from Default. The hint is the natural place to spell out a length or character rule, since a masked field cannot show that rule inside the value itself.",
                            code: "<Input.Password label=\"Password\" hint=\"At least 8 characters\" value={v} onValueChange={setV} />",
                            render: <div className="w-72"><Input.Password label="Password" hint="At least 8 characters" value={value} onValueChange={setValue} placeholder="Password" showAnatomy /></div>,
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
                    name="Input.Password"
                    tier="atom"
                    leaf="Required"
                    states={[
                        {
                            name: "isRequired = true",
                            why: "A `*` mark appears right after the label text, with nothing else in the field changing. It tells the learner this field cannot be left blank before they ever try to submit the form.",
                            code: "<Input.Password label=\"Password\" isRequired value={v} onValueChange={setV} />",
                            render: <div className="w-72"><Input.Password label="Password" isRequired value={value} onValueChange={setValue} placeholder="Password" showAnatomy /></div>,
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Filled — a real value (masked as ●) with a label. */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("SuperSecure!2026")
            return (
                <BlockAnatomy
                    name="Input.Password"
                    tier="atom"
                    leaf="Filled"
                    states={[
                        {
                            name: "value = \"SuperSecure!2026\"",
                            why: "The box now shows a row of masking dots instead of standing empty, one dot per character typed. The value stays masked even while filled, since a password field never reveals its content just because it holds one.",
                            code: "<Input.Password label=\"Password\" value=\"SuperSecure!2026\" onValueChange={setV} />",
                            render: <div className="w-72"><Input.Password label="Password" value={value} onValueChange={setValue} showAnatomy /></div>,
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
            const [value, setValue] = useState("SuperSecure!2026")
            return (
                <BlockAnatomy
                    name="Input.Password"
                    tier="atom"
                    leaf="Disabled"
                    states={[
                        {
                            name: "isDisabled = true",
                            why: "The whole field dims and stops accepting focus, typing, or a reveal toggle, while the label and its masked value stay visible but muted. Use it when the password field's value is fixed by something else in the form, so editing or revealing it here would be misleading.",
                            code: "<Input.Password label=\"Password\" value=\"SuperSecure!2026\" isDisabled onValueChange={setV} />",
                            render: <div className="w-72"><Input.Password label="Password" value={value} onValueChange={setValue} isDisabled showAnatomy /></div>,
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
 * Compare against `Error` next: that leaf adds `errorMessage`, the only thing that
 * grows the red text line; the border here is already the same red.
 */
export const Invalid: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("123")
            return (
                <BlockAnatomy
                    name="Input.Password"
                    tier="atom"
                    leaf="Invalid"
                    states={[
                        {
                            name: "isInvalid = true, no errorMessage",
                            why: "The border turns red while no error line appears underneath it, and the label stays normal, because `isInvalid` alone carries no message to print. Compare it against `Error` next: that leaf adds `errorMessage`, which is the only thing that grows a red text line below the same red border.",
                            code: "<Input.Password label=\"Password\" isInvalid value={v} onValueChange={setV} />",
                            render: <div className="w-72"><Input.Password label="Password" isInvalid value={value} onValueChange={setValue} placeholder="Password" showAnatomy /></div>,
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
            const [value, setValue] = useState("123")
            return (
                <BlockAnatomy
                    name="Input.Password"
                    tier="atom"
                    leaf="Error"
                    states={[
                        {
                            name: "errorMessage set",
                            why: "The border turns red exactly as in `Invalid`, and now a red message line also appears below the field explaining what is wrong. Printing the actual reason, not just a red border, is what lets the learner fix the problem without guessing.",
                            code: "<Input.Password label=\"Password\" errorMessage=\"Password is too short\" value={v} onValueChange={setV} />",
                            render: <div className="w-72"><Input.Password label="Password" errorMessage="Password is too short" value={value} onValueChange={setValue} placeholder="Password" showAnatomy /></div>,
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
                name="Input.Password"
                tier="atom"
                leaf="Loading"
                states={[
                    {
                        name: "isSkeleton = true, label set",
                        why: "A shimmering bar mirrors the label's position above a shimmering box, standing in for both before any data has arrived. Mirroring the label's own position, rather than skipping it, is what keeps the field from jumping once the real label and value land.",
                        code: "<Input.Password label=\"Password\" isSkeleton />",
                        render: <div className="w-72"><Input.Password label="Password" value="" onValueChange={() => {}} isSkeleton showAnatomy /></div>,
                    },
                ]}
            />
        </div>
    ),
}
