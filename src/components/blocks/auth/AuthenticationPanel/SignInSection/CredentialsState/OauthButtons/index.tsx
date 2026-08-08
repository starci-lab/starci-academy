"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import { Button } from "@/components/atoms/buttons/Button"
import { StackV } from "@/components/frames/Stack"
import type {
    OauthButtonItem,
} from "../map"
import type { KeycloakIdentityProvider } from "@/modules/api/graphql/mutations/types/exchange-code-for-token"

/** Props for {@link OauthButtons}. */
export interface OauthButtonsProps {
    /** OAuth provider buttons to render, in display order. */
    items: Array<OauthButtonItem>
    /** Fired with the chosen provider when a button is pressed. */
    onOauthPress: (provider: KeycloakIdentityProvider) => void
}

/**
 * Vertical stack of OAuth shortcut buttons (Google, GitHub, …).
 *
 * Presentational: maps {@link OauthButtonItem}s to buttons and forwards the
 * chosen provider up via `onOauthPress`. No business logic.
 * @param props - provider items and the press callback
 */
export const OauthButtons = ({
    items,
    onOauthPress,
}: OauthButtonsProps) => {
    const t = useTranslations()
    const buttonItems = items.map((item) => () => (
        <Button
            variant="outline"
            label={t(item.labelKey)}
            prefixIcon={item.icon}
            classNames={["w-full"]}
            onPress={() => onOauthPress(item.provider)}
        />
    ))
    return <StackV identity={{ tier: "block", component: "OauthButtons" }} gap={3} items={buttonItems} />
}
