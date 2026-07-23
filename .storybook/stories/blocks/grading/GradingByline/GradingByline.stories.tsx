import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip, Typography } from "@heroui/react"
import { ModelByline, VerdictIcon } from "./GradingByline"
import { AiModelCategory } from "../../chips/AiCategoryChip/AiCategoryChip"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — the grading attribution pair reused across the result card / drawer /
 * history rows: `ModelByline` (sparkle + plain model name + tier chip) and
 * `VerdictIcon` (đạt / không đạt glyph).
 *
 * ANATOMY IS PER-LEAF: each demo below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story. This pair emits no anchors, so the
 * `Sơ đồ` tab decodes the parts through its numbered legend alone.
 */
const meta: Meta<typeof ModelByline> = {
    title: "Design/Grading/GradingByline",
    component: ModelByline,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ModelByline>

/** Plain canvas for each leaf's anatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

// Verdict glyph + label leaf (pass/fail share this composition — only tone/text differ).
// Real DOM: a flex-row span WRAPS the glyph + label — they are siblings INSIDE it.
const VERDICT_PARTS: Array<AnatomyNode> = [
    {
        name: "span · dòng verdict",
        tier: "primitive",
        role: "hàng inline gom glyph + nhãn kết quả",
        children: [
            { name: "VerdictIcon", tier: "primitive", role: "glyph đạt (check xanh) / không đạt (x đỏ)" },
            { name: "Typography", tier: "primitive", role: "nhãn kết quả đứng cạnh glyph" },
        ],
    },
]

// Verdict-inside-chip leaf: the glyph + label wrapped in a soft result Chip.
const VERDICT_CHIP_PARTS: Array<AnatomyNode> = [
    {
        name: "Chip",
        tier: "primitive",
        role: "vỏ chip kết quả (success / danger · soft)",
        children: [
            { name: "VerdictIcon", tier: "primitive", role: "glyph đạt / không đạt" },
            { name: "Chip.Label", tier: "primitive", role: "nhãn kết quả trong chip" },
        ],
    },
]

// Full byline leaf: ModelByline emits a fragment — [sparkle + plain model name] grouped in a
// row span, then AiCategoryChip as a SIBLING beside that span (withLabel is text-only, same shape).
const BYLINE_PARTS: Array<AnatomyNode> = [
    {
        name: "ModelByline",
        tier: "design",
        role: "nửa attribution của cặp: sparkle + tên model + chip hạng",
        children: [
            {
                name: "span · dòng attribution",
                tier: "primitive",
                role: "gom sparkle + tên model plain-text (chip đứng NGOÀI span này)",
                children: [
                    { name: "SparkleIcon", tier: "primitive", role: "icon accent mở dòng attribution" },
                    { name: "Model text", tier: "primitive", role: "tên model plain-text (không chip, không mono)" },
                ],
            },
            { name: "AiCategoryChip", tier: "design", role: "chip hạng model — sibling của dòng text trong fragment" },
        ],
    },
]

// Byline without tier: no `category` → AiCategoryChip is absent (composition differs).
const BYLINE_NO_CHIP_PARTS: Array<AnatomyNode> = [
    {
        name: "ModelByline",
        tier: "design",
        role: "nửa attribution: sparkle + tên model (không hạng)",
        children: [
            {
                name: "span · dòng attribution",
                tier: "primitive",
                role: "gom sparkle + tên model plain-text",
                children: [
                    { name: "SparkleIcon", tier: "primitive", role: "icon accent mở dòng attribution" },
                    { name: "Model text", tier: "primitive", role: "tên model plain-text (không hạng → không chip)" },
                ],
            },
        ],
    },
]

// Empty leaf: model=null → ModelByline renders NOTHING (returns null); the dashed frame holds
// only a placeholder line. The frame is the real container; ModelByline emits no part.
const BYLINE_EMPTY_PARTS: Array<AnatomyNode> = [
    {
        name: "div · khung gạch",
        tier: "primitive",
        role: "frame viền gạch (dashed) chứa dòng placeholder — ModelByline trả null nên không có part",
        children: [
            { name: "Typography", tier: "primitive", role: "dòng chú thích placeholder khi model=null" },
        ],
    },
]

export const VerdictPass: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="GradingByline"
                tier="design"
                leaf="Đạt"
                parts={VERDICT_PARTS}
                note="Glyph check xanh + nhãn 'Đạt' — leaf verdict tối giản dùng lại ở dòng lịch sử."
            >
                <span className="flex items-center gap-2" data-anat-part="span · dòng verdict">
                    <VerdictIcon pass showAnatomy />
                    <Typography type="body-sm" data-anat-part="Typography">Đạt</Typography>
                </span>
            </BlockAnatomy>,
        ),
}

export const VerdictFail: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="GradingByline"
                tier="design"
                leaf="Không đạt"
                parts={VERDICT_PARTS}
                note="Cùng composition với leaf 'Đạt', chỉ đổi tone glyph (x đỏ) + nhãn 'Không đạt'."
            >
                <span className="flex items-center gap-2" data-anat-part="span · dòng verdict">
                    <VerdictIcon pass={false} showAnatomy />
                    <Typography type="body-sm" data-anat-part="Typography">Không đạt</Typography>
                </span>
            </BlockAnatomy>,
        ),
}

export const VerdictInChipPass: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="GradingByline"
                tier="design"
                leaf="Chip đạt"
                parts={VERDICT_CHIP_PARTS}
                note="Glyph + nhãn bọc trong Chip soft — leaf khác 'Đạt' vì thêm vỏ Chip + Chip.Label."
            >
                <Chip color="success" variant="soft" size="sm" data-anat-part="Chip">
                    <VerdictIcon pass showAnatomy />
                    <Chip.Label data-anat-part="Chip.Label">Đạt</Chip.Label>
                </Chip>
            </BlockAnatomy>,
        ),
}

export const VerdictInChipFail: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="GradingByline"
                tier="design"
                leaf="Chip không đạt"
                parts={VERDICT_CHIP_PARTS}
                note="Cùng composition với 'Chip đạt', đổi màu Chip sang danger + nhãn 'Không đạt'."
            >
                <Chip color="danger" variant="soft" size="sm" data-anat-part="Chip">
                    <VerdictIcon pass={false} showAnatomy />
                    <Chip.Label data-anat-part="Chip.Label">Không đạt</Chip.Label>
                </Chip>
            </BlockAnatomy>,
        ),
}

export const BylineWithLabel: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="GradingByline"
                tier="design"
                leaf="Có nhãn + hạng"
                parts={BYLINE_PARTS}
                reason="Gom hai mảnh attribution chấm bài dùng lại khắp result card / drawer / dòng lịch sử: ModelByline (sparkle + tên model plain-text + AiCategoryChip theo hạng) và VerdictIcon (đạt/không đạt). Quy tắc 'text rồi chip bên cạnh' được gói sẵn để mọi surface hiển thị model đã chấm nhất quán, không tự ghép lại chip-cạnh-chip."
            >
                <div className="flex flex-wrap items-center gap-2">
                    <ModelByline model="qwen2.5-coder-32b" category={AiModelCategory.Balanced} withLabel showAnatomy />
                </div>
            </BlockAnatomy>,
        ),
}

export const BylineNoLabel: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="GradingByline"
                tier="design"
                leaf="Không nhãn + hạng"
                parts={BYLINE_PARTS}
                note="Bỏ tiền tố 'Đã chấm bởi' — chỉ khác nội dung text, CÙNG composition với leaf 'Có nhãn + hạng'."
            >
                <div className="flex flex-wrap items-center gap-2">
                    <ModelByline model="claude-sonnet-4-5" category={AiModelCategory.Frontier} showAnatomy />
                </div>
            </BlockAnatomy>,
        ),
}

export const BylineNoTierChip: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="GradingByline"
                tier="design"
                leaf="Không chip hạng"
                parts={BYLINE_NO_CHIP_PARTS}
                note="Không truyền `category` → AiCategoryChip vắng mặt, composition thiếu chip hạng."
            >
                <div className="flex flex-wrap items-center gap-2">
                    <ModelByline model="llama-3.1-8b-instruct" showAnatomy />
                </div>
            </BlockAnatomy>,
        ),
}

export const BylineEmpty: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="GradingByline"
                tier="design"
                leaf="Rỗng (model=null)"
                parts={BYLINE_EMPTY_PARTS}
                note="model=null → ModelByline không render gì; khung chấm gạch chỉ chứa dòng chú thích placeholder."
            >
                <div className="flex min-h-6 items-center gap-2 rounded-lg border border-dashed border-default px-3" data-anat-part="div · khung gạch">
                    <Typography type="body-xs" color="muted" data-anat-part="Typography">
                        (không render gì — model=null)
                    </Typography>
                    <ModelByline model={null} category={AiModelCategory.Economy} withLabel showAnatomy />
                </div>
            </BlockAnatomy>,
        ),
}
