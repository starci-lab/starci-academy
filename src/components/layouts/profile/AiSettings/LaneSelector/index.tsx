"use client"

import React, {
    useMemo,
} from "react"
import {
    AiMode,
} from "@/modules/api"
import {
    useQueryMyAiSettingsSwr,
} from "@/hooks"
import type {
    AiLaneChoice,
} from "../types"
import {
    LaneCard,
} from "./LaneCard"

/**
 * Vertical list of lane cards.
 *
 * Reads eligibility from the AI settings SWR singleton to build the lane rows;
 * each {@link LaneCard} reads/sets the current selection itself.
 */
export const LaneSelector = () => {
    const { data: settings } = useQueryMyAiSettingsSwr()
    // Premium is locked until the user has an active subscription
    const lanes = useMemo<Array<AiLaneChoice>>(
        () => [
            {
                mode: AiMode.Auto,
                disabled: false,
            },
            {
                mode: AiMode.Premium,
                disabled: !settings?.canPremium,
            },
            {
                mode: AiMode.Byok,
                disabled: false,
            },
        ],
        [
            settings?.canPremium,
        ],
    )
    return (
        <div className="flex flex-col gap-3">
            {lanes.map((lane) => (
                <LaneCard
                    key={lane.mode}
                    mode={lane.mode}
                    disabled={lane.disabled}
                />
            ))}
        </div>
    )
}
