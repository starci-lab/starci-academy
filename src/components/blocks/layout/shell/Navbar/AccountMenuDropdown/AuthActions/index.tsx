"use client"

import React, { useCallback, useMemo } from "react"
import { useTranslations } from "next-intl"
import { AuthenticationModalTab } from "@/redux/slices/tabs"
import { useAppDispatch } from "@/redux/hooks"
import { setAuthenticationModalTab } from "@/redux/slices/tabs"
import { useAccountMenuOverlayState, useAuthenticationOverlayState } from "@/hooks/zustand/overlay/hooks"
import { _AuthActions, type AuthActionItem } from "./component"

/** Props for {@link AuthActions}. */
export type AuthActionsProps = Record<string, never>
/**
 * Row of authentication call-to-action buttons — the CONNECTED half: derives
 * its action items from translations, dispatches the auth-tab action, and
 * opens the authentication overlay directly. See
 * `design/storybook/architecture/split.md`.
 * @param props - optional root class name
 */
export const AuthActions = () => {
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const { close } = useAccountMenuOverlayState()
    const { open: openAuthentication } = useAuthenticationOverlayState()

    /** Open the auth modal on the given tab and close this dropdown. */
    const onSelectTab = useCallback(
        (tab: AuthenticationModalTab) => {
            dispatch(setAuthenticationModalTab(tab))
            close()
            openAuthentication()
        },
        [dispatch, close, openAuthentication],
    )

    const items = useMemo<Array<AuthActionItem>>(
        () => [
            {
                key: "sign-in",
                label: t("auth.signIn.submit"),
                variant: "primary",
                onPress: () => onSelectTab(AuthenticationModalTab.SignIn),
            },
            {
                key: "sign-up",
                label: t("auth.signUp.submit"),
                variant: "tertiary",
                onPress: () => onSelectTab(AuthenticationModalTab.SignUp),
            },
        ],
        [t, onSelectTab],
    )

    return <_AuthActions items={items} />
}
