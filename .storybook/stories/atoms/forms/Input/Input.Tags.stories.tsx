import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input } from "@sb-components/atoms/forms/Input/Input"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Input/Input.Tags", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

/**
 * DEP THẬT DUY NHẤT — mỗi token trong hộp là một `Chip.Base` removable (đọc
 * `.storybook/components/atoms/forms/Input/Input.tsx`, `InputTags`: map `value`
 * ra `<span data-anat-part="Chip"><Chip.Base onRemove … /></span>`). `storyId`
 * trỏ export `Default` của `Atoms/Chips/Chip/Chip.Base`.
 *
 * `Field`/`Label`/`Description`/`Error`/`Skeleton` là RUỘT của `FieldFrame`
 * (atom-internal, không story riêng) nên KHÔNG khai ở đây — "deps không có thì
 * thôi" (thầy chốt 2026-07-26 lần 2).
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Chip: { tier: "atom", role: "each tag renders as a removable Chip.Base", storyId: "atoms-chips-chip-chip-base--default" },
}

/** Leaf TRẦN — trống, gõ + Enter để thêm thẻ. Chưa có token nên chưa có Chip deps. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string[]>([])
            return (
                <BlockAnatomy
                    name="Input.Tags"
                    tier="atom"
                    leaf="Default"
                    note="Bare — no label, hint, or error."
                    code={"<Input.Tags value={value} onValueChange={setValue} placeholder=\"Add a tag…\" />"}
                >
                    <div className="w-80">
                        <Input.Tags value={value} onValueChange={setValue} placeholder="Add a tag…" ariaLabel="Tags" showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf props `label` + `hint` — nhãn trên, mô tả dưới nhãn. */
export const WithLabel: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string[]>([])
            return (
                <BlockAnatomy
                    name="Input.Tags"
                    tier="atom"
                    leaf="Props `label` + `hint`"
                    note="Label plus hint."
                    code={"<Input.Tags label=\"Skills\" hint=\"Press Enter to add\" value={value} onValueChange={setValue} />"}
                >
                    <div className="w-80">
                        <Input.Tags label="Skills" hint="Press Enter to add" value={value} onValueChange={setValue} placeholder="Add a tag…" showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isRequired` — dấu `*` sau nhãn. */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string[]>([])
            return (
                <BlockAnatomy
                    name="Input.Tags"
                    tier="atom"
                    leaf="Prop `isRequired`"
                    note="isRequired adds a * after the label."
                    code={"<Input.Tags label=\"Skills\" isRequired value={value} onValueChange={setValue} />"}
                >
                    <div className="w-80">
                        <Input.Tags label="Skills" isRequired value={value} onValueChange={setValue} placeholder="Add a tag…" showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `value` filled — vài token, mỗi token là một `Chip.Base` (dep thật). */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string[]>(["React", "TypeScript", "GraphQL"])
            return (
                <BlockAnatomy
                    name="Input.Tags"
                    tier="atom"
                    leaf="Prop `value` (filled)"
                    note="value holds tokens — each one renders as a Chip.Base."
                    annotate={ANNOTATE}
                    code={"<Input.Tags label=\"Skills\" value={[\"React\", \"TypeScript\", \"GraphQL\"]} onValueChange={setValue} />"}
                >
                    <div className="w-80">
                        <Input.Tags label="Skills" value={value} onValueChange={setValue} placeholder="Add a tag…" removeLabel="Remove tag" showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isDisabled` — khoá hộp, nhãn nhạt; Chip vẫn hiện nhưng không xoá được. */
export const Disabled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string[]>(["React", "TypeScript"])
            return (
                <BlockAnatomy
                    name="Input.Tags"
                    tier="atom"
                    leaf="Prop `isDisabled`"
                    note="isDisabled locks the box — tags stay visible but the Chip cannot be removed."
                    annotate={ANNOTATE}
                    code={"<Input.Tags label=\"Skills\" isDisabled value={[\"React\", \"TypeScript\"]} onValueChange={setValue} />"}
                >
                    <div className="w-80">
                        <Input.Tags label="Skills" value={value} onValueChange={setValue} placeholder="Add a tag…" removeLabel="Remove tag" isDisabled showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `errorMessage` — cùng `label` → dòng đỏ + viền lỗi. */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string[]>(["React"])
            return (
                <BlockAnatomy
                    name="Input.Tags"
                    tier="atom"
                    leaf="Prop `errorMessage`"
                    note="label plus errorMessage adds the red line and the invalid border."
                    annotate={ANNOTATE}
                    code={"<Input.Tags label=\"Skills\" errorMessage=\"Add at least 3 tags\" value={[\"React\"]} onValueChange={setValue} />"}
                >
                    <div className="w-80">
                        <Input.Tags label="Skills" errorMessage="Add at least 3 tags" value={value} onValueChange={setValue} placeholder="Add a tag…" removeLabel="Remove tag" showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isSkeleton` — nhãn mirror trên field-box skeleton. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Input.Tags"
                tier="atom"
                leaf="Prop `isSkeleton`"
                note="isSkeleton with a label mirrors the label above the shimmer box."
                code={"<Input.Tags label=\"Skills\" isSkeleton />"}
            >
                <div className="w-80">
                    <Input.Tags label="Skills" value={[]} onValueChange={() => {}} isSkeleton showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
