"use client"

import React from "react"
import {
    useAppSelector,
} from "@/redux"
import {
    AiQuotaTab,
} from "@/redux/slices"
import {
    AiQuotaAutoTab,
} from "../AutoTab"
import {
    AiQuotaHistoryTab,
} from "../HistoryTab"
import {
    AiQuotaSubscriptionTab,
} from "../SubscriptionTab"

/**
 * AI quota modal body — renders the active tab panel from Redux.
 */
export const AiQuotaBody = () => {
    const tab = useAppSelector((state) => state.tabs.aiQuotaTab)

    switch (tab) {
    case AiQuotaTab.Auto:
        return <AiQuotaAutoTab />
    case AiQuotaTab.Subscription:
        return <AiQuotaSubscriptionTab />
    case AiQuotaTab.History:
        return <AiQuotaHistoryTab />
    default:
        return <AiQuotaAutoTab />
    }
}
