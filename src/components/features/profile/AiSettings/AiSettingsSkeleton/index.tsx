"use client"

import React from "react"
import {
    cn,
} from "@heroui/react"
import {
    Skeleton,
} from "@/components/blocks"
import type {
    WithClassNames,
} from "@/modules/types"

export type AiSettingsSkeletonProps = WithClassNames<undefined>

/**
 * Loading state for the {@link AiSettings} content (everything below the
 * header).
 *
 * Presentational: mirrors the effective-lane chip row, the BYOK card (provider
 * picker + key field), and the save button. The header is static chrome and
 * renders outside the loading gate, so it is intentionally not skeletonized.
 * @param props.className - Optional wrapper class.
 */
export const AiSettingsSkeleton = ({
    className,
}: AiSettingsSkeletonProps) => {
    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {/* BYOK section (no card): heading + provider tabs + key input */}
            <div className="flex flex-col gap-4">
                <Skeleton.Typography type="body-sm" width="1/4" />
                <div className="flex flex-col gap-2">
                    <Skeleton.Typography type="body-xs" width="1/4" />
                    <Skeleton.Tabs count={3} />
                </div>
                <div className="flex flex-col gap-2">
                    <Skeleton.Typography type="body-xs" width="1/4" />
                    <Skeleton.Input />
                </div>
            </div>
            {/* short save button */}
            <Skeleton.Button />
        </div>
    )
}
