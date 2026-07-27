import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Select } from "@sb-components/atoms/forms/Select/Select"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Select.Combobox`: autocomplete gõ-lọc chọn MỘT, bọc thẳng HeroUI `ComboBox`.
 *
 * Atom lá (§12g cuối bài): field gõ + caret là HeroUI `ComboBox.InputGroup`/`Trigger`,
 * khung nhãn/mô tả/lỗi là `FieldFrame` NỘI BỘ (không có story riêng). Không component
 * nào ở đây có story riêng để nhảy tới ⇒ KHÔNG dùng `annotate`, bỏ hẳn prop.
 */

const meta: Meta = { title: "Atoms/Forms/Select/Select.Combobox", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

const OPTIONS = [
    { value: "hn", label: "Hanoi" },
    { value: "hcm", label: "Ho Chi Minh City" },
    { value: "dn", label: "Da Nang" },
    { value: "ct", label: "Can Tho" },
    { value: "hp", label: "Hai Phong" },
]

/** Leaf TRẦN — không label: ô trống, gõ để lọc gợi ý. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string | null>(null)
            return (
                <BlockAnatomy
                    name="Select.Combobox"
                    tier="atom"
                    leaf="Default"
                    states={[
                        {
                            name: "no label, value = null",
                            why: "The field renders an empty box carrying only the `placeholder` text. Typing runs react-aria's own option filter, so a bare combobox is ready to search the moment it mounts, with no label above it.",
                            code: "<Select.Combobox value={v} onValueChange={setV} options={OPTIONS} placeholder=\"Search city or province\" />",
                            render: (
                                <div className="w-72">
                                    <Select.Combobox
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        placeholder="Search city or province"
                                        ariaLabel="City/Province"
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

/** Leaf prop `label`/`hint` — nhãn + mô tả (FieldFrame Label/Description). */
export const WithLabel: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string | null>(null)
            return (
                <BlockAnatomy
                    name="Select.Combobox"
                    tier="atom"
                    leaf="Props `label` / `hint`"
                    states={[
                        {
                            name: "label and hint passed",
                            why: "FieldFrame grows a Label above the box and a Description line below it. This is for a field the caller wants to name and explain on its own, instead of leaving the meaning to a surrounding form section.",
                            code: "<Select.Combobox label=\"City/Province\" hint=\"Type to filter fast.\" ... />",
                            render: (
                                <div className="w-72">
                                    <Select.Combobox
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        placeholder="Search city or province"
                                        label="City/Province"
                                        hint="Type to filter fast."
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

/** Leaf prop `isRequired` — nhãn + dấu `*` bắt buộc. */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string | null>(null)
            return (
                <BlockAnatomy
                    name="Select.Combobox"
                    tier="atom"
                    leaf="Prop `isRequired`"
                    states={[
                        {
                            name: "isRequired = true",
                            why: "A `*` is appended right after the Label text, no other node changes. This tells the viewer the field cannot be submitted empty before they even try.",
                            code: "<Select.Combobox label=\"City/Province\" isRequired ... />",
                            render: (
                                <div className="w-72">
                                    <Select.Combobox
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        placeholder="Search city or province"
                                        label="City/Province"
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

/**
 * Leaf prop `value` — ô trống thì hiện `placeholder` mờ, chọn xong thì ô mang nhãn
 * option đã chọn.
 *
 * ⚠️ Đổi tên 2026-07-26 (từ `Labeled`): leaf này từng kèm cả `label`, mà `label` đã có
 * nhà ở leaf `WithLabel` ⇒ hai leaf cùng khoe một prop, trái §12g. Bỏ `label`, trả leaf
 * về đúng prop nó sở hữu. `isDisabled` cũng đã tách sang leaf `Disabled` cùng ngày.
 */
export const Value: Story = {
    render: () => {
        const Demo = () => {
            const [empty, setEmpty] = useState<string | null>(null)
            const [filled, setFilled] = useState<string | null>("dn")
            return (
                <BlockAnatomy
                    name="Select.Combobox"
                    tier="atom"
                    leaf="Prop `value`"
                    states={[
                        {
                            name: "value = null",
                            why: "The box falls back to the muted `placeholder` text, same DOM shape as a filled box. This is the resting state before the learner has picked anything yet.",
                            code: "<Select.Combobox value={null} ... />",
                            render: (
                                <div className="w-72">
                                    <Select.Combobox value={empty} onValueChange={setEmpty} options={OPTIONS} placeholder="Search city or province" ariaLabel="City or province" showAnatomy />
                                </div>
                            ),
                        },
                        {
                            name: "value = \"dn\"",
                            why: "The box swaps the placeholder for the matching option's own label text, same DOM shape as the empty box. This is what the field shows once a real selection has landed.",
                            code: "<Select.Combobox value=\"dn\" ... />",
                            render: (
                                <div className="w-72">
                                    <Select.Combobox value={filled} onValueChange={setFilled} options={OPTIONS} placeholder="Search city or province" ariaLabel="City or province" showAnatomy />
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

/** Leaf prop `isDisabled` — nhãn nhạt màu + input khoá, chặn popover mở. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Select.Combobox"
                tier="atom"
                leaf="Prop `isDisabled`"
                states={[
                    {
                        name: "isDisabled = true",
                        why: "The Label and the input box both dim together, and typing plus opening the popover are both blocked. This is for a field the caller has decided the learner cannot touch right now, without removing it from view.",
                        code: "<Select.Combobox label=\"City/Province\" value=\"hn\" isDisabled ... />",
                        render: (
                            <div className="w-72">
                                <Select.Combobox
                                    value="hn"
                                    onValueChange={() => {}}
                                    options={OPTIONS}
                                    placeholder="Search city or province"
                                    label="City/Province"
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

/**
 * Leaf prop `isInvalid` — CHỈ đổi viền sang đỏ, không có dòng lỗi. Khác
 * `errorMessage` (leaf dưới): `errorMessage` set thì viền đỏ CỘNG dòng lỗi;
 * `isInvalid` đứng một mình thì chỉ viền, vì FieldFrame không tự sinh chữ.
 */
export const Invalid: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Select.Combobox"
                tier="atom"
                leaf="Prop `isInvalid`"
                states={[
                    {
                        name: "isInvalid = true, no errorMessage",
                        why: "Only the input border switches to the danger tone; no error line appears under it, because FieldFrame never invents error text on its own. Pass `errorMessage` alongside it when the red line should show too.",
                        code: "<Select.Combobox label=\"City/Province\" isInvalid ... />",
                        render: (
                            <div className="w-72">
                                <Select.Combobox
                                    value={null}
                                    onValueChange={() => {}}
                                    options={OPTIONS}
                                    placeholder="Search city or province"
                                    label="City/Province"
                                    isInvalid
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

/** Leaf prop `errorMessage` — nhãn + dòng lỗi đỏ + viền lỗi. */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string | null>(null)
            return (
                <BlockAnatomy
                    name="Select.Combobox"
                    tier="atom"
                    leaf="Prop `errorMessage`"
                    states={[
                        {
                            name: "errorMessage set",
                            why: "The Label, a red message line, and an invalid border all appear together, added by `errorMessage` alone. This is the full validation-failed shape, giving the learner both the visual cue and the reason in one line.",
                            code: "<Select.Combobox label=\"City/Province\" errorMessage=\"Choose a valid city or province.\" ... />",
                            render: (
                                <div className="w-72">
                                    <Select.Combobox
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        placeholder="Search city or province"
                                        label="City/Province"
                                        errorMessage="Choose a valid city or province."
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

/** Leaf prop `isSkeleton` — nhãn skeleton trên trigger-box skeleton (mirror đúng cột). */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Select.Combobox"
                tier="atom"
                leaf="Prop `isSkeleton`"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "A label-shaped bar and a trigger-box-shaped bar both swap in for the real field. This mirrors the exact column the real label and box will occupy, so the row doesn't shift once the field is ready.",
                        code: "<Select.Combobox label=\"City/Province\" isSkeleton />",
                        render: (
                            <div className="w-72">
                                <Select.Combobox value={null} onValueChange={() => {}} options={OPTIONS} label="City/Province" isSkeleton showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
