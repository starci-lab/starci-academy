"use client"

import React from "react"
import {
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import {
    CvWorkspace,
} from "@/components/features/profile/CV/CvWorkspace"

/** Props for {@link ProfileCvTab}. */
export type ProfileCvTabProps = WithClassNames<undefined>

/**
 * "CV" tab of the public profile — owner-only (withheld from the strip and this
 * panel for any other viewer, see `PublicProfile/index.tsx`). Renders the same
 * {@link CvWorkspace} as the standalone `/profile/cv` page, without its
 * breadcrumb (already in the profile-tab context).
 *
 * @param props - {@link ProfileCvTabProps}
 */
export const ProfileCvTab = ({
    className,
}: ProfileCvTabProps) => {
    return (
        <div className={cn("min-w-0", className)}>
            <CvWorkspace />
        </div>
    )
}
