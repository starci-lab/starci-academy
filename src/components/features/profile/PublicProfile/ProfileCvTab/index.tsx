"use client"

import React, { useCallback } from "react"
import {
    cn,
} from "@heroui/react"
import { useRouter, useSearchParams } from "next/navigation"
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
 * `?edit=true` alongside `?tab=cv` (e.g. `/profile/[u]?tab=cv&edit=true`)
 * selects the workspace's compose mode IN PLACE — toggling never leaves this
 * tab, it only flips that one query param (the `tab=cv` param `useProfileTabUrlSync`
 * owns is preserved as-is).
 *
 * @param props - {@link ProfileCvTabProps}
 */
export const ProfileCvTab = ({
    className,
}: ProfileCvTabProps) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const edit = searchParams.get("edit") === "true"

    const onEditChange = useCallback((next: boolean) => {
        const params = new URLSearchParams(searchParams.toString())
        if (next) {
            params.set("edit", "true")
        } else {
            params.delete("edit")
        }
        router.replace(`?${params.toString()}`)
    }, [router, searchParams])

    return (
        <div className={cn("min-w-0", className)}>
            <CvWorkspace edit={edit} onEditChange={onEditChange} />
        </div>
    )
}
