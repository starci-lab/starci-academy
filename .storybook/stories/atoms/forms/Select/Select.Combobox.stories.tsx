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
                    code={"<Select.Combobox value={v} onValueChange={setV} options={OPTIONS} placeholder=\"Search city or province\" />"}
                    note="Typing runs react-aria's own option filter."
                >
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
                </BlockAnatomy>
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
                    code={"<Select.Combobox label=\"City/Province\" hint=\"Type to filter fast.\" ... />"}
                >
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
                </BlockAnatomy>
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
                    code={"<Select.Combobox label=\"City/Province\" isRequired ... />"}
                    note="isRequired adds a * after the label."
                >
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
                </BlockAnatomy>
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
                    code={"<Select.Combobox value={null} … />   // empty\n<Select.Combobox value=\"dn\" … />     // picked"}
                    note="Empty falls back to the placeholder; picked swaps in that option's label. Same DOM either way."
                >
                    <div className="flex flex-col gap-4">
                        <div className="w-72">
                            <Select.Combobox value={empty} onValueChange={setEmpty} options={OPTIONS} placeholder="Search city or province" ariaLabel="City or province" showAnatomy />
                        </div>
                        <div className="w-72">
                            <Select.Combobox value={filled} onValueChange={setFilled} options={OPTIONS} placeholder="Search city or province" ariaLabel="City or province" />
                        </div>
                    </div>
                </BlockAnatomy>
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
                code={"<Select.Combobox label=\"City/Province\" value=\"hn\" isDisabled ... />"}
                note="isDisabled dims the label and the input box together, and blocks typing/the popover."
            >
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
            </BlockAnatomy>
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
                code={"<Select.Combobox label=\"City/Province\" isInvalid ... />"}
                note="isInvalid alone only switches the input border to danger — no error line under it. Pass errorMessage as well when the red line should show too."
            >
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
            </BlockAnatomy>
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
                    code={"<Select.Combobox label=\"City/Province\" errorMessage=\"Choose a valid city or province.\" ... />"}
                    note="errorMessage adds the label, a red line, and an invalid border."
                >
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
                </BlockAnatomy>
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
                code={"<Select.Combobox label=\"City/Province\" isSkeleton />"}
                note="isSkeleton swaps in a label skeleton plus a trigger-box skeleton."
            >
                <div className="w-72">
                    <Select.Combobox value={null} onValueChange={() => {}} options={OPTIONS} label="City/Province" isSkeleton showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
