"use client"

import { CaretDownIcon, FunnelIcon, LockIcon, SparkleIcon, WarningCircleIcon, WarningIcon } from "@phosphor-icons/react"
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
    Switch,
    Tooltip,
    Typography,
    cn
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import { AiMode } from "@/modules/api/graphql/queries/query-my-ai-settings"
import type { ModelProvider } from "@/modules/api/graphql/queries/query-my-ai-settings"
import { AiModelCategory, AiModelTask } from "@/modules/api/graphql/queries/query-ai-models"
import { type AiGradableModel } from "@/modules/api/graphql/queries/types/ai-models"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { AiCategoryChip } from "@/components/blocks/chips/AiCategoryChip"
import { useAiModelLatency, type ModelHealth } from "@/hooks/socketio/useAiModelLatency"

/**
 * Lane + model selection emitted by the picker. `model`/`provider` null = the
 * Auto lane (the balancer picks). Structurally matches feature selection types
 * (e.g. ChallengeGradeSelection) so callers pass theirs directly.
 */
export interface GradeModelSelection {
    /** Lane to run on (Auto = balancer-picked, Premium = pinned model). */
    mode: AiMode
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

/** Price facet of the funnel filter. */
type PriceFilter = "all" | "free" | "paid"

/** Tier facet options (incl. the "all" reset). */
const TIER_FILTERS: ReadonlyArray<AiModelCategory | "all"> = [
    "all",
    AiModelCategory.Free,
    AiModelCategory.Economy,
    AiModelCategory.Balanced,
    AiModelCategory.Premium,
    AiModelCategory.Frontier,
]

/** Price facet options + their i18n key suffix under `aiSettings.*`. */
const PRICE_FILTERS: ReadonlyArray<{ value: PriceFilter, labelKey: string }> = [
    {
        value: "all",
        labelKey: "filterAll",
    },
    {
        value: "free",
        labelKey: "filterFree",
    },
    {
        value: "paid",
        labelKey: "filterPaid",
    },
]

/** Small pill toggle used in the funnel filter panel (tier / price facets). */
const FilterChip = ({
    active,
    label,
    onPress,
}: {
    active: boolean
    label: string
    onPress: () => void
}) => (
    <button
        type="button"
        onClick={onPress}
        className={cn(
            "cursor-pointer rounded-full border px-3 py-1 text-xs transition-colors",
            active
                ? "border-accent bg-accent/10 text-accent"
                : "border-default text-muted hover:bg-default",
        )}
    >
        {label}
    </button>
)

/**
 * Live health badge on each model row — a green dot + latency (up) or a red dot
 * + "down" (failing probe), styled like the category chip. Driven by the public
 * `aiModelLatency` snapshot + `/system_health` socket; rendered only when data exists.
 */
const ModelHealthChip = ({ ok, latencyMs, errorMessage }: ModelHealth) => {
    const t = useTranslations()
    return (
        // native title tooltip surfaces the probe failure reason on hover (debug + UX)
        <span
            className="shrink-0"
            title={!ok && errorMessage ? errorMessage : undefined}
        >
            <Chip
                color={ok ? "success" : "danger"}
                variant="soft"
                size="sm"
            >
                <span className={cn("size-1.5 rounded-full", ok ? "bg-success" : "bg-danger")} />
                <Chip.Label>
                    {ok
                        ? t("status.latency", { ms: latencyMs })
                        : t("status.componentStatus.down")}
                </Chip.Label>
            </Chip>
        </span>
    )
}

/** Props for {@link GradeModelDropdown}. */
export type GradeModelDropdownProps = WithClassNames<undefined> & {
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
    /** Fired with the new selection when the user picks an option. */
    onSelect: (selection: GradeModelSelection) => void
    /** Fired when a locked (unlock-required) model is pressed — route to plans. */
    onUpgrade: () => void
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
    onSelect,
    onUpgrade,
    className,
}: GradeModelDropdownProps) => {
    const t = useTranslations()
    // live per-model health (dot + latency chip on each row); empty until the BE ships it.
    const latency = useAiModelLatency()
    // controlled open so selecting Auto can close the popover on press.
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState("")
    const normalizedQuery = query.trim().toLowerCase()
    // funnel facets: tier / price / "only suitable for this task".
    const [tierFilter, setTierFilter] = useState<AiModelCategory | "all">("all")
    const [priceFilter, setPriceFilter] = useState<PriceFilter>("all")
    const [onlySuited, setOnlySuited] = useState(false)
    const [showFilters, setShowFilters] = useState(false)
    const activeFilterCount = (tierFilter !== "all" ? 1 : 0)
        + (priceFilter !== "all" ? 1 : 0)
        + (onlySuited ? 1 : 0)
    // models NOT suited for `task` are NOT hidden — they render with an amber
    // warning (like below-floor). The "only suitable" facet can hide them.
    const filteredModels = useMemo(
        () => models.filter((model) => {
            if (normalizedQuery
                && !model.model.toLowerCase().includes(normalizedQuery)) {
                return false
            }
            if (tierFilter !== "all" && model.category !== tierFilter) {
                return false
            }
            if (priceFilter === "free" && !model.complimentary) {
                return false
            }
            if (priceFilter === "paid" && model.complimentary) {
                return false
            }
            if (onlySuited
                && task
                && model.supportedTasks?.length
                && !model.supportedTasks.includes(task)) {
                return false
            }
            return true
        }),
        [models, normalizedQuery, tierFilter, priceFilter, onlySuited, task],
    )
    // a pinned model shows its name; otherwise the Auto label (or "pick a model"
    // when the Auto lane is hidden and nothing is picked yet)
    const triggerLabel = selection.model
        ?? (showAutoLane ? t("aiSettings.lanes.auto.title") : t("aiSettings.pickModel"))

    return (
        <Dropdown
            isOpen={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open)
                if (!open) {
                    setQuery("")
                    setTierFilter("all")
                    setPriceFilter("all")
                    setOnlySuited(false)
                    setShowFilters(false)
                }
            }}
        >
            <DropdownTrigger
                isDisabled={isDisabled}
                className={cn("cursor-pointer", className)}
            >
                <div className="flex items-center gap-2">
                    <SparkleIcon className="size-5" />
                    <span className="max-w-40 truncate">{triggerLabel}</span>
                    <CaretDownIcon className="size-5" />
                </div>
            </DropdownTrigger>
            <DropdownPopover
                placement={placement}
                className="min-w-64"
            >
                <div className="flex flex-col">
                    {/* Auto lane — above search + scroll so the default is always one click away. */}
                    {showAutoLane ? (
                        <>
                            <DropdownMenu aria-label={t("aiSettings.lanes.auto.title")}>
                                <DropdownSection>
                                    <DropdownItem
                                        key="auto"
                                        textValue={t("aiSettings.lanes.auto.title")}
                                        onPress={() => {
                                            onSelect({
                                                mode: AiMode.Auto,
                                                model: null,
                                                provider: null,
                                            })
                                            setIsOpen(false)
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                "flex items-center gap-2",
                                                !selection.model && "text-accent",
                                            )}
                                        >
                                            <SparkleIcon className="size-5 shrink-0" />
                                            <span>{t("aiSettings.lanes.auto.title")}</span>
                                        </div>
                                    </DropdownItem>
                                </DropdownSection>
                                <Separator />
                            </DropdownMenu>
                        </>
                    ) : null}
                    {/* Search + funnel filter. No divider below → flows seamlessly into
                    the model list (gap-3 whitespace only). */}
                    <div className="flex items-center gap-2 px-2">
                        <div
                            className="min-w-0 flex-1"
                            onKeyDownCapture={(event) => event.stopPropagation()}
                        >
                            <SearchField
                                variant="secondary"
                                aria-label={t("aiSettings.searchModel")}
                            >
                                <SearchField.Group>
                                    <SearchField.SearchIcon />
                                    <SearchField.Input
                                        placeholder={t("aiSettings.searchModel")}
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                    />
                                    {query ? (
                                        <SearchField.ClearButton onPress={() => setQuery("")} />
                                    ) : null}
                                </SearchField.Group>
                            </SearchField>
                        </div>
                        <Button
                            isIconOnly
                            size="sm"
                            variant={activeFilterCount > 0 || showFilters ? "secondary" : "tertiary"}
                            aria-label={t("aiSettings.filterModels")}
                            onPress={() => setShowFilters((open) => !open)}
                            className="relative shrink-0"
                        >
                            <FunnelIcon className="size-5" />
                            {activeFilterCount > 0 ? (
                                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-accent text-[0.625rem] text-accent-foreground">
                                    {activeFilterCount}
                                </span>
                            ) : null}
                        </Button>
                    </div>
                    {showFilters ? (
                        <div className="mx-2 flex flex-col gap-3 rounded-2xl border border-default bg-default/40 px-3 py-3">
                            <div className="flex flex-col gap-2">
                                <Typography type="body-xs" className="text-muted">
                                    {t("aiSettings.filterTier")}
                                </Typography>
                                <div className="flex flex-wrap gap-2">
                                    {TIER_FILTERS.map((tier) => (
                                        <FilterChip
                                            key={tier}
                                            active={tierFilter === tier}
                                            label={tier === "all"
                                                ? t("aiSettings.filterAll")
                                                : t(`aiSettings.categories.${tier}`)}
                                            onPress={() => setTierFilter(tier)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Typography type="body-xs" className="text-muted">
                                    {t("aiSettings.filterPrice")}
                                </Typography>
                                <div className="flex flex-wrap gap-2">
                                    {PRICE_FILTERS.map((price) => (
                                        <FilterChip
                                            key={price.value}
                                            active={priceFilter === price.value}
                                            label={t(`aiSettings.${price.labelKey}`)}
                                            onPress={() => setPriceFilter(price.value)}
                                        />
                                    ))}
                                </div>
                            </div>
                            {task ? (
                                <div className="flex items-center justify-between gap-2">
                                    <Typography type="body-sm">
                                        {t("aiSettings.filterOnlySuited")}
                                    </Typography>
                                    <Switch
                                        isSelected={onlySuited}
                                        onChange={setOnlySuited}
                                    />
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                    <ScrollShadow
                        hideScrollBar
                        className="max-h-72"
                    >
                        <DropdownMenu
                            aria-label={t("aiSettings.pickModel")}
                        >
                            {/* One entry per catalog model. Below-floor = warning (selectable,
                        risky); Balanced/Premium/Frontier = locked without an unlock. */}
                            <DropdownSection>
                                {filteredModels.length === 0 ? (
                                    <DropdownItem
                                        key="no-results"
                                        textValue={t("aiSettings.searchModelEmpty")}
                                        onPress={() => undefined}
                                    >
                                        <span className="text-muted">{t("aiSettings.searchModelEmpty")}</span>
                                    </DropdownItem>
                                ) : null}
                                {filteredModels.map((model) => {
                                    const key = `${model.provider}:${model.model}`
                                    const isSelected = selection.model === model.model
                                        && selection.provider === model.provider
                                    const categoryChip = <AiCategoryChip category={model.category} />
                                    // live health (right of the category chip); null until probe data arrives
                                    const health = latency.get(model.model)
                                    const healthChip = health
                                        ? <ModelHealthChip ok={health.ok} latencyMs={health.latencyMs} errorMessage={health.errorMessage} />
                                        : null
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
                                                onPress={() => undefined}
                                            >
                                                <Tooltip>
                                                    <Tooltip.Trigger>
                                                        <div className="flex w-full items-center justify-between gap-2 text-muted">
                                                            <span className="flex min-w-0 items-center gap-2">
                                                                <WarningCircleIcon className="size-5 shrink-0" />
                                                                <span className="truncate">{model.model}</span>
                                                            </span>
                                                            <span className="flex shrink-0 items-center gap-2">{healthChip}{categoryChip}</span>
                                                        </div>
                                                    </Tooltip.Trigger>
                                                    <Tooltip.Content>{t("aiSettings.modelUnavailable")}</Tooltip.Content>
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
                                                onPress={onUpgrade}
                                            >
                                                <Tooltip>
                                                    <Tooltip.Trigger>
                                                        <div className="flex w-full items-center justify-between gap-2 text-muted">
                                                            <span className="flex min-w-0 items-center gap-2">
                                                                <LockIcon className="size-5 shrink-0" />
                                                                <span className="truncate">{model.model}</span>
                                                            </span>
                                                            <span className="flex shrink-0 items-center gap-2">{healthChip}{categoryChip}</span>
                                                        </div>
                                                    </Tooltip.Trigger>
                                                    <Tooltip.Content>
                                                        <Typography type="body-sm">{t("aiSettings.subscribeToGrade")}</Typography>
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
                                                onPress={() => onSelect({
                                                    mode: canPremium ? AiMode.Premium : AiMode.Auto,
                                                    model: model.model,
                                                    provider: model.provider,
                                                })}
                                            >
                                                <Tooltip>
                                                    <Tooltip.Trigger>
                                                        <div className="flex w-full items-center justify-between gap-2">
                                                            <span className="flex min-w-0 items-center gap-2">
                                                                <WarningIcon className="size-5 shrink-0 text-warning" />
                                                                <span className={cn("truncate", isSelected && "text-accent")}>
                                                                    {model.model}
                                                                </span>
                                                            </span>
                                                            <span className="flex shrink-0 items-center gap-2">{healthChip}{categoryChip}</span>
                                                        </div>
                                                    </Tooltip.Trigger>
                                                    <Tooltip.Content>
                                                        <Typography type="body-sm" className="text-warning">
                                                            {belowFloor
                                                                ? t("aiSettings.belowFloorWarning")
                                                                : t("aiSettings.offTaskWarning")}
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
                                            onPress={() => onSelect({
                                                mode: canPremium ? AiMode.Premium : AiMode.Auto,
                                                model: model.model,
                                                provider: model.provider,
                                            })}
                                        >
                                            <div className="flex w-full items-center justify-between gap-2">
                                                <span className={cn("min-w-0 flex-1 truncate", isSelected && "text-accent")}>
                                                    {model.model}
                                                </span>
                                                <span className="flex shrink-0 items-center gap-2">{healthChip}{categoryChip}</span>
                                            </div>
                                        </DropdownItem>
                                    )
                                })}
                            </DropdownSection>
                        </DropdownMenu>
                    </ScrollShadow>
                </div>
            </DropdownPopover>
        </Dropdown>
    )
}
