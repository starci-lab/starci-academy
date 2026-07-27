import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Select } from "@sb-components/atoms/forms/Select/Select"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Select.Single`: dropdown chọn MỘT, bọc thẳng HeroUI `Select`.
 *
 * Atom lá: control TRẦN là HeroUI `Select.Trigger`/`Select.Value`/`Select.Popover`,
 * khung nhãn/mô tả/lỗi là `FieldFrame` NỘI BỘ (không có story riêng). Không
 * component nào ở đây có story riêng để nhảy tới ⇒ `annotate` không có `storyId`
 * — nhưng bốn part heroui thật (`Select.Trigger`/`Select.Value`/`Label`/`Skeleton`)
 * vẫn cần tier `heroui` để panel hai-luật không lặng lẽ bỏ sót chúng (2026-07-28).
 *
 * 2026-07-27: di trú toàn bộ leaf sang API `states[]` (§8/§4a).
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Select.Trigger": { tier: "heroui", role: "dropdown trigger button" },
    "Select.Value": { tier: "heroui", role: "trigger's selected-value text" },
    Label: { tier: "heroui", role: "field label line" },
    Skeleton: { tier: "heroui", role: "loading placeholder" },
}

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
                    annotate={ANNOTATE}
                    leaf="Default"
                    states={[
                        {
                            name: "value = null, no label",
                            why: "The trigger shows only the muted placeholder text and FieldFrame renders no label or description around it. This is the bare control, so a caller checking the raw trigger shape does not have to scroll past a heading first.",
                            code: "<Select.Single value={v} onValueChange={setV} options={OPTIONS} placeholder=\"Choose a course\" />",
                            render: (
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
                    name="Select.Single"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Props `label` / `hint`"
                    states={[
                        {
                            name: "label = \"Course\", hint set",
                            why: "FieldFrame adds a label line above the trigger and a hint line below it, on top of the same bare trigger from Default. Both come from the same internal frame, so a caller reaches for label and hint together rather than composing two separate wrappers.",
                            code: "<Select.Single label=\"Course\" hint=\"Pick the track you want to follow.\" ... />",
                            render: (
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
                    name="Select.Single"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `isRequired`"
                    states={[
                        {
                            name: "isRequired = true",
                            why: "A red asterisk is appended right after the label text, with nothing else in the composition changing. The mark tells the reader this field cannot be left blank before they ever open the popover.",
                            code: "<Select.Single label=\"Course\" isRequired ... />",
                            render: (
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
                    annotate={ANNOTATE}
                    leaf="Prop `value`"
                    states={[
                        {
                            name: "value = null",
                            why: "The trigger falls back to the muted placeholder text, using the exact same DOM as the picked state below. An empty value has to read as visibly unset, not as a stray blank box.",
                            code: "<Select.Single value={null} onValueChange={setV} options={OPTIONS} placeholder=\"Choose a course\" ariaLabel=\"Course\" />",
                            render: (
                                <div className="w-72">
                                    <Select.Single value={empty} onValueChange={setEmpty} options={OPTIONS} placeholder="Choose a course" ariaLabel="Course" showAnatomy />
                                </div>
                            ),
                        },
                        {
                            name: "value = \"sd\"",
                            why: "The trigger swaps in the matching option's own label, System Design Mastery, in the same node the placeholder just occupied. The trigger is controlled, so it can never drift from whatever value the caller holds in state.",
                            code: "<Select.Single value=\"sd\" onValueChange={setV} options={OPTIONS} placeholder=\"Choose a course\" ariaLabel=\"Course\" />",
                            render: (
                                <div className="w-72">
                                    <Select.Single value={filled} onValueChange={setFilled} options={OPTIONS} placeholder="Choose a course" ariaLabel="Course" />
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

/** Leaf prop `isDisabled` — nhãn nhạt màu + trigger khoá, chặn popover mở. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Select.Single"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isDisabled`"
                states={[
                    {
                        name: "isDisabled = true, value = \"fs\"",
                        why: "The label and the trigger box both dim together and the popover no longer opens on click. Disabling has to read at a glance across the whole field, not just on the box the pointer happens to hover.",
                        code: "<Select.Single label=\"Course\" value=\"fs\" isDisabled ... />",
                        render: (
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
                name="Select.Single"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isInvalid`"
                states={[
                    {
                        name: "isInvalid = true, errorMessage not set",
                        why: "Only the trigger's border switches to the danger colour, with no error line underneath it. FieldFrame never invents error text on its own, so isInvalid alone marks the field wrong without saying why.",
                        code: "<Select.Single label=\"Course\" isInvalid ... />",
                        render: (
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
                    name="Select.Single"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `errorMessage`"
                    states={[
                        {
                            name: "errorMessage set",
                            why: "The label stays, the trigger border turns to the danger colour, and a red line with the message text appears beneath it. Passing errorMessage is enough on its own to flip the field invalid, there is no separate flag to remember alongside it.",
                            code: "<Select.Single label=\"Course\" errorMessage=\"Please choose a course.\" ... />",
                            render: (
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
                name="Select.Single"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Both the label and the trigger box swap for shimmer bars sized to the space the real label and trigger will occupy. The atom draws its own resting shape so the field never jumps once the real options are ready.",
                        code: "<Select.Single label=\"Course\" isSkeleton />",
                        render: (
                            <div className="w-72">
                                <Select.Single value={null} onValueChange={() => {}} options={OPTIONS} label="Course" isSkeleton showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
