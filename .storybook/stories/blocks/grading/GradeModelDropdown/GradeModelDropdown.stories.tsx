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
 * Each leaf passes `showAnatomy` (via `Controlled`) so the block emits
 * `data-anat-part` anchors and `Sơ đồ` badges the parts on-render (a few
 * cross-file atoms — AiCategoryChip, SelfHostGpuMark, FlexWrapButtonRadio — stay
 * legend-only since tagging them would need editing another primitive).
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
    showAnatomy = true,
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
    showAnatomy?: boolean
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
            showAnatomy={showAnatomy}
            onSelect={setSelection}
            onUpgrade={() => {}}
        />
    )
}

// ── Reusable composition nodes (shared across leaves) ────────────────────────
// PARTS mirror the REAL DOM `GradeModelDropdown` renders (see the component .tsx):
//   Dropdown → DropdownTrigger + DropdownPopover
//     DropdownPopover → [auto lane · search · tier filter · list · reveal-hidden]
//       auto lane  = DropdownMenu > DropdownSection > DropdownItem + Separator
//       list       = ScrollShadow > DropdownMenu > DropdownSection > DropdownItem…
//       each row   = DropdownItem > (Tooltip > Tooltip.Trigger >) ModelRowLayout
// NOTE: the storybook `useAiModelLatency` stub returns an empty map, so the health
// StatusChip is NEVER mounted here — it is intentionally absent from these parts.

// Chips/marks pinned inside a model row (right = category chip; name-suffix = self-host).
const CATEGORY_CHIP: AnatomyNode = { name: "AiCategoryChip", tier: "design", role: "chip hạng (tier) tô màu ghim cuối hàng (trailing)" }
const SELF_HOST_MARK: AnatomyNode = { name: "SelfHostGpuMark", tier: "design", role: "dấu GPU self-host — CHỈ hàng model chạy hạ tầng nội bộ (nameSuffix)", state: "self-host" }

// Normal selectable row — DropdownItem wrapping the ModelRowLayout.
const NORMAL_ROW: AnatomyNode = {
    name: "DropdownItem",
    tier: "primitive",
    role: "hàng model bấm-chọn (lặp ×N)",
    children: [
        {
            name: "ModelRowLayout",
            tier: "design",
            role: "layout hàng — tên truncate trái, chip ghim phải",
            children: [SELF_HOST_MARK, CATEGORY_CHIP],
        },
    ],
}

// Locked row — tier cao chưa mở gói: DropdownItem > Tooltip.Trigger(row) + Tooltip.Content.
// NOTE: the outer `<Tooltip>` (HeroUI TooltipRoot) is CUT from the tree — it delegates to
// react-aria's `TooltipTrigger` primitive, a context-only wrapper that never renders a DOM
// node, so `data-anat-part` passed to it lands nowhere; Tooltip.Trigger + Tooltip.Content are
// the real emitters (each forwards props onto an actual DOM element) and are direct children here.
const LOCKED_ROW: AnatomyNode = {
    name: "DropdownItem.Locked",
    tier: "primitive",
    role: "hàng tier cao — không chọn được, bấm → nâng gói",
    state: "locked",
    children: [
        {
            name: "Tooltip.Trigger",
            tier: "primitive",
            role: "vùng hover bọc hàng — giải thích vì sao khoá",
            children: [
                {
                    name: "ModelRowLayout",
                    tier: "design",
                    role: "layout hàng — muted, không chọn được; tự hiện dấu khoá đầu hàng (leading)",
                    children: [CATEGORY_CHIP],
                },
            ],
        },
        { name: "Tooltip.Content", tier: "primitive", role: "'Nâng gói hoặc enroll khoá để mở model này'" },
    ],
}

// Below-floor row — vẫn chọn được nhưng cảnh báo: cùng shape, icon amber. (Tooltip root cut — see LOCKED_ROW note.)
const WARN_ROW: AnatomyNode = {
    name: "DropdownItem.Warning",
    tier: "primitive",
    role: "hàng dưới floor — vẫn chọn được nhưng có thể kém chính xác",
    state: "warning",
    children: [
        {
            name: "Tooltip.Trigger",
            tier: "primitive",
            role: "vùng hover bọc hàng — giải thích cảnh báo",
            children: [
                {
                    name: "ModelRowLayout",
                    tier: "design",
                    role: "layout hàng — vẫn chọn được; tự hiện dấu cảnh báo model dưới mức khuyến nghị (leading)",
                    children: [SELF_HOST_MARK, CATEGORY_CHIP],
                },
            ],
        },
        { name: "Tooltip.Content", tier: "primitive", role: "'Model dưới mức khuyến nghị — kết quả có thể kém chính xác'" },
    ],
}

// Disabled/down row — provider tạm mất kết nối (key lỗi / down): HIDDEN by default (folds
// into hiddenCount), only reachable after pressing REVEAL_HIDDEN ("Hiện N ẩn"). Same shape as
// LOCKED/WARN (Tooltip root cut — see LOCKED_ROW note). FULL_CATALOG's gpt-4o is this row's
// real instance (not self-host) so no SELF_HOST_MARK child here.
const DISABLED_ROW: AnatomyNode = {
    name: "DropdownItem.Disabled",
    tier: "primitive",
    role: "model tạm mất kết nối (key lỗi / provider down) — không chọn được — ẨN mặc định, hiện qua REVEAL_HIDDEN",
    state: "disabled",
    children: [
        {
            name: "Tooltip.Trigger",
            tier: "primitive",
            role: "vùng hover bọc hàng — giải thích vì sao không khả dụng",
            children: [
                {
                    name: "ModelRowLayout",
                    tier: "design",
                    role: "layout hàng — muted, không chọn được; tự hiện dấu cảnh báo model tạm mất kết nối (leading)",
                    children: [CATEGORY_CHIP],
                },
            ],
        },
        { name: "Tooltip.Content", tier: "primitive", role: "'Model tạm không khả dụng'" },
    ],
}

// Empty catalog row — DropdownItem wrapping a muted text span.
const EMPTY_ROW: AnatomyNode = {
    name: "DropdownItem.Empty",
    tier: "primitive",
    role: "dòng rỗng khi danh sách trống — tự hiện 'Không có model khớp' (muted)",
    state: "empty",
}

// Auto lane pinned atop the popover — its own DropdownMenu/Section/Item + Separator.
const AUTO_LANE: AnatomyNode = {
    name: "DropdownMenu.Auto",
    tier: "primitive",
    role: "menu ghim lane 'Tự động' đầu popover",
    children: [
        {
            name: "DropdownSection",
            tier: "primitive",
            role: "nhóm mục trong menu",
            children: [
                {
                    name: "DropdownItem.Auto",
                    tier: "primitive",
                    role: "lane 'Tự động' — balancer tự chọn model; tự hiện SparkleIcon + nhãn 'Tự động'",
                },
            ],
        },
        { name: "Separator", tier: "primitive", role: "ngăn lane auto với phần tìm/lọc" },
    ],
}

const SEARCH_NODE: AnatomyNode = { name: "SearchField", tier: "primitive", role: "ô tìm model trong popover" }
const TIER_FILTER_NODE: AnatomyNode = { name: "FlexWrapButtonRadio", tier: "primitive", role: "cụm pill lọc theo hạng (tier) — ẩn khi < 2 bucket" }
const REVEAL_HIDDEN: AnatomyNode = { name: "Button.RevealHidden", tier: "primitive", role: "nút lộ model đang ẩn (down / off-task) — CHỈ khi hiddenCount > 0" }

// list = ScrollShadow > DropdownMenu > DropdownSection > rows.
const listMenu = (rows: Array<AnatomyNode>): AnatomyNode => ({
    name: "ScrollShadow",
    tier: "primitive",
    role: "vùng cuộn danh sách model (max-h-72)",
    children: [
        {
            name: "DropdownMenu.ModelList",
            tier: "primitive",
            role: "menu danh sách model",
            children: [
                {
                    name: "DropdownSection",
                    tier: "primitive",
                    role: "nhóm mục trong menu",
                    children: rows,
                },
            ],
        },
    ],
})

const popover = (children: Array<AnatomyNode>): AnatomyNode => ({
    name: "DropdownPopover",
    tier: "primitive",
    role: "bảng popover (flex-col): auto lane + tìm + lọc hạng + danh sách + nút lộ ẩn",
    children,
})

const TRIGGER_INLINE: AnatomyNode = { name: "DropdownTrigger", tier: "primitive", role: "trigger inline — Sparkle + nhãn + CaretDown", state: "inline" }
const TRIGGER_FIELD: AnatomyNode = { name: "DropdownTrigger", tier: "primitive", role: "trigger field-style (viền + nền field) khớp Select cạnh nó — Sparkle + nhãn + FieldChevronDown", state: "field" }
// Button trigger — DropdownTrigger WRAPS a real Button (tertiary), not a bare Button.
const TRIGGER_BUTTON: AnatomyNode = {
    name: "DropdownTrigger",
    tier: "primitive",
    role: "trigger bọc Button",
    state: "button",
    children: [
        { name: "Button", tier: "primitive", role: "Button tertiary — Sparkle + nhãn, hoà vào cụm nút cạnh nó" },
    ],
}

// ── Per-leaf PARTS sets ──────────────────────────────────────────────────────
// content — inline trigger + full popover (normal selectable rows). FULL_CATALOG
// has 1 unavailable model → hiddenCount=1 → the reveal-hidden button renders.
const INLINE_PARTS: Array<AnatomyNode> = [
    TRIGGER_INLINE,
    popover([AUTO_LANE, SEARCH_NODE, TIER_FILTER_NODE, listMenu([NORMAL_ROW, DISABLED_ROW]), REVEAL_HIDDEN]),
]

// field-style trigger — same popover, trigger swapped to match Select fields beside it.
const FIELD_PARTS: Array<AnatomyNode> = [
    TRIGGER_FIELD,
    popover([AUTO_LANE, SEARCH_NODE, TIER_FILTER_NODE, listMenu([NORMAL_ROW, DISABLED_ROW]), REVEAL_HIDDEN]),
]

// button trigger — same popover, trigger is DropdownTrigger > Button (tertiary).
const BUTTON_PARTS: Array<AnatomyNode> = [
    TRIGGER_BUTTON,
    popover([AUTO_LANE, SEARCH_NODE, TIER_FILTER_NODE, listMenu([NORMAL_ROW, DISABLED_ROW]), REVEAL_HIDDEN]),
]

// no auto lane — trigger ghim model cụ thể, popover bỏ lane "Tự động".
const NO_AUTO_PARTS: Array<AnatomyNode> = [
    TRIGGER_INLINE,
    popover([SEARCH_NODE, TIER_FILTER_NODE, listMenu([NORMAL_ROW, DISABLED_ROW]), REVEAL_HIDDEN]),
]

// locked — canPremium=false: Free/Economy stay normal, Balanced/Frontier turn LOCKED.
const LOCKED_PARTS: Array<AnatomyNode> = [
    TRIGGER_INLINE,
    popover([AUTO_LANE, SEARCH_NODE, TIER_FILTER_NODE, listMenu([NORMAL_ROW, LOCKED_ROW, DISABLED_ROW]), REVEAL_HIDDEN]),
]

// below-floor — floor=Economy: the Free (self-host) row turns WARNING, rest stay normal.
const WARN_PARTS: Array<AnatomyNode> = [
    TRIGGER_INLINE,
    popover([AUTO_LANE, SEARCH_NODE, TIER_FILTER_NODE, listMenu([WARN_ROW, NORMAL_ROW, DISABLED_ROW]), REVEAL_HIDDEN]),
]

// empty catalog — models=[]: no tier filter (< 2 bucket), no reveal (hiddenCount=0),
// list falls to the empty row.
const EMPTY_PARTS: Array<AnatomyNode> = [
    TRIGGER_INLINE,
    popover([AUTO_LANE, SEARCH_NODE, listMenu([EMPTY_ROW])]),
]

/** INLINE — the bare inline trigger + full popover (the default composition). */
export const DefaultTrigger: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="GradeModelDropdown"
                tier="block"
                leaf="InlineTrigger"
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
                leaf="FieldTrigger"
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
                leaf="ButtonTrigger"
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
                leaf="ButtonFullWidth"
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
                leaf="NoAutoLanePinned"
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
                leaf="LockedModels"
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
                leaf="BelowFloorWarning"
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
                leaf="EmptyCatalog"
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
                leaf="DisabledControl"
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
