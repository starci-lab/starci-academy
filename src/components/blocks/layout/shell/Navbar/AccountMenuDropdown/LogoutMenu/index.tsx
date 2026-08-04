"use client"

import React, { useCallback } from "react"
import {
    useTranslations,
} from "next-intl"
import { useMutateSignOutSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSignOutSwr"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { _LogoutMenu } from "./component"

/** Props for {@link LogoutMenu}. */
export type LogoutMenuProps = WithClassNames<undefined>

/**
 * Logout section of the account dropdown — the CONNECTED half: owns the
 * sign-out mutation and resolves the label via `t()`. See
 * `design/storybook/architecture/split.md`.
 * @param props - optional root class name
 */
export const LogoutMenu = ({ className }: LogoutMenuProps) => {
    const t = useTranslations()
    const mutateSignOutSwr = useMutateSignOutSwr()

    /** Trigger the sign-out mutation. */
    const onLogout = useCallback(
        async () => {
            await mutateSignOutSwr.trigger()
        },
        [mutateSignOutSwr],
    )

    return <_LogoutMenu label={t("nav.logout")} onLogout={onLogout} className={className} />
}
