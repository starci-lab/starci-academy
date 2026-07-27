import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input } from "@sb-components/atoms/forms/Input/Input"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Input/Input.Tags", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

/**
 * DEP THẬT DUY NHẤT — mỗi token trong hộp là một `Chip.Base` removable (đọc
 * `.storybook/components/atoms/forms/Input/Input.tsx`, `InputTags`: `<Chip.Base
 * onRemove … anatPart="Chip.Base" />` — node name = TÊN COMPONENT THẬT, không
 * còn vai "Chip" của wrapping span cũ, § two-law pass 2026-07-28). `storyId` trỏ
 * export `Removable` của `Atoms/Chips/Chip/Chip.Base` (khớp đúng shape đang render
 * ở đây — có `onRemove`).
 *
 * `Field` là RUỘT của `FieldFrame` (atom-internal, không story riêng) nên KHÔNG
 * khai ở đây — "deps không có thì thôi" (thầy chốt 2026-07-26 lần 2). Nhưng
 * `Label`/`Skeleton` của FieldFrame LÀ heroui THẬT (`Label`/`Skeleton` từ
 * `@heroui/react`) nên vẫn cần tier `heroui` để panel không lặng lẽ bỏ sót
 * (2026-07-28).
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Chip.Base": { tier: "atom", role: "each tag renders as a removable Chip.Base", storyId: "atoms-chips-chip-chip-base--removable" },
    Label: { tier: "heroui", role: "field label line" },
    Skeleton: { tier: "heroui", role: "loading placeholder" },
}

/** Leaf TRẦN — trống, gõ + Enter để thêm thẻ. Chưa có token nên chưa có Chip deps. Migrated to `states` 2026-07-27. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string[]>([])
            return (
                <BlockAnatomy
                    name="Input.Tags"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Default"
                    states={[
                        {
                            name: "value = [] (no tags yet)",
                            why: "The field renders as an empty bordered box holding just the draft text input, with no `Chip.Base` tokens and no label or hint above it. Typing a token and pressing Enter is how the first tag gets added, so this bare box is the field's true resting state before any data exists.",
                            code: "<Input.Tags value={value} onValueChange={setValue} placeholder=\"Add a tag…\" />",
                            render: (
                                <div className="w-80">
                                    <Input.Tags value={value} onValueChange={setValue} placeholder="Add a tag…" ariaLabel="Tags" showAnatomy />
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

/** Leaf props `label` + `hint` — nhãn trên, mô tả dưới nhãn. Migrated to `states` 2026-07-27. */
export const WithLabel: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string[]>([])
            return (
                <BlockAnatomy
                    name="Input.Tags"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Props `label` + `hint`"
                    states={[
                        {
                            name: "label + hint set, value = []",
                            why: "A `label` line appears above the box and a `hint` line appears beneath it, while the tag box itself stays exactly as empty as the Default state. The hint spells out the Enter-to-add gesture that the bare box alone can't communicate.",
                            code: "<Input.Tags label=\"Skills\" hint=\"Press Enter to add\" value={value} onValueChange={setValue} />",
                            render: (
                                <div className="w-80">
                                    <Input.Tags label="Skills" hint="Press Enter to add" value={value} onValueChange={setValue} placeholder="Add a tag…" showAnatomy />
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

/** Leaf prop `isRequired` — dấu `*` sau nhãn. Migrated to `states` 2026-07-27. */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string[]>([])
            return (
                <BlockAnatomy
                    name="Input.Tags"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `isRequired`"
                    states={[
                        {
                            name: "isRequired = true",
                            why: "A `*` mark attaches to the end of the label; nothing else about the box or its tokens changes. Some tag fields aren't optional, so the asterisk has to appear before the caller ever tries to submit the surrounding form.",
                            code: "<Input.Tags label=\"Skills\" isRequired value={value} onValueChange={setValue} />",
                            render: (
                                <div className="w-80">
                                    <Input.Tags label="Skills" isRequired value={value} onValueChange={setValue} placeholder="Add a tag…" showAnatomy />
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

/** Leaf prop `value` filled — vài token, mỗi token là một `Chip.Base` (dep thật). Migrated to `states` 2026-07-27. */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string[]>(["React", "TypeScript", "GraphQL"])
            return (
                <BlockAnatomy
                    name="Input.Tags"
                    tier="atom"
                    leaf="Prop `value` (filled)"
                    annotate={ANNOTATE}
                    states={[
                        {
                            name: "value = [\"React\", \"TypeScript\", \"GraphQL\"]",
                            why: "Each string in `value` mounts as its own removable `Chip.Base` inside the box, which is the one real dependency this atom composes. Rendering tags as chips instead of plain comma-joined text is what makes each one individually removable.",
                            code: "<Input.Tags label=\"Skills\" value={[\"React\", \"TypeScript\", \"GraphQL\"]} onValueChange={setValue} />",
                            render: (
                                <div className="w-80">
                                    <Input.Tags label="Skills" value={value} onValueChange={setValue} placeholder="Add a tag…" removeLabel="Remove tag" showAnatomy />
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

/** Leaf prop `isDisabled` — khoá hộp, nhãn nhạt; Chip vẫn hiện nhưng không xoá được. Migrated to `states` 2026-07-27. */
export const Disabled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string[]>(["React", "TypeScript"])
            return (
                <BlockAnatomy
                    name="Input.Tags"
                    tier="atom"
                    leaf="Prop `isDisabled`"
                    annotate={ANNOTATE}
                    states={[
                        {
                            name: "isDisabled = true, value = [\"React\", \"TypeScript\"]",
                            why: "The chips stay visible and the label dims, but the × on each chip stops responding and the draft input can no longer take focus. The tags must still read even though editing is locked, for example while a field the tags depend on is still loading.",
                            code: "<Input.Tags label=\"Skills\" isDisabled value={[\"React\", \"TypeScript\"]} onValueChange={setValue} />",
                            render: (
                                <div className="w-80">
                                    <Input.Tags label="Skills" value={value} onValueChange={setValue} placeholder="Add a tag…" removeLabel="Remove tag" isDisabled showAnatomy />
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

/** Leaf prop `errorMessage` — cùng `label` → dòng đỏ + viền lỗi. Migrated to `states` 2026-07-27. */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string[]>(["React"])
            return (
                <BlockAnatomy
                    name="Input.Tags"
                    tier="atom"
                    leaf="Prop `errorMessage`"
                    annotate={ANNOTATE}
                    states={[
                        {
                            name: "errorMessage set, value = [\"React\"]",
                            why: "A red line appears under the box and the border switches to the danger tone, while the existing chip keeps rendering unchanged. The message has to sit right at the field that failed validation, not float somewhere else on the form.",
                            code: "<Input.Tags label=\"Skills\" errorMessage=\"Add at least 3 tags\" value={[\"React\"]} onValueChange={setValue} />",
                            render: (
                                <div className="w-80">
                                    <Input.Tags label="Skills" errorMessage="Add at least 3 tags" value={value} onValueChange={setValue} placeholder="Add a tag…" removeLabel="Remove tag" showAnatomy />
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

/** Leaf prop `isSkeleton` — nhãn mirror trên field-box skeleton. Migrated to `states` 2026-07-27. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Input.Tags"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                states={[
                    {
                        name: "isSkeleton = true, label set",
                        why: "The label text still renders above a shimmer bar that stands in for the whole box — chips, draft input, and all. The atom draws its own resting shape instead of the caller assembling a placeholder box by hand.",
                        code: "<Input.Tags label=\"Skills\" isSkeleton />",
                        render: (
                            <div className="w-80">
                                <Input.Tags label="Skills" value={[]} onValueChange={() => {}} isSkeleton showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
