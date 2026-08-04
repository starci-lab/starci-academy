"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { useAnySocketDown } from "@/hooks/socketio/connectionStore"
import { _SocketConnectionStatus } from "./component"

/**
 * SocketConnectionStatus — the CONNECTED half: subscribes to the socket
 * connection store and resolves the toast copy via `t()`. See
 * `design/storybook/architecture/split.md`.
 */
export const SocketConnectionStatus = () => {
    const t = useTranslations()
    const anyDown = useAnySocketDown()

    return (
        <_SocketConnectionStatus
            anyDown={anyDown}
            reconnectingLabel={t("socketStatus.reconnecting")}
            reconnectedLabel={t("socketStatus.reconnected")}
        />
    )
}
