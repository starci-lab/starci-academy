import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    KeepGoingPath,
    type KeepGoingContent,
} from "@sb-components/blocks/learn/KeepGoingPath/KeepGoingPath"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `KeepGoingPath.Base`: đường học tiếp của **chương hiện tại**.
 *
 * Cố ý KHÔNG vẽ lại cây module đầy đủ — cây đó sống ở rail trái, vẽ hai lần là hai
 * nguồn sự thật. Ở đây chỉ trả lời "đang ở đâu + bài kế là gì".
 *
 * BLOCK SỞ HỮU hình: icon trạng thái (play/check/circle) · chip độ khó · ổ khoá.
 * Caller chỉ đưa DỮ LIỆU — không node, không class.
 *
 * 📐 **MỘT LEAF** (§11f + §14d.2): mọi biến thể dưới đây dùng CHUNG một cây DOM
 * (`SurfaceCard.List` → rows), chỉ khác nội dung ⇒ đều là **STATE**, render trong
 * cùng một leaf. Trước đó trò tách `AllRead`/`AllDifficulties`/`Bordered` thành
 * story riêng — sai, vì không cái nào làm mất/thêm node.
 */
const meta: Meta<typeof KeepGoingPath.Base> = {
    title: "Blocks/Learn/KeepGoingPath.Base",
    component: KeepGoingPath.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof KeepGoingPath.Base>

const MIXED: Array<KeepGoingContent> = [
    { id: "l1", title: "Docker là gì", minutes: 6, state: "done", difficulty: "beginner", onPress: () => {} },
    { id: "l2", title: "Viết Dockerfile tối ưu", minutes: 12, state: "active", difficulty: "intermediate", onPress: () => {} },
    { id: "l3", title: "Multi-stage build", minutes: 9, state: "todo", difficulty: "advanced", locked: true, onPress: () => {} },
    { id: "l4", title: "Tự viết Operator", minutes: 22, state: "todo", difficulty: "insane", locked: true, onPress: () => {} },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard.List": {
        storyId: "layouts-cards-surfacecard-surfacecard-list--default",
        tier: "primitive",
        role: "khung + nhịp hàng — dùng CHUNG với LearnNudges, không đẻ đường render thứ hai",
    },
    "VariantChip.Difficulty": {
        storyId: "designs-chips-variantchip-difficulty--levels",
        tier: "design",
        role: "vai độ khó — ramp 4 bậc, không phải token trạng thái",
    },
}

/**
 * Leaf duy nhất — render **MỘT** khung, đủ biến thể bên trong: 3 trạng thái bài
 * (đã xong · đang học · chưa học) · đủ 4 bậc độ khó · bài khoá.
 *
 * ⛔ KHÔNG render hai bản để khoe `bordered` (thầy chốt 2026-07-26): app KHÔNG có
 * ca surface-in-surface ⇒ `bordered` là case BỊA. Block không bịa case cho đủ bộ.
 */
export const Path: Story = {
    render: () => (
        <div className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
            <BlockAnatomy
                name="KeepGoingPath.Base"
                tier="block"
                leaf="Đường học tiếp"
                parts={[]}
                annotate={ANNOTATE}
                note="Bốn bậc độ khó + ba trạng thái + bài khoá — đủ biến thể trong MỘT khung."
            >
                <KeepGoingPath.Base
                    anatPart="SurfaceCard.List"
                    showAnatomy
                    moduleTitle="Chương 2 · Container hoá"
                    contents={MIXED}
                />
            </BlockAnatomy>
        </div>
    ),
}
