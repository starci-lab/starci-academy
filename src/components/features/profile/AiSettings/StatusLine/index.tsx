"use client"

import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react"
import React from "react"
import {
    cn,
    Typography,
} from "@heroui/react"
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
        <div className="flex items-center gap-2">
            {isSuccess ? (
                <CheckCircleIcon
                    aria-hidden
                    className="size-5 text-success"
                />
            ) : (
                <WarningCircleIcon
                    aria-hidden
                    className="size-5 text-danger"
                />
            )}
            <Typography
                type="body-sm"
                className={cn(isSuccess ? "text-success" : "text-danger")}
            >
                {status.text}
            </Typography>
        </div>
    )
}
