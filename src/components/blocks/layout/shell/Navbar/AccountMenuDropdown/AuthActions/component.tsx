import React from "react"
import {
    Button,
    cn,
} from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** One resolved auth CTA row. */
export interface AuthActionItem {
    /** Stable key. */
    key: string
    /** Already-localized button label. */
    label: string
    /** Button visual variant. */
    variant: "primary" | "tertiary"
    /** Fired when this action is pressed. */
    onPress: () => void
}

/** Props for {@link _AuthActions} — presentational; labels + handlers already resolved. */
export interface AuthActionsProps extends WithClassNames<undefined> {
    /** The auth CTA rows to render, in order. */
    items: Array<AuthActionItem>
}

/**
 * Row of authentication call-to-action buttons shown to signed-out users.
 *
 * @param props - {@link AuthActionsProps}
 */
export const _AuthActions = ({ items, className }: AuthActionsProps) => (
    <div className={cn("flex items-center gap-3", className)}>
        {items.map((item) => (
            <Button
                key={item.key}
                variant={item.variant}
                onPress={item.onPress}
            >
                {item.label}
            </Button>
        ))}
    </div>
)
