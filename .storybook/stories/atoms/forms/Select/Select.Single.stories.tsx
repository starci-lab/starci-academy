import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Select } from "@sb-components/atoms/forms/Select/Select"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Select.Single`: dropdown chọn MỘT, bọc thẳng HeroUI `Select`.
 *
 * Atom lá (§12g cuối bài — "deps không có thì thôi"): control TRẦN là HeroUI
 * `Select.Trigger`/`Select.Value`/`Select.Popover`, khung nhãn/mô tả/lỗi là
 * `FieldFrame` NỘI BỘ (không có story riêng). Không component nào ở đây có
 * story riêng để nhảy tới ⇒ KHÔNG dùng `annotate`, bỏ hẳn prop (không phải `{}`).
 */

const meta: Meta = { title: "Atoms/Forms/Select/Select.Single", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

const OPTIONS = [
    { value: "fs", label: "Fullstack Mastery" },
    { value: "sd", label: "System Design Mastery" },
    { value: "do", label: "DevOps Mastery" },
]

/** Leaf TRẦN — không label: value rỗng, hiện placeholder. FieldFrame render thẳng trigger. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string | null>(null)
            return (
                <BlockAnatomy
                    name="Select.Single"
                    tier="atom"
                    leaf="Default"
                    code={"<Select.Single value={v} onValueChange={setV} options={OPTIONS} placeholder=\"Choose a course\" />"}
                >
                    <div className="w-72">
                        <Select.Single
                            value={value}
                            onValueChange={setValue}
                            options={OPTIONS}
                            placeholder="Choose a course"
                            ariaLabel="Course"
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
                    name="Select.Single"
                    tier="atom"
                    leaf="Props `label` / `hint`"
                    code={"<Select.Single label=\"Course\" hint=\"Pick the track you want to follow.\" ... />"}
                >
                    <div className="w-72">
                        <Select.Single
                            value={value}
                            onValueChange={setValue}
                            options={OPTIONS}
                            placeholder="Choose a course"
                            label="Course"
                            hint="Pick the track you want to follow."
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
                    name="Select.Single"
                    tier="atom"
                    leaf="Prop `isRequired`"
                    code={"<Select.Single label=\"Course\" isRequired ... />"}
                    note="isRequired adds a * after the label."
                >
                    <div className="w-72">
                        <Select.Single
                            value={value}
                            onValueChange={setValue}
                            options={OPTIONS}
                            placeholder="Choose a course"
                            label="Course"
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
 * Leaf prop `value` — trigger đổi hình theo chỗ đứng của dữ liệu: rỗng thì hiện
 * `placeholder` mờ, có giá trị thì hiện nhãn option đã chọn.
 *
 * ⚠️ Đổi tên 2026-07-26: leaf này từng tên `Labeled` và kèm cả `label` — nhưng `label`
 * đã có nhà ở leaf `WithLabel`, nên hai leaf cùng khoe một prop (§12g: mỗi prop MỘT
 * leaf). Bỏ `label` khỏi đây, trả leaf về đúng prop nó sở hữu là `value`.
 * `isDisabled` cũng đã tách sang leaf `Disabled` cùng ngày, cùng lý do.
 */
export const Value: Story = {
    render: () => {
        const Demo = () => {
            const [empty, setEmpty] = useState<string | null>(null)
            const [filled, setFilled] = useState<string | null>("sd")
            return (
                <BlockAnatomy
                    name="Select.Single"
                    tier="atom"
                    leaf="Prop `value`"
                    code={"<Select.Single value={null} … />   // empty\n<Select.Single value=\"sd\" … />    // picked"}
                    note="Empty falls back to the placeholder; picked swaps in that option's label. Same DOM either way."
                >
                    <div className="flex flex-col gap-4">
                        <div className="w-72">
                            <Select.Single value={empty} onValueChange={setEmpty} options={OPTIONS} placeholder="Choose a course" ariaLabel="Course" showAnatomy />
                        </div>
                        <div className="w-72">
                            <Select.Single value={filled} onValueChange={setFilled} options={OPTIONS} placeholder="Choose a course" ariaLabel="Course" />
                        </div>
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isDisabled` — nhãn nhạt màu + trigger khoá, chặn popover mở. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Select.Single"
                tier="atom"
                leaf="Prop `isDisabled`"
                code={"<Select.Single label=\"Course\" value=\"fs\" isDisabled ... />"}
                note="isDisabled dims the label and the trigger box together, and blocks the popover from opening."
            >
                <div className="w-72">
                    <Select.Single
                        value="fs"
                        onValueChange={() => {}}
                        options={OPTIONS}
                        placeholder="Choose a course"
                        label="Course"
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
                name="Select.Single"
                tier="atom"
                leaf="Prop `isInvalid`"
                code={"<Select.Single label=\"Course\" isInvalid ... />"}
                note="isInvalid alone only switches the trigger border to danger — no error line under it. Pass errorMessage as well when the red line should show too."
            >
                <div className="w-72">
                    <Select.Single
                        value={null}
                        onValueChange={() => {}}
                        options={OPTIONS}
                        placeholder="Choose a course"
                        label="Course"
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
                    name="Select.Single"
                    tier="atom"
                    leaf="Prop `errorMessage`"
                    code={"<Select.Single label=\"Course\" errorMessage=\"Please choose a course.\" ... />"}
                    note="errorMessage adds the label, a red line, and an invalid border."
                >
                    <div className="w-72">
                        <Select.Single
                            value={value}
                            onValueChange={setValue}
                            options={OPTIONS}
                            placeholder="Choose a course"
                            label="Course"
                            errorMessage="Please choose a course."
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
                name="Select.Single"
                tier="atom"
                leaf="Prop `isSkeleton`"
                code={"<Select.Single label=\"Course\" isSkeleton />"}
                note="isSkeleton swaps in a label skeleton plus a trigger-box skeleton."
            >
                <div className="w-72">
                    <Select.Single value={null} onValueChange={() => {}} options={OPTIONS} label="Course" isSkeleton showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
