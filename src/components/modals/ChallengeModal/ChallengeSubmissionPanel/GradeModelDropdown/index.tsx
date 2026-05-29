"use client"

import React from "react"
import {
    Button,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownPopover,
    DropdownSection,
    DropdownTrigger,
} from "@heroui/react"
import {
    CaretDownIcon,
    SparkleIcon,
} from "@phosphor-icons/react"
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
    className,
}: GradeModelDropdownProps) => {
    const t = useTranslations()
    // Auto lane = no concrete model picked; otherwise show the chosen model name
    const isAuto = selection.mode === AiMode.Auto || selection.model === null
    const triggerLabel = isAuto
        ? t("aiSettings.lanes.auto.title")
        : selection.model
    // lock every premium model when the user is not entitled to the Premium lane
    const disabledKeys = canPremium
        ? []
        : models.map((model) => `${model.provider}:${model.model}`)

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    size="sm"
                    variant="secondary"
                    isDisabled={isDisabled}
                    className={className}
                >
                    <SparkleIcon className="size-4" />
                    <span className="max-w-40 truncate">{triggerLabel}</span>
                    <CaretDownIcon className="size-4" />
                </Button>
            </DropdownTrigger>
            <DropdownPopover
                placement="bottom start"
                className="min-w-64"
            >
                <DropdownMenu
                    aria-label={t("aiSettings.pickModel")}
                    disabledKeys={disabledKeys}
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
                    {/* Premium lane — one entry per catalog model, with a category chip */}
                    <DropdownSection className="border-t border-divider pt-1 mt-1">
                        {models.map((model) => (
                            <DropdownItem
                                key={`${model.provider}:${model.model}`}
                                onPress={() => onSelect({
                                    mode: AiMode.Premium,
                                    model: model.model,
                                    provider: model.provider,
                                })}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="truncate">{model.model}</span>
                                    <Chip
                                        size="sm"
                                        color={CATEGORY_CHIP_COLOR[model.category]}
                                        variant="soft"
                                    >
                                        {t(`aiSettings.categories.${model.category}`)}
                                    </Chip>
                                </div>
                            </DropdownItem>
                        ))}
                    </DropdownSection>
                </DropdownMenu>
            </DropdownPopover>
        </Dropdown>
    )
}
