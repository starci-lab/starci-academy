import React from "react"
import { NotificationCenter } from "@/components/features/notifications/NotificationCenter"

/**
 * Route `/[locale]/notifications` — "Trung tâm thông báo": the bell's "Xem tất
 * cả" destination. Thin route file: only mounts the feature, no logic/UI here.
 */
const Page = () => {
    return <NotificationCenter />
}

export default Page
