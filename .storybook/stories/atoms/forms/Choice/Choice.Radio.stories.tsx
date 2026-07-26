import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { RadioGroup as HeroRadioGroup } from "@heroui/react"
import { Choice } from "@sb-components/atoms/forms/Choice/Choice"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Choice.Radio`: MỘT hàng option, nhãn nằm INLINE cạnh dot (bọc HeroUI Radio).
 *
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): `Choice.Radio` KHÔNG sống độc lập — nó phải
 * nằm trong một radio-context. Mô tả phụ (`hint`) · lỗi (`errorMessage`) · bắt buộc
 * (`isRequired`) là chuyện của NHÓM nên các state đó có nhà ở story `Choice.RadioGroup`
 * — KHÔNG lặp lại ở đây (§12f). Story này chỉ giữ state SINH RA TỪ chính hàng option.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). Bộ leaf đủ prop CÓ HÌNH của chính component này:
 * chọn hay chưa (`Default`/`Selected`, đến từ `value` khớp của nhóm) · `isDisabled`
 * (`Disabled`) · `isSkeleton` (`Loading`). `value`/`label`/`className`/`showAnatomy`
 * không có leaf riêng (`value`/`label` là dữ liệu bắt buộc, không phải state bật/tắt).
 *
 * ⚠️ HARNESS: `Choice.RadioGroup` chỉ nhận `options` DỮ LIỆU (không `children`), nên để
 * soi MỘT hàng option ta bọc bằng HeroUI `RadioGroup` trần — đây là giàn giáo của story
 * để có radio-context, KHÔNG phải cách dùng trong app.
 *
 * ⭐ DEPS: atom này bọc thẳng HeroUI Radio — không dựng lại atom nào khác có story
 * riêng, nên KHÔNG có prop `annotate` (§12g: "atom lá bọc thẳng HeroUI ⇒ deps RỖNG").
 * `Control`/`Label` trong DOM là khe nội bộ của chính hàng option này.
 *
 * ✍️ Chữ hiện trên panel (`leaf`/`reason`/`note`/`code`) và nhãn demo trong khung
 * render viết TIẾNG ANH; JSDoc/comment giữ tiếng Việt.
 */
const meta: Meta<typeof Choice.Radio> = {
    title: "Atoms/Forms/Choice/Choice.Radio",
    component: Choice.Radio,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Choice.Radio>

/** Leaf TRẦN — một option chưa chọn (bọc trong radio-context để chạy được). */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="Choice.Radio"
                    tier="atom"
                    leaf="No prop turned on"
                    reason="One radio option row, wrapping HeroUI Radio. It must live inside a radio-context — the app uses Choice.RadioGroup with options; this bare HeroRadioGroup is scaffolding for this story only."
                    note="The label sits beside the dot — Radio.Content owns it."
                    code={"<Choice.Radio value=\"starter\" label=\"Starter plan\" />"}
                >
                    <div className="w-72">
                        <HeroRadioGroup aria-label="Plan" value={value} onChange={setValue} className="flex flex-col gap-2">
                            <Choice.Radio value="starter" label="Starter plan" showAnatomy />
                        </HeroRadioGroup>
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf — option đã chọn (value của nhóm khớp value của hàng; hàng KHÔNG tự giữ state chọn). */
export const Selected: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("starter")
            return (
                <BlockAnatomy
                    name="Choice.Radio"
                    tier="atom"
                    leaf="Selected"
                    reason="Selection lives on the group's value, not on this row — that's what keeps a set of radios mutually exclusive without each row tracking the others."
                    note="The dot fills when the group's value matches this row's value; nothing else changes."
                    code={"<Choice.Radio value=\"starter\" label=\"Starter plan\" />"}
                >
                    <div className="w-72">
                        <HeroRadioGroup aria-label="Plan" value={value} onChange={setValue} className="flex flex-col gap-2">
                            <Choice.Radio value="starter" label="Starter plan" showAnatomy />
                        </HeroRadioGroup>
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isDisabled` — khoá RIÊNG một hàng (khoá cả nhóm là state của RadioGroup). */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Choice.Radio"
                tier="atom"
                leaf="Prop `isDisabled`"
                reason="One option can be off the table without locking the whole group — a plan tier that's sold out, a slot already taken."
                note="Only this row dims and blocks the pointer; the rest of the group stays interactive."
                code={"<Choice.Radio value=\"starter\" label=\"Starter plan\" isDisabled />"}
            >
                <div className="w-72">
                    <HeroRadioGroup aria-label="Plan" value="starter" onChange={() => {}} className="flex flex-col gap-2">
                        <Choice.Radio value="starter" label="Starter plan" isDisabled showAnatomy />
                    </HeroRadioGroup>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `isSkeleton` — shimmer CO-LOCATED (§12c): dot + thanh nhãn. Không cần radio-context. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Choice.Radio"
                tier="atom"
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the shape owns its resting state, so the row draws its own shimmer — no shared skeleton component to keep in sync."
                note="The shimmer mirrors dot + label width; a group's Loading leaf just stacks several of these."
                code={"<Choice.Radio value=\"\" label=\"\" isSkeleton />"}
            >
                <div className="w-72">
                    <Choice.Radio value="" label="" isSkeleton showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
