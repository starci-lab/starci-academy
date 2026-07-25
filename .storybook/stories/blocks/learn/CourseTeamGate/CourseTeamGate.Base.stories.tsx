import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseTeamGate } from "@sb-components/blocks/learn/CourseTeamGate/CourseTeamGate"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `CourseTeamGate.Base`: nhắc vào GitHub team của khoá.
 *
 * 🔴 **ĐỐI TƯỢNG = NGƯỜI ĐÃ MUA.** Backend scope team theo `is_enrolled = true`, nên
 * chưa mua thì không có team nào để vào. Block **tự ẩn** với trial và với người đã ở
 * trong team — screen không phải hỏi (§14b).
 *
 * ⚠️ Bản screen dựng 2026-07-25 từng gate NGƯỢC (`viewer === "trial"`). Hai leaf dưới
 * đây khoá chặt đúng chiều để không lật lại lần nữa.
 *
 * 📐 **HAI LEAF** (§14d.2): "hiện" và "ẩn" khác nhau về CẤU TRÚC (có node vs rỗng).
 * Còn hai lý do ẩn (trial · đã-trong-team) cho ra CÙNG cây rỗng ⇒ là STATE của cùng
 * một leaf, không tách hai story.
 */
const meta: Meta<typeof CourseTeamGate.Base> = {
    title: "Blocks/Learn/CourseTeamGate.Base",
    component: CourseTeamGate.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CourseTeamGate.Base>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Feedback.Callout": {
        storyId: "layouts-feedback-feedback-feedback-callout--default",
        tier: "primitive",
        role: "toàn bộ HÌNH đến từ khung này — block chỉ đặt nội dung + điều kiện ẩn",
    },
}

const leafShell = (leaf: string, node: ReactNode, note?: ReactNode) => (
    <div className="mx-auto max-w-3xl p-8">
        <BlockAnatomy
            name="CourseTeamGate.Base"
            tier="block"
            leaf={leaf}
            parts={[]}
            annotate={ANNOTATE}
            note={note}
        >
            {node}
        </BlockAnatomy>
    </div>
)

/** LEAF — ĐÃ MUA + chưa vào team ⇒ hiện cảnh báo. Leaf duy nhất có node. */
export const Warning: Story = {
    render: () =>
        leafShell(
            "Đã mua, chưa vào team",
            <CourseTeamGate.Base
                anatPart="Feedback.Callout"
                showAnatomy
                isEnrolled
                isInTeam={false}
                onJoin={() => {}}
            />,
        ),
}

/**
 * LEAF — **tự ẩn**, cây rỗng. Hai lý do cùng cho ra kết quả này:
 * trial (chưa mua thì làm gì có team) · đã ở trong team (nhắc nữa là phiền).
 */
export const Hidden: Story = {
    render: () =>
        leafShell(
            "Tự ẩn",
            <div className="flex flex-col gap-2">
                <CourseTeamGate.Base isEnrolled={false} isInTeam={false} onJoin={() => {}} />
                <CourseTeamGate.Base isEnrolled isInTeam onJoin={() => {}} />
            </div>,
            "Không part nào — im lặng là hợp đồng nghiệp vụ, không phải lỗi.",
        ),
}
