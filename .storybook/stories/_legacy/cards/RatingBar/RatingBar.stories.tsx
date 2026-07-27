import type { Meta, StoryObj } from "@storybook/nextjs"
import { RatingBar } from "@sb-components/_legacy/blocks/cards/RatingBar/RatingBar"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and wraps its render in
 * its OWN BlockAnatomy reflecting the parts THAT leaf composes — there is no
 * separate consolidated "Anatomy" story. RatingBar directly composes, per tile:
 * a Label (the grade text), a `StatusChip` (the 1–4 keyboard-shortcut number),
 * and an optional `Typography` hint (next-interval preview) — the tile grid +
 * pressable chrome itself is `GroupPressableCard`'s own anatomy, not drilled here.
 */
const meta: Meta<typeof RatingBar> = {
    title: "Legacy/Block/Cards/RatingBar",
    component: RatingBar,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof RatingBar>

/** Bốn mức nhớ SM-2 kèm số ngày ôn lại tiếp theo, dùng ngay dưới mặt sau thẻ flashcard. */
const gradesWithInterval = [
    { grade: 0, label: "Quên", hint: "10 phút" },
    { grade: 1, label: "Khó", hint: "1 ngày" },
    { grade: 2, label: "Tốt", hint: "3 ngày" },
    { grade: 3, label: "Dễ", hint: "7 ngày" },
]

/** Cùng bốn mức nhưng chưa có lịch sử ôn tập của thẻ nên chưa tính được ngày kế tiếp. */
const gradesWithoutInterval = [
    { grade: 0, label: "Quên" },
    { grade: 1, label: "Khó" },
    { grade: 2, label: "Tốt" },
    { grade: 3, label: "Dễ" },
]

// Every tile: label + shortcut-number chip + (optional) next-interval hint.
const LABEL: AnatomyNode = { name: "Label", tier: "composite", role: "nhãn mức nhớ (Quên/Khó/Tốt/Dễ)" }
const STATUS_CHIP: AnatomyNode = { name: "StatusChip", tier: "composite", role: "số phím tắt 1–4 (tone neutral)" }
const HINT: AnatomyNode = { name: "Typography", tier: "composite", role: "khoảng lặp kế tiếp (vd '3 ngày')" }

/** With hint — every tile shows its next-interval preview. */
const PARTS_WITH_HINT: Array<AnatomyNode> = [LABEL, STATUS_CHIP, HINT]
/** Without hint — new card, no review history yet, so no interval to show. */
const PARTS_NO_HINT: Array<AnatomyNode> = [LABEL, STATUS_CHIP]
/** Loading — each tile's Label/StatusChip/hint mirrored as Skeleton stand-ins. */
const PARTS_SKELETON: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "composite", role: "khung nhãn mức nhớ", state: "skeleton" },
    { name: "Skeleton", tier: "composite", role: "khung số phím tắt", state: "skeleton" },
]

/**
 * Mặc định — có hint khoảng lặp. Dùng khi thẻ đã có lịch sử ôn tập: mỗi mức hiện
 * luôn số ngày tới lần ôn kế tiếp để người học cân nhắc trước khi chọn.
 */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="RatingBar"
                tier="block"
                leaf="Default"
                parts={PARTS_WITH_HINT}
                reason="Mỗi ô SM-2 gói 3 tín hiệu: nhãn mức nhớ, số phím tắt 1–4 (StatusChip), và khoảng lặp kế tiếp — grid + chrome pressable đến từ GroupPressableCard (anatomy riêng của nó)."
            >
                <RatingBar
                    options={gradesWithInterval}
                    onRate={() => {}}
                    ariaLabel="Chọn mức độ nhớ"
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Không có hint — thẻ mới. Thẻ chưa từng được ôn nên chưa tính được khoảng lặp kế
 * tiếp; bar vẫn hoạt động đầy đủ, chỉ ẩn dòng hint.
 */
export const NoHint: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="RatingBar"
                tier="block"
                leaf="NoHint"
                parts={PARTS_NO_HINT}
                note="Thẻ mới chưa có lịch sử ôn — hint không truyền → dòng Typography khoảng lặp không render, biến mất khỏi cây."
            >
                <RatingBar
                    options={gradesWithoutInterval}
                    onRate={() => {}}
                    ariaLabel="Chọn mức độ nhớ"
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Đang gửi điểm (isPending). Bật khi request chấm điểm đang chạy — khoá cả bốn ô để
 * người học không bấm chồng lệnh trong lúc chờ.
 */
export const Pending: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="RatingBar"
                tier="block"
                leaf="Pending"
                parts={PARTS_WITH_HINT}
                note="isPending → cùng composition với Default, chỉ khoá press (isDisabled xuống GroupPressableCard); không đổi cây."
            >
                <RatingBar
                    options={gradesWithInterval}
                    onRate={() => {}}
                    ariaLabel="Chọn mức độ nhớ"
                    isPending
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Skeleton mirror (isSkeleton). Bật khi dữ liệu thẻ/khoảng lặp chưa sẵn sàng — giữ
 * đúng lưới + khung ô, chỉ thay nhãn/chip/hint bằng bar chờ.
 */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="RatingBar"
                tier="block"
                leaf="Loading"
                parts={PARTS_SKELETON}
                note="isSkeleton → mỗi tile đổi Label/StatusChip thật sang Skeleton tương ứng, giữ đúng lưới + khung ô."
            >
                <RatingBar
                    options={gradesWithInterval}
                    onRate={() => {}}
                    ariaLabel="Chọn mức độ nhớ"
                    isSkeleton
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Container hẹp — co về 2 cột. Dưới 384px container tự co về lưới 2x2 thay vì 4 ô dẹt
 * một hàng, tránh dòng hint bị bể chữ.
 */
export const NarrowContainer: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-72">
                <BlockAnatomy
                    name="RatingBar"
                    tier="block"
                    leaf="NarrowContainer"
                    parts={PARTS_WITH_HINT}
                    note="Container hẹp (<384px) tự co về lưới 2×2 — CÙNG composition với Default, chỉ đổi số cột."
                >
                    <RatingBar
                        options={gradesWithInterval}
                        onRate={() => {}}
                        ariaLabel="Chọn mức độ nhớ"
                        showAnatomy
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}
