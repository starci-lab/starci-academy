import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Choice } from "@sb-components/atoms/forms/Choice/Choice"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Choice.Checkbox`: ô tick boolean, nhãn nằm INLINE cạnh ô (bọc HeroUI Checkbox).
 *
 * 📐 **1 PROP = 1 LEAF** (§12g — luật TẦNG ATOM). Bộ leaf đủ prop CÓ HÌNH: `isSelected`
 * (`Default`/`Checked`) · `hint` (`WithHint`) · `isRequired` (`Required`) · `isDisabled`
 * (`Disabled`) · `errorMessage` (`Error`) · `isSkeleton` (`Loading`). `label`/
 * `onValueChange`/`className`/`showAnatomy` không sinh hình riêng nên không có leaf.
 *
 * ⭐ DEPS: atom này bọc thẳng HeroUI Checkbox — không dựng lại atom nào khác có story
 * riêng, nên KHÔNG có prop `annotate` (§12g: "atom lá bọc thẳng HeroUI ⇒ deps RỖNG,
 * bỏ hẳn prop"). `Control`/`Label` trong DOM là khe nội bộ của chính Checkbox;
 * `Description`/`Error` là khe của `FieldFrame` (scaffold nội bộ, không có story riêng)
 * — không cái nào có nhà để nhảy tới.
 *
 * ⚠️ Tab States đã BỎ (thầy chốt 2026-07-26, lần 2). Panel còn Deps · Code — file này
 * không có Deps nên panel chỉ còn Code.
 *
 * ✍️ Chữ hiện trên panel (`leaf`/`reason`/`note`/`code`) và nhãn demo trong khung
 * render viết TIẾNG ANH; JSDoc/comment giữ tiếng Việt.
 */
const meta: Meta<typeof Choice.Checkbox> = {
    title: "Atoms/Forms/Choice/Choice.Checkbox",
    component: Choice.Checkbox,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Choice.Checkbox>

/** Leaf TRẦN — chưa bật prop nào: bỏ tick, không hint, không lỗi. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(false)
            return (
                <BlockAnatomy
                    name="Choice.Checkbox"
                    tier="atom"
                    leaf="No prop turned on"
                    reason="The one checkbox atom in the system, wrapping HeroUI Checkbox. This leaf is the baseline: unticked, no hint, no error."
                    note="The label sits beside the box — Checkbox.Content owns it, not a separate FieldFrame label."
                    code={"<Choice.Checkbox isSelected={value} onValueChange={setValue} label=\"Receive email updates\" />"}
                >
                    <div className="w-72">
                        <Choice.Checkbox isSelected={value} onValueChange={setValue} label="Receive email updates" showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isSelected` — hình khi đã tick (false = leaf Default ở trên). */
export const Checked: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(true)
            return (
                <BlockAnatomy
                    name="Choice.Checkbox"
                    tier="atom"
                    leaf="Prop `isSelected`"
                    reason="isSelected is controlled — the caller owns the value and hands it back through onValueChange, so the box never drifts from the form state around it."
                    note="Ticked fills the box and swaps the icon; nothing else in the row moves."
                    code={"<Choice.Checkbox isSelected onValueChange={setValue} label=\"Receive email updates\" />"}
                >
                    <div className="w-72">
                        <Choice.Checkbox isSelected={value} onValueChange={setValue} label="Receive email updates" showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `hint` — dòng mô tả phụ dưới nhãn, qua scaffold nội bộ FieldFrame. */
export const WithHint: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(false)
            return (
                <BlockAnatomy
                    name="Choice.Checkbox"
                    tier="atom"
                    leaf="Prop `hint`"
                    reason="A checkbox with a consequence needs a sentence, not just a label — hint is that sentence, always visible below the row."
                    note="Routed through FieldFrame internally — the atom stays a single call, no separate Field wrapper at the call site."
                    code={"<Choice.Checkbox isSelected={value} onValueChange={setValue} label=\"Receive email updates\" hint=\"You can turn this off anytime in Settings.\" />"}
                >
                    <div className="w-72">
                        <Choice.Checkbox
                            isSelected={value}
                            onValueChange={setValue}
                            label="Receive email updates"
                            hint="You can turn this off anytime in Settings."
                            showAnatomy
                        />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isRequired` — dấu `*` gắn vào nhãn inline. */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(false)
            return (
                <BlockAnatomy
                    name="Choice.Checkbox"
                    tier="atom"
                    leaf="Prop `isRequired`"
                    reason="Some agreements aren't optional — the asterisk on the inline label says so before the form is even submitted."
                    note="The mark rides on the same label as the box, not on a separate FieldFrame heading — this control has no heading of its own."
                    code={"<Choice.Checkbox isSelected={value} onValueChange={setValue} label=\"Agree to the Terms of Service\" isRequired />"}
                >
                    <div className="w-72">
                        <Choice.Checkbox
                            isSelected={value}
                            onValueChange={setValue}
                            label="Agree to the Terms of Service"
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

/** Leaf prop `isDisabled` — khoá control, nhạt màu. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Choice.Checkbox"
                tier="atom"
                leaf="Prop `isDisabled`"
                reason="Not allowed yet — a step upstream isn't done, or the setting is locked by policy. The box stays visible so the reader knows the option exists."
                note="Forwarded straight to HeroUI: press is blocked and both box and label dim."
                code={"<Choice.Checkbox isDisabled isSelected onValueChange={setValue} label=\"Agree to the Terms of Service\" />"}
            >
                <div className="w-72">
                    <Choice.Checkbox
                        isSelected
                        onValueChange={() => {}}
                        label="Agree to the Terms of Service"
                        isDisabled
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `errorMessage` — nhãn inline + viền lỗi + dòng lỗi đỏ, qua FieldFrame. */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(false)
            return (
                <BlockAnatomy
                    name="Choice.Checkbox"
                    tier="atom"
                    leaf="Prop `errorMessage`"
                    reason="A blank required checkbox is easy to miss on a long form — the red border and the line beneath it stop the eye at the exact row that needs attention."
                    note="Setting errorMessage flips the control invalid on its own; there's no separate isInvalid to remember."
                    code={"<Choice.Checkbox isSelected={value} onValueChange={setValue} label=\"Agree to the Terms of Service\" errorMessage=\"You must agree to continue.\" />"}
                >
                    <div className="w-72">
                        <Choice.Checkbox
                            isSelected={value}
                            onValueChange={setValue}
                            label="Agree to the Terms of Service"
                            errorMessage="You must agree to continue."
                            showAnatomy
                        />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isSkeleton` — shimmer CO-LOCATED (§12c): ô vuông + thanh nhãn. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Choice.Checkbox"
                tier="atom"
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the shape owns its resting state, so the checkbox draws its own shimmer — no shared skeleton component to keep in sync."
                note="The shimmer mirrors box + label width so the row doesn't jump when the real content lands."
                code={"<Choice.Checkbox isSkeleton />"}
            >
                <div className="w-72">
                    <Choice.Checkbox isSelected={false} onValueChange={() => {}} label="" isSkeleton showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
