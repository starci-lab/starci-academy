import type { Meta, StoryObj } from "@storybook/nextjs"
import { LearnNudges, type LearnNudge } from "@sb-components/blocks/learn/LearnNudges/LearnNudges"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `LearnNudges.Base`: việc nên làm hôm nay.
 *
 * §14b — caller chỉ đưa `kind` (ENUM), **block sở hữu bảng `kind → icon`**. Screen
 * không được biết "ôn thẻ" trông ra sao; nếu prop là `leadingIcon` thì screen lại
 * phải cầm atom ⇒ thủng luật.
 *
 * Đi CÙNG layout `SurfaceCard.List` với `KeepGoingPath` — hai cụm trông giống nhau
 * thì phải chung một đường render.
 *
 * 📐 **MỘT LEAF** (§14d.2): đủ-3-việc · một-việc · đang-chờ · bordered đều dùng CHUNG
 * cây `SurfaceCard.List` ⇒ **STATE**, không tách story.
 */
const meta: Meta<typeof LearnNudges.Base> = {
    title: "Blocks/Learn/LearnNudges.Base",
    component: LearnNudges.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LearnNudges.Base>

const NUDGES: Array<LearnNudge> = [
    { id: "flashcards", kind: "flashcards", title: "Ôn 12 thẻ đến hạn hôm nay", onPress: () => {} },
    { id: "mock-interview", kind: "interview", title: "Luyện phỏng vấn cho capstone", onPress: () => {} },
    { id: "league", kind: "league", title: "Bạn đang hạng #42 tuần này", onPress: () => {} },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard.List": {
        storyId: "layouts-cards-surfacecard-surfacecard-list--default",
        tier: "primitive",
        role: "khung + nhịp hàng — CÙNG layout với KeepGoingPath",
    },
}

/**
 * Leaf duy nhất — đủ 3 loại việc, ca chỉ-một-việc, và state **đang chờ**.
 *
 * `pending` neo bug thật (src ghi 2026-07-12): `dueSwr`/`leaderboardSwr` resolve SAU
 * `outline` nên trong lúc chờ, `dueCount`/`rank` mặc định 0/null → block từng
 * `return null` rồi bật lại ⇒ **dải NHẤP NHÁY**. State này giữ CHỖ để hết nháy.
 */
export const Nudges: Story = {
    render: () => (
        <div className="mx-auto max-w-3xl p-8">
            <BlockAnatomy
                name="LearnNudges.Base"
                tier="block"
                leaf="Việc nên làm"
                parts={[]}
                annotate={ANNOTATE}
                note="Gạch của `pending` đổ thẳng vào `items` — vẫn MỘT đường render, không nhánh vẽ khung thứ hai."
            >
                <div className="flex flex-col gap-6">
                    <LearnNudges.Base
                        anatPart="SurfaceCard.List"
                        showAnatomy
                        items={NUDGES}
                    />
                    <LearnNudges.Base items={[NUDGES[0]]} />
                    <LearnNudges.Base items={[]} isPending />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
