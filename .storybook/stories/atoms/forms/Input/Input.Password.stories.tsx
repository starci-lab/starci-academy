import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input } from "@sb-components/atoms/forms/Input/Input"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Input/Input.Password", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

/**
 * ATOM LÁ — `Input.Password` bọc thẳng HeroUI `TextField`/`Input` (type="password")
 * + nút hiện/ẩn (Phosphor `EyeIcon`/`EyeSlashIcon`) + `FieldFrame` nội bộ (§11a).
 * Toggle là NÚT NỘI BỘ của chính atom (không phải `Button.Base` với story riêng) ⇒
 * mọi part (`Label`/`Description`/`Field`/`Toggle`/`Error`/`Skeleton`) vẫn là KHE
 * nội bộ ⇒ KHÔNG có deps ⇒ bỏ hẳn prop `annotate`.
 *
 * ⭐ 2026-07-26 (§12g): leaf `Invalid` tách khỏi `Error` — `isInvalid` một mình chỉ
 * đổi viền (không dòng chữ), `errorMessage` mới kéo theo viền + dòng đỏ. Hai prop
 * khác pixel nhau nên phải là hai leaf khác nhau (§12g.1: đổi pixel = có leaf).
 *
 * ⭐ Nút hiện/ẩn mật khẩu (`reveal`) là `useState` NỘI BỘ, không có prop nào ghim
 * được trạng thái "đã hiện" từ bên ngoài ⇒ KHÔNG dựng được leaf cho nó mà không sửa
 * component (cấm ở lượt này) — ghi vào `issues` thay vì thêm leaf.
 */

/** Default — bare masked field + the show/hide eye button. Không bật prop nào (§12g). */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("password123")
            return (
                <BlockAnatomy
                    name="Input.Password"
                    tier="atom"
                    leaf="Default"
                    note="Bare — no label, hint, or error."
                    code={"<Input.Password value={v} onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Password value={value} onValueChange={setValue} ariaLabel="Password" showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/**
 * Leaf prop `placeholder` — chữ mờ CHỈ hiện khi ô rỗng, nên leaf này phải để `value=""`.
 * Trước 2026-07-26 `placeholder` bị nhét vào leaf `Default` (mà ô đó lại có sẵn mật khẩu
 * nên chữ mờ KHÔNG BAO GIỜ hiện) — prop có hình mà không leaf nào soi được (§12g).
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
                    note="Ghost text only shows while the field is empty; typing the first character hides it."
                    code={"<Input.Password placeholder=\"Password\" value={v} onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Password placeholder="Password" value={value} onValueChange={setValue} ariaLabel="Password" showAnatomy />
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
                    name="Input.Password"
                    tier="atom"
                    leaf="WithLabel"
                    note="label + hint."
                    code={"<Input.Password label=\"Password\" hint=\"At least 8 characters\" value={v} onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Password label="Password" hint="At least 8 characters" value={value} onValueChange={setValue} placeholder="Password" showAnatomy />
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
                    name="Input.Password"
                    tier="atom"
                    leaf="Required"
                    note="isRequired → * mark after the label."
                    code={"<Input.Password label=\"Password\" isRequired value={v} onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Password label="Password" isRequired value={value} onValueChange={setValue} placeholder="Password" showAnatomy />
                    </div>
                </BlockAnatomy>
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
                    note="value holds text (masked as ●)."
                    code={"<Input.Password label=\"Password\" value=\"SuperSecure!2026\" onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Password label="Password" value={value} onValueChange={setValue} showAnatomy />
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
            const [value, setValue] = useState("SuperSecure!2026")
            return (
                <BlockAnatomy
                    name="Input.Password"
                    tier="atom"
                    leaf="Disabled"
                    note="isDisabled → locked + dimmed."
                    code={"<Input.Password label=\"Password\" value=\"SuperSecure!2026\" isDisabled onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Password label="Password" value={value} onValueChange={setValue} isDisabled showAnatomy />
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
            const [value, setValue] = useState("123")
            return (
                <BlockAnatomy
                    name="Input.Password"
                    tier="atom"
                    leaf="Invalid"
                    note="isInvalid → red border only. No errorMessage set → no red line, label stays normal."
                    code={"<Input.Password label=\"Password\" isInvalid value={v} onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Password label="Password" isInvalid value={value} onValueChange={setValue} placeholder="Password" showAnatomy />
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
            const [value, setValue] = useState("123")
            return (
                <BlockAnatomy
                    name="Input.Password"
                    tier="atom"
                    leaf="Error"
                    note="errorMessage → red border (same as isInvalid) + red message line below."
                    code={"<Input.Password label=\"Password\" errorMessage=\"Password is too short\" value={v} onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Password label="Password" errorMessage="Password is too short" value={value} onValueChange={setValue} placeholder="Password" showAnatomy />
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
                name="Input.Password"
                tier="atom"
                leaf="Loading"
                note="isSkeleton + label → label mirrored above the box."
                code={"<Input.Password label=\"Password\" isSkeleton />"}
            >
                <div className="w-72">
                    <Input.Password label="Password" value="" onValueChange={() => {}} isSkeleton showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
