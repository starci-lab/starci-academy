"use client"

import { CircleCheck as CheckCircleIcon, CircleExclamation as WarningCircleIcon } from "@gravity-ui/icons"
import React from "react"
import {
    useAiSettingsForm,
} from "@/hooks/zustand"

/**
 * Inline success/error line shown after a save/remove action.
 *
 * Reads the status straight off the AI settings formik singleton; renders
 * nothing until an action sets one.
 */
export const StatusLine = () => {
    const { status } = useAiSettingsForm()
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
                    className="size-4"
                />
            ) : (
                <WarningCircleIcon
                    className="size-4"
                />
            )}
            {status.text}
        </div>
    )
}
