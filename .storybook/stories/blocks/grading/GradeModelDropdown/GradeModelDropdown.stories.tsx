import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import {
    GradeModelDropdown,
    AiModelCategory,
    AiModelTask,
    ModelProvider,
} from "./GradeModelDropdown"
import type { AiGradableModel, GradeModelSelection } from "./GradeModelDropdown"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — the shared model-picker lane (grading, AI lab, any model-select
 * surface): a trigger + a popover that owns Auto lane · search · tier filter ·
 * the model list, plus the per-row disabled / locked / warning states.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — the
 * trigger shape (inline · field · button) and the popover shape (full · no-auto ·
 * locked · warning · empty). There is no separate consolidated "Anatomy" story.
 * This block emits no on-render anchors, so `Sơ đồ` renders clean + a numbered
 * legend (no `showAnatomy`).
 */
const meta: Meta<typeof GradeModelDropdown> = {
    title: "Block/Grading/GradeModelDropdown",
    component: GradeModelDropdown,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof GradeModelDropdown>

/** Plain canvas — each story wraps its render in its own per-leaf BlockAnatomy. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

/** Danh mục model đủ 5 hạng — gpt-4o cố tình "down" (available=false) để minh hoạ hàng bị disable. */
const FULL_CATALOG: Array<AiGradableModel> = [
    {
        model: "qwen2.5-coder:7b",
        provider: ModelProvider.Local,
        category: AiModelCategory.Free,
        complimentary: true,
        available: true,
        supportedTasks: [AiModelTask.Grading, AiModelTask.Chatting],
    },
    {
        model: "gpt-4o-mini",
        provider: ModelProvider.OpenAI,
        category: AiModelCategory.Economy,
        complimentary: false,
        available: true,
        supportedTasks: [AiModelTask.Grading, AiModelTask.Chatting],
    },
    {
        model: "gemini-2.5-flash",
        provider: ModelProvider.Gemini,
        category: AiModelCategory.Balanced,
        complimentary: false,
        available: true,
        supportedTasks: [AiModelTask.Grading],
    },
    {
        model: "gpt-4o",
        provider: ModelProvider.OpenAI,
        category: AiModelCategory.Premium,
        complimentary: false,
        available: false,
        supportedTasks: [AiModelTask.Grading],
    },
    {
        model: "claude-3-7-sonnet",
        provider: ModelProvider.Anthropic,
        category: AiModelCategory.Frontier,
        complimentary: false,
        available: true,
        supportedTasks: [AiModelTask.Grading],
    },
]

/** Giữ state `selection` bằng useState để bấm chọn Auto/model trong popover phản ánh đúng ngoài trigger. */
const Controlled = ({
    models,
    initialSelection,
    canPremium,
    isDisabled = false,
    showAutoLane = true,
    floor,
    task,
    isDropdown,
    isButton = false,
    isButtonFullWidth = false,
}: {
    models: Array<AiGradableModel>
    initialSelection: GradeModelSelection
    canPremium: boolean
    isDisabled?: boolean
    showAutoLane?: boolean
    floor?: AiModelCategory
    task?: AiModelTask
    isDropdown?: boolean
    isButton?: boolean
    isButtonFullWidth?: boolean
}) => {
    const [selection, setSelection] = React.useState<GradeModelSelection>(initialSelection)
    return (
        <GradeModelDropdown
            models={models}
            selection={selection}
            canPremium={canPremium}
            isDisabled={isDisabled}
            showAutoLane={showAutoLane}
            floor={floor}
            task={task}
            isDropdown={isDropdown}
            isButton={isButton}
            isButtonFullWidth={isButtonFullWidth}
            onSelect={setSelection}
            onUpgrade={() => {}}
        />
    )
}

// ── Reusable composition nodes (shared across leaves) ────────────────────────
// The chip cluster pinned on the right of each model row.
const ROW_CHIPS: Array<AnatomyNode> = [
    { name: "SelfHostGpuMark", tier: "primitive", role: "icon GPU cạnh model self-host trên hạ tầng nội bộ" },
    { name: "StatusChip", tier: "primitive", role: "badge health (dot + độ trễ) — rỗng đến khi BE ship probe", state: "empty" },
    { name: "AiCategoryChip", tier: "primitive", role: "chip hạng (tier) tô màu ở cuối mỗi hàng model" },
]

const NORMAL_ROW: AnatomyNode = {
    name: "ModelRowLayout",
    tier: "primitive",
    role: "một hàng model — tên truncate trái, chip ghim phải (lặp ×N)",
    children: ROW_CHIPS,
}

const LOCKED_ROW: AnatomyNode = {
    name: "ModelRowLayout",
    tier: "primitive",
    role: "hàng model tier cao — không chọn được, bấm → nâng gói",
    state: "locked",
    children: [
        { name: "LockIcon", tier: "primitive", role: "dấu khoá ở đầu hàng chưa mở gói" },
        ...ROW_CHIPS,
    ],
}

const WARN_ROW: AnatomyNode = {
    name: "ModelRowLayout",
    tier: "primitive",
    role: "hàng model dưới floor — vẫn chọn được nhưng có thể kém chính xác",
    state: "warning",
    children: [
        { name: "WarningIcon", tier: "primitive", role: "dấu cảnh báo model dưới mức khuyến nghị" },
        ...ROW_CHIPS,
    ],
}

const EMPTY_ROW: AnatomyNode = {
    name: "DropdownItem · rỗng",
    tier: "primitive",
    role: '"Không có model khớp" khi danh sách trống',
    state: "empty",
}

const SEARCH_NODE: AnatomyNode = { name: "SearchField", tier: "primitive", role: "ô tìm model trong popover" }
const TIER_FILTER_NODE: AnatomyNode = { name: "FlexWrapButtonRadio", tier: "primitive", role: "cụm pill lọc theo hạng (tier)" }
const AUTO_LANE_NODE: AnatomyNode = { name: "DropdownItem · Tự động", tier: "primitive", role: 'lane "Tự động" ghim đầu — balancer tự chọn model' }

const scroll = (rows: Array<AnatomyNode>): AnatomyNode => ({
    name: "ScrollShadow",
    tier: "primitive",
    role: "vùng cuộn danh sách model (max-h)",
    children: rows,
})

const popover = (children: Array<AnatomyNode>): AnatomyNode => ({
    name: "DropdownPopover",
    tier: "primitive",
    role: "bảng popover: auto lane + tìm + lọc theo hạng + danh sách model",
    children,
})

const TRIGGER_INLINE: AnatomyNode = { name: "DropdownTrigger", tier: "primitive", role: "trigger inline — Sparkle + nhãn + CaretDown", state: "inline" }
const TRIGGER_FIELD: AnatomyNode = { name: "DropdownTrigger", tier: "primitive", role: "trigger field-style (viền + nền field) khớp Select cạnh nó", state: "field" }
const TRIGGER_BUTTON: AnatomyNode = { name: "Button", tier: "primitive", role: "trigger là Button tertiary — Sparkle + nhãn", state: "button" }

// ── Per-leaf PARTS sets ──────────────────────────────────────────────────────
// content — inline trigger + full popover (normal selectable rows).
const INLINE_PARTS: Array<AnatomyNode> = [
    TRIGGER_INLINE,
    popover([AUTO_LANE_NODE, SEARCH_NODE, TIER_FILTER_NODE, scroll([NORMAL_ROW])]),
]

// field-style trigger — same popover, trigger swapped to match Select fields beside it.
const FIELD_PARTS: Array<AnatomyNode> = [
    TRIGGER_FIELD,
    popover([AUTO_LANE_NODE, SEARCH_NODE, TIER_FILTER_NODE, scroll([NORMAL_ROW])]),
]

// button trigger — same popover, trigger is a real Button (tertiary).
const BUTTON_PARTS: Array<AnatomyNode> = [
    TRIGGER_BUTTON,
    popover([AUTO_LANE_NODE, SEARCH_NODE, TIER_FILTER_NODE, scroll([NORMAL_ROW])]),
]

// no auto lane — trigger ghim model cụ thể, popover bỏ lane "Tự động".
const NO_AUTO_PARTS: Array<AnatomyNode> = [
    TRIGGER_INLINE,
    popover([SEARCH_NODE, TIER_FILTER_NODE, scroll([NORMAL_ROW])]),
]

// locked — hàng tier cao hiện dấu khoá (LockIcon), bấm → nâng gói.
const LOCKED_PARTS: Array<AnatomyNode> = [
    TRIGGER_INLINE,
    popover([AUTO_LANE_NODE, SEARCH_NODE, TIER_FILTER_NODE, scroll([LOCKED_ROW])]),
]

// below-floor — hàng dưới mức khuyến nghị hiện dấu cảnh báo (WarningIcon).
const WARN_PARTS: Array<AnatomyNode> = [
    TRIGGER_INLINE,
    popover([AUTO_LANE_NODE, SEARCH_NODE, TIER_FILTER_NODE, scroll([WARN_ROW])]),
]

// empty catalog — không có model: pill lọc biến mất, danh sách rơi về dòng rỗng.
const EMPTY_PARTS: Array<AnatomyNode> = [
    TRIGGER_INLINE,
    popover([AUTO_LANE_NODE, SEARCH_NODE, scroll([EMPTY_ROW])]),
]

/** INLINE — the bare inline trigger + full popover (the default composition). */
export const DefaultTrigger: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="GradeModelDropdown"
                tier="block"
                leaf="Trigger inline"
                parts={INLINE_PARTS}
                reason="Picker lane + model dùng chung cho mọi surface AI (chấm bài, AI lab). Gói search + lọc theo hạng (FlexWrapButtonRadio) + mỗi hàng model có chip hạng (AiCategoryChip), dấu self-host (SelfHostGpuMark), badge health, và các trạng thái disabled/locked/warning vào MỘT block — feature chỉ truyền catalog + selection, không phải tự dựng lại toàn bộ logic khoá gói / dưới-floor / hợp-tác-vụ ở mỗi màn."
            >
                <Controlled
                    models={FULL_CATALOG}
                    initialSelection={{ model: null, provider: null }}
                    canPremium
                />
            </BlockAnatomy>,
        ),
}

/** FIELD — trigger rendered as a bordered field (isDropdown), same popover. */
export const FieldTrigger: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="GradeModelDropdown"
                tier="block"
                leaf="Trigger field"
                parts={FIELD_PARTS}
                note="Trigger đổi sang field-style (viền + nền field) để khớp Select cạnh nó — popover giữ nguyên composition."
            >
                <Controlled
                    models={FULL_CATALOG}
                    initialSelection={{ model: null, provider: null }}
                    canPremium
                    isDropdown
                />
            </BlockAnatomy>,
        ),
}

/** BUTTON — trigger rendered as a real Button (isButton), same popover. */
export const ButtonTrigger: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="GradeModelDropdown"
                tier="block"
                leaf="Trigger button"
                parts={BUTTON_PARTS}
                note="Trigger là Button tertiary để hoà vào cụm nút cạnh nó — popover giữ nguyên composition."
            >
                <Controlled
                    models={FULL_CATALOG}
                    initialSelection={{ model: null, provider: null }}
                    canPremium
                    isButton
                />
            </BlockAnatomy>,
        ),
}

/** BUTTON FULL-WIDTH — the Button trigger stretched to its container. */
export const ButtonFullWidth: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="GradeModelDropdown"
                tier="block"
                leaf="Trigger button full-width"
                parts={BUTTON_PARTS}
                note="CÙNG composition với 'Trigger button' — Button chỉ giãn full-width theo container (w-64)."
            >
                <div className="w-64">
                    <Controlled
                        models={FULL_CATALOG}
                        initialSelection={{ model: null, provider: null }}
                        canPremium
                        isButton
                        isButtonFullWidth
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** NO AUTO — showAutoLane=false + a pinned model → popover drops the Auto lane. */
export const NoAutoLanePinned: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="GradeModelDropdown"
                tier="block"
                leaf="Không auto — đã ghim"
                parts={NO_AUTO_PARTS}
                note="showAutoLane=false → popover BỎ lane 'Tự động'; trigger hiện tên model đã ghim thay vì 'Tự động'."
            >
                <Controlled
                    models={FULL_CATALOG}
                    initialSelection={{ model: "gemini-2.5-flash", provider: ModelProvider.Gemini }}
                    canPremium
                    showAutoLane={false}
                />
            </BlockAnatomy>,
        ),
}

/** LOCKED — canPremium=false → tier-cao rows get a lock + route to plans. */
export const LockedModels: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="GradeModelDropdown"
                tier="block"
                leaf="Khoá gói"
                parts={LOCKED_PARTS}
                note="Chưa mở gói → hàng Balanced/Premium/Frontier thêm LockIcon, không chọn được, bấm → nâng gói."
            >
                <Controlled
                    models={FULL_CATALOG}
                    initialSelection={{ model: null, provider: null }}
                    canPremium={false}
                />
            </BlockAnatomy>,
        ),
}

/** WARNING — floor=Economy → below-floor models get an amber warning icon. */
export const BelowFloorWarning: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="GradeModelDropdown"
                tier="block"
                leaf="Cảnh báo dưới floor"
                parts={WARN_PARTS}
                note="floor=Economy → model dưới mức thêm WarningIcon: vẫn chọn được nhưng cảnh báo có thể kém chính xác."
            >
                <Controlled
                    models={FULL_CATALOG}
                    initialSelection={{ model: null, provider: null }}
                    canPremium
                    floor={AiModelCategory.Economy}
                />
            </BlockAnatomy>,
        ),
}

/** EMPTY — an empty catalog → no tier filter, list falls to the empty row. */
export const EmptyCatalog: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="GradeModelDropdown"
                tier="block"
                leaf="Catalog rỗng"
                parts={EMPTY_PARTS}
                note="models=[] → pill lọc theo hạng biến mất (không đủ bucket), danh sách rơi về dòng 'Không có model khớp'."
            >
                <Controlled
                    models={[]}
                    initialSelection={{ model: null, provider: null }}
                    canPremium
                />
            </BlockAnatomy>,
        ),
}

/** DISABLED — isDisabled → the whole control is inert (popover never opens). */
export const DisabledControl: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="GradeModelDropdown"
                tier="block"
                leaf="Vô hiệu hoá"
                parts={INLINE_PARTS}
                note="CÙNG composition với 'Trigger inline' — isDisabled chỉ khoá tương tác (popover không mở), trigger giữ model đã ghim."
            >
                <Controlled
                    models={FULL_CATALOG}
                    initialSelection={{ model: "gpt-4o-mini", provider: ModelProvider.OpenAI }}
                    canPremium
                    isDisabled
                />
            </BlockAnatomy>,
        ),
}
