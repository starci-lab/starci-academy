import { CaretDownIcon, LockIcon, SparkleIcon, WarningCircleIcon, WarningIcon } from "@phosphor-icons/react"
import React, { useMemo, useState } from "react"
import {
    Button,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownPopover,
    DropdownSection,
    DropdownTrigger,
    ScrollShadow,
    SearchField,
    Separator,
    Tooltip,
    Typography,
    cn,
} from "@heroui/react"
import { AiCategoryChip, AiModelCategory } from "../../chips/AiCategoryChip/AiCategoryChip"
import { FlexWrapButtonRadio } from "../../navigation/FlexWrapButtonRadio/FlexWrapButtonRadio"
import { SelfHostGpuMark } from "../SelfHostGpuMark/SelfHostGpuMark"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — faithful port of
 * `@/components/blocks/grading/GradeModelDropdown`. Authored in Storybook (not
 * `src`); synced to `src` later.
 *
 * NO `@/components` imports — it COMPOSES the local primitives `AiCategoryChip`,
 * `FlexWrapButtonRadio`, and `SelfHostGpuMark` (imported relatively). The
 * `@/modules` enums/types (`ModelProvider`, `AiModelTask`, `AiGradableModel`) are
 * INLINED, the `t(...)` copy is inlined as Vietnamese literals, and the live
 * `useAiModelLatency` socket hook is replaced by a STUB that returns an empty map
 * (the picker's documented "no health chip until the BE ships probes" state) so
 * the block renders in isolation.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export { AiModelCategory }

/** Task a model is suited for (mirrors backend `AiModelTask`). Drives picker visibility. */
export enum AiModelTask {
    Chatting = "chatting",
    Grading = "grading",
    CvGenerating = "cv_generating",
    TaskGrading = "task_grading",
    ChallengeGrading = "challenge_grading",
}

/** Provider serving a model (mirrors backend `ModelProvider`). */
export enum ModelProvider {
    Gemini = "gemini",
    OpenAI = "openai",
    Local = "local",
    OpenRouter = "openrouter",
    Anthropic = "anthropic",
}

/** One selectable model for the grading picker (mirrors backend `AiGradableModelData`). */
export interface AiGradableModel {
    /** Concrete model name (e.g. "gpt-4o"). */
    model: string
    /** Provider serving this model. */
    provider: ModelProvider
    /** Cost/quality category. */
    category: AiModelCategory
    /** Whether the model is usable on the free Auto lane. */
    complimentary: boolean
    /** Whether the model's provider has a working key right now; false → disabled (no key). */
    available: boolean
    /** Tasks this model is suited for — pickers filter by this. */
    supportedTasks: Array<AiModelTask>
}

/** Latest probe outcome for one model — drives the picker health chip. */
export interface ModelHealth {
    /** Whether the latest 1-token probe succeeded. */
    ok: boolean
    /** Round-trip latency (ms) of the latest probe (0 when it failed). */
    latencyMs: number
    /** Short failure reason when the probe failed (shown on hover), else null. */
    errorMessage: string | null
}

/**
 * STORYBOOK STUB of the `useAiModelLatency` socket hook. In `src` this reads the
 * public `aiModelLatency` snapshot + `/system_health` socket; here it degrades to
 * an empty map so the block renders with no live dependency (the picker simply
 * shows no health chip — its documented "empty until BE ships probes" state).
 */
const useAiModelLatency = (): Map<string, ModelHealth> => new Map()

/** Localized category labels (in `src`: `t(\`aiSettings.categories.${category}\`)`). */
const AI_CATEGORY_LABEL: Record<AiModelCategory, string> = {
    [AiModelCategory.Free]: "Miễn phí",
    [AiModelCategory.Economy]: "Tiết kiệm",
    [AiModelCategory.Balanced]: "Cân bằng",
    [AiModelCategory.Premium]: "Cao cấp",
    [AiModelCategory.Frontier]: "Đỉnh",
}

/**
 * Model selection emitted by the picker. `model`/`provider` null = the Auto
 * lane (the balancer picks); a pinned model runs on that model. Structurally
 * matches feature selection types (e.g. ChallengeGradeSelection) so callers
 * pass theirs directly.
 */
export interface GradeModelSelection {
    /** Pinned model name, or null for the Auto lane. */
    model: string | null
    /** Provider of the pinned model, or null for the Auto lane. */
    provider: ModelProvider | null
}

/** Categories that need an unlock (paid OR enrolled) to pick. */
const PLAN_CATEGORIES: ReadonlyArray<AiModelCategory> = [
    AiModelCategory.Balanced,
    AiModelCategory.Premium,
    AiModelCategory.Frontier,
]

/** Category ladder cheapest → strongest — for "below the floor" comparison. */
const CATEGORY_ORDER: ReadonlyArray<AiModelCategory> = [
    AiModelCategory.Free,
    AiModelCategory.Economy,
    AiModelCategory.Balanced,
    AiModelCategory.Premium,
    AiModelCategory.Frontier,
]

/** Tier facet options (incl. the "all" reset). */
const TIER_FILTERS: ReadonlyArray<AiModelCategory | "all"> = [
    "all",
    AiModelCategory.Free,
    AiModelCategory.Economy,
    AiModelCategory.Balanced,
    AiModelCategory.Premium,
    AiModelCategory.Frontier,
]

/**
 * Live health badge on each model row — a green dot + latency (up) or a red dot
 * + "down" (failing probe), styled like the category chip. Driven by the public
 * `aiModelLatency` snapshot + `/system_health` socket; rendered only when data exists.
 */
const ModelHealthChip = ({ ok, latencyMs, errorMessage }: ModelHealth) => {
    const chip = (
        <Chip
            color={ok ? "success" : "danger"}
            variant="soft"
            size="sm"
        >
            <span className={cn("size-1.5 rounded-full", ok ? "bg-success" : "bg-danger")} />
            <Chip.Label>
                {ok ? `${latencyMs}ms` : "Ngưng"}
            </Chip.Label>
        </Chip>
    )

    if (!ok && errorMessage) {
        return (
            <Tooltip>
                <Tooltip.Trigger className="shrink-0 cursor-default">
                    {chip}
                </Tooltip.Trigger>
                <Tooltip.Content>{errorMessage}</Tooltip.Content>
            </Tooltip>
        )
    }

    return <span className="shrink-0">{chip}</span>
}

/** Models self-hosted on StarCi GPU hardware (v1 hardcode; move to catalog later). */
const SELF_HOST_GPU_MODELS = new Set(["qwen2.5-coder:7b"])

const showSelfHostMark = (model: AiGradableModel) =>
    model.provider === ModelProvider.Local && SELF_HOST_GPU_MODELS.has(model.model)

/** Dropdown row width — popover must be bounded or `truncate` never fires. */
const DROPDOWN_POPOVER_CLASS = "w-80 max-w-[calc(100vw-2rem)]"
const DROPDOWN_ITEM_ROW_CLASS = "w-full min-w-0 overflow-hidden"

/**
 * HeroUI's `Select.Indicator` chevron, replicated 1:1 (same 16×16 viewBox + path)
 * so the `isDropdown` trigger's caret is IDENTICAL to the Select dropdowns beside
 * it — `IconChevronDown` is a HeroUI internal, not exported, so we inline its SVG.
 */
const FieldChevronDown = () => (
    <svg aria-hidden="true" fill="none" viewBox="0 0 16 16" className="size-4">
        <path
            clipRule="evenodd"
            fillRule="evenodd"
            fill="currentColor"
            d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06"
        />
    </svg>
)
const MODEL_ROW_TRIGGER_CLASS = "block w-full min-w-0"

/** Model row — name truncates on the left, chips stay pinned on the right. */
const ModelRowLayout = ({
    leading,
    name,
    nameSuffix,
    isSelected,
    muted,
    trailing,
}: {
    leading?: React.ReactNode
    name: string
    nameSuffix?: React.ReactNode
    isSelected?: boolean
    muted?: boolean
    trailing: React.ReactNode
}) => (
    <div
        className={cn(
            "grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2",
            muted && "text-muted",
        )}
    >
        <span className="flex min-w-0 items-center gap-2 overflow-hidden">
            {leading}
            <span
                className={cn("min-w-0 truncate", isSelected && "text-accent-soft-foreground")}
                title={name}
            >
                {name}
            </span>
            {nameSuffix}
        </span>
        <span className="flex shrink-0 items-center justify-end gap-2">{trailing}</span>
    </div>
)

export interface GradeModelDropdownProps {
    /** Enabled models the user can pick from (from the `aiModels` catalog). */
    models: Array<AiGradableModel>
    /** The current lane + model selection. */
    selection: GradeModelSelection
    /**
     * Whether higher-tier models are unlocked for this user (paid OR enrolled —
     * the StarCi rule). Drives the lock on Balanced / Premium / Frontier.
     */
    canPremium: boolean
    /** Disables the whole control (e.g. while a grade is in flight). */
    isDisabled?: boolean
    /**
     * Show the "Auto" lane entry on top. Default true. Pass false where a concrete
     * model is required (e.g. personal-project review must pin a model).
     */
    showAutoLane?: boolean
    /**
     * Recommended minimum category. Any model BELOW it is flagged WARNING (still
     * selectable, but may be inaccurate). Grading passes `Economy` → Free models
     * read a warning; the lesson chatbot omits it (Free is its normal lane).
     */
    floor?: AiModelCategory
    /**
     * Only show models suited for this task (chatting / grading). Models that do
     * not list the task are hidden — e.g. the chat picker passes `chatting` to
     * hide grading-only models. A model with no `supportedTasks` (stale payload)
     * is never hidden. Omit to show every model.
     */
    task?: AiModelTask
    /** Popover placement. Default "bottom start"; pass "top start" for a bottom-anchored composer. */
    placement?: "bottom start" | "top start"
    /**
     * Render the trigger as a standard bordered field-style dropdown button
     * (mirrors HeroUI `Select.Trigger`) instead of the bare inline trigger, so it
     * matches real `Select` fields sitting alongside it.
     */
    isDropdown?: boolean
    /**
     * Render the trigger as a real `Button` (`variant="tertiary"`) instead of the
     * bare inline trigger, so it reads as a button among sibling toggle-button/
     * button-style pickers. Mutually exclusive with `isDropdown`.
     */
    isButton?: boolean
    /**
     * `isButton` only — stretch the trigger `Button` to the full width of its
     * container instead of hugging its label content.
     */
    isButtonFullWidth?: boolean
    /** Fired with the new selection when the user picks an option. */
    onSelect: (selection: GradeModelSelection) => void
    /** Fired when a locked (unlock-required) model is pressed — route to plans. */
    onUpgrade: () => void
    /** Extra classes on the trigger. */
    className?: string
}

/**
 * Shared lane + model picker (grading, AI lab, any model-select surface).
 *
 * Renders the "Auto" lane plus every catalog model (tagged with its cost
 * category chip). Per model:
 * - no working key → DISABLED (warning, not selectable).
 * - Balanced / Premium / Frontier without an unlock → LOCKED (routes to plans).
 * - below the `floor` → SELECTABLE but flagged WARNING (may be inaccurate).
 * - otherwise → normal selectable.
 *
 * @param props - {@link GradeModelDropdownProps}
 */
export const GradeModelDropdown = ({
    models,
    selection,
    canPremium,
    isDisabled = false,
    showAutoLane = true,
    floor,
    task,
    placement = "bottom start",
    isDropdown,
    isButton = false,
    isButtonFullWidth = false,
    onSelect,
    onUpgrade,
    className,
}: GradeModelDropdownProps) => {
    // live per-model health (dot + latency chip on each row); empty until the BE ships it.
    const latency = useAiModelLatency()
    // controlled open so selecting Auto can close the popover on press.
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState("")
    const normalizedQuery = query.trim().toLowerCase()
    // single inline facet: tier. (price/suitability folded away — suitability is
    // now the default, off-task models are hidden, not a toggle.)
    const [tierFilter, setTierFilter] = useState<AiModelCategory | "all">("all")
    // down (unavailable) + off-task models are HIDDEN by default (noise nobody
    // picks); `showHidden` reveals them (rendered disabled / amber-warned as before).
    const [showHidden, setShowHidden] = useState(false)
    const { visibleModels, hiddenCount } = useMemo(() => {
        const visible: Array<AiGradableModel> = []
        let hidden = 0
        for (const model of models) {
            if (normalizedQuery
                && !model.model.toLowerCase().includes(normalizedQuery)) {
                continue
            }
            if (tierFilter !== "all" && model.category !== tierFilter) {
                continue
            }
            const offTask = Boolean(task
                && model.supportedTasks?.length
                && !model.supportedTasks.includes(task))
            if (!model.available || offTask) {
                hidden += 1
                if (!showHidden) {
                    continue
                }
            }
            visible.push(model)
        }
        return { visibleModels: visible, hiddenCount: hidden }
    }, [models, normalizedQuery, tierFilter, task, showHidden])
    // tiers present in the catalog → the inline tier filter only offers real buckets.
    const tierChips = useMemo(() => {
        const present = new Set(models.map((model) => model.category))
        return TIER_FILTERS.filter((tier) => tier === "all" || present.has(tier))
    }, [models])
    // a pinned model shows its name; otherwise the Auto label (or "pick a model"
    // when the Auto lane is hidden and nothing is picked yet)
    const triggerLabel = selection.model
        ?? (showAutoLane ? "Tự động" : "Chọn model")

    return (
        <Dropdown
            isOpen={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open)
                if (!open) {
                    setQuery("")
                    setTierFilter("all")
                    setShowHidden(false)
                }
            }}
        >
            {isButton ? (
                <DropdownTrigger
                    isDisabled={isDisabled}
                    className={cn("cursor-pointer", isButtonFullWidth && "block w-full", className)}
                >
                    <Button variant="tertiary" size="sm" fullWidth={isButtonFullWidth}>
                        <SparkleIcon aria-hidden className="size-4 shrink-0" />
                        <span className={cn("truncate", isButtonFullWidth ? "min-w-0 flex-1 text-left" : "max-w-40")}>
                            {triggerLabel}
                        </span>
                    </Button>
                </DropdownTrigger>
            ) : isDropdown ? (
                // isDropdown → the trigger IS the field (ONE element, exactly like the
                // Select — no inner wrapper div, so no stacked shadow). Every field state
                // (chrome + hover bg/border + focus border + shadow-field) is copied 1:1
                // from `.select__trigger`. `transform-none!` removes BOTH the press-shrink
                // AND the base `transform-gpu` so `shadow-field` matches the Select's on
                // hover. Hover is wired on BOTH `hover:` and `data-[hovered=true]:`.
                <DropdownTrigger
                    isDisabled={isDisabled}
                    className={cn(
                        "relative flex! min-h-9 w-full cursor-pointer items-center rounded-field border border-[color:var(--field-border)] bg-field py-2 pe-7 ps-3 text-sm text-field-foreground shadow-field transform-none!",
                        "hover:bg-field-hover hover:border-[color:var(--field-border-hover)]",
                        "data-[hovered=true]:bg-field-hover data-[hovered=true]:border-[color:var(--field-border-hover)]",
                        "data-[focus-visible=true]:border-[color:var(--field-border-focus)]",
                        className,
                    )}
                >
                    <span className="flex min-w-0 items-center gap-2 overflow-hidden">
                        <SparkleIcon className="size-4 shrink-0" />
                        <span className="truncate">{triggerLabel}</span>
                    </span>
                    <span
                        className={cn(
                            "absolute inset-y-0 end-2 my-auto flex shrink-0 items-center justify-center text-field-placeholder transition duration-150",
                            isOpen && "rotate-180",
                        )}
                    >
                        <FieldChevronDown />
                    </span>
                </DropdownTrigger>
            ) : (
                <DropdownTrigger
                    isDisabled={isDisabled}
                    className={cn("min-w-0 max-w-full cursor-pointer", className)}
                >
                    <div className="flex w-full min-w-0 items-center justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-2 overflow-hidden">
                            <SparkleIcon className="size-4 shrink-0" />
                            <span className="truncate">{triggerLabel}</span>
                        </span>
                        <CaretDownIcon weight="bold" className="size-4 shrink-0" />
                    </div>
                </DropdownTrigger>
            )}
            <DropdownPopover
                placement={placement}
                className={DROPDOWN_POPOVER_CLASS}
            >
                <div className="flex w-full min-w-0 flex-col">
                    {/* Auto lane — above search + scroll so the default is always one click away. */}
                    {showAutoLane ? (
                        <>
                            <DropdownMenu aria-label="Tự động">
                                <DropdownSection>
                                    <DropdownItem
                                        key="auto"
                                        textValue="Tự động"
                                        onPress={() => {
                                            onSelect({
                                                model: null,
                                                provider: null,
                                            })
                                            setIsOpen(false)
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                "flex items-center gap-2",
                                                !selection.model && "text-accent-soft-foreground",
                                            )}
                                        >
                                            <SparkleIcon className="size-4 shrink-0" />
                                            <span>Tự động</span>
                                        </div>
                                    </DropdownItem>
                                </DropdownSection>
                                <Separator />
                            </DropdownMenu>
                        </>
                    ) : null}
                    {/* Search → inline tier filter → list, separated by whitespace only
                    (no divider, no funnel panel). down + off-task hidden by default. */}
                    <div
                        className="px-2"
                        onKeyDownCapture={(event) => event.stopPropagation()}
                    >
                        <SearchField
                            variant="secondary"
                            aria-label="Tìm model"
                        >
                            <SearchField.Group>
                                <SearchField.SearchIcon />
                                <SearchField.Input
                                    placeholder="Tìm model"
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                />
                                {query ? (
                                    <SearchField.ClearButton onPress={() => setQuery("")} />
                                ) : null}
                            </SearchField.Group>
                        </SearchField>
                    </div>
                    {/* tier filter — FlexWrapButtonRadio inside popover surface */}
                    {tierChips.length > 1 ? (
                        <div className="px-2 pt-2">
                            <FlexWrapButtonRadio
                                ariaLabel="Lọc theo hạng"
                                value={tierFilter}
                                onChange={setTierFilter}
                                items={tierChips.map((tier) => ({
                                    value: tier,
                                    content: tier === "all"
                                        ? "Tất cả"
                                        : AI_CATEGORY_LABEL[tier],
                                }))}
                            />
                        </div>
                    ) : null}
                    <ScrollShadow
                        hideScrollBar
                        className="max-h-72 w-full min-w-0"
                    >
                        <DropdownMenu
                            aria-label="Chọn model"
                            className="w-full min-w-0"
                        >
                            {/* One entry per catalog model. Below-floor = warning (selectable,
                        risky); Balanced/Premium/Frontier = locked without an unlock. */}
                            <DropdownSection>
                                {visibleModels.length === 0 ? (
                                    <DropdownItem
                                        key="no-results"
                                        textValue="Không có model khớp"
                                        onPress={() => undefined}
                                    >
                                        <span className="text-muted">Không có model khớp</span>
                                    </DropdownItem>
                                ) : null}
                                {visibleModels.map((model) => {
                                    const key = `${model.provider}:${model.model}`
                                    const isSelected = selection.model === model.model
                                        && selection.provider === model.provider
                                    const categoryChip = <AiCategoryChip category={model.category} />
                                    // live health (right of the category chip); null until probe data arrives
                                    const health = latency.get(model.model)
                                    const healthChip = health
                                        ? <ModelHealthChip ok={health.ok} latencyMs={health.latencyMs} errorMessage={health.errorMessage} />
                                        : null
                                    const selfHostMark = showSelfHostMark(model) ? <SelfHostGpuMark /> : null
                                    const requiresPlan = PLAN_CATEGORIES.includes(model.category)
                                    // below the recommended floor → flag danger (grading: Free is
                                    // below Economy). No floor → never flagged (chatbot runs Free).
                                    const belowFloor = floor !== undefined
                                        && CATEGORY_ORDER.indexOf(model.category) < CATEGORY_ORDER.indexOf(floor)
                                    // not suited for this picker's task → amber warning (still
                                    // selectable at the user's risk), same language as below-floor.
                                    const offTask = Boolean(task
                                        && model.supportedTasks?.length
                                        && !model.supportedTasks.includes(task))
                                    if (!model.available) {
                                        // DISABLED (not locked): model/provider tạm không khả dụng
                                        // (key không hợp lệ / provider down) → icon CẢNH BÁO.
                                        return (
                                            <DropdownItem
                                                key={key}
                                                textValue={model.model}
                                                className={DROPDOWN_ITEM_ROW_CLASS}
                                                onPress={() => undefined}
                                            >
                                                <Tooltip>
                                                    <Tooltip.Trigger className={MODEL_ROW_TRIGGER_CLASS}>
                                                        <ModelRowLayout
                                                            muted
                                                            name={model.model}
                                                            nameSuffix={selfHostMark}
                                                            leading={<WarningCircleIcon className="size-5 shrink-0" />}
                                                            trailing={<>{healthChip}{categoryChip}</>}
                                                        />
                                                    </Tooltip.Trigger>
                                                    <Tooltip.Content>Model tạm không khả dụng</Tooltip.Content>
                                                </Tooltip>
                                            </DropdownItem>
                                        )
                                    }
                                    if (requiresPlan && !canPremium) {
                                        // LOCKED: cần nâng gói HOẶC enroll khoá để mở tier cao.
                                        return (
                                            <DropdownItem
                                                key={key}
                                                textValue={model.model}
                                                className={DROPDOWN_ITEM_ROW_CLASS}
                                                onPress={onUpgrade}
                                            >
                                                <Tooltip>
                                                    <Tooltip.Trigger className={MODEL_ROW_TRIGGER_CLASS}>
                                                        <ModelRowLayout
                                                            muted
                                                            name={model.model}
                                                            nameSuffix={selfHostMark}
                                                            leading={<LockIcon className="size-5 shrink-0" />}
                                                            trailing={<>{healthChip}{categoryChip}</>}
                                                        />
                                                    </Tooltip.Trigger>
                                                    <Tooltip.Content>
                                                        <Typography type="body-sm">Nâng gói hoặc enroll khoá để mở model này</Typography>
                                                    </Tooltip.Content>
                                                </Tooltip>
                                            </DropdownItem>
                                        )
                                    }
                                    if (belowFloor || offTask) {
                                        // WARNING (amber): dưới mức khuyến nghị HOẶC không hợp tác vụ —
                                        // vẫn chọn được nhưng kết quả có thể kém.
                                        return (
                                            <DropdownItem
                                                key={key}
                                                textValue={model.model}
                                                className={DROPDOWN_ITEM_ROW_CLASS}
                                                onPress={() => onSelect({
                                                    model: model.model,
                                                    provider: model.provider,
                                                })}
                                            >
                                                <Tooltip>
                                                    <Tooltip.Trigger className={MODEL_ROW_TRIGGER_CLASS}>
                                                        <ModelRowLayout
                                                            isSelected={isSelected}
                                                            name={model.model}
                                                            nameSuffix={selfHostMark}
                                                            leading={<WarningIcon className="size-5 shrink-0 text-warning-soft-foreground" />}
                                                            trailing={<>{healthChip}{categoryChip}</>}
                                                        />
                                                    </Tooltip.Trigger>
                                                    <Tooltip.Content>
                                                        <Typography type="body-sm" className="text-warning-soft-foreground">
                                                            {belowFloor
                                                                ? "Model dưới mức khuyến nghị — kết quả chấm có thể kém chính xác"
                                                                : "Model không hợp tác vụ này — kết quả có thể kém"}
                                                        </Typography>
                                                    </Tooltip.Content>
                                                </Tooltip>
                                            </DropdownItem>
                                        )
                                    }
                                    return (
                                        <DropdownItem
                                            key={key}
                                            textValue={model.model}
                                            className={DROPDOWN_ITEM_ROW_CLASS}
                                            onPress={() => onSelect({
                                                model: model.model,
                                                provider: model.provider,
                                            })}
                                        >
                                            <ModelRowLayout
                                                isSelected={isSelected}
                                                name={model.model}
                                                nameSuffix={selfHostMark}
                                                trailing={<>{healthChip}{categoryChip}</>}
                                            />
                                        </DropdownItem>
                                    )
                                })}
                            </DropdownSection>
                        </DropdownMenu>
                    </ScrollShadow>
                    {/* escape hatch — reveal the down / off-task models hidden by default */}
                    {hiddenCount > 0 ? (
                        <button
                            type="button"
                            onClick={() => setShowHidden((open) => !open)}
                            className="cursor-pointer px-3 pb-2 pt-1 text-start text-xs text-muted transition-colors hover:text-foreground"
                        >
                            {showHidden
                                ? "Ẩn bớt"
                                : `Hiện ${hiddenCount} model đang ẩn`}
                        </button>
                    ) : null}
                </div>
            </DropdownPopover>
        </Dropdown>
    )
}
