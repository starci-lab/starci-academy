import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Choice } from "@sb-components/atoms/forms/Choice/Choice"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Choice.RadioGroup`: nhóm chọn-một, dựng từ `options` DỮ LIỆU (bọc HeroUI
 * RadioGroup + lặp `Choice.Radio` cho mỗi option).
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). Bộ leaf đủ prop CÓ HÌNH: đã chọn hay chưa (`Default`/
 * `Selected`, đến từ `value`) · `groupLabel` (`WithLabel`) · `hint` (`WithHint`) ·
 * `isRequired` (`Required`) · `isDisabled` (`Disabled`) · `errorMessage` (`Error`) ·
 * `isSkeleton` (`Loading`). `options`/`onValueChange`/`ariaLabel`/`skeletonRows`/
 * `className`/`showAnatomy` không có leaf riêng.
 *
 * ⛔ KHÔNG lặp state của TỪNG hàng (`Choice.Radio`'s own Disabled/Loading — §12f):
 * khoá một option riêng lẻ hay skeleton một hàng lẻ đọc ở story `Choice.Radio`.
 *
 * ⚠️⭐ DEPS — GAP đã ghi nhận, chưa bật được (đọc kỹ trước khi thêm lại `annotate`):
 * `Choice.RadioGroup` GỌI HÀM `ChoiceRadio` thật để dựng từng hàng (xem
 * `Choice.tsx`), nhưng component đó KHÔNG có prop kiểu `anatPart` để đổi tên
 * `data-anat-part` phát ra (khác `ButtonBase`/`AvatarGroup`, nơi cụm CÓ đường dây
 * này — xem `ButtonGroup.tsx` truyền `anatPart="Button.Base"` xuống mỗi
 * `ButtonBase`). Vì vậy mỗi hàng option chỉ phát ra `Control`/`Label` — hai khe NỘI
 * BỘ giống hệt tên dùng trong chính story `Choice.Radio` — DOM không có node nào
 * tên `"Radio"`/`"Choice.Radio"` để khoá `storyId` vào. Gắn `storyId` lên
 * `Control`/`Label` ở đây sẽ SAI: hai key đó ở ba file `Choice.*` còn lại đều là khe
 * (không link), gắn link riêng cho mỗi RadioGroup là không nhất quán và IM LẶNG sai
 * nếu ai đó đọc nhầm là "Control = cả hàng Radio". Do đó bỏ hẳn `annotate` ở đây,
 * KHÔNG bịa key — xem `issues` của lượt sửa này để bật dây `anatPart` ở `Choice.tsx`
 * trước khi thêm lại.
 *
 * ✍️ Chữ hiện trên panel (`leaf`/`reason`/`note`/`code`) và nhãn demo trong khung
 * render viết TIẾNG ANH; JSDoc/comment giữ tiếng Việt.
 */
const meta: Meta<typeof Choice.RadioGroup> = {
    title: "Atoms/Forms/Choice/Choice.RadioGroup",
    component: Choice.RadioGroup,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Choice.RadioGroup>

const OPTIONS = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
]

/** Leaf TRẦN — nhóm 3 lựa chọn, chưa chọn cái nào, không heading. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="Choice.RadioGroup"
                    tier="atom"
                    leaf="No prop turned on"
                    reason="The one radio-group atom in the system, wrapping HeroUI RadioGroup. It rebuilds one Choice.Radio per entry from options — data, not JSX children, so a caller can't mismatch a row's shape with the rest."
                    note="No heading, no hint, no error — just the rows."
                    code={"<Choice.RadioGroup value={value} onValueChange={setValue} options={OPTIONS} ariaLabel=\"Skill level\" />"}
                >
                    <div className="w-72">
                        <Choice.RadioGroup value={value} onValueChange={setValue} options={OPTIONS} ariaLabel="Skill level" showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf — đã chọn một option (value khớp options[].value). */
export const Selected: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("intermediate")
            return (
                <BlockAnatomy
                    name="Choice.RadioGroup"
                    tier="atom"
                    leaf="Selected"
                    reason="value is controlled — the caller owns which option is picked and hands it back through onValueChange, so the group never drifts from the form state around it."
                    note="Exactly one row's dot fills; the group enforces mutual exclusion, no row tracks the others itself."
                    code={"<Choice.RadioGroup value=\"intermediate\" onValueChange={setValue} options={OPTIONS} ariaLabel=\"Skill level\" />"}
                >
                    <div className="w-72">
                        <Choice.RadioGroup value={value} onValueChange={setValue} options={OPTIONS} ariaLabel="Skill level" showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `groupLabel` — heading TRÊN nhóm (map vào FieldFrame label). */
export const WithLabel: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="Choice.RadioGroup"
                    tier="atom"
                    leaf="Prop `groupLabel`"
                    reason="A group of options usually needs one line saying what they're options FOR — groupLabel is that line, sitting above every row."
                    note="Without groupLabel the group still needs an accessible name, which is what ariaLabel is for — the two aren't the same prop."
                    code={"<Choice.RadioGroup value={value} onValueChange={setValue} options={OPTIONS} groupLabel=\"Current skill level\" />"}
                >
                    <div className="w-72">
                        <Choice.RadioGroup
                            value={value}
                            onValueChange={setValue}
                            options={OPTIONS}
                            groupLabel="Current skill level"
                            showAnatomy
                        />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `hint` — dòng mô tả phụ dưới heading, qua FieldFrame. */
export const WithHint: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="Choice.RadioGroup"
                    tier="atom"
                    leaf="Prop `hint`"
                    reason="A choice with a downstream effect gets a sentence, not just a heading — hint stays visible below the label whatever the reader picks."
                    note="Requires groupLabel to sit under — a hint with no heading above it reads as floating text."
                    code={"<Choice.RadioGroup value={value} onValueChange={setValue} options={OPTIONS} groupLabel=\"Skill level\" hint=\"Used to personalize your learning path.\" />"}
                >
                    <div className="w-72">
                        <Choice.RadioGroup
                            value={value}
                            onValueChange={setValue}
                            options={OPTIONS}
                            groupLabel="Current skill level"
                            hint="Used to personalize your learning path."
                            showAnatomy
                        />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isRequired` — dấu `*` gắn vào heading. */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="Choice.RadioGroup"
                    tier="atom"
                    leaf="Prop `isRequired`"
                    reason="Some questions can't be skipped — the asterisk on the heading flags that before the reader tries to move on."
                    note="The mark rides on groupLabel, so it only shows once the group has a heading to attach to."
                    code={"<Choice.RadioGroup value={value} onValueChange={setValue} options={OPTIONS} groupLabel=\"Skill level\" isRequired />"}
                >
                    <div className="w-72">
                        <Choice.RadioGroup
                            value={value}
                            onValueChange={setValue}
                            options={OPTIONS}
                            groupLabel="Current skill level"
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

/** Leaf prop `isDisabled` — khoá CẢ nhóm. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Choice.RadioGroup"
                tier="atom"
                leaf="Prop `isDisabled`"
                reason="A whole question can be off the table — a step the reader hasn't unlocked yet, a field pre-filled and locked by policy."
                note="Forwarded to every row at once: all dots and labels dim, every row blocks the pointer."
                code={"<Choice.RadioGroup isDisabled value=\"beginner\" onValueChange={setValue} options={OPTIONS} ariaLabel=\"Skill level\" />"}
            >
                <div className="w-72">
                    <Choice.RadioGroup
                        value="beginner"
                        onValueChange={() => {}}
                        options={OPTIONS}
                        ariaLabel="Skill level"
                        isDisabled
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `errorMessage` — heading + viền lỗi cả nhóm + dòng lỗi đỏ, qua FieldFrame. */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="Choice.RadioGroup"
                    tier="atom"
                    leaf="Prop `errorMessage`"
                    reason="A required choice left blank is easy to miss on a long form — the red border and the line beneath the group stop the eye at the exact question that needs an answer."
                    note="Setting errorMessage flips the whole group invalid on its own; there's no separate isInvalid to remember."
                    code={"<Choice.RadioGroup value={value} onValueChange={setValue} options={OPTIONS} groupLabel=\"Skill level\" errorMessage=\"Please choose a skill level.\" />"}
                >
                    <div className="w-72">
                        <Choice.RadioGroup
                            value={value}
                            onValueChange={setValue}
                            options={OPTIONS}
                            groupLabel="Current skill level"
                            errorMessage="Please choose your current skill level."
                            showAnatomy
                        />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isSkeleton` — shimmer CO-LOCATED (§12c): stack dot + thanh nhãn. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Choice.RadioGroup"
                tier="atom"
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the shape owns its resting state, so the group draws its own shimmer — no shared skeleton component to keep in sync."
                note="Row count follows options.length by default (override with skeletonRows), so the group doesn't jump when the real rows land."
                code={"<Choice.RadioGroup value=\"\" onValueChange={setValue} options={OPTIONS} isSkeleton />"}
            >
                <div className="w-72">
                    <Choice.RadioGroup value="" onValueChange={() => {}} options={OPTIONS} isSkeleton showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
