"use client"

import React, { useCallback } from "react"
import {
    useTranslations,
} from "next-intl"
import { useMutateSignOutSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSignOutSwr"
import { _LogoutMenu } from "./component"

/** Props for {@link LogoutMenu}. */
export type LogoutMenuProps = Record<string, never>
/**
 * Logout section of the account dropdown — the CONNECTED half: owns the
 * sign-out mutation and resolves the label via `t()`. See
 * `design/storybook/architecture/split.md`.
 * @param props - optional root class name
 */
export const LogoutMenu = () => {
    const t = useTranslations()
    const mutateSignOutSwr = useMutateSignOutSwr()

    /** Trigger the sign-out mutation. */
    const onLogout = useCallback(
        async () => {
            await mutateSignOutSwr.trigger()
        },
        [mutateSignOutSwr],
    )

    return <_LogoutMenu label={t("nav.logout")} onLogout={onLogout} />
}
