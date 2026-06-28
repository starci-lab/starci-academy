"use client"

import { CaretDownIcon, LockIcon, SparkleIcon, WarningCircleIcon } from "@phosphor-icons/react"
import React from "react"
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownPopover,
    DropdownSection,
    DropdownTrigger,
    Tooltip,
    Typography,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import { AiMode } from "@/modules/api/graphql/queries/query-my-ai-settings"
import { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"
import { type AiGradableModel } from "@/modules/api/graphql/queries/types/ai-models"
import type { GradingModelSelection } from "@/hooks/zustand/personalProjectGithub/store"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { AiCategoryChip } from "@/components/blocks/chips/AiCategoryChip"

/** Props for {@link GradingModelDropdown}. */
export type GradingModelDropdownProps = WithClassNames<undefined> & {
    /** Models the user can pick from — ALREADY filtered to Economy and up (no free / no Auto lane). */
    models: Array<AiGradableModel>
    /** Current grading-lane + model selection. */
    selection: GradingModelSelection
    /** Whether the Premium lane (Balanced + Premium models) is unlocked for this user. */
    canPremium: boolean
    /** Disables the whole control (e.g. while a review is in flight). */
    isDisabled?: boolean
    /** Fired with the new selection when the user picks a model. */
    onSelect: (selection: GradingModelSelection) => void
    /** Fired when a locked (subscription-required) model is pressed — route to the subscription page. */
    onUpgrade: () => void
}

/**
 * Grading model picker for the personal-project review.
 *
 * Mirrors the challenge {@link import("../../Challenge/ChallengeSubmissionPanel/GradeModelDropdown").GradeModelDropdown}
 * but WITHOUT the free Auto lane: the personal project must always grade with an Economy tier
 * model or higher. Economy models grade without a plan; Balanced + Premium are locked unless
 * `canPremium` (pressing routes to the subscription page).
 * @param props - {@link GradingModelDropdownProps}
 */
export const GradingModelDropdown = ({
    models,
    selection,
    canPremium,
    isDisabled = false,
    onSelect,
    onUpgrade,
    className,
}: GradingModelDropdownProps) => {
    const t = useTranslations()
    const triggerLabel = selection.model ?? t("aiSettings.pickModel")

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
                    {/* One entry per Economy+ catalog model, with a category chip. Economy models
                        grade without a plan; Balanced + Premium are locked without a subscription
                        (pressing routes to the subscription page). */}
                    <DropdownSection>
                        {models.map((model) => {
                            const key = `${model.provider}:${model.model}`
                            const categoryChip = <AiCategoryChip category={model.category} />
                            // Economy is usable without a plan; Balanced + Premium require a paid subscription.
                            const requiresPlan = model.category === AiModelCategory.Balanced
                                || model.category === AiModelCategory.Premium
                            if (!model.available) {
                                // DISABLED (not locked): model/provider tạm không khả dụng (vd key không
                                // hợp lệ / provider down) → icon CẢNH BÁO, KHÔNG phải ổ khoá.
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
                                                    {categoryChip}
                                                </div>
                                            </Tooltip.Trigger>
                                            <Tooltip.Content>{t("aiSettings.modelUnavailable")}</Tooltip.Content>
                                        </Tooltip>
                                    </DropdownItem>
                                )
                            }
                            if (requiresPlan && !canPremium) {
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
                                        mode: canPremium ? AiMode.Premium : AiMode.Auto,
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
