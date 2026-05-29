"use client"

import React from "react"
import {
    Button,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import type {
    KeycloakIdentityProvider,
} from "@/modules/api"
import type {
    OauthButtonItem,
} from "../types"

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
    return (
        <>
            {items.map((item, idx) => (
                <React.Fragment key={item.provider}>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full text-sm"
                        onPress={() => onOauthPress(item.provider)}
                    >
                        <span className="inline-flex items-center justify-center gap-2">
                            <item.icon className="w-5 h-5" />
                            {t(item.labelKey)}
                        </span>
                    </Button>
                    {idx === 0 && <div className="h-2" />}
                </React.Fragment>
            ))}
        </>
    )
}
