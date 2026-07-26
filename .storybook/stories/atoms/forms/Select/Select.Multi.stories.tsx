import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Select } from "@sb-components/atoms/forms/Select/Select"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Select.Multi`: dropdown chọn NHIỀU, bọc thẳng HeroUI `Select`
 * (`selectionMode="multiple"`).
 *
 * Atom lá (§12g cuối bài): trigger tóm tắt bằng CHỮ ("Đã chọn n" — string hard-code
 * trong `Select.tsx`, không phải `Chip.Base`). Đã ĐỌC source để kiểm chứng: KHÔNG
 * compose `Chip.Base` cho giá trị đã chọn, nên KHÔNG có dep thật ⇒ bỏ hẳn `annotate`.
 */

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
                    leaf="Default"
                    code={"<Select.Multi value={v} onValueChange={setV} options={OPTIONS} placeholder=\"Choose languages\" />"}
                >
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
            const [value, setValue] = useState<Array<string>>([])
            return (
                <BlockAnatomy
                    name="Select.Multi"
                    tier="atom"
                    leaf="Props `label` / `hint`"
                    code={"<Select.Multi label=\"Language\" hint=\"Pick every language you use.\" ... />"}
                >
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
            const [value, setValue] = useState<Array<string>>([])
            return (
                <BlockAnatomy
                    name="Select.Multi"
                    tier="atom"
                    leaf="Prop `isRequired`"
                    code={"<Select.Multi label=\"Language\" isRequired ... />"}
                    note="isRequired adds a * after the label."
                >
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
                </BlockAnatomy>
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
                    leaf="Prop `value`"
                    code={"<Select.Multi value={[]} … />             // empty\n<Select.Multi value={[\"ts\", \"go\"]} … />   // 2 picked → count"}
                    note="Empty falls back to the placeholder; two or more collapse into a count instead of a growing list."
                >
                    <div className="flex flex-col gap-4">
                        <div className="w-72">
                            <Select.Multi value={empty} onValueChange={setEmpty} options={OPTIONS} placeholder="Choose languages" ariaLabel="Language" showAnatomy />
                        </div>
                        <div className="w-72">
                            <Select.Multi value={filled} onValueChange={setFilled} options={OPTIONS} placeholder="Choose languages" ariaLabel="Language" />
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
                name="Select.Multi"
                tier="atom"
                leaf="Prop `isDisabled`"
                code={"<Select.Multi label=\"Language\" value={[\"js\"]} isDisabled ... />"}
                note="isDisabled dims the label and the trigger box together, and blocks the popover from opening."
            >
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
                name="Select.Multi"
                tier="atom"
                leaf="Prop `isInvalid`"
                code={"<Select.Multi label=\"Language\" isInvalid ... />"}
                note="isInvalid alone only switches the trigger border to danger — no error line under it. Pass errorMessage as well when the red line should show too."
            >
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
            </BlockAnatomy>
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
                    leaf="Prop `errorMessage`"
                    code={"<Select.Multi label=\"Language\" errorMessage=\"Pick at least one language.\" ... />"}
                    note="errorMessage adds the label, a red line, and an invalid border."
                >
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
                name="Select.Multi"
                tier="atom"
                leaf="Prop `isSkeleton`"
                code={"<Select.Multi label=\"Language\" isSkeleton />"}
                note="isSkeleton swaps in a label skeleton plus a trigger-box skeleton."
            >
                <div className="w-72">
                    <Select.Multi value={[]} onValueChange={() => {}} options={OPTIONS} label="Language" isSkeleton showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
