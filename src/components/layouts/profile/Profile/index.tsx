"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import {
    cn,
} from "@heroui/react"
import {
    useAppSelector,
} from "@/redux"
import type {
    WithClassNames,
} from "@/modules/types"
import {
    ProfileHeader,
} from "./ProfileHeader"
import {
    QuotaCard,
} from "./QuotaCard"
import {
    ProfileNav,
} from "./ProfileNav"

/**
 * Profile hub container.
 *
 * Reads the signed-in user from redux and composes the header, the AI quota
 * summary card (which opens the quota modal), and the navigation list.
 * Mounted by the `/profile` route. `"use client"` for redux + SWR singletons.
 * @param props.className - Optional wrapper class merged into the root element.
 */
export type ProfileProps = WithClassNames<undefined>

export const Profile = ({
    className,
}: ProfileProps) => {
    const t = useTranslations()
    const user = useAppSelector((state) => state.user.user)

    if (!user) {
        return (
            <div className={cn("mx-auto flex max-w-3xl flex-col items-center gap-1.5 p-12 text-center", className)}>
                <div className="text-lg font-semibold text-foreground">{t("profile.signedOut.title")}</div>
                <div className="text-sm text-muted">{t("profile.signedOut.desc")}</div>
            </div>
        )
    }

    return (
        <div className={cn("mx-auto flex max-w-3xl flex-col gap-6 p-6", className)}>
            <ProfileHeader />
            <QuotaCard />
            <ProfileNav />
        </div>
    )
}
