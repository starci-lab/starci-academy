"use client"

import {
    CaretDownIcon,
    LockIcon,
    SparkleIcon,
} from "@phosphor-icons/react"
import React from "react"
import {
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownPopover,
    DropdownSection,
    DropdownTrigger,
    Tooltip,
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    AiMode,
    AiModelCategory,
    type AiGradableModel,
} from "@/modules/api"
import type {
    WithClassNames,
} from "@/modules/types"
import type {
    AiLabModelSelection,
} from "../types"

/** HeroUI {@link Chip} color per model cost/quality category. */
const CATEGORY_CHIP_COLOR: Record<AiModelCategory, "success" | "default" | "warning"> = {
    [AiModelCategory.Economy]: "success",
    [AiModelCategory.Balanced]: "default",
    [AiModelCategory.Premium]: "warning",
}

/** Props for {@link LaneModelPicker}. */
export type LaneModelPickerProps = WithClassNames<undefined> & {
    /** Enabled models the user can pick from (from the `aiModels` catalog). */
    models: Array<AiGradableModel>
    /** The current lane + model selection. */
    selection: AiLabModelSelection
    /** Whether the Premium lane (specific models) is unlocked for this user. */
    canPremium: boolean
    /** Disables the whole control (e.g. while a run is in flight). */
    isDisabled?: boolean
    /** Fired with the new selection when the user picks an option. */
    onSelect: (selection: AiLabModelSelection) => void
    /** Fired when a locked (subscription-required) model is pressed — route to AI settings. */
    onUpgrade: () => void
}

/**
 * Lane + model picker for an AI Lab run.
 *
 * Presentational: renders the free "Auto" lane plus every catalog model (each tagged
 * with its cost category chip) and forwards the chosen {@link AiLabModelSelection}.
 * Premium models are locked unless `canPremium`. Mirrors the challenge panel's
 * `GradeModelDropdown` but uses the local selection type.
 * @param props - {@link LaneModelPickerProps}
 */
export const LaneModelPicker = ({
    models,
    selection,
    canPremium,
    isDisabled = false,
    onSelect,
    onUpgrade,
    className,
}: LaneModelPickerProps) => {
    const t = useTranslations()
    const isAuto = selection.mode === AiMode.Auto || selection.model === null
    const triggerLabel = isAuto
        ? t("aiSettings.lanes.auto.title")
        : selection.model

    return (
        <Dropdown>
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
                placement="bottom start"
                className="min-w-64"
            >
                <DropdownMenu aria-label={t("aiSettings.pickModel")}>
                    {/* Auto lane — balancer picks a complimentary model, free of charge */}
                    <DropdownSection>
                        <DropdownItem
                            key="auto"
                            onPress={() => onSelect({
                                mode: AiMode.Auto,
                                model: null,
                                provider: null,
                            })}
                        >
                            <div className="flex items-center gap-2">
                                <span>{t("aiSettings.lanes.auto.title")}</span>
                            </div>
                        </DropdownItem>
                    </DropdownSection>
                    {/* Premium lane — one entry per catalog model, with a category chip.
                        Without a subscription every model is locked: pressing routes to AI
                        settings and hovering explains why (Auto lane stays free). */}
                    <DropdownSection className="border-t border-divider pt-1 mt-1">
                        {models.map((model) => {
                            const key = `${model.provider}:${model.model}`
                            const categoryChip = (
                                <Chip
                                    size="sm"
                                    color={CATEGORY_CHIP_COLOR[model.category]}
                                    variant="soft"
                                >
                                    {t(`aiSettings.categories.${model.category}`)}
                                </Chip>
                            )
                            if (!model.available) {
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
                                                        <LockIcon className="size-5 shrink-0" />
                                                        <span className="truncate">{model.model}</span>
                                                    </span>
                                                    {categoryChip}
                                                </div>
                                            </Tooltip.Trigger>
                                            <Tooltip.Content>{t("aiSettings.modelUnavailable")}</Tooltip.Content>
                                        </Tooltip>
                                    </DropdownItem>
                                )
                            }
                            if (!canPremium) {
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
                                                    {categoryChip}
                                                </div>
                                            </Tooltip.Trigger>
                                            <Tooltip.Content>{t("aiSettings.subscribeToGrade")}</Tooltip.Content>
                                        </Tooltip>
                                    </DropdownItem>
                                )
                            }
                            return (
                                <DropdownItem
                                    key={key}
                                    textValue={model.model}
                                    onPress={() => onSelect({
                                        mode: AiMode.Premium,
                                        model: model.model,
                                        provider: model.provider,
                                    })}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="truncate">{model.model}</span>
                                        {categoryChip}
                                    </div>
                                </DropdownItem>
                            )
                        })}
                    </DropdownSection>
                </DropdownMenu>
            </DropdownPopover>
        </Dropdown>
    )
}
