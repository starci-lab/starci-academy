import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Select } from "@sb-components/atoms/forms/Select/Select"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Select.Multi`: dropdown chọn NHIỀU, bọc thẳng HeroUI `Select`
 * (`selectionMode="multiple"`).
 *
 * Atom lá: trigger tóm tắt bằng CHỮ ("Đã chọn n" — string hard-code trong
 * `Select.tsx`, không phải `Chip.Base`). Đã ĐỌC source để kiểm chứng: KHÔNG
 * compose `Chip.Base` hay `Select.Value` cho giá trị đã chọn (chỉ một `<span>`
 * trần), nên KHÔNG có dep thật ⇒ `annotate` không có `storyId`. Nhưng
 * `Select.Trigger`/`Label`/`Skeleton` LÀ heroui thật vẫn cần tier `heroui` để
 * panel hai-luật không lặng lẽ bỏ sót chúng (2026-07-28).
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Select.Trigger": { tier: "heroui", role: "dropdown trigger button" },
    Label: { tier: "heroui", role: "field label line" },
    Skeleton: { tier: "heroui", role: "loading placeholder" },
}

const meta: Meta = { title: "Atoms/Forms/Select/Select.Multi", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

const OPTIONS = [
    { value: "js", label: "JavaScript" },
    { value: "ts", label: "TypeScript" },
    { value: "go", label: "Go" },
    { value: "rs", label: "Rust" },
]

/** Leaf TRẦN — không label: chưa chọn gì, hiện placeholder. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<Array<string>>([])
            return (
                <BlockAnatomy
                    name="Select.Multi"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Default"
                    states={[
                        {
                            name: "value = [], no prop turned on",
                            why: "The trigger shows the placeholder text and no label sits above it. This is the baseline shape every other leaf differs from by exactly one prop.",
                            code: "<Select.Multi value={v} onValueChange={setV} options={OPTIONS} placeholder=\"Choose languages\" />",
                            render: (
                                <div className="w-72">
                                    <Select.Multi
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        placeholder="Choose languages"
                                        ariaLabel="Language"
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
            const [value, setValue] = useState<Array<string>>([])
            return (
                <BlockAnatomy
                    name="Select.Multi"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Props `label` / `hint`"
                    states={[
                        {
                            name: "label set, hint set",
                            why: "A label heading and a description line grow above the trigger. The pair tells the reader what the field is for and adds a sentence of guidance before they open it.",
                            code: "<Select.Multi label=\"Language\" hint=\"Pick every language you use.\" ... />",
                            render: (
                                <div className="w-72">
                                    <Select.Multi
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        placeholder="Choose languages"
                                        label="Language"
                                        hint="Pick every language you use."
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
            const [value, setValue] = useState<Array<string>>([])
            return (
                <BlockAnatomy
                    name="Select.Multi"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `isRequired`"
                    states={[
                        {
                            name: "isRequired = true",
                            why: "A `*` mark attaches after the label, nothing else about the trigger changes. The mark flags a field the form will reject as empty before the reader ever opens it.",
                            code: "<Select.Multi label=\"Language\" isRequired ... />",
                            render: (
                                <div className="w-72">
                                    <Select.Multi
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        placeholder="Choose languages"
                                        label="Language"
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
 * Leaf prop `value` — mảng rỗng thì trigger hiện `placeholder`; từ hai giá trị trở lên
 * thì gộp thành số đếm ("2 selected") thay vì kéo dài danh sách.
 *
 * ⚠️ Đổi tên 2026-07-26 (từ `Labeled`): leaf này từng kèm cả `label`, mà `label` đã có
 * nhà ở leaf `WithLabel` ⇒ hai leaf cùng khoe một prop, trái §12g. Bỏ `label`, trả leaf
 * về đúng prop nó sở hữu. `isDisabled` cũng đã tách sang leaf `Disabled` cùng ngày.
 */
export const Value: Story = {
    render: () => {
        const Demo = () => {
            const [empty, setEmpty] = useState<Array<string>>([])
            const [filled, setFilled] = useState<Array<string>>(["ts", "go"])
            return (
                <BlockAnatomy
                    name="Select.Multi"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `value`"
                    states={[
                        {
                            name: "value = []",
                            why: "The trigger falls back to the placeholder text. An empty array reads as nothing chosen yet, the same visual as before the reader ever opened the popover.",
                            code: "<Select.Multi value={[]} … />",
                            render: (
                                <div className="w-72">
                                    <Select.Multi value={empty} onValueChange={setEmpty} options={OPTIONS} placeholder="Choose languages" ariaLabel="Language" showAnatomy />
                                </div>
                            ),
                        },
                        {
                            name: "value = [\"ts\", \"go\"]",
                            why: "Two or more picks collapse into a count instead of listing every label. A growing list would push the trigger's width around as the reader keeps picking, so the atom holds the box steady.",
                            code: "<Select.Multi value={[\"ts\", \"go\"]} … />",
                            render: (
                                <div className="w-72">
                                    <Select.Multi value={filled} onValueChange={setFilled} options={OPTIONS} placeholder="Choose languages" ariaLabel="Language" />
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
                name="Select.Multi"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isDisabled`"
                states={[
                    {
                        name: "isDisabled = true",
                        why: "The label and the trigger box dim together and the popover no longer opens. The dimmed pair reads as one locked control instead of a label that looks live above a dead box.",
                        code: "<Select.Multi label=\"Language\" value={[\"js\"]} isDisabled ... />",
                        render: (
                            <div className="w-72">
                                <Select.Multi
                                    value={["js"]}
                                    onValueChange={() => {}}
                                    options={OPTIONS}
                                    placeholder="Choose languages"
                                    label="Language"
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
                name="Select.Multi"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isInvalid`"
                states={[
                    {
                        name: "isInvalid = true, errorMessage not set",
                        why: "Only the trigger border switches to danger, no error line grows under it. isInvalid alone is a bare visual flag; pass errorMessage as well when the red line should show too.",
                        code: "<Select.Multi label=\"Language\" isInvalid ... />",
                        render: (
                            <div className="w-72">
                                <Select.Multi
                                    value={[]}
                                    onValueChange={() => {}}
                                    options={OPTIONS}
                                    placeholder="Choose languages"
                                    label="Language"
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
            const [value, setValue] = useState<Array<string>>([])
            return (
                <BlockAnatomy
                    name="Select.Multi"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `errorMessage`"
                    states={[
                        {
                            name: "errorMessage set",
                            why: "The trigger border turns invalid and a red line grows below it, under the same label as any other leaf. Setting errorMessage flips the control invalid on its own, so there is no separate isInvalid to remember alongside it.",
                            code: "<Select.Multi label=\"Language\" errorMessage=\"Pick at least one language.\" ... />",
                            render: (
                                <div className="w-72">
                                    <Select.Multi
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        placeholder="Choose languages"
                                        label="Language"
                                        errorMessage="Pick at least one language."
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
                name="Select.Multi"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The label swaps for a bar skeleton and the trigger box swaps for a matching box skeleton. Whoever owns the shape owns its resting state, so the atom draws its own shimmer instead of waiting on a shared skeleton component.",
                        code: "<Select.Multi label=\"Language\" isSkeleton />",
                        render: (
                            <div className="w-72">
                                <Select.Multi value={[]} onValueChange={() => {}} options={OPTIONS} label="Language" isSkeleton showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
