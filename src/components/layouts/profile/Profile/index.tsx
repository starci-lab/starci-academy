"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import {
    useAppSelector,
} from "@/redux"
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
 */
export const Profile = () => {
    const t = useTranslations()
    const user = useAppSelector((state) => state.user.user)

    if (!user) {
        return (
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-1.5 p-12 text-center">
                <div className="text-lg font-semibold text-foreground">{t("profile.signedOut.title")}</div>
                <div className="text-sm text-muted">{t("profile.signedOut.desc")}</div>
            </div>
        )
    }

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
            <ProfileHeader user={user} />
            <QuotaCard />
            <ProfileNav />
        </div>
    )
}
