"use client"

import React from "react"
import {
    Button,
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import {
    useTranslations,
} from "next-intl"
import type {
    OauthButtonItem,
} from "../types"
import type { KeycloakIdentityProvider } from "@/modules/api/graphql/mutations/types/exchange-code-for-token"

/** Props for {@link OauthButtons}. */
export interface OauthButtonsProps extends WithClassNames<undefined> {
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
    className,
}: OauthButtonsProps) => {
    const t = useTranslations()
    return (
        <div className={cn("flex flex-col gap-2", className)}>
            {items.map((item) => (
                <Button
                    key={item.provider}
                    type="button"
                    variant="outline"
                    className="w-full text-sm"
                    onPress={() => onOauthPress(item.provider)}
                >
                    <span className="inline-flex items-center justify-center gap-2">
                        <item.icon className="size-4" />
                        {t(item.labelKey)}
                    </span>
                </Button>
            ))}
        </div>
    )
}
