"use client"

import { CaretDownIcon, LockIcon, SparkleIcon } from "@phosphor-icons/react"
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
    Typography,
    cn
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

    ChallengeGradeSelection,
} from "../types"

/** HeroUI {@link Chip} color per model cost/quality category. */
const CATEGORY_CHIP_COLOR: Record<AiModelCategory, "success" | "default" | "warning"> = {
    [AiModelCategory.Economy]: "success",
    [AiModelCategory.Balanced]: "default",
    [AiModelCategory.Premium]: "warning",
}

/** Props for {@link GradeModelDropdown}. */
export type GradeModelDropdownProps = WithClassNames<undefined> & {
    /** Enabled models the user can pick from (from the `aiModels` catalog). */
    models: Array<AiGradableModel>
    /** The row's current grading-lane + model selection. */
    selection: ChallengeGradeSelection
    /** Whether the Premium lane (specific models) is unlocked for this user. */
    canPremium: boolean
    /** Disables the whole control (e.g. while a grade is in flight). */
    isDisabled?: boolean
    /** Fired with the new selection when the user picks an option. */
    onSelect: (selection: ChallengeGradeSelection) => void
    /** Fired when a locked (subscription-required) model is pressed — route to the subscription page. */
    onUpgrade: () => void
}

/**
 * Grading lane + model picker for one submission row.
 *
 * Presentational: renders the "Auto (free)" lane plus every catalog model
 * (each tagged with its cost category chip) and forwards the chosen
 * {@link ChallengeGradeSelection}. Premium models are locked unless `canPremium`.
 * @param props - {@link GradeModelDropdownProps}
 */
export const GradeModelDropdown = ({
    models,
    selection,
    canPremium,
    isDisabled = false,
    onSelect,
    onUpgrade,
    className,
}: GradeModelDropdownProps) => {
    const t = useTranslations()
    // Auto lane = no concrete model picked; otherwise show the chosen model name
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
                <DropdownMenu
                    aria-label={t("aiSettings.pickModel")}
                >
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
                        Without a subscription every model is locked: pressing routes to the
                        subscription page and hovering explains why (Auto lane stays free). */}
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
                                            <Tooltip.Content>
                                                <Typography type="body-sm">{t("aiSettings.subscribeToGrade")}</Typography>
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
