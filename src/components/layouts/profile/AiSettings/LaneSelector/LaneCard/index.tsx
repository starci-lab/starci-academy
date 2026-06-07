"use client"

import { CircleCheck as CheckCircleIcon } from "@gravity-ui/icons"
import React, {
    useCallback,
} from "react"
import {
    Chip,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useAiSettingsForm,
} from "@/hooks/zustand"
import type {
    AiMode,
} from "@/modules/api"
import {
    LANE_ICON_MAP,
} from "../../map"

/** Props for {@link LaneCard} (list item — per-item data only). */
export interface LaneCardProps {
    /** Lane this card represents. */
    mode: AiMode
    /** Whether the lane is locked (not selectable). */
    disabled: boolean
}

/**
 * One selectable lane card (icon + title + description + selected check).
 *
 * List item: receives its lane + locked state as props; reads the current
 * selection from the AI settings formik singleton and updates it on press.
 * @param props.mode - Lane this card represents.
 * @param props.disabled - Whether the lane is locked.
 */
export const LaneCard = ({
    mode,
    disabled,
}: LaneCardProps) => {
    const t = useTranslations()
    const { mode: selectedMode, setMode } = useAiSettingsForm()
    const selected = selectedMode === mode
    const onPress = useCallback(
        () => {
            setMode(mode)
        },
        [
            setMode,
            mode,
        ],
    )
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onPress}
            className={[
                "flex items-start gap-3 rounded-3xl border p-5 text-left transition-all",
                selected
                    ? "border-accent bg-accent/5 ring-2 ring-accent/30"
                    : "border-divider bg-background hover:shadow-md",
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            ].join(" ")}
        >
            {LANE_ICON_MAP[mode]}
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className="text-base font-semibold">
                        {t(`aiSettings.lanes.${mode}.title`)}
                    </span>
                    {disabled ? (
                        <Chip
                            size="sm"
                            color="default"
                            variant="soft"
                        >
                            {t("aiSettings.premiumLocked")}
                        </Chip>
                    ) : null}
                </div>
                <div className="text-xs text-muted">
                    {t(`aiSettings.lanes.${mode}.desc`)}
                </div>
            </div>
            {selected ? (
                <CheckCircleIcon
                    className="size-5 text-accent"
                />
            ) : null}
        </button>
    )
}
