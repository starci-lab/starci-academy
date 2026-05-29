"use client"

import React from "react"
import {
    CheckCircleIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react"
import {
    useAiSettingsFormik,
    type AiSettingsSaveStatus,
} from "@/hooks/singleton"

/**
 * Inline success/error line shown after a save/remove action.
 *
 * Reads the status straight off the AI settings formik singleton; renders
 * nothing until an action sets one.
 */
export const StatusLine = () => {
    const formik = useAiSettingsFormik()
    const status = formik.status as AiSettingsSaveStatus | undefined
    if (!status) {
        return null
    }
    const isSuccess = status.kind === "success"
    return (
        <div
            className={[
                "flex items-center gap-2 text-sm",
                isSuccess ? "text-success" : "text-danger",
            ].join(" ")}
        >
            {isSuccess ? (
                <CheckCircleIcon
                    weight="fill"
                    className="size-4"
                />
            ) : (
                <WarningCircleIcon
                    weight="fill"
                    className="size-4"
                />
            )}
            {status.text}
        </div>
    )
}
