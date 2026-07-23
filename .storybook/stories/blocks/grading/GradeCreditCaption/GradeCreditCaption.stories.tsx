import type { Meta, StoryObj } from "@storybook/nextjs"
import { GradeCreditCaption } from "./GradeCreditCaption"
import type { GradeCreditUsage } from "./GradeCreditCaption"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — the ONE shared credit caption sitting under every model picker. It is
 * just text (+ an optional warning icon), optionally wrapped in a pressable that
 * opens the quota-details modal.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes —
 * there is no separate consolidated "Anatomy" story. The caption emits no
 * anchors (raw text + icon), so `Sơ đồ` is a clean render + numbered legend.
 */
const meta: Meta<typeof GradeCreditCaption> = {
    title: "Design/Grading/GradeCreditCaption",
    component: GradeCreditCaption,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof GradeCreditCaption>

/** Plain canvas for each leaf's anatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

/** Còn nhiều credit trong cả hai khung giờ. */
const plentyUsage: GradeCreditUsage = {
    credit: { remaining5h: 10, remainingWeek: 42, limitWeek: 60 },
}

/** Sắp cạn credit tuần (dưới mức một lượt Auto) nhưng khung 5h vẫn còn dư. */
const lowWeekUsage: GradeCreditUsage = {
    credit: { remaining5h: 2, remainingWeek: 2, limitWeek: 60 },
}

/** Vừa dồn hết khung 5h nhưng credit tuần vẫn còn dư dả. */
const burstOnlyUsage: GradeCreditUsage = {
    credit: { remaining5h: 2, remainingWeek: 40, limitWeek: 150 },
}

/** Credit tuần đã về 0 — dùng cho case model pin và case chưa biết chi phí Auto. */
const emptyUsage: GradeCreditUsage = {
    credit: { remaining5h: 0, remainingWeek: 0, limitWeek: 20 },
}

// MUTED shape — pressable wraps a plain muted usage line, no warning icon.
// Shared by every "còn credit / không cảnh báo" leaf that stays interactive.
const MUTED_PARTS: Array<AnatomyNode> = [
    { name: "Pressable · button", tier: "primitive", role: "bọc caption, bấm mở modal chi tiết quota" },
    { name: "Typography · text", tier: "primitive", role: 'dòng "Còn N/M credit tuần này" (muted)' },
]

// WARNING shape — same pressable, but body becomes icon + đỏ warning text when
// the Auto lane can't afford the next run (hết tuần vs dồn hết khung 5h).
const WARNING_PARTS: Array<AnatomyNode> = [
    { name: "Pressable · button", tier: "primitive", role: "bọc caption, bấm mở modal chi tiết quota" },
    { name: "WarningCircleIcon", tier: "primitive", role: "icon cảnh báo khi pool không đủ chi trả lượt Auto (phosphor)", state: "warning" },
    { name: "Typography · text", tier: "primitive", role: "dòng cảnh báo đỏ, nói ĐÚNG lý do (hết tuần / dồn hết khung 5h)", state: "danger" },
]

// STATIC shape — no onOpenDetails → the pressable wrapper drops, just a bare span.
const STATIC_PARTS: Array<AnatomyNode> = [
    { name: "Typography · text", tier: "primitive", role: 'dòng "Còn N/M credit tuần này" (muted, KHÔNG bọc pressable)' },
]

// LOADING shape — creditUsage null → the caption returns null (renders nothing).
const LOADING_PARTS: Array<AnatomyNode> = []

export const Loading: Story = {
    name: "Đang tải",
    render: () =>
        shell(
            <BlockAnatomy
                name="GradeCreditCaption"
                tier="design"
                leaf="Đang tải"
                parts={LOADING_PARTS}
                note="creditUsage null (chưa có snapshot) → caption return null, KHÔNG render gì — không phần tử nào."
            >
                <div className="flex flex-col gap-2">
                    <div className="flex h-6 items-center rounded border border-dashed border-default px-2 text-xs text-muted">
                        (không render gì — creditUsage null)
                    </div>
                    <GradeCreditCaption
                        creditUsage={null}
                        hasPinnedModel={false}
                        autoCreditCost={10}
                        onOpenDetails={() => {}}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

export const PlentyCredit: Story = {
    name: "Còn nhiều credit",
    render: () =>
        shell(
            <BlockAnatomy
                name="GradeCreditCaption"
                tier="design"
                leaf="Còn nhiều credit"
                parts={MUTED_PARTS}
                reason="Dòng caption leaf dùng chung dưới mọi model picker: hiện pool credit tuần cho cả lane Auto lẫn model pin (đều trừ chung một pool), đổi sang dòng cảnh báo đỏ khi lane Auto không còn đủ — và nói ĐÚNG lý do (hết tuần vs dồn hết khung 5h). Không cấu thành từ Primitives/* (chỉ text + icon), nên đúng ra là Primitive hơn Block (xem FLAGS)."
            >
                <GradeCreditCaption
                    creditUsage={plentyUsage}
                    hasPinnedModel={false}
                    autoCreditCost={5}
                    onOpenDetails={() => {}}
                />
            </BlockAnatomy>,
        ),
}

export const BlockedByWeek: Story = {
    name: "Chặn: hết tuần",
    render: () =>
        shell(
            <BlockAnatomy
                name="GradeCreditCaption"
                tier="design"
                leaf="Chặn: hết tuần"
                parts={WARNING_PARTS}
                note="Pool tuần dưới chi phí Auto → thêm WarningCircleIcon + text đỏ, khác composition leaf 'còn credit'."
            >
                <GradeCreditCaption
                    creditUsage={lowWeekUsage}
                    hasPinnedModel={false}
                    autoCreditCost={5}
                    onOpenDetails={() => {}}
                />
            </BlockAnatomy>,
        ),
}

export const BlockedByBurst: Story = {
    name: "Chặn: dồn khung 5h",
    render: () =>
        shell(
            <BlockAnatomy
                name="GradeCreditCaption"
                tier="design"
                leaf="Chặn: dồn khung 5h"
                parts={WARNING_PARTS}
                note="Khung 5h cạn nhưng tuần còn dư → CÙNG shape cảnh báo, chỉ đổi câu lý do."
            >
                <GradeCreditCaption
                    creditUsage={burstOnlyUsage}
                    hasPinnedModel={false}
                    autoCreditCost={5}
                    onOpenDetails={() => {}}
                />
            </BlockAnatomy>,
        ),
}

export const PinnedModelNoWarning: Story = {
    name: "Model pin, không cảnh báo",
    render: () =>
        shell(
            <BlockAnatomy
                name="GradeCreditCaption"
                tier="design"
                leaf="Model pin, không cảnh báo"
                parts={MUTED_PARTS}
                note="hasPinnedModel → bỏ qua check afford, luôn là dòng muted dù pool = 0; CÙNG composition leaf 'còn credit'."
            >
                <GradeCreditCaption
                    creditUsage={emptyUsage}
                    hasPinnedModel
                    autoCreditCost={5}
                    onOpenDetails={() => {}}
                />
            </BlockAnatomy>,
        ),
}

export const UnknownAutoCost: Story = {
    name: "Chưa biết chi phí Auto",
    render: () =>
        shell(
            <BlockAnatomy
                name="GradeCreditCaption"
                tier="design"
                leaf="Chưa biết chi phí Auto"
                parts={MUTED_PARTS}
                note="autoCreditCost undefined → không đủ dữ kiện để cảnh báo, giữ dòng muted; CÙNG composition leaf 'còn credit'."
            >
                <GradeCreditCaption
                    creditUsage={emptyUsage}
                    hasPinnedModel={false}
                    autoCreditCost={undefined}
                    onOpenDetails={() => {}}
                />
            </BlockAnatomy>,
        ),
}

export const Interactive: Story = {
    name: "Bấm mở chi tiết",
    render: () =>
        shell(
            <BlockAnatomy
                name="GradeCreditCaption"
                tier="design"
                leaf="Bấm mở chi tiết"
                parts={MUTED_PARTS}
                note="Có onOpenDetails → caption là pressable mở modal; CÙNG composition leaf 'còn credit'."
            >
                <GradeCreditCaption
                    creditUsage={plentyUsage}
                    hasPinnedModel={false}
                    autoCreditCost={5}
                    onOpenDetails={() => {}}
                />
            </BlockAnatomy>,
        ),
}

export const StaticNoDetails: Story = {
    name: "Tĩnh, không bấm",
    render: () =>
        shell(
            <BlockAnatomy
                name="GradeCreditCaption"
                tier="design"
                leaf="Tĩnh, không bấm"
                parts={STATIC_PARTS}
                note="Không truyền onOpenDetails → bỏ lớp Pressable, chỉ còn span tĩnh; composition khác leaf 'bấm mở chi tiết'."
            >
                <GradeCreditCaption
                    creditUsage={plentyUsage}
                    hasPinnedModel={false}
                    autoCreditCost={5}
                />
            </BlockAnatomy>,
        ),
}
