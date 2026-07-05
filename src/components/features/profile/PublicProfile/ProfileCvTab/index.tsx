"use client"

import React from "react"
import {
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import {
    CvGallery,
} from "@/components/features/profile/CV/CvGallery"

/** Props for {@link ProfileCvTab}. */
export type ProfileCvTabProps = WithClassNames<undefined>

/**
 * "CV" tab of the public profile — owner-only (withheld from the strip and this
 * panel for any other viewer, see `PublicProfile/index.tsx`). Renders the
 * {@link CvBlocksWorkspace} block editor (the CV flow is always an editor now —
 * no separate view/edit mode), without a breadcrumb (already in the profile-tab
 * context).
 *
 * @param props - {@link ProfileCvTabProps}
 */
export const ProfileCvTab = ({
    className,
}: ProfileCvTabProps) => {
    return (
        <div className={cn("min-w-0", className)}>
            <CvGallery />
        </div>
    )
}
