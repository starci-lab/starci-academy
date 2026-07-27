import type { Meta, StoryObj } from "@storybook/nextjs"
import { StepBadge, type StepBadgeState, type StepBadgeSize } from "@sb-components/atoms/display/StepBadge/StepBadge"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `StepBadge.Base`: viên tròn đánh số DUY NHẤT cho các luồng nhiều bước.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g — luật của TẦNG ATOM). Mỗi prop có hình một leaf,
 * leaf đó render ĐỦ mọi giá trị prop ấy sinh ra: `state` · `size` · `isSkeleton`.
 * Prop không sinh hình (`className`) KHÔNG có leaf. `number` không có leaf riêng —
 * nó là nội dung tự do (giống `text` của `Chip.Base`), không phải một union hữu hạn.
 *
 * ⭐ 2026-07-26: atom vừa thêm `showAnatomy`/`anatPart` (nhóm E) — gắn
 * `data-anat-part` lên root thật (`"Badge"`), root skeleton (`"Skeleton"`), và
 * bọc icon check khi `state="done"` (`"Icon"`). Ô đầu mỗi leaf dưới đây bật
 * `showAnatomy` để tab Deps của `BlockAnatomy` badge được — leaf `States` bật ở
 * ô `done` (không phải ô đầu tiên theo thứ tự khai) để cùng lúc lộ cả `Badge`
 * lẫn `Icon` trong một cây.
 *
 * ⭐ Vớt state từ hai story CŨ (pre-canon, §12g cấm tách leaf theo GIÁ TRỊ):
 * `.storybook/stories/atoms/display/StepBadge/StepBadge.Base.stories.tsx` bản
 * trước (7 story `Default/Active/Done/Muted/SizeMd/Sequence/Skeleton`) và
 * `.storybook/stories/atoms/identity/StepBadge/StepBadge.stories.tsx` (cùng 7
 * story, đặt sai category — KHÔNG xoá, chỉ vớt). Đối chiếu: `Active`/`Done`/
 * `Muted` → đã có trong union `state` của leaf `States`; `SizeMd` → đã có trong
 * union `size` của leaf `Sizes`; `Sequence` (3 badge liền hàng done→active→muted)
 * → cùng nội dung leaf `States` đã render (khác mỗi cách trình bày, không phải
 * giá trị mới); `Skeleton` → đã có, và bản mới còn render CẢ HAI size (bản cũ
 * chỉ có `sm`) nên bao trọn. Không có state nào của bản cũ bị rơi.
 */

/** Hướng dẫn hiện đầu trang autodocs. Chữ trên UI viết TIẾNG ANH. */
const STEP_BADGE_DOC = `
## State, not colour

A step badge marks where a step sits in a flow, not an arbitrary colour choice.

**\`done\`** swaps the number for a check — the step is behind you.
**\`active\`** is the step the reader is on right now.
**\`muted\`** is a step they have not reached yet.

There is no boolean toggle for the check mark — it only ever appears through
\`state="done"\`, so a badge can never show both a number and a check.

## Sizing

Two sizes, both fixed boxes: \`sm\` (20px) matches the original inline badge this
atom replaces; \`md\` (24px) is for a badge that needs to read at a glance inside a
bigger callout. Size never changes tone or shape, only scale.
`

const meta: Meta<typeof StepBadge.Base> = {
    title: "Atoms/Display/StepBadge/StepBadge.Base",
    component: StepBadge.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: { description: { component: STEP_BADGE_DOC } },
    },
}

export default meta

type Story = StoryObj<typeof StepBadge.Base>

/** Leaf TRẦN — chưa bật prop nào, để thấy hình mặc định (`state="active"`, `size="sm"`). */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="StepBadge.Base"
                tier="atom"
                leaf="Bare badge"
                reason="The one step badge in the system. Every leaf below it differs by exactly one prop, so this is the baseline you compare against."
                note={"Defaults to state=\"active\" at size=\"sm\" (20px) — the shape the hand-rolled badge in GithubTeamGate had before this atom existed."}
                code={"<StepBadge.Base number={1} showAnatomy />"}
            >
                <StepBadge.Base number={1} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** One row of the `state` demo table. */
interface StateRow {
    /** The state value this row demonstrates. */
    state: StepBadgeState
    /** The step number rendered on the badge for this row. */
    number: number
    /** Human-readable meaning of the state, shown next to the demo cell. */
    hint: string
}

/** ĐỦ union `StepBadgeState` — thiếu một giá trị là giá trị đó sẽ mọc thành leaf lạc chỗ. */
const STATES: Array<StateRow> = [
    { state: "done", number: 1, hint: "completed — the number is replaced by a check" },
    { state: "active", number: 2, hint: "the step the reader is on right now" },
    { state: "muted", number: 3, hint: "not reached yet" },
]

/** Leaf prop `state` — VỊ TRÍ trong luồng, render ĐỦ union. */
export const States: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="StepBadge.Base"
                tier="atom"
                leaf="Prop `state`"
                reason="State is where the badge sits in the flow, not a colour pick. Done swaps the number for a check, active reads as the step you are on, muted marks a step you have not reached."
                note="Done and active both fill solid; muted stays on the flat default surface so a row of upcoming steps reads as calm, not as another live colour competing for attention."
                code={`<StepBadge.Base number={1} state="done" showAnatomy />
<StepBadge.Base number={2} state="active" />
<StepBadge.Base number={3} state="muted" />`}
            >
                <div className="flex flex-wrap items-center gap-3">
                    {STATES.map(({ state, number }) => (
                        <StepBadge.Base key={state} number={number} state={state} showAnatomy={state === "done"} />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** One row of the `size` demo table. */
interface SizeRow {
    /** The size value this row demonstrates. */
    size: StepBadgeSize
    /** Human-readable meaning of the size, shown next to the demo cell. */
    hint: string
}

/** ĐỦ union `StepBadgeSize`. */
const SIZES: Array<SizeRow> = [
    { size: "sm", hint: "20px — default, matches inline usage" },
    { size: "md", hint: "24px — reads at a glance in a bigger callout" },
]

/** Leaf prop `size` — render ĐỦ union. */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="StepBadge.Base"
                tier="atom"
                leaf="Prop `size`"
                reason="Size only scales the box, the text, and the check that stands in for a done step — the state logic underneath never changes."
                note={"Both boxes here sit at state=\"active\" so the only thing that moves between them is the box itself."}
                code={`<StepBadge.Base number={2} size="sm" showAnatomy />
<StepBadge.Base number={2} size="md" />`}
            >
                <div className="flex flex-wrap items-center gap-3">
                    {SIZES.map(({ size }, index) => (
                        <StepBadge.Base
                            key={size}
                            number={2}
                            state="active"
                            size={size}
                            showAnatomy={index === 0}
                        />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Leaf prop `isSkeleton` — shimmer CO-LOCATED (§12c), mirrors {@link SIZES} only:
 * once the badge is empty, `state` carries no shape of its own, so there is
 * nothing else to shimmer differently.
 */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="StepBadge.Base"
                tier="atom"
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the shape owns its resting state, so the badge draws its own round shimmer instead of sharing a generic skeleton component."
                note="The shimmer mirrors the same two boxes as the size leaf — a done/active/muted distinction has no shape once the content is gone, so isSkeleton only tracks size."
                code={`<StepBadge.Base isSkeleton size="sm" showAnatomy />
<StepBadge.Base isSkeleton size="md" />`}
            >
                <div className="flex flex-wrap items-center gap-3">
                    {SIZES.map(({ size }, index) => (
                        <StepBadge.Base key={size} isSkeleton size={size} showAnatomy={index === 0} />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}
