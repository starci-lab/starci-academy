import React from "react"
import {
    RobotIcon,
} from "@phosphor-icons/react"

/**
 * StarCI AI screen header — robot icon + title + subtitle.
 *
 * Presentational (render-only); no business logic, so no `"use client"` needed.
 */
export const StarciAiHeader = () => {
    return (
        <div className="flex items-center gap-3">
            <RobotIcon
                weight="duotone"
                className="size-8 text-accent"
            />
            <div>
                <div className="text-2xl font-bold">StarCI AI</div>
                <div className="text-sm text-muted">
                    Các mô hình AI đang được sử dụng trong hệ thống
                </div>
            </div>
        </div>
    )
}
